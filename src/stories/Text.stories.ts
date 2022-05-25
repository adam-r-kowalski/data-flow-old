export default {
  title: "Text",
}

const nearestPowerOfTwo = (x: number): number => {
  let current = 1
  while (current < x) {
    current <<= 1
  }
  return current
}

export const Empty = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const totalCells = 256
  const rows = Math.sqrt(totalCells)
  const fontSize = 72
  const size = nearestPowerOfTwo(fontSize * rows)
  const cellSize = size / rows
  canvas.width = size
  canvas.height = size
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `${fontSize}px monospace`
  ctx.fillStyle = 'white'
  const ascii = Array.from({ length: totalCells }, (v, i) => i)
  const chars = ascii.map(c => String.fromCharCode(c))
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  const metrics = chars.map((c, i) => {
    const metric = ctx.measureText(c)
    const width = Math.abs(metric.actualBoundingBoxLeft) + Math.abs(metric.actualBoundingBoxRight)
    const height = Math.abs(metric.actualBoundingBoxAscent) + Math.abs(metric.actualBoundingBoxDescent)
    const x = i % rows * cellSize
    const y = Math.floor(i / rows) * cellSize
    ctx.fillText(c, x, y)
    return { x, y, width, height }
  })

  const webglSize = 500
  const webgl_canvas = document.createElement('canvas')
  webgl_canvas.width = webglSize
  webgl_canvas.height = webglSize
  const gl = webgl_canvas.getContext('webgl2')!

  // for drawing text
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.depthMask(false)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

  const vertexShaderSource = `#version 300 es
  uniform vec2 u_resolution;

  in vec2 a_position;
  in vec2 a_texCoord;

  out vec2 v_texCoord;

  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }
  `

  const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_image;

  in vec2 v_texCoord;

  out vec4 fragColor;

  void main() {
    ivec2 size = textureSize(u_image, 0);
    fragColor = texture(u_image, v_texCoord / vec2(float(size.x), float(size.y)));
  }
  `

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.compileShader(vertexShader)

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)

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

  const positionBuffer = gl.createBuffer()!
  const aPositionLocation = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(aPositionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(
    aPositionLocation,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
  )

  const texCoordBuffer = gl.createBuffer()!
  const aTexCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
  gl.enableVertexAttribArray(aTexCoordLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.vertexAttribPointer(
    aTexCoordLocation,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
  )

  const indexBuffer = gl.createBuffer()!

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')!

  const imageLocation = gl.getUniformLocation(program, 'u_image')!

  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texImage2D(
    gl.TEXTURE_2D,
      /*mipLevel*/0,
      /*internalformat*/gl.RGBA,
      /*srcFormat*/gl.RGBA,
      /*srcType*/gl.UNSIGNED_BYTE,
      /*source*/canvas)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.uniform1i(imageLocation, 0)
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const positions: number[] = []
  const texCoords: number[] = []
  const indices: number[] = []
  let x = 0
  let offset = 0
  Array.from("Hello World!").forEach(c => {
    const metric = metrics[c.charCodeAt(0)]
    positions.push(
      x, 0,
      x, metric.height,
      x + metric.width, 0,
      x + metric.width, metric.height,
    )
    texCoords.push(
      metric.x, metric.y,
      metric.x, metric.y + metric.height,
      metric.x + metric.width, metric.y,
      metric.x + metric.width, metric.y + metric.height,
    )
    indices.push(
      offset, offset + 1, offset + 2,
      offset + 1, offset + 2, offset + 3,
    )
    x += metric.width
    offset += 4
  })

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  gl.drawElements(gl.TRIANGLES, /*count*/indices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)

  return webgl_canvas
}
