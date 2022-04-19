import { Vertices, Text } from './geometry'

const vertexShaderSource = `#version 300 es
uniform float uDevicePixelRatio;
uniform vec2 uResolution;
in vec2 aPosition;
in vec3 aColor;
out vec3 vColor;

void main() {
  vColor = aColor;
  vec2 clipSpace = aPosition * uDevicePixelRatio / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
}
`

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
  fragColor = vec4(vColor, 1.0);
}
`

interface Shaders {
  vertex: string
  fragment: string
}

interface Config {
  element: HTMLElement
  clearColor: number[]
}

interface Attribute {
  buffer: WebGLBuffer
  location: number
}

export class Renderer {
  gl: WebGL2RenderingContext
  ctx: CanvasRenderingContext2D
  position: Attribute
  color: Attribute
  uResolution: WebGLUniformLocation
  uDevicePixelRatio: WebGLUniformLocation
  onResizeCallbacks: (() => void)[]

  constructor({ element, clearColor }: Config) {
    this.onResizeCallbacks = []
    const gl_canvas: HTMLCanvasElement = document.createElement('canvas')
    gl_canvas.style.width = '100%'
    gl_canvas.style.height = '100%'
    gl_canvas.style.position = 'absolute'
    element.appendChild(gl_canvas)
    const text_canvas: HTMLCanvasElement = document.createElement('canvas')
    text_canvas.style.width = '100%'
    text_canvas.style.height = '100%'
    text_canvas.style.position = 'absolute'
    element.appendChild(text_canvas)
    const gl = gl_canvas.getContext('webgl2')
    this.gl = gl
    const ctx = text_canvas.getContext('2d')
    this.ctx = ctx
    const [r, g, b] = clearColor
    gl.clearColor(r / 255, g / 255, b / 255, 1.0)
    const program = this.createProgram({
      vertex: vertexShaderSource,
      fragment: fragmentShaderSource
    })
    this.uResolution = gl.getUniformLocation(program, 'uResolution')
    this.uDevicePixelRatio = gl.getUniformLocation(program, 'uDevicePixelRatio')
    this.position = {
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(program, 'aPosition')
    }
    gl.enableVertexAttribArray(this.position.location)
    this.color = {
      buffer: gl.createBuffer(),
      location: gl.getAttribLocation(program, 'aColor')
    }
    gl.enableVertexAttribArray(this.color.location)
    const resizeObserver = new ResizeObserver(this.resizeObserverCallback)
    try {
      resizeObserver.observe(gl_canvas, { box: 'device-pixel-content-box' })
    } catch (ex) {
      resizeObserver.observe(gl_canvas, { box: 'content-box' })
    }
  }

  createProgram = (shaders: Shaders): WebGLProgram => {
    const gl = this.gl
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, shaders.vertex)
    gl.compileShader(vertexShader)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, shaders.fragment)
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
    return program
  }

  drawVertices = (vertices: Vertices) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.position.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(this.position.location, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(vertices.colors), gl.STATIC_DRAW)
    gl.vertexAttribPointer(this.color.location, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)
    gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/vertices.positions.length / 2)
  }

  drawText = (text: Text): void => {
    const ctx = this.ctx
    const dpr = window.devicePixelRatio
    const [x, y] = text.translation
    const [r, g, b] = text.color
    ctx.font = `${text.fontSize * dpr}px ${text.fontFamily}`
    ctx.textAlign = text.textAlign
    ctx.textBaseline = text.textBaseline
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillText(text.text, x * dpr, y * dpr)
  }

  clear = (): void => {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.ctx.clearRect(0, 0, gl.canvas.width, gl.canvas.height)
  }

  resizeObserverCallback = (entries: ResizeObserverEntry[]): void => {
    const gl = this.gl
    const ctx = this.ctx
    entries.map(entry => {
      if (entry.devicePixelContentBoxSize) return {
        entry: entry,
        width: entry.devicePixelContentBoxSize[0].inlineSize,
        height: entry.devicePixelContentBoxSize[0].blockSize,
        dpr: 1,
      }
      if (entry.contentBoxSize) return {
        entry: entry,
        width: entry.contentBoxSize[0].inlineSize,
        height: entry.contentBoxSize[0].blockSize,
        dpr: window.devicePixelRatio,
      }
      return {
        entry: entry,
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        dpr: window.devicePixelRatio,
      }
    }).forEach(({ entry, width, height, dpr }) => {
      const canvas = entry.target as HTMLCanvasElement
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    })
    gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height)
    gl.uniform1f(this.uDevicePixelRatio, window.devicePixelRatio)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    ctx.canvas.width = gl.canvas.width
    ctx.canvas.height = gl.canvas.height
    for (const onResize of this.onResizeCallbacks) {
      onResize()
    }
  }

  onResize = (callback: () => void): void => {
    this.onResizeCallbacks.push(callback)
  }
}
