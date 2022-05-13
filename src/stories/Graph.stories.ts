import { typeAlias } from '@babel/types'
import { WebGL2 } from '../renderer'
import * as Studio from '../studio'

export default {
  title: "Graph",
}


class TextureProgram {
  program: WebGLProgram
  transformLocation: WebGLUniformLocation
  textureLocation: WebGLUniformLocation
  positionBuffer: WebGLBuffer
  texcoordBuffer: WebGLBuffer
  colorBuffer: WebGLBuffer
  indexBuffer: WebGLBuffer
  gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext) {
    const vertexShaderSource = `#version 300 es
uniform mat3 u_transform;

in vec3 a_position;
in vec2 a_texcoord;
in vec4 a_color;

out vec2 v_texcoord;
out vec4 v_color;

void main() {
  gl_Position = vec4(u_transform * a_position, 1.0);
  v_texcoord = a_texcoord;
  v_color = a_color;
}
`

    const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D u_texture;

in vec2 v_texcoord;
in vec4 v_color;

out vec4 fragColor;

void main() {
  fragColor = texture(u_texture, v_texcoord) * v_color;
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

    this.positionBuffer = gl.createBuffer()!
    const aPositionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPositionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(
      aPositionLocation,
      /*size*/2,
      /*type*/gl.FLOAT,
      /*normalize*/false,
      /*stride*/0,
      /*offset*/0
    )

    this.texcoordBuffer = gl.createBuffer()!
    const aTexcoordLocation = gl.getAttribLocation(program, 'a_texcoord')
    gl.enableVertexAttribArray(aTexcoordLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer)
    gl.vertexAttribPointer(
      aTexcoordLocation,
      /*size*/2,
      /*type*/gl.FLOAT,
      /*normalize*/true,
      /*stride*/0,
      /*offset*/0
    )

    this.colorBuffer = gl.createBuffer()!
    const aColorLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(aColorLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.vertexAttribPointer(
      aColorLocation,
      /*size*/4,
      /*type*/gl.UNSIGNED_BYTE,
      /*normalize*/true,
      /*stride*/0,
      /*offset*/0
    )

    this.indexBuffer = gl.createBuffer()!

    this.transformLocation = gl.getUniformLocation(program, 'u_transform')!
    this.textureLocation = gl.getUniformLocation(program, 'u_texture')!

    this.program = program
    this.gl = gl
  }

  use = () => this.gl.useProgram(this.program)

  setMatrix = (data: number[]) =>
    this.gl.uniformMatrix3fv(this.transformLocation, /*transpose*/true, /*data*/data)

  setPosition = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  setTexcoord = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

  setColor = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW)
  }

  setIndices = (data: number[]) => {
    const gl = this.gl
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW)
  }
}

export const Triangle = () => {
  const canvas = document.createElement('canvas')
  const [width, height] = [500, 500]
  canvas.width = width
  canvas.height = height
  canvas.style.display = 'block'

  const gl = canvas.getContext('webgl2')!

  const textureProgram = new TextureProgram(gl)
  textureProgram.use()

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const gradientTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, gradientTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    /*level*/0,
    /*internalFormat*/gl.RGBA,
    /*width*/1,
    /*height*/1,
    /*border*/0,
    /*format*/gl.RGBA,
    /*type*/gl.UNSIGNED_BYTE,
    /*data*/new Uint8Array([255, 255, 255, 255])
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const targetTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, targetTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    /*level*/0,
    /*internalFormat*/gl.RGBA,
    /*width*/width,
    /*height*/height,
    /*border*/0,
    /*format*/gl.RGBA,
    /*type*/gl.UNSIGNED_BYTE,
    /*data*/null
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const framebuffer = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  const attachmentPoint = gl.COLOR_ATTACHMENT0
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, /*level*/0)

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindTexture(gl.TEXTURE_2D, gradientTexture)

  textureProgram.setMatrix([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ])

  textureProgram.setPosition([
    -1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ])

  textureProgram.setTexcoord([
    0, 0,
    1, 0,
    0, 1,
    1, 1,
  ])

  textureProgram.setColor([
    255, 0, 0, 150,
    0, 255, 0, 150,
    0, 0, 255, 150,
    0, 0, 0, 150,
  ])

  textureProgram.setIndices([
    0, 1, 2,
    1, 2, 3,
  ])

  gl.drawElements(gl.TRIANGLES, /*count*/6, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  gl.bindTexture(gl.TEXTURE_2D, targetTexture)

  textureProgram.setColor([
    255, 255, 255, 255,
    255, 255, 255, 255,
    255, 255, 255, 255,
    255, 255, 255, 255,
  ])

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, /*count*/6, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)

  return canvas
}
