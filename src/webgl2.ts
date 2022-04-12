const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`

export interface Rectangle {
  x: number,
  y: number,
  width: number,
  height: number,
  red: number,
  green: number,
  blue: number,
  alpha: number
}

export interface Text {
  message: string,
  x: number,
  y: number,
  fontFamily: string,
  fontSize: number
  textAlign: 'left' | 'right',
  fillStyle: string
}


export class WebGL2 {
  gl: WebGL2RenderingContext
  colorLocation: WebGLUniformLocation
  ctx: CanvasRenderingContext2D

  createShader(shader_type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(shader_type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
    console.assert(success)
    return shader
  }

  createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = this.gl.createProgram()
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
    console.assert(success)
    return program
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.gl.canvas
    const dpr = window.devicePixelRatio
    const { width, height } = canvas.getBoundingClientRect()
    const displayWidth = Math.round(width * dpr)
    const displayHeight = Math.round(height * dpr)
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }

  constructor() {
    const glCanvas: HTMLCanvasElement = document.querySelector('#canvas')
    glCanvas.width = window.innerWidth
    glCanvas.height = window.innerHeight
    this.gl = glCanvas.getContext('webgl2')
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = this.createProgram(vertexShader, fragmentShader)
    this.gl.clearColor(0.56, .56, .56, 1)
    const positionAttributeLocation = this.gl.getAttribLocation(program, "a_position")
    const positionBuffer = this.gl.createBuffer()
    const vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(vao)
    this.gl.enableVertexAttribArray(positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
    const size = 2
    const dtype = this.gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    this.gl.vertexAttribPointer(positionAttributeLocation, size, dtype, normalize, stride, offset)
    this.gl.useProgram(program)
    const resoltionUniformLocation = this.gl.getUniformLocation(program, "u_resolution")
    this.gl.uniform2f(resoltionUniformLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.colorLocation = this.gl.getUniformLocation(program, "u_color")
    const textCanvas: HTMLCanvasElement = document.querySelector('#text')
    textCanvas.width = window.innerWidth
    textCanvas.height = window.innerHeight
    this.ctx = textCanvas.getContext('2d')
    this.resizeCanvasToDisplaySize()
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  drawRectangle(rectangle: Rectangle) {
    const x1 = rectangle.x
    const x2 = rectangle.x + rectangle.width
    const y1 = rectangle.y
    const y2 = rectangle.y + rectangle.height
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), this.gl.STATIC_DRAW);
    const offset = 0
    const count = 6
    this.gl.uniform4f(this.colorLocation, rectangle.red, rectangle.green, rectangle.blue, rectangle.alpha)
    this.gl.drawArrays(this.gl.TRIANGLES, offset, count)
  }

  drawText(text: Text) {
    this.ctx.font = `${text.fontSize}pt ${text.fontFamily}`
    this.ctx.textAlign = text.textAlign
    this.ctx.fillStyle = text.fillStyle
    this.ctx.fillText(text.message, text.x, text.y + text.fontSize)
  }
}
