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

interface Cursor {
  x: number,
  y: number,
}

enum Kind {
  NUMBER,
}

interface Entity {
  kind: Kind,
  index: number,
}

interface State {
  numbers: Numbers,
  calls: Calls
  cursor: Cursor,
  grid: number,
  repeat: string,
  editing?: Entity,
}

const grid = 50

const state: State = {
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
  },
  cursor: {
    x: Math.round((window.innerWidth / 2) / grid) * grid,
    y: Math.round((window.innerHeight / 2) / grid) * grid
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


const renderNumbers = (state: State) => {
  state.numbers.xs.map((x, i) => {
    const y = state.numbers.ys[i]

    // function name

    setRectangle(gl, x, y, 200, 40)
    gl.uniform4f(colorLocation, .10, .46, .82, 1)
    gl.drawArrays(primitiveType, offset, count)

    ctx.font = '22px sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText('Number', x + 5, y + 28)

    // function body

    setRectangle(gl, x, y + 40, 200, 60)
    gl.uniform4f(colorLocation, .11, .19, .23, 1)
    gl.drawArrays(primitiveType, offset, count)

    // editing
    if (state.editing && state.editing.index == i) {
      setRectangle(gl, x + 10, y + 50, 150, 40)
      gl.uniform4f(colorLocation, 1, 1, 1, 1)
      gl.drawArrays(primitiveType, offset, count)

      const literal = state.numbers.literals[i]
      if (literal.length > 0) {
        ctx.font = '20px sans-serif'
        ctx.fillStyle = 'black'
        ctx.fillText(parseInt(literal).toLocaleString(), x + 15, y + 75)
      }
    } else {
      const literal = state.numbers.literals[i]
      if (literal.length > 0) {
        ctx.font = '20px sans-serif'
        ctx.fillStyle = 'white'
        ctx.fillText(parseInt(literal).toLocaleString(), x + 15, y + 75)
      }
    }


    // result
    setRectangle(gl, x + 175, y + 65, 15, 15)
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


  for (let x = state.grid; x < textCanvas.width; x += state.grid) {
    setRectangle(gl, x, 0, 1, textCanvas.height)
    gl.uniform4f(colorLocation, 1, 1, 1, 0.1)
    gl.drawArrays(primitiveType, offset, count)
  }

  for (let y = state.grid; y < textCanvas.height; y += state.grid) {
    setRectangle(gl, 0, y, textCanvas.width, 1)
    gl.uniform4f(colorLocation, 1, 1, 1, 0.1)
    gl.drawArrays(primitiveType, offset, count)
  }

  renderNumbers(state)
  renderCalls(state.calls)


  // cursor
  const x = state.cursor.x - width / 2
  const y = state.cursor.y - height / 2

  setRectangle(gl, x + width / 2 - 15, y + height / 2 - 1, 30, 2)
  gl.uniform4f(colorLocation, 1, 1, 1, 1)
  gl.drawArrays(primitiveType, offset, count)

  setRectangle(gl, x + width / 2 - 1, y + height / 2 - 15, 2, 30)
  gl.uniform4f(colorLocation, 1, 1, 1, 1)
  gl.drawArrays(primitiveType, offset, count)

}

requestAnimationFrame(mainLoop)

document.addEventListener('mousemove', event => {
  state.cursor.x = Math.round(event.clientX / state.grid) * state.grid
  state.cursor.y = Math.round(event.clientY / state.grid) * state.grid
  requestAnimationFrame(mainLoop)
})

const addNumber = (state: State) => {
  state.editing = {
    kind: Kind.NUMBER,
    index: state.numbers.xs.length
  }
  state.numbers.xs.push(state.cursor.x)
  state.numbers.ys.push(state.cursor.y)
  state.numbers.literals.push('')
}

const addCall = (state: State) => {
  state.calls.xs.push(state.cursor.x)
  state.calls.ys.push(state.cursor.y)
  state.calls.names.push('Add')
  state.calls.arguments.push(['x', 'y'])
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
    case 'n':
      addNumber(state);
      requestAnimationFrame(mainLoop)
      break
    case 'c':
      addCall(state);
      requestAnimationFrame(mainLoop)
      break
    case 'h':
      state.cursor.x -= state.grid * repeat(state);
      state.editing = null
      requestAnimationFrame(mainLoop)
      break
    case 'j':
      state.cursor.y += state.grid * repeat(state);
      state.editing = null
      requestAnimationFrame(mainLoop)
      break
    case 'k':
      state.cursor.y -= state.grid * repeat(state);
      state.editing = null
      requestAnimationFrame(mainLoop)
      break
    case 'l':
      state.cursor.x += state.grid * repeat(state);
      state.editing = null
      requestAnimationFrame(mainLoop)
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      if (state.editing) {
        state.numbers.literals[state.editing.index] += event.key
        requestAnimationFrame(mainLoop)
      } else {
        state.repeat += event.key
      }
      break
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


