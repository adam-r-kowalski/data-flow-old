import { ECS } from './ecs'
import { projection, Mat4x4 } from './linear_algebra'

class Geometry {
  constructor(
    public vertices: number[],
    public indices: number[]
  ) { }
}

class Translate {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) { }

  matrix = (): Mat4x4 =>
    new Mat4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, this.z, 1,
    ])
}

class Scale {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) { }

  matrix = (): Mat4x4 =>
    new Mat4x4([
      this.x, 0, 0, 0,
      0, this.y, 0, 0,
      0, 0, this.z, 0,
      0, 0, 0, 1,
    ])
}

const ecs = new ECS()

const rect = ecs.entity(
  new Geometry(
    [
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      -0.5, -0.5, 0,
      0.5, -0.5, 0
    ],
    [
      0, 1, 2,
      2, 3, 1
    ]
  ),
  new Translate(400, 500, 0),
  new Scale(50, 50, 1)
)


const vertexShaderSource = `#version 300 es
in vec4 a_position;

uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * a_position;
}
`

const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
  fragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`

const gl_canvas: HTMLCanvasElement = document.createElement('canvas')
gl_canvas.style.width = '100%'
gl_canvas.style.height = '100%'
gl_canvas.style.position = 'absolute'
document.body.appendChild(gl_canvas)
const gl = gl_canvas.getContext('webgl2')

gl.clearColor(1.0, 1.0, 1.0, 1.0)

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader))
  console.log(gl.getShaderInfoLog(fragmentShader))
}
gl.useProgram(program)

const dpr = window.devicePixelRatio
gl.canvas.width = Math.round(gl.canvas.clientWidth * dpr)
gl.canvas.height = Math.round(gl.canvas.clientHeight * dpr)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

const uMatrix = gl.getUniformLocation(program, 'u_matrix')

const positionBuffer = gl.createBuffer()
const aPositionLocation = gl.getAttribLocation(program, 'a_position')
gl.enableVertexAttribArray(aPositionLocation)

const indexBuffer = gl.createBuffer()

gl.clear(gl.COLOR_BUFFER_BIT)

const geometry = rect.get(Geometry)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW)
gl.vertexAttribPointer(aPositionLocation, /*size*/3, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(geometry.indices), gl.STATIC_DRAW)

const s = rect.get(Scale)

const matrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400)
  .mul(rect.get(Translate).matrix())
  .mul(rect.get(Scale).matrix())

gl.uniformMatrix4fv(uMatrix, /*transpose*/false, matrix.data)

gl.drawElements(gl.TRIANGLES, /*count*/6, /*index type*/gl.UNSIGNED_BYTE, /*offset*/0)
