interface Numbers {
  xs: number[],
  ys: number[],
  literals: string[]
}

interface Calls {
  xs: number[],
  ys: number[],
  names: string[],
  arguments: string[][],
}

interface Graph {
  numbers: Numbers,
  calls: Calls
}

interface Cursor {
  x: number,
  y: number,
}

interface State {
  graph: Graph,
  cursor: Cursor,
  grid: number,
  repeat: string,
}

const grid = 50

const state: State = {
  graph: {
    numbers: {
      xs: [],
      ys: [],
      literals: [],
    },
    calls: {
      xs: [],
      ys: [],
      names: [],
      arguments: [],
    }
  },
  cursor: {
    x: Math.round((window.innerWidth / 2) / grid) * grid - grid / 2,
    y: Math.round((window.innerHeight / 2) / grid) * grid - grid / 2
  },
  grid,
  repeat: ''
}


const glCanvas: HTMLCanvasElement = document.querySelector('#gl')
glCanvas.width = window.innerWidth
glCanvas.height = window.innerHeight
const gl = glCanvas.getContext('webgl2')

gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

const textCanvas: HTMLCanvasElement = document.querySelector('#text')
textCanvas.width = window.innerWidth
textCanvas.height = window.innerHeight
const ctx = textCanvas.getContext('2d')

const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`


const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`


const createShader = (gl: WebGL2RenderingContext, shader_type: number, source: string) => {
  const shader = gl.createShader(shader_type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)


const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

const program = createProgram(gl, vertexShader, fragmentShader)

const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
const positionBuffer = gl.createBuffer()


const vao = gl.createVertexArray()
gl.bindVertexArray(vao)
gl.enableVertexAttribArray(positionAttributeLocation)

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

{
  const size = 2
  const dtype = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.vertexAttribPointer(positionAttributeLocation, size, dtype, normalize, stride, offset)
}





const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
  const dpr = window.devicePixelRatio
  const { width, height } = canvas.getBoundingClientRect()
  const displayWidth = Math.round(width * dpr)
  const displayHeight = Math.round(height * dpr)
  const needResize = canvas.width != displayWidth || canvas.height != displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

const resoltionUniformLocation = gl.getUniformLocation(program, "u_resolution")

resizeCanvasToDisplaySize(gl.canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(.27, .35, .39, 1)


gl.useProgram(program)
gl.uniform2f(resoltionUniformLocation, gl.canvas.width, gl.canvas.height)

gl.bindVertexArray(vao)


const randomInt = (range: number) => Math.floor(Math.random() * range)

const setRectangle = (gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) => {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
}

const colorLocation = gl.getUniformLocation(program, "u_color")


const primitiveType = gl.TRIANGLES
const offset = 0
const count = 6


gl.clear(gl.COLOR_BUFFER_BIT)

const width = 200
const height = 105


const renderNumbers = (numbers: Numbers) => {
  numbers.xs.map((x, i) => {
    const y = numbers.ys[i]

    // function name

    setRectangle(gl, x, y, width, 40)
    gl.uniform4f(colorLocation, .10, .46, .82, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '22px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('Number', x + 5, y + 28)

    // function body

    setRectangle(gl, x, y + 40, 200, height - 40)
    gl.uniform4f(colorLocation, .11, .19, .23, 1)
    gl.drawArrays(primitiveType, offset, count)

    // literal
    setRectangle(gl, x, y + 40, 200, height - 40)
    gl.uniform4f(colorLocation, .11, .19, .23, 1)
    gl.drawArrays(primitiveType, offset, count)

    // result
    setRectangle(gl, x + 180, y + 55, 10, 10)
    gl.uniform4f(colorLocation, .39, .64, 1, 1)
    gl.drawArrays(primitiveType, offset, count)
  })
}

const renderCalls = (calls: Calls) => {
  calls.xs.map((x, i) => {
    const y = calls.ys[i]

    // function name

    setRectangle(gl, x, y, width, 40)
    gl.uniform4f(colorLocation, .10, .46, .82, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '22px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('Add', x + 5, y + 28)

    // function body

    setRectangle(gl, x, y + 40, 200, height - 40)
    gl.uniform4f(colorLocation, .11, .19, .23, 1)
    gl.drawArrays(primitiveType, offset, count)


    // x

    setRectangle(gl, x + 10, y + 55, 10, 10)
    gl.uniform4f(colorLocation, .39, .64, 1, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('x', x + 30, y + 65)


    // y

    setRectangle(gl, x + 10, y + 80, 10, 10)
    gl.uniform4f(colorLocation, .39, .64, 1, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('y', x + 30, y + 90)


    // result

    setRectangle(gl, x + 180, y + 55, 10, 10)
    gl.uniform4f(colorLocation, .39, .64, 1, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('result', x + 125, y + 65)

  })
}

const mainLoop = () => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)


  for (let x = state.grid / 2; x < textCanvas.width; x += state.grid) {
    setRectangle(gl, x, 0, 1, textCanvas.height)
    gl.uniform4f(colorLocation, 1, 1, 1, 0.1)
    gl.drawArrays(primitiveType, offset, count)
  }

  for (let y = state.grid / 2; y < textCanvas.height; y += state.grid) {
    setRectangle(gl, 0, y, textCanvas.width, 1)
    gl.uniform4f(colorLocation, 1, 1, 1, 0.1)
    gl.drawArrays(primitiveType, offset, count)
  }

  renderNumbers(state.graph.numbers)
  renderCalls(state.graph.calls)


  // cursor
  const x = state.cursor.x - width / 2
  const y = state.cursor.y - height / 2

  setRectangle(gl, x + width / 2 - 15, y + height / 2 - 1, 30, 2)
  gl.uniform4f(colorLocation, 1, 1, 1, 1)
  gl.drawArrays(primitiveType, offset, count)

  setRectangle(gl, x + width / 2 - 1, y + height / 2 - 15, 2, 30)
  gl.uniform4f(colorLocation, 1, 1, 1, 1)
  gl.drawArrays(primitiveType, offset, count)

  requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)

document.addEventListener('mousemove', event => {
  state.cursor.x = Math.round(event.clientX / state.grid) * state.grid - state.grid / 2
  state.cursor.y = Math.round(event.clientY / state.grid) * state.grid - state.grid / 2
})

const addNumber = (state: State) => {
  state.graph.numbers.xs.push(state.cursor.x)
  state.graph.numbers.ys.push(state.cursor.y)
  state.graph.numbers.literals.push('')
}

const addCall = (state: State) => {
  state.graph.calls.xs.push(state.cursor.x)
  state.graph.calls.ys.push(state.cursor.y)
  state.graph.calls.names.push('Add')
  state.graph.calls.arguments.push(['x', 'y'])
}

const repeat = (state: State) => {
  if (state.repeat.length > 0) {
    const result = parseInt(state.repeat)
    state.repeat = ''
    return result
  }
  return 1
}

document.addEventListener('keypress', event => {
  switch (event.key) {
    case 'n': addNumber(state); break
    case 'c': addCall(state); break
    case 'h': state.cursor.x -= state.grid * repeat(state); break
    case 'j': state.cursor.y += state.grid * repeat(state); break
    case 'k': state.cursor.y -= state.grid * repeat(state); break
    case 'l': state.cursor.x += state.grid * repeat(state); break
    case '0': state.repeat += '0'; break
    case '1': state.repeat += '1'; break
    case '2': state.repeat += '2'; break
    case '3': state.repeat += '3'; break
    case '4': state.repeat += '4'; break
    case '5': state.repeat += '5'; break
    case '6': state.repeat += '6'; break
    case '7': state.repeat += '7'; break
    case '8': state.repeat += '8'; break
    case '9': state.repeat += '9'; break
    default: console.log(event.key)
  }
})

window.addEventListener('resize', () => {
  gl.canvas.width = window.innerWidth
  gl.canvas.height = window.innerHeight
  resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.uniform2f(resoltionUniformLocation, gl.canvas.width, gl.canvas.height)
  textCanvas.width = window.innerWidth
  textCanvas.height = window.innerHeight
})
