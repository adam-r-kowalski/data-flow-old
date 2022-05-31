class DefaultProgram {
    positionBuffer: WebGLBuffer
    colorBuffer: WebGLBuffer
    textureCoordinatesBuffer: WebGLBuffer
    indexBuffer: WebGLBuffer
    resolutionLocation: WebGLUniformLocation

    constructor(gl: WebGL2RenderingContext) {
        const vertexShaderSource = `#version 300 es
  uniform vec2 u_resolution;

  in vec2 a_position;
  in vec2 a_textureCoordinates;
  in vec4 a_color;

  out vec2 v_textureCoordinates;
  out vec4 v_color;

  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_textureCoordinates = a_textureCoordinates;
    v_color = a_color;
  }
  `
        const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_texture;

  in vec2 v_textureCoordinates;
  in vec4 v_color;

  out vec4 fragColor;
  
  vec4 hslToRgb(in vec4 hsl) {
    float h = hsl.x / 360.0;
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w);
  }

  void main() {
    ivec2 size = textureSize(u_texture, 0);
    vec2 coordinate = v_textureCoordinates / vec2(float(size.x), float(size.y));
    fragColor = texture(u_texture, coordinate) * hslToRgb(v_color);
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

        this.textureCoordinatesBuffer = gl.createBuffer()!
        const aTextureCoordinatesLocation = gl.getAttribLocation(program, 'a_textureCoordinates')
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
        const aColorLocation = gl.getAttribLocation(program, 'a_color')
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
        this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution')!
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
        public metrics: Metric[]
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


export class Renderer {
    gl: WebGL2RenderingContext
    canvas: HTMLCanvasElement
    program: DefaultProgram
    width: number
    height: number
    fontAtlasses: Map<string, FontAtlas>
    textures: WebGLTexture[]

    constructor(width: number, height: number) {
        const canvas = document.createElement('canvas')
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
        const widthDpr = width * window.devicePixelRatio
        const heightDpr = height * window.devicePixelRatio
        canvas.width = widthDpr
        canvas.height = heightDpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        gl.uniform2f(this.program.resolutionLocation, widthDpr, heightDpr)
        gl.viewport(0, 0, widthDpr, heightDpr)
        this.width = widthDpr
        this.height = heightDpr
    }

    clear = () => {
        const { gl } = this
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

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

    fontAtlas = (fontFamily: string, fontSize: number): FontAtlas => {
        const font = `${fontSize}px ${fontFamily}`
        const atlas = this.fontAtlasses.get(font)
        if (atlas) return atlas
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
                x: x * window.devicePixelRatio,
                y: y * window.devicePixelRatio,
                width: width * window.devicePixelRatio,
                height: height * window.devicePixelRatio
            }
        })
        const { gl } = this
        const texture = gl.createTexture()!
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
        const textureIndex = this.textures.length
        this.textures.push(texture)
        const newAtlas = new FontAtlas(textureIndex, metrics)
        this.fontAtlasses.set(font, newAtlas)
        return newAtlas
    }
}