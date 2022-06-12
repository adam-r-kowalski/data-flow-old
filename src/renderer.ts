import { Mat3 } from "./linear_algebra"

class DefaultProgram {
    positionBuffer: WebGLBuffer
    colorBuffer: WebGLBuffer
    textureCoordinatesBuffer: WebGLBuffer
    indexBuffer: WebGLBuffer
    resolutionLocation: WebGLUniformLocation
    devicePixelRatioLocation: WebGLUniformLocation
    matrixLocation: WebGLUniformLocation

    constructor(gl: WebGL2RenderingContext) {
        const aPositionLocation = 0
        const aTextureCoordinatesLocation = 1
        const aColorLocation = 2

        const vertexShaderSource = `#version 300 es
  uniform float u_devicePixelRatio;
  uniform mat3 u_matrix;

  layout(location = ${aPositionLocation}) in vec2 a_position;
  layout(location = ${aTextureCoordinatesLocation}) in vec2 a_textureCoordinates;
  layout(location = ${aColorLocation}) in vec4 a_color;

  out vec2 v_textureCoordinates;
  out vec4 v_color;

  void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_textureCoordinates = a_textureCoordinates * u_devicePixelRatio;
    v_color = a_color / 255.0;
  }
  `
        const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_texture;

  in vec2 v_textureCoordinates;
  in vec4 v_color;

  out vec4 fragColor;
  
  void main() {
    ivec2 size = textureSize(u_texture, 0);
    vec2 coordinate = v_textureCoordinates / vec2(float(size.x), float(size.y));
    fragColor = texture(u_texture, coordinate) * v_color;
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

        gl.useProgram(program)

        const vertexArrayObject = gl.createVertexArray()!
        gl.bindVertexArray(vertexArrayObject)

        this.positionBuffer = gl.createBuffer()!
        gl.bindAttribLocation(program, aPositionLocation, 'a_position')
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

        this.textureCoordinatesBuffer = gl.createBuffer()!
        gl.bindAttribLocation(program, aTextureCoordinatesLocation, 'a_textureCoordinates')
        gl.enableVertexAttribArray(aTextureCoordinatesLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer)
        gl.vertexAttribPointer(
            aTextureCoordinatesLocation,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
        )

        this.colorBuffer = gl.createBuffer()!
        gl.bindAttribLocation(program, aColorLocation, 'a_color')
        gl.enableVertexAttribArray(aColorLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
        gl.vertexAttribPointer(
            aColorLocation,
        /*size*/4,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
        )

        this.indexBuffer = gl.createBuffer()!
        this.devicePixelRatioLocation = gl.getUniformLocation(program, 'u_devicePixelRatio')!
        this.matrixLocation = gl.getUniformLocation(program, 'u_matrix')!
    }
}

const nearestPowerOfTwo = (x: number): number => {
    let current = 1
    while (current < x) {
        current <<= 1
    }
    return current
}

interface Metric {
    x: number
    y: number
    width: number
    height: number
}

class FontAtlas {
    constructor(
        public texture: number,
        public metrics: Metric[],
        public fontFamily: string,
        public fontSize: number,
    ) { }

    metric = (c: string) => this.metrics[c.charCodeAt(0)]
}

interface DrawData {
    vertices: number[]
    colors: number[]
    textureCoordinates: number[]
    vertexIndices: number[]
}

interface DrawLineData {
    vertices: number[]
    colors: number[]
    textureCoordinates: number[]
}

const createFontMetrics = (gl: WebGL2RenderingContext, texture: WebGLTexture, font: string, fontSize: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const totalCells = 256
    const rows = Math.sqrt(totalCells)
    const size = nearestPowerOfTwo(fontSize * rows)
    const cellSize = size / rows
    canvas.width = size * window.devicePixelRatio
    canvas.height = size * window.devicePixelRatio
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.font = font
    ctx.fillStyle = 'white'
    const ascii = Array.from({ length: totalCells }, (v, i) => i)
    const chars = ascii.map(c => String.fromCharCode(c))
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const metrics = chars.map((c, i) => {
        const metric = ctx.measureText(c)
        const width = Math.ceil(metric.width)
        const height = fontSize
        const x = i % rows * cellSize
        const y = Math.floor(i / rows) * cellSize
        ctx.fillText(c, x, y)
        return {
            x: x,
            y: y,
            width: width,
            height: height
        }
    })
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
      /*mipLevel*/0,
      /*internalformat*/gl.RGBA,
      /*srcFormat*/gl.RGBA,
      /*srcType*/gl.UNSIGNED_BYTE,
      /*source*/canvas)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return metrics
}

export class Renderer {
    gl: WebGL2RenderingContext
    canvas: HTMLCanvasElement
    program: DefaultProgram
    width: number
    height: number
    fontAtlasses: Map<string, FontAtlas>
    textures: WebGLTexture[]
    devicePixelRatio: number

    constructor(width: number, height: number) {
        const canvas = document.createElement('canvas')
        canvas.style.touchAction = 'none'
        const gl = canvas.getContext('webgl2')!
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.depthMask(false)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        gl.activeTexture(gl.TEXTURE0)
        this.gl = gl
        this.canvas = canvas
        this.program = new DefaultProgram(gl)
        this.fontAtlasses = new Map()
        this.textures = []
        this.devicePixelRatio = window.devicePixelRatio
        this.setSize(width, height)
        const texture = gl.createTexture()!
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
      /*mipLevel*/0,
      /*internalformat*/gl.RGBA,
      /*width*/1,
      /*height*/1,
      /*border*/0,
      /*srcFormat*/gl.RGBA,
      /*srcType*/gl.UNSIGNED_BYTE,
      /*data*/new Uint8Array([255, 255, 255, 255]))
        this.textures.push(texture)
    }

    setSize = (width: number, height: number) => {
        const { gl, canvas } = this
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        gl.uniform2f(this.program.resolutionLocation, canvas.width, canvas.height)
        gl.uniform1f(this.program.devicePixelRatioLocation, window.devicePixelRatio)
        gl.viewport(0, 0, canvas.width, canvas.height)
        this.width = width
        this.height = height
        if (this.devicePixelRatio == window.devicePixelRatio) return
        this.devicePixelRatio = window.devicePixelRatio
        this.recreateFontAtlasses()
    }

    clear = () => {
        const { gl } = this
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    setMatrix = (matrix: Mat3) =>
        this.gl.uniformMatrix3fv(this.program.matrixLocation, /*transpose*/true, /*data*/matrix.data)

    draw = ({ vertices, colors, textureCoordinates, vertexIndices }: DrawData) => {
        const { gl, program } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, program.colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, program.textureCoordinatesBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
        gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)
    }

    drawLines = ({ vertices, colors, textureCoordinates }: DrawLineData) => {
        const { gl, program } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, program.colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, program.textureCoordinatesBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer)
        gl.drawArrays(gl.LINES, 0, vertices.length / 2)
    }

    recreateFontAtlasses = () => {
        for (const [font, fontAtlas] of this.fontAtlasses) {
            const texture = this.textures[fontAtlas.texture]
            const metrics = createFontMetrics(this.gl, texture, font, fontAtlas.fontSize)
            fontAtlas.metrics = metrics
        }
    }

    fontAtlas = (fontFamily: string, fontSize: number): FontAtlas => {
        const font = `${fontSize}px ${fontFamily}`
        const atlas = this.fontAtlasses.get(font)
        if (atlas) return atlas
        const { gl } = this
        const texture = gl.createTexture()!
        const metrics = createFontMetrics(gl, texture, font, fontSize)
        const textureIndex = this.textures.length
        this.textures.push(texture)
        const newAtlas = new FontAtlas(textureIndex, metrics, fontFamily, fontSize)
        this.fontAtlasses.set(font, newAtlas)
        return newAtlas
    }
}