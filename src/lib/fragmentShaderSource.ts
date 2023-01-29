const fragmentShaderSource = `
    precision mediump float;
    varying highp vec2 v_texture_coordinate;
    uniform sampler2D sampler;

    void main() {
        gl_FragColor = texture2D(sampler, v_texture_coordinate);
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`;

export default fragmentShaderSource;


// const fragmentShaderSource = `
// precision mediump float;

// void main() {
//   gl_FragColor = vec4(1, 0, 0, 1);
// }
// `;
