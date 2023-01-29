import { createProgram, createShader } from "app/utils/shaderUtils";
import fragmentShaderSource from "./fragmentShaderSource";
import vertexShaderSource from "./vertexShaderSource";

const points = [
    // first triangle
    // top left
    -1, -1,

    // top right
    1, -1,

    // bottom left
    -1, 1,

    // second triangle
    // bottom right
    1, 1,

    // top right
    1, -1,

    // bottom left
    -1, 1,
];

const positions = [0, 0, 0, 0.5, 0.7, 0,];

class Program {

    canvas;

    constructor(canvas) {
        this.canvas = canvas;
        this.init();
    }

    init() {
        console.log(`init Program`, this.canvas);

        if (!this.canvas) throw "Cannot initialize program without a canvas";

        const gl = this.canvas.getContext('experimental-webgl');//'webgl');
        if (!gl) return alert('Your browser does not support WebGL.');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);
        if (!program) return alert("Failed to create shader program.");

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const positionAttributeLocation = gl.getAttribLocation(program, "points");
        //const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(positionAttributeLocation);

        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        const primitiveType = gl.TRIANGLES;
        const offset2 = 0;
        const count = 3;

        gl.drawArrays(primitiveType, offset2, count);
        console.log(`init() done.`)
    }

}


export default Program;