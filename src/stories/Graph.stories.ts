import { typeAlias } from '@babel/types'
import * as Studio from '../studio'

export default {
  title: "Graph",
}

class DefaultProgram {
  program: WebGLProgram
  uMatrix: WebGLUniformLocation
  aPositionBuffer: WebGLBuffer
  aColorBuffer: WebGLBuffer
  gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext) {
    const vertexShaderSource = `#version 300 es
uniform mat4 u_matrix;

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`

    const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
}
`

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getShaderInfoLog(vertexShader))
      console.log(gl.getShaderInfoLog(fragmentShader))
    }

    this.aPositionBuffer = gl.createBuffer()!
    const aPositionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPositionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aPositionBuffer)
    gl.vertexAttribPointer(
      aPositionLocation,
      /*size*/3,
      /*type*/gl.FLOAT,
      /*normalize*/false,
      /*stride*/0,
      /*offset*/0
    )

    this.aColorBuffer = gl.createBuffer()!
    const aColorLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(aColorLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aColorBuffer)
    gl.vertexAttribPointer(
      aColorLocation,
      /*size*/4,
      /*type*/gl.UNSIGNED_BYTE,
      /*normalize*/true,
      /*stride*/0,
      /*offset*/0
    )

    this.uMatrix = gl.getUniformLocation(program, 'u_matrix')!

    this.program = program
    this.gl = gl
  }

  use = () => this.gl.useProgram(this.program)

  setMatrix = (data: number[]) =>
    this.gl.uniformMatrix4fv(this.uMatrix, /*transpose*/true, /*data*/[
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])

  setPosition = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  setColor = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW)
  }
}

export const Triangle = () => {
  const canvas = document.createElement('canvas')
  const [width, height] = [500, 500]
  canvas.width = width
  canvas.height = height
  canvas.style.display = 'block'

  const gl = canvas.getContext('webgl2')!
  gl.clearColor(0.0, 0.0, 0.0, 1.0)


  const defaultProgram = new DefaultProgram(gl)
  defaultProgram.use()

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  const textureWidth = 250
  const textureHeight = 250
  gl.texImage2D(
    gl.TEXTURE_2D,
    /*level*/0,
    /*internalFormat*/gl.RGBA,
    /*width*/textureWidth,
    /*height*/textureHeight,
    /*border*/0,
    /*format*/gl.RGBA,
    /*type*/gl.UNSIGNED_BYTE,
    /*data*/null
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.viewport(0, 0, width, height)

  const attachmentPoint = gl.COLOR_ATTACHMENT0
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, /*level*/0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  defaultProgram.setMatrix([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  defaultProgram.setPosition([
    0.5, 0, 0,
    0, 0.5, 0,
    -0.5, 0, 0,
  ])

  defaultProgram.setColor([
    255, 0, 0, 255,
    0, 255, 0, 255,
    0, 0, 255, 255,
  ])

  gl.drawArrays(gl.TRIANGLES, /*first*/0, /*count*/3)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)

  return canvas
}
