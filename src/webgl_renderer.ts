import { ECS, Entity } from './ecs'
import { projection } from './linear_algebra'
import { Geometry, Translate, Scale } from './components'

export class Renderer {
  element: HTMLCanvasElement
  gl: WebGL2RenderingContext
  uMatrix: WebGLUniformLocation
  position: { buffer: WebGLBuffer, location: number }
  indexBuffer: WebGLBuffer

  constructor() {
    this.element = document.createElement('canvas')
    this.element.style.width = '100%'
    this.element.style.height = '100%'
    const gl = this.element.getContext('webgl2')
    this.gl = gl
    gl.clearColor(0.0, 1.0, 1.0, 1.0)

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
    this.uMatrix = gl.getUniformLocation(program, 'u_matrix')

    this.position = {
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(program, 'a_position')
    }
    gl.enableVertexAttribArray(this.position.location)

    this.indexBuffer = gl.createBuffer()
  }

  setSize = (width: number, height: number): void => {
    const gl = this.gl
    gl.canvas.width = width
    gl.canvas.height = height
    gl.viewport(0, 0, width, height)
  }

  render = (rect: Entity): void => {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)
    const geometry = rect.get(Geometry)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW)
    gl.vertexAttribPointer(this.position.location, /*size*/3, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(geometry.indices), gl.STATIC_DRAW)
    const matrix = projection(gl.canvas.width, gl.canvas.height, 400)
      .mul(rect.get(Translate).matrix())
      .mul(rect.get(Scale).matrix())
    gl.uniformMatrix4fv(this.uMatrix, /*transpose*/false, matrix.data)
    gl.drawElements(gl.TRIANGLES, /*count*/geometry.vertices.length / 2, /*index type*/gl.UNSIGNED_BYTE, /*offset*/0)
  }
}
