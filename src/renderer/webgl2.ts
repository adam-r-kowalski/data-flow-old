import { Renderer, Size, Text, FontSize, FontFamily, Color, Vertices, TextureCoordinates, Colors, VertexIndices, Offset } from "../components"
import { ECS, Entity } from "../ecs"

class DefaultProgram {
    positionBuffer: WebGLBuffer
    colorBuffer: WebGLBuffer
    texCoordBuffer: WebGLBuffer
    indexBuffer: WebGLBuffer
    resolutionLocation: WebGLUniformLocation

    constructor(gl: WebGL2RenderingContext) {
        const vertexShaderSource = `#version 300 es
  uniform vec2 u_resolution;

  in vec2 a_position;
  in vec2 a_texCoord;
  in vec4 a_color;

  out vec2 v_texCoord;
  out vec4 v_color;

  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
    v_color = a_color;
  }
  `

        const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_image;

  in vec2 v_texCoord;
  in vec4 v_color;

  out vec4 fragColor;
  
  vec4 hslToRgb(in vec4 hsl) {
    float h = hsl.x / 360.0;
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w);
  }

  void main() {
    ivec2 size = textureSize(u_image, 0);
    vec2 coord = v_texCoord / vec2(float(size.x), float(size.y));
    fragColor = texture(u_image, coord) * hslToRgb(v_color);
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

        this.texCoordBuffer = gl.createBuffer()!
        const aTexCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
        gl.enableVertexAttribArray(aTexCoordLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
        gl.vertexAttribPointer(
            aTexCoordLocation,
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
        const imageLocation = gl.getUniformLocation(program, 'u_image')!
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
        public texture: WebGLTexture,
        public metrics: Metric[]
    ) { }

    metric = (c: string) => this.metrics[c.charCodeAt(0)]
}

class Fonts {
    private atlasses: Map<string, FontAtlas>

    constructor() {
        this.atlasses = new Map()
    }

    get = (gl: WebGL2RenderingContext, fontFamily: string, fontSize: number): FontAtlas => {
        const font = `${fontSize}px ${fontFamily}`
        const atlas = this.atlasses.get(font)
        if (atlas) return atlas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const totalCells = 256
        const rows = Math.sqrt(totalCells)
        const size = nearestPowerOfTwo((fontSize + 5) * rows)
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
            const width = Math.abs(metric.actualBoundingBoxLeft) + Math.abs(metric.actualBoundingBoxRight)
            const height = Math.abs(metric.actualBoundingBoxAscent) + Math.abs(metric.actualBoundingBoxDescent)
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
        const small = metrics['-'.charCodeAt(0)]
        const space = metrics[' '.charCodeAt(0)]
        space.width = small.width
        space.height = small.height
        const texture = gl.createTexture()!
        gl.activeTexture(gl.TEXTURE0)
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
        const newAtlas = new FontAtlas(texture, metrics)
        this.atlasses.set(font, newAtlas)
        return newAtlas
    }
}

const setSize = (self: Entity, size: Size) => {
    const { width, height } = size
    const gl = self.get(WebGL2RenderingContext)!
    const widthDpr = width * window.devicePixelRatio
    const heightDpr = height * window.devicePixelRatio
    self.update(HTMLCanvasElement, canvas => {
        canvas.width = widthDpr
        canvas.height = heightDpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
    })
    const program = self.get(DefaultProgram)!
    gl.uniform2f(program.resolutionLocation, widthDpr, heightDpr)
    gl.viewport(0, 0, widthDpr, heightDpr)
    self.set(size)
}

const getSize = (self: Entity) => self.get(Size)!

const clear = (self: Entity) => {
    const gl = self.get(WebGL2RenderingContext)!
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const textSize = (self: Entity, entity: Entity) => {
    const gl = self.get(WebGL2RenderingContext)!
    const text = entity.get(Text)!.value
    const fontSize = entity.get(FontSize)!.value
    const fontFamily = entity.get(FontFamily)!.value
    const atlas = self.get(Fonts)!.get(gl, fontFamily, fontSize)
    let size = new Size(0, 0)
    for (const c of text) {
        const metric = atlas.metric(c)
        size.width += metric.width
        size.height = Math.max(metric.height, size.height)
    }
    return size
}

const textGeometry = (self: Entity, entity: Entity) => {
    const gl = self.get(WebGL2RenderingContext)!
    const text = entity.get(Text)!.value
    const fontSize = entity.get(FontSize)!.value
    const fontFamily = entity.get(FontFamily)!.value
    const { h, s, l, a } = entity.get(Color)!
    const atlas = self.get(Fonts)!.get(gl, fontFamily, fontSize)
    let x = 0
    let indexOffset = 0
    const vertices = new Vertices()
    const textureCoordinates = new TextureCoordinates()
    const colors = new Colors()
    const indices = new VertexIndices()
    const offset = entity.get(Offset)!
    for (const c of text) {
        const metric = atlas.metric(c)
        const x0 = offset.x + x
        const x1 = x0 + metric.width
        const y0 = offset.y
        const y1 = y0 + metric.height
        vertices.data.push(
            x0, y0,
            x0, y1,
            x1, y0,
            x1, y1,
        )
        textureCoordinates.data.push(
            metric.x, metric.y,
            metric.x, metric.y + metric.height,
            metric.x + metric.width, metric.y,
            metric.x + metric.width, metric.y + metric.height,
        )
        colors.data.push(
            h, s, l, a,
            h, s, l, a,
            h, s, l, a,
            h, s, l, a,
        )
        indices.data.push(
            indexOffset + 0, indexOffset + 1, indexOffset + 2,
            indexOffset + 1, indexOffset + 2, indexOffset + 3,
        )
        x += metric.width
        indexOffset += 4
    }
    entity.set(vertices, textureCoordinates, colors, indices)
}

const draw = (self: Entity) => {
    const gl = self.get(WebGL2RenderingContext)!
    const vertices = self.get(Vertices)!.data
    const colors = self.get(Colors)!.data
    const textureCoordinates = self.get(TextureCoordinates)!.data
    const vertexIndices = self.get(VertexIndices)!.data
    const program = self.get(DefaultProgram)!
    gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, program.colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, program.texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
    gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)
}

export const webgl2 = (ecs: ECS, width: number, height: number) => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')!
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.depthMask(false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    const entity = ecs.entity(
        gl,
        canvas,
        new DefaultProgram(gl),
        new Fonts(),
        new Vertices(),
        new Colors(),
        new TextureCoordinates(),
        new VertexIndices()
    )
    setSize(entity, new Size(width, height))
    const vtable = {
        setSize,
        getSize,
        clear,
        textSize,
        textGeometry,
        draw,
    }
    ecs.set(new Renderer(entity, vtable))
    return entity
}