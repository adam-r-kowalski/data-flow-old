console.log("hello world")

const canvas: HTMLCanvasElement = document.querySelector('#app')


const gl = canvas.getContext('webgl2')
if (!gl) {
  console.error("could not load webgl2")
}


const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;


const fragmentShaderSource = `#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor =vec4(1, 0, 0.5, 1);
}
`;


const createShader = (gl, shader_type, source) => {
  const shader = gl.createShader(shader_type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

console.log('foo world')
