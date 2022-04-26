
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
const gl = gl_canvas.getContext('webgl2')

gl.clearColor(0, 0, 0, 1.0)

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

const dpr = window.devicePixelRatio
gl.canvas.width = Math.round(gl.canvas.clientWidth * dpr)
gl.canvas.height = Math.round(gl.canvas.clientHeight * dpr)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

const uResolution = gl.getUniformLocation(program, 'uResolution')
gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height)

const uDevicePixelRatio = gl.getUniformLocation(program, 'uDevicePixelRatio')
gl.uniform1f(uDevicePixelRatio, window.devicePixelRatio)

const positionBuffer = gl.createBuffer()
const aPositionLocation = gl.getAttribLocation(program, 'aPosition')
gl.enableVertexAttribArray(aPositionLocation)

const colorBuffer = gl.createBuffer()
const aColorLocation = gl.getAttribLocation(program, 'aColor')
gl.enableVertexAttribArray(aColorLocation)

gl.clear(gl.COLOR_BUFFER_BIT)

{

  const positions = []
  const colors = []

  const pushRectangle = ({ position, size, color }) => {
    const [x, y] = position
    const [w, h] = size
    const [r, g, b] = color
    const [w2, h2] = [w / 2, h / 2]
    positions.push(
      x - w2, y - h2,
      x - w2, y + h2,
      x + w2, y - h2,

      x - w2, y + h2,
      x + w2, y - h2,
      x + w2, y + h2,
    )
    colors.push(
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
    )
  }

  graph.nodes.positions.forEach((position, i) => {
    pushRectangle({
      position,
      size: [100, 100],
      color: [255, 0, 0]
    })
  })

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPositionLocation, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
  gl.vertexAttribPointer(aColorLocation, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)

  gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/positions.length / 2)

}

document.addEventListener('mousemove', e => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  const p0 = [50, 50]
  const p1 = [100, 50]
  const p2 = [e.clientX - 50, e.clientY]
  const p3 = [e.clientX, e.clientY]

  const linspace = (start, stop, num) => {
    const step = (stop - start) / (num - 1)
    return Array.from({ length: num }, (_, i) => start + step * i)
  }

  {

    const positions = []
    const colors = []

    const pushRectangle = ({ position, size, color }) => {
      const [x, y] = position
      const [w, h] = size
      const [r, g, b] = color
      const [w2, h2] = [w / 2, h / 2]
      positions.push(
        x - w2, y - h2,
        x - w2, y + h2,
        x + w2, y - h2,

        x - w2, y + h2,
        x + w2, y - h2,
        x + w2, y + h2,
      )
      colors.push(
        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,
      )
    }

    pushRectangle({
      position: p0,
      size: [10, 10],
      color: [255, 0, 0]
    })

    pushRectangle({
      position: p1,
      size: [10, 10],
      color: [255, 0, 0]
    })

    pushRectangle({
      position: p2,
      size: [10, 10],
      color: [255, 0, 0]
    })

    pushRectangle({
      position: p3,
      size: [10, 10],
      color: [255, 0, 0]
    })

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(aPositionLocation, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
    gl.vertexAttribPointer(aColorLocation, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)

    gl.drawArrays(gl.TRIANGLES, /*offset*/0, /*count*/positions.length / 2)

  }

  {

    const positions = []
    const colors = []


    const cubic_bezier = linspace(0, 1, 25).forEach(t => {
      const a = 1 - t
      const b = a * a
      const c = b * a

      const x0 = c * p0[0]
      const y0 = c * p0[1]

      const bt3 = 3 * b * t

      const x1 = bt3 * p1[0]
      const y1 = bt3 * p1[1]

      const t2 = t * t
      const at23 = 3 * a * t2
      const x2 = at23 * p2[0]
      const y2 = at23 * p2[1]

      const t3 = t2 * t
      const x3 = t3 * p3[0]
      const y3 = t3 * p3[1]

      positions.push(x0 + x1 + x2 + x3, y0 + y1 + y2 + y3)
      colors.push(0, 255, 0, 0, 255, 0)
    })

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(aPositionLocation, /*size*/2, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW)
    gl.vertexAttribPointer(aColorLocation, /*size*/3, /*type*/gl.UNSIGNED_BYTE, /*normalize*/true, /*stride*/0, /*offset*/0)

    gl.drawArrays(gl.LINE_STRIP, /*offset*/0, /*count*/positions.length / 2)
  }
})

