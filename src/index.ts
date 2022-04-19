import { material } from './color'

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
const ctx = text_canvas.getContext('2d')

gl.canvas.width = gl.canvas.clientWidth
gl.canvas.height = gl.canvas.clientHeight
ctx.canvas.width = gl.canvas.width
ctx.canvas.height = gl.canvas.height
gl.clearColor(33 / 255, 33 / 255, 33 / 255, 1.0)


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
gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

const uDevicePixelRatio = gl.getUniformLocation(program, 'uDevicePixelRatio')
gl.uniform1f(uDevicePixelRatio, window.devicePixelRatio)

const positionBuffer = gl.createBuffer()
const aPosition = gl.getAttribLocation(program, 'aPosition')
gl.enableVertexAttribArray(aPosition)

const colorBuffer = gl.createBuffer()
const aColor = gl.getAttribLocation(program, 'aColor')
gl.enableVertexAttribArray(aColor)


interface Vertices {
  positions: number[]
  colors: number[]
}

interface Rectangle {
  translation: number[]
  scale: number[]
  color: number[]
}

const pushRectangle = (vertices: Vertices, rectangle: Rectangle): void => {
  const [x1, y1] = rectangle.translation
  const [w, h] = rectangle.scale
  const [r, g, b] = rectangle.color
  const [x2, y2] = [x1 + w, y1 + h]
  vertices.positions.push(
    x1, y1,
    x1, y2,
    x2, y1,
    x1, y2,
    x2, y1,
    x2, y2,
  )
  vertices.colors.push(
    r, g, b,
    r, g, b,
    r, g, b,
    r, g, b,
    r, g, b,
    r, g, b,
  )
}

const drawVertices = (vertices: Vertices) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.positions), gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(vertices.colors), gl.STATIC_DRAW)
  gl.vertexAttribPointer(aColor, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)
  gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/vertices.positions.length / 2)
}

interface Text {
  fontSize: number
  fontFamily: string
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  color: number[]
  translation: number[]
  text: string
}

const drawText = (text: Text): void => {
  const dpr = window.devicePixelRatio
  const [x, y] = text.translation
  const [r, g, b] = text.color
  ctx.font = `${text.fontSize * dpr}px ${text.fontFamily}`
  ctx.textAlign = text.textAlign
  ctx.textBaseline = text.textBaseline
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
  ctx.fillText(text.text, x * dpr, y * dpr)
}

const clear = (): void => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  ctx.clearRect(0, 0, gl.canvas.width, gl.canvas.height)
}

const center = (rectangle: Rectangle): number[] => {
  const [x, y] = rectangle.translation
  const [w, h] = rectangle.scale
  return [x + w / 2, y + h / 2]
}

const vertices: Vertices = {
  positions: [],
  colors: []
}

const rectangle: Rectangle = {
  translation: [100, 200],
  scale: [800, 400],
  color: material.blue
}

pushRectangle(vertices, rectangle)

const text: Text = {
  fontSize: 48,
  fontFamily: 'sans-serif',
  textAlign: 'center',
  textBaseline: 'middle',
  color: material.white,
  translation: center(rectangle),
  text: 'Foo Bar'
}

const render = () => {
  clear()
  drawVertices(vertices)
  drawText(text)
}

const onResize = (entries: ResizeObserverEntry[]): void => {
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
  gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height)
  gl.uniform1f(uDevicePixelRatio, window.devicePixelRatio)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  ctx.canvas.width = gl.canvas.width
  ctx.canvas.height = gl.canvas.height
  render()
}

const resizeObserver = new ResizeObserver(onResize)
try {
  resizeObserver.observe(gl_canvas, { box: 'device-pixel-content-box' })
} catch (ex) {
  resizeObserver.observe(gl_canvas, { box: 'content-box' })
}

