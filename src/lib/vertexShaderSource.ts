const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 points;
    attribute vec2 texture_coordinate;

    varying highp vec2 v_texture_coordinate;
    uniform vec2 u_resolution;

    void main(void) {
        vec2 clipSpace = a_position.xy / u_resolution * 2.0 - 1.0;
        gl_Position = vec4(points, 0.0, 1.0);
        v_texture_coordinate = texture_coordinate;
    }
`;

export default vertexShaderSource;

// const vertexShaderSource = `
// attribute vec4 a_position;

// uniform vec2 u_resolution;

// void main() {
//   vec2 clipSpace = a_position.xy / u_resolution * 2.0 - 1.0;
//   gl_Position = vec4(clipSpace, 0, 1);
// }
// `;
