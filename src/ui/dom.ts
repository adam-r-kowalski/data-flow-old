export interface CanvasStyle {
    touchAction: "none"
    width: string
    height: string
    display: "block"
    userSelect: "none"
}

export interface Buffer {}

export interface Program {}

export interface Texture {}

export interface Shader {}

export interface VertexArrayObject {}

export interface UniformLocation {}

export type TexImage2D = {
    (
        target: number,
        level: number,
        internalformat: number,
        width: number,
        height: number,
        border: number,
        format: number,
        type: number,
        pixels: ArrayBufferView | null
    ): void
    (
        target: number,
        level: number,
        internalformat: number,
        format: number,
        type: number,
        source: Canvas
    ): void
}

export interface WebGL2Context {
    readonly BLEND: number
    readonly SRC_ALPHA: number
    readonly ONE_MINUS_SRC_ALPHA: number
    readonly TEXTURE0: number
    readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL: number
    readonly TEXTURE_2D: number
    readonly RGBA: number
    readonly UNSIGNED_BYTE: number
    readonly UNSIGNED_SHORT: number
    readonly FLOAT: number
    readonly LINK_STATUS: number
    readonly VERTEX_SHADER: number
    readonly FRAGMENT_SHADER: number
    readonly TEXTURE_WRAP_S: number
    readonly TEXTURE_WRAP_T: number
    readonly CLAMP_TO_EDGE: number
    readonly COLOR_BUFFER_BIT: number
    readonly ARRAY_BUFFER: number
    readonly ELEMENT_ARRAY_BUFFER: number
    readonly TRIANGLES: number
    readonly LINES: number
    readonly STATIC_DRAW: number
    canvas: Canvas
    enable: (cap: number) => void
    blendFunc: (sfactor: number, dfactor: number) => void
    depthMask: (flag: boolean) => void
    activeTexture: (texture: number) => void
    pixelStorei: (pname: number, param: number | boolean) => void
    clearColor: (
        red: number,
        green: number,
        blue: number,
        alpha: number
    ) => void
    createBuffer: () => Buffer | null
    createProgram: () => Program | null
    createShader: (type: number) => Shader | null
    shaderSource: (shader: Shader, source: string) => void
    compileShader: (shader: Shader) => void
    createTexture: () => Texture | null
    bindTexture: (target: number, texture: Texture | null) => void
    bindBuffer: (target: number, buffer: Buffer | null) => void
    bufferData: (
        target: number,
        srcData: BufferSource | null,
        usage: number
    ) => void
    attachShader: (program: Program, shader: Shader) => void
    linkProgram: (program: Program) => void
    getProgramParameter: (program: Program, pname: number) => any
    getShaderInfoLog: (shader: Shader) => string | null
    useProgram: (program: Program) => void
    createVertexArray: () => VertexArrayObject | null
    bindVertexArray: (array: VertexArrayObject | null) => void
    getUniformLocation: (
        program: Program,
        name: string
    ) => UniformLocation | null
    generateMipmap: (target: number) => void
    texParameteri: (target: number, pname: number, param: number) => void
    clear: (mask: number) => void
    uniformMatrix3fv: (
        location: UniformLocation | null,
        transpose: boolean,
        data: Iterable<number>
    ) => void
    viewport: (x: number, y: number, width: number, height: number) => void
    drawElements: (
        mode: number,
        count: number,
        type: number,
        offset: number
    ) => void
    drawArrays: (mode: number, first: number, count: number) => void
    bindAttribLocation: (program: Program, index: number, name: string) => void
    enableVertexAttribArray: (index: number) => void
    vertexAttribPointer: (
        index: number,
        size: number,
        type: number,
        normalized: boolean,
        stride: number,
        offset: number
    ) => void
    vertexAttribIPointer: (
        index: number,
        size: number,
        type: number,
        stride: number,
        offset: number
    ) => void
    texImage2D: TexImage2D
}

export interface TextMetrics {
    width: number
}

export interface CanvasContext {
    scale: (x: number, y: number) => void
    textAlign: "left"
    textBaseline: "top"
    font: string
    fillStyle: "white"
    canvas: Canvas
    clearRect: (x: number, y: number, w: number, h: number) => void
    measureText: (text: string) => TextMetrics
    fillText: (text: string, x: number, y: number) => void
}

export type GetContext = {
    (contextId: "webgl2"): WebGL2Context | null
    (contextId: "2d"): CanvasContext | null
}

export interface Canvas {
    style: CanvasStyle
    getContext: GetContext
    width: number
    height: number
}

export interface BodyStyle {
    cursor: "auto" | "none"
}

export interface Body {
    appendChild: (canvas: Canvas) => void
    style: BodyStyle
}

export interface PointerDownEvent {
    clientX: number
    clientY: number
    pointerId: number
    detail: number
}

export interface Document {
    createElement: (tagName: "canvas") => Canvas
    addEventListener: (
        event: "pointerdown",
        callback: (p: PointerDownEvent) => void
    ) => void
    body: Body
}

export interface Message<AppEvent> {
    data: AppEvent
}

export type AddEventListener<AppEvent> = {
    (event: "resize", callback: () => void): void
    (event: "message", callback: (message: Message<AppEvent>) => void): void
}

export interface Window<AppEvent> {
    devicePixelRatio: number
    innerWidth: number
    innerHeight: number
    addEventListener: AddEventListener<AppEvent>
    postMessage: (event: AppEvent) => void
}
