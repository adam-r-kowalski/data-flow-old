const canvas: HTMLCanvasElement = document.querySelector('#webgl_canvas')
const gl = canvas.getContext('webgl2')

const canvasToDisplaySizeMap = new Map([[canvas, [canvas.clientWidth, canvas.clientHeight]]])

const onResize = (entries: ResizeObserverEntry[]): void => {
  entries.map(entry => {
    if (entry.devicePixelContentBoxSize) {
      const size = entry.devicePixelContentBoxSize[0]
      return {
        entry,
        width: size.inlineSize,
        height: size.blockSize,
        dpr: 1
      }
    }
    if (entry.contentBoxSize[0]) {
      const size = entry.contentBoxSize[0]
      return {
        entry,
        width: size.inlineSize,
        height: size.blockSize,
        dpr: window.devicePixelRatio
      }
    }
    return {
      entry,
      width: entry.contentRect.width,
      height: entry.contentRect.height,
      dpr: window.devicePixelRatio
    }
  }).forEach(({ entry, width, height, dpr }) => {
    canvasToDisplaySizeMap.set(entry.target as HTMLCanvasElement, [
      Math.round(width * dpr),
      Math.round(height * dpr)
    ])
  })
  requestAnimationFrame(render)
}

const resizeObserver = new ResizeObserver(onResize)
try {
  resizeObserver.observe(canvas, { box: 'device-pixel-content-box' })
} catch (ex) {
  resizeObserver.observe(canvas, { box: 'content-box' })
}

const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement): void => {
  const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas)
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    canvas.width = displayWidth
    canvas.height = displayHeight
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }
}

resizeCanvasToDisplaySize(canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

const program = gl.createProgram()

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const vertexShaderSource = `#version 300 es

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 150.0;
}
`
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)
gl.attachShader(program, vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
gl.shaderSource(fragmentShader, fragmentShaderSource)
gl.compileShader(fragmentShader)
gl.attachShader(program, fragmentShader)

gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShader))
  console.log(gl.getShaderInfoLog(fragmentShader))
}

gl.useProgram(program)

const render = () => {
  resizeCanvasToDisplaySize(canvas)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, /*first*/ 0, /*count*/ 1)
}

requestAnimationFrame(render)
