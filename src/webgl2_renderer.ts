import Scene from './scene'

const vertexShaderSource = `#version 300 es
uniform vec2 uResolution;
in vec2 aPosition;
in vec3 aColor;
out vec3 vColor;

void main() {
  vColor = aColor;
  vec2 clipSpace = aPosition / uResolution * 2.0 - 1.0;
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

export default class Renderer {
  gl: WebGL2RenderingContext
  ctx: CanvasRenderingContext2D
  position: { buffer: WebGLBuffer, location: number }
  color: { buffer: WebGLBuffer, location: number }
  uResolution: WebGLUniformLocation

  constructor(public scene: Scene) {
    const gl_canvas: HTMLCanvasElement = document.createElement('canvas')
    gl_canvas.style.width = '100%'
    gl_canvas.style.height = '100%'
    gl_canvas.style.position = 'absolute'
    document.body.appendChild(gl_canvas)

    const text_canvas: HTMLCanvasElement = document.createElement('canvas')
    text_canvas.style.width = '100%'
    text_canvas.style.height = '100%'
    text_canvas.style.position = 'absolute'
    document.body.appendChild(text_canvas)

    const gl = gl_canvas.getContext('webgl2')
    this.gl = gl
    gl.clearColor(33 / 255, 33 / 255, 33 / 255, 1.0)

    this.ctx = text_canvas.getContext('2d')

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getShaderInfoLog(vertexShader))
      console.log(gl.getShaderInfoLog(fragmentShader))
    }

    this.uResolution = gl.getUniformLocation(program, 'uResolution')

    this.position = {
      location: gl.getAttribLocation(program, 'aPosition'),
      buffer: gl.createBuffer()
    }
    gl.enableVertexAttribArray(this.position.location)

    this.color = {
      location: gl.getAttribLocation(program, 'aColor'),
      buffer: gl.createBuffer(),
    }
    gl.enableVertexAttribArray(this.color.location)

    gl.useProgram(program)

    const resizeObserver = new ResizeObserver(this.onResize)
    try {
      resizeObserver.observe(gl_canvas, { box: 'device-pixel-content-box' })
    } catch (ex) {
      resizeObserver.observe(gl_canvas, { box: 'content-box' })
    }
  }

  onResize = (entries: ResizeObserverEntry[]): void => {
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
    const gl = this.gl
    gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    this.ctx.canvas.width = gl.canvas.width
    this.ctx.canvas.height = gl.canvas.height
    this.render()
  }

  render = (): void => {
    const gl = this.gl
    const ctx = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.position.buffer)
    {
      const data = new Float32Array(this.scene.triangles * 2)
      let i = 0
      for (const vertices of this.scene.positions) {
        for (const vertex of vertices) {
          data[i++] = vertex
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
    gl.vertexAttribPointer(this.position.location, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.color.buffer)
    {
      const data = new Uint8Array(this.scene.triangles * 3)
      let i = 0
      for (const colors of this.scene.colors) {
        for (const color of colors) {
          data[i++] = color
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
    gl.vertexAttribPointer(this.color.location, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)

    gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/this.scene.triangles)

    ctx.clearRect(0, 0, gl.canvas.width, gl.canvas.height)
    ctx.font = `24px sans-serif`
    ctx.fillStyle = 'white'
    ctx.fillText('foo', 55, 100 + 24 - 3)
  }
}
