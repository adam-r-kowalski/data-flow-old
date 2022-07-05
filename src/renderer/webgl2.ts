import { ClickHandlers } from ".";
import { Batch } from "./batch_geometry";
import { Size } from "../layout";
import { Font, TextMeasurements } from "../ui";
import { Lines } from "./connection_geometry";
import { Matrix3x3, projection } from "../linear_algebra/matrix3x3";
import { Document, WebGL2Context, Buffer, UniformLocation, Shader, Program, Canvas, Texture, Window } from "./dom";

interface Attribute {
    location: number
    buffer: Buffer
}

interface Attributes {
    vertices: Attribute
    vertexIndices: Buffer
    colors: Attribute
    textureCoordinates: Attribute
    cameraIndex: Attribute
}

interface Uniforms {
    projection: UniformLocation
    texture: UniformLocation
    cameras: UniformLocation
}

interface ProgramData {
    vertexShader: Shader
    fragmentShader: Shader
    program: Program
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

const createTextMeasurements = (document: Document, gl: WebGL2Context, font: Font, dpr: DevicePixelRatio) => {
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
    ctx.font = `${font.size}px ${font.family}`
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

export class WebGL2Renderer {
    _size: Size
    _cameras: Matrix3x3[]

    constructor(
        public window: Window,
        public document: Document,
        public canvas: Canvas,
        public gl: WebGL2Context,
        public program: ProgramData,
        public textures: Texture[],
        public textMeasurementsCache: Map<string, TextMeasurements>,
        public clickHandlers: ClickHandlers,
    ) { }

    clear = () => {
        const { gl } = this
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    set size(size: Size) {
        const { gl, program, window } = this
        const { uniforms } = program
        const { canvas } = gl
        gl.uniformMatrix3fv(uniforms.projection, /*transpose*/true, projection(size))
        canvas.width = size.width * window.devicePixelRatio
        canvas.height = size.height * window.devicePixelRatio
        canvas.style.width = `${size.width}px`
        canvas.style.height = `${size.height}px`
        gl.viewport(0, 0, canvas.width, canvas.height)
        this._size = size
    }

    get size() { return this._size }

    set cameras(cameras: Matrix3x3[]) {
        const { gl, program } = this
        const { uniforms } = program
        const data: number[] = []
        for (const camera of cameras) data.push(...camera)
        gl.uniformMatrix3fv(uniforms.cameras, /*transpose*/true, data)
        this._cameras = cameras
    }

    get cameras() { return this._cameras }

    draw = ({ vertices, colors, vertexIndices, textureCoordinates, textureIndex, cameraIndex }: Batch) => {
        const { gl, program, textures } = this
        const { attributes } = program
        const texture = textures[textureIndex]
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.vertices.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.colors.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.textureCoordinates.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.cameraIndex.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cameraIndex), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attributes.vertexIndices)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
        gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)
    }

    drawLines = ({ vertices, colors }: Lines) => {
        const { gl, program, textures } = this
        const { attributes } = program
        const texture = textures[0]
        const count = vertices.length / 2
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.vertices.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.colors.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.textureCoordinates.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Array(count * 2).fill(0)), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, attributes.cameraIndex.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(Array(count).fill(0)), gl.STATIC_DRAW)
        gl.drawArrays(gl.LINES, /*first*/0, count)
    }

    getTextureMeasurements = (font: Font, dpr: DevicePixelRatio) => {
        const { document, gl } = this
        const key = `${dpr} ${font.size} ${font.family}`
        const measurements = this.textMeasurementsCache.get(key)
        if (measurements) return measurements
        const { texture, widths, textureCoordinates } = createTextMeasurements(document, gl, font, dpr)
        const textureIndex = this.textures.length
        this.textures.push(texture)
        const newMeasurements = { widths, textureIndex, textureCoordinates }
        this.textMeasurementsCache.set(key, newMeasurements)
        return newMeasurements
    }

    measureText = (font: Font, str: string) => {
        const { window } = this
        const dpr = window.devicePixelRatio
        const { widths, textureIndex, textureCoordinates } = this.getTextureMeasurements(font, dpr)
        const indices = mapString(str, c => c.charCodeAt(0))
        return {
            widths: indices.map(i => widths[i]),
            textureIndex,
            textureCoordinates: indices.map(i => textureCoordinates[i]),
        }
    }
}

const createVertexShader = (gl: WebGL2Context, attributes: Attributes): Shader => {
    const { vertices, colors, textureCoordinates, cameraIndex } = attributes
    const vertexShaderSource = `#version 300 es
  uniform mat3 u_projection;
  uniform mat3 u_cameras[8];

  layout(location = ${vertices.location}) in vec2 a_vertex;
  layout(location = ${colors.location}) in vec4 a_color;
  layout(location = ${textureCoordinates.location}) in vec2 a_textureCoordinates;
  layout(location = ${cameraIndex.location}) in uint a_cameraIndex;

  out vec4 v_color;
  out vec2 v_textureCoordinates;

  void main() {
    mat3 camera = u_cameras[a_cameraIndex];
    mat3 transform = u_projection * inverse(camera);
    gl_Position = vec4((transform * vec3(a_vertex, 1)).xy, 0, 1);
    v_color = a_color / 255.0;
    v_textureCoordinates = a_textureCoordinates;
  }
  `
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)
    return vertexShader
}

const createFragmentShader = (gl: WebGL2Context): Shader => {
    const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_texture;

  in vec4 v_color;
  in vec2 v_textureCoordinates;

  out vec4 fragColor;
  
  void main() {
    fragColor = texture(u_texture, v_textureCoordinates) * v_color;
  }
  `
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)
    return fragmentShader
}

const bindVertices = (gl: WebGL2Context, program: Program, { location, buffer }: Attribute) => {
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

const bindColors = (gl: WebGL2Context, program: Program, { location, buffer }: Attribute) => {
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

const bindTextureCoordinates = (gl: WebGL2Context, program: Program, { location, buffer }: Attribute) => {
    gl.bindAttribLocation(program, location, 'a_textureCoordinates')
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

const bindCameraIndex = (gl: WebGL2Context, program: Program, { location, buffer }: Attribute) => {
    gl.bindAttribLocation(program, location, 'a_cameraIndex')
    gl.enableVertexAttribArray(location)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribIPointer(
        location,
        /*size*/1,
        /*type*/gl.UNSIGNED_BYTE,
        /*stride*/0,
        /*offset*/0
    )
}

const createProgram = (gl: WebGL2Context): ProgramData => {
    const attributes: Attributes = {
        vertices: {
            location: 0,
            buffer: gl.createBuffer()!
        },
        colors: {
            location: 1,
            buffer: gl.createBuffer()!
        },
        textureCoordinates: {
            location: 2,
            buffer: gl.createBuffer()!
        },
        cameraIndex: {
            location: 3,
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
    bindTextureCoordinates(gl, program, attributes.textureCoordinates)
    bindCameraIndex(gl, program, attributes.cameraIndex)
    const uniforms: Uniforms = {
        projection: gl.getUniformLocation(program, 'u_projection')!,
        texture: gl.getUniformLocation(program, 'u_texture')!,
        cameras: gl.getUniformLocation(program, 'u_cameras')!
    }
    return {
        vertexShader,
        fragmentShader,
        program,
        attributes,
        uniforms
    }
}

interface Parameters {
    width: number
    height: number
    document: Document
    window: Window
}

export const webGL2Renderer = ({ width, height, document, window }: Parameters) => {
    const canvas = document.createElement('canvas')
    canvas.style.touchAction = 'none'
    const gl = canvas.getContext('webgl2')!
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.depthMask(false)
    gl.activeTexture(gl.TEXTURE0)
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
    const renderer = new WebGL2Renderer(window, document, canvas, gl, program, [texture], new Map(), [])
    renderer.size = { width, height }
    return renderer
}