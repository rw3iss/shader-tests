
const fs = require("fs");
const path = require("path");
const esbuild = require('esbuild');
//const postcssPresetEnv = require("postcss-preset-env");
const { sassPlugin } = require('esbuild-sass-plugin');
const scssPlugin = require('./plugins/scssPlugin');
const { getNormalizedEnvVars } = require("./utils/envUtils");
const { mkDirSync } = require("./utils/fileUtils");
const transformHtmlTemplatePlugin = require("./plugins/transformHtmlTemplatePlugin");
const copyPlugin = require("./plugins/copyPlugin");

const PORT = 4000;

// Config params (relative to where npm/script is called from):
const APP_BASE = './src';
const ENTRY_FILE = `index.tsx`;
const OUTPUT_DIR = './build';
const OUTPUT_FILE = 'app.js';
const TARGET = 'es2018';
/*
[
    'es2018',
    'chrome100',
    'firefox100',
    'safari14',
    'ios12'
]
*/

const { define, defineNoQuotes } = getNormalizedEnvVars();

///////////////////////////////////////////////////////////////////////////////

const pluginCache = new Map();
const CWD = path.resolve('./');

// Main bundling function.
async function build(entryFile, outFile) {
    console.log(`build(${entryFile}, ${outFile})`);

    // make sure build directory existsSync
    mkDirSync(OUTPUT_DIR);

    const ctx = await esbuild.context({
        entryPoints: [entryFile],
        //outfile: outFile,
        outdir: path.resolve(OUTPUT_DIR),
        bundle: true,
        minify: true,
        target: TARGET,
        format: 'iife',
        logLevel: 'info',
        loader: { // built-in loaders: js, jsx, ts, tsx, css, json, text, base64, dataurl, file, binary
            '.ttf': 'file',
            '.otf': 'file',
            '.png': 'file',
            '.svg': 'file',
            '.js': 'js',
            '.jsx': 'jsx',
            '.ts': 'ts',
            '.tsx': 'tsx',
            '.html': 'file'
        },
        //jsx: 'transform', // wait for new esbuild version
        assetNames: 'static/[name].[hash]',
        tsconfig: "tsconfig.json",
        mainFields: ["browser", "module", "main"],
        plugins: [
            scssPlugin,
            sassPlugin({
                cache: pluginCache,
                // importMapper: (path) => {
                //     //console.log(`import`, path);
                //     return path.replace(/(src\/styles\/includes)/g, `./src/styles/includes.scss`);
                // },
                loadPaths: [`${CWD}`],
                // precompile: (source, pathname) => {
                //     const basedir = path.dirname(pathname);
                //     return source.replace(/(src\/styles\/includes)/g, `${CWD}/src/styles/includes.scss`);
                // }
            }),
            //postCssPlugin({ plugins: [autoprefixer, postcssPresetEnv()] }),
            //copyPlugin,
            transformHtmlTemplatePlugin
        ],
        sourcemap: true,
        define
    });

    await ctx.watch();

    const { host, port } = await ctx.serve({
        port: PORT,
        servedir: './build',
    })

    console.log(`Build served at ${host}:${PORT}`);
    // .catch((e) => {
    //     console.log("Error building:", e.message);
    //     process.exit(1);
    // });
}

// copies any imports or paths that start with /static to the build folder.
// todo: also needs to parse file contents for references to /static?
// let copyStaticPlugin = {
//     name: 'copy-static',
//     setup(build) {

//         function _findEnvFile(dir) {
//             if (!fs.existsSync(dir))
//                 return false;
//             let filePath = `${dir}/.env`;
//             if ((fs.existsSync(filePath))) {
//                 return filePath;
//             } else {
//                 return _findEnvFile(path.resolve(dir, '../'));
//             }
//         }

//         build.onResolve({ filter: /^static$/ }, async (args) => {
//             // find a .env file in current directory or any parent:
//             return ({
//                 path: _findEnvFile(args.resolveDir),
//                 namespace: 'env-ns',
//             })
//         })

//         build.onLoad({ filter: /.*/, namespace: 'env-ns' }, async (args) => {
//             // read in .env file contents and combine with regular .env:
//             let data = await fs.promises.readFile(args.path, 'utf8')
//             const buf = Buffer.from(data)
//             const config = require('dotenv').parse(buf);

//             return ({
//                 contents: JSON.stringify({ ...process.env, ...config }),
//                 loader: 'json'
//             });
//         })
//     }
// }

// call build for main app bundle
build(`${APP_BASE}/${ENTRY_FILE}`, `${OUTPUT_DIR}/${OUTPUT_FILE}`);