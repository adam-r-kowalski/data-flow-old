import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { Mat3 } from "../linear_algebra";
import { Font, TextMeasurements } from "../ui";

interface Attribute {
    location: number
    buffer: WebGLBuffer
}

interface Attributes {
    vertices: Attribute
    colors: Attribute
    vertexIndices: WebGLBuffer
}

interface Uniforms {
    projection: WebGLUniformLocation
}

interface Program {
    vertexShader: WebGLShader
    fragmentShader: WebGLShader
    program: WebGLProgram
    attributes: Attributes
    uniforms: Uniforms
}

type DevicePixelRatio = number

const nearestPowerOfTwo = (x: number): number => {
    let current = 1
    while (current < x) {
        current <<= 1
    }
    return current
}

const createTextMeasurements = (gl: WebGL2RenderingContext, font: Font, dpr: DevicePixelRatio) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const totalCells = 256
    const rows = Math.sqrt(totalCells)
    const size = nearestPowerOfTwo(font.size * rows)
    const cellSize = size / rows
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.font = font.family
    ctx.fillStyle = 'white'
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const height = font.size
    const widths: number[] = []
    const textureCoordinates: number[][] = []
    for (let i = 0; i < totalCells; ++i) {
        const c = String.fromCharCode(i)
        const metric = ctx.measureText(c)
        const width = Math.ceil(metric.width)
        const x = i % rows * cellSize
        const y = Math.floor(i / rows) * cellSize
        ctx.fillText(c, x, y)
        widths.push(width)
        const x0 = x / size
        const x1 = (x + width) / size
        const y0 = y / size
        const y1 = (y + height) / size
        textureCoordinates.push([
            x0, y0,
            x0, y1,
            x1, y0,
            x1, y1
        ])
    }
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
      /*mipLevel*/0,
      /*internalformat*/gl.RGBA,
      /*srcFormat*/gl.RGBA,
      /*srcType*/gl.UNSIGNED_BYTE,
      /*source*/canvas
    )
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return { widths, textureCoordinates, texture }
}

const mapString = <T>(str: string, f: (c: string, i: number) => T): Array<T> => {
    let result = []
    for (let i = 0; i < str.length; ++i) {
        result.push(f(str[i], i))
    }
    return result
}

type Key = [Font, DevicePixelRatio]

export class WebGL2Renderer {
    _size: Size

    constructor(
        public canvas: HTMLCanvasElement,
        public gl: WebGL2RenderingContext,
        public program: Program,
        public textures: WebGLTexture[],
        public textMeasurementsCache: Map<Key, TextMeasurements>,
    ) { }

    clear() {
        const { gl } = this
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    set size(size: Size) {
        const { gl, program } = this
        const { uniforms } = program
        const { canvas } = gl
        gl.uniformMatrix3fv(uniforms.projection, /*transpose*/true, Mat3.projection(size).data)
        canvas.width = size.width * window.devicePixelRatio
        canvas.height = size.height * window.devicePixelRatio
        canvas.style.width = `${size.width}px`
        canvas.style.height = `${size.height}px`
        gl.viewport(0, 0, canvas.width, canvas.height)
        this._size = size
    }

    get size() { return this._size }

    draw({ vertices, colors, vertexIndices }: Batch) {
        const { gl, program } = this
        const { attributes } = program
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.vertices.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.colors.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attributes.vertexIndices)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
        gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)
    }

    measureText(font: Font, str: string) {
        const { gl } = this
        const dpr = window.devicePixelRatio
        const key: Key = [font, dpr]
        const { widths, textureIndex, textureCoordinates } = (() => {
            const measurements = this.textMeasurementsCache.get(key)
            if (measurements) return measurements
            const { texture, widths, textureCoordinates } = createTextMeasurements(gl, font, dpr)
            const textureIndex = this.textures.length
            this.textures.push(texture)
            const newMeasurements = { widths, textureIndex, textureCoordinates }
            this.textMeasurementsCache.set(key, newMeasurements)
            return newMeasurements
        })()
        const indices = mapString(str, c => c.charCodeAt(0))
        return {
            widths: indices.map(i => widths[i]),
            textureIndex,
            textureCoordinates: indices.map(i => textureCoordinates[i]),
        }
    }
}


const createVertexShader = (gl: WebGL2RenderingContext, { vertices, colors }: Attributes): WebGLShader => {
    const vertexShaderSource = `#version 300 es
  uniform mat3 u_projection;

  layout(location = ${vertices.location}) in vec2 a_vertex;
  layout(location = ${colors.location}) in vec4 a_color;

  out vec4 v_color;

  void main() {
    gl_Position = vec4((u_projection * vec3(a_vertex, 1)).xy, 0, 1);
    v_color = a_color / 255.0;
  }
  `
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)
    return vertexShader
}

const createFragmentShader = (gl: WebGL2RenderingContext): WebGLShader => {
    const fragmentShaderSource = `#version 300 es
  precision highp float;

  in vec4 v_color;

  out vec4 fragColor;
  
  void main() {
    fragColor = v_color;
  }
  `
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)
    return fragmentShader
}

const bindVertices = (gl: WebGL2RenderingContext, program: WebGLProgram, { location, buffer }: Attribute) => {
    gl.bindAttribLocation(program, location, 'a_vertex')
    gl.enableVertexAttribArray(location)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(
        location,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
    )
}

const bindColors = (gl: WebGL2RenderingContext, program: WebGLProgram, { location, buffer }: Attribute) => {
    gl.bindAttribLocation(program, location, 'a_color')
    gl.enableVertexAttribArray(location)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(
        location,
        /*size*/4,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
    )
}


const createProgram = (gl: WebGL2RenderingContext): Program => {
    const attributes: Attributes = {
        vertices: {
            location: 0,
            buffer: gl.createBuffer()!
        },
        colors: {
            location: 1,
            buffer: gl.createBuffer()!
        },
        vertexIndices: gl.createBuffer()!
    }
    const vertexShader = createVertexShader(gl, attributes)
    const fragmentShader = createFragmentShader(gl)
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
    bindVertices(gl, program, attributes.vertices)
    bindColors(gl, program, attributes.colors)
    const uniforms = {
        projection: gl.getUniformLocation(program, 'u_projection')!
    }
    return {
        vertexShader,
        fragmentShader,
        program,
        attributes,
        uniforms
    }
}

export const webGL2Renderer = (size: Size) => {
    const canvas = document.createElement('canvas')
    canvas.style.touchAction = 'none'
    const gl = canvas.getContext('webgl2')!
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.depthMask(false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.clearColor(0, 0, 0, 1)
    const program = createProgram(gl)
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
      /*data*/new Uint8Array([255, 255, 255, 255])
    )
    const textures = [texture]
    const textMeasurementsCache = new Map()
    const renderer = new WebGL2Renderer(canvas, gl, program, textures, textMeasurementsCache)
    renderer.size = size
    return renderer
}