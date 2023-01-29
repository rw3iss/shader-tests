const path = require('path');

// This plugin just manually inserts some special strings in the main index file
// (there is no easy to use html templating plugin for esbuild)
module.exports = {
    name: 'transform',
    setup(build) {
        let fs = require('fs');
        let cacheControl = '';

        if (process.env.DISABLE_CACHE == 'true') {
            cacheControl = '<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE"><META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE"><meta http-equiv="expires" content="0" />';
        }

        const opts = build.initialOptions;
        const appdir = path.resolve('./');
        const inputdir = path.dirname(path.resolve(opts.entryPoints[0] || './src'));
        const outfile = opts.outfile;
        const outdir = opts.outdir || (outfile ? path.resolve(path.dirname(outfile)) : path.resolve('../'));

        console.log(`input ${inputdir}, output ${outdir}`);

        build.onResolve({ filter: /.*\.html$/ }, (args) => {
            console.log(`RESOLVE HTML`, args)
            const path1 = args.resolveDir.replace('/build', '');
            //console.log(`resolve:`, args.resolveDir, args, path1, path.join(path1, args.path));
            return { path: path.join(path1, args.path) };
        });

        const tryWriteIndex = async () => {
            try {
                const indexFile = path.join(inputdir.trim(), 'index.html');
                if (!fs.existsSync(indexFile)) console.log(`Warning: index.html file not found at: ${indexFile}`)
                console.log(`tryWriteIndex`, indexFile);

                let text = await fs.promises.readFile(indexFile, 'utf8');
                text = text.replace(/{TIMESTAMP}/g, Date.now());
                text = text.replace('{CACHE_CONTROL}', cacheControl);

                // replace environment variables
                Object.keys(opts.define).forEach(k => {
                    var replace = `{${k}}`;
                    var re = new RegExp(replace, "g");
                    text = text.replace(re, opts.define[k]);
                });

                let outFile = path.resolve(outdir, 'index.html');
                fs.writeFileSync(outFile, text, { encoding: 'utf-8' });
                console.log('wrote', outFile);
            } catch (e) {
                console.log(`Exception transforming index.html file:`, e)
                throw e;
            }
        }


        console.log(`transformHtmlTemplatePlugin`, inputdir, '=>', outdir);//, opts);
        tryWriteIndex(inputdir, outdir);


        build.onLoad({ filter: /.*\.html$/ }, async (args) => {
            console.log(`LOAD HTML`, args);
            let text = await fs.promises.readFile(args.path, 'utf8');
            text = text.replace(/{TIMESTAMP}/g, Date.now());
            text = text.replace('{CACHE_CONTROL}', cacheControl);

            // replace environment variables
            Object.keys(defineNoQuotes).forEach(k => {
                var replace = `{${k}}`;
                var re = new RegExp(replace, "g");
                text = text.replace(re, opts.define[k]);
            });

            let outFile = path.resolve(outdir, 'index.html');
            fs.writeFileSync(outFile, text, { encoding: 'utf-8' });
            console.log('wrote', outFile);

            return {
                contents: text,
                loader: 'text',
            };
        });

        // build.onEnd(result => {
        //     if (!result.metafile) {
        //         console.log('not a meta file...')
        //         return;
        //     }
        //     const outputs = result.metafile.outputs;
        //     if (!outputs) {
        //         console.log('no output...')
        //         return;
        //     }

        //     const { publicPath, outdir } = build.initialOptions;
        //     const fullOutdir = path.resolve(process.cwd(), opt.path || outdir);
        //     const relativeOutdir = path.relative(process.cwd(), fullOutdir);

        //     console.log('WRITING', result.length);

        //     writeFileSync(
        //         path.resolve(fullOutdir, 'gen_' + opt.filename),
        //         result,
        //         //JSON.stringify(groupByName(manifest), null, '  '),
        //         { encoding: 'utf-8' }
        //     );
        // });

    },
};