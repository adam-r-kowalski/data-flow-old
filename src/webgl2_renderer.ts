import { Scene } from './scene'

interface Renderer {
  gl: WebGL2RenderingContext
  ctx: CanvasRenderingContext2D
  position: { buffer: WebGLBuffer, location: number }
  color: { buffer: WebGLBuffer, location: number }
}

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

export const initRenderer = (): Renderer => {
  const gl_canvas: HTMLCanvasElement = document.createElement('canvas')
  gl_canvas.style.width = '100%'
  gl_canvas.style.height = '100%'
  gl_canvas.style.position = 'absolute'
  document.body.appendChild(gl_canvas)

  const text_canvas: HTMLCanvasElement = document.createElement('canvas')
  text_canvas.style.width = '100%'
  text_canvas.style.height = '100%'
  text_canvas.style.position = 'absolute'

  const dpr = window.devicePixelRatio;
  const gl = gl_canvas.getContext('webgl2')
  gl.canvas.width = Math.round(gl.canvas.clientWidth * dpr)
  gl.canvas.height = Math.round(gl.canvas.clientHeight * dpr)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(33 / 255, 33 / 255, 33 / 255, 1.0)

  const ctx = text_canvas.getContext('2d')
  ctx.canvas.width = gl.canvas.width
  ctx.canvas.height = gl.canvas.height
  document.body.appendChild(text_canvas)

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

  gl.useProgram(program)

  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aColor = gl.getAttribLocation(program, 'aColor')

  gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height)
  gl.enableVertexAttribArray(aPosition)
  gl.enableVertexAttribArray(aColor)

  return {
    gl,
    ctx,
    position: {
      location: aPosition,
      buffer: gl.createBuffer(),
    },
    color: {
      location: aColor,
      buffer: gl.createBuffer(),
    }
  }
}

export const render = (renderer: Renderer, scene: Scene): void => {
  const { gl, ctx, position, color } = renderer
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindBuffer(gl.ARRAY_BUFFER, position.buffer)
  {
    const data = new Float32Array(scene.triangles * 2)
    let i = 0
    for (const vertices of scene.positions) {
      for (const vertex of vertices) {
        data[i++] = vertex
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }
  gl.vertexAttribPointer(position.location, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)

  gl.bindBuffer(gl.ARRAY_BUFFER, color.buffer)
  {
    const data = new Uint8Array(scene.triangles * 3)
    let i = 0
    for (const colors of scene.colors) {
      for (const color of colors) {
        data[i++] = color
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }
  gl.vertexAttribPointer(color.location, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)

  gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/scene.triangles)

  ctx.font = `24px sans-serif`
  ctx.fillStyle = 'white'
  ctx.fillText('foo', 55, 100 + 24 - 5)
}
