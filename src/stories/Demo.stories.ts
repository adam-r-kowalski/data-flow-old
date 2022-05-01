export default {
  title: "Demo",
}

export const Primary = () => {
  const canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  const gl = canvas.getContext('webgl2')
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  const max_batch_size = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 5)

  const vertexShaderSource = `#version 300 es
uniform mat4[${max_batch_size}] u_matrix;
uniform vec4[${max_batch_size}] u_color;

in vec4 a_position;
in int a_index;

out vec4 v_color;

void main() {
  gl_Position = u_matrix[a_index] * a_position;
  v_color = u_color[a_index];
}
`

  const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 fragColor;

vec4 hslToRgb(in vec4 hsl) {
 float h = hsl.x / 360.0;
 vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
 return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w);
}

void main() {
  fragColor = hslToRgb(v_color);
}
`

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

  const aPosition = {
    buffer: gl.createBuffer(),
    location: gl.getAttribLocation(program, 'a_position')
  }
  gl.enableVertexAttribArray(aPosition.location)

  const vertexIndexBuffer = gl.createBuffer()

  const aIndex = {
    buffer: gl.createBuffer(),
    location: gl.getAttribLocation(program, 'a_index')
  }
  gl.enableVertexAttribArray(aIndex.location)


  const uMatrix = gl.getUniformLocation(program, 'u_matrix')
  const uColor = gl.getUniformLocation(program, 'u_color')

  const render = (): void => {
    const start = performance.now()

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.uniformMatrix4fv(uMatrix, /*transpose*/false, [
      0.25, 0, 0, 0,
      0, 0.25, 0, 0,
      0, 0, 1, 0,
      -0.5, -0.5, 0, 1,

      0.25, 0, 0, 0,
      0, 0.25, 0, 0,
      0, 0, 1, 0,
      0.5, 0.5, 0, 1,
    ])

    gl.uniform4fv(uColor, [
      270, 1, 0.5, 1,

      130, 1, 0.5, 1,
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, aPosition.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,

      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
    ]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(aPosition.location, /*size*/3, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer)
    const vertexIndices = [
      0, 1, 2,
      3, 0, 2,

      4, 5, 6,
      7, 4, 6,
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, aIndex.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Int16Array([
      0, 0, 0, 0,

      1, 1, 1, 1,
    ]), gl.STATIC_DRAW)
    gl.vertexAttribIPointer(aIndex.location, /*size*/1, /*type*/gl.SHORT, /*stride*/0, /*offset*/0)

    gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*index type*/gl.UNSIGNED_SHORT, /*offset*/0)

    const stop = performance.now()
    console.log(`frame took ${stop - start} ms`)
  }

  const onResize = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0]
    const { width, height, dpr } = (() => {
      if (entry.devicePixelContentBoxSize) return {
        width: entry.devicePixelContentBoxSize[0].inlineSize,
        height: entry.devicePixelContentBoxSize[0].blockSize,
        dpr: 1
      }
      if (entry.contentBoxSize) return {
        width: entry.contentBoxSize[0].inlineSize,
        height: entry.contentBoxSize[0].blockSize,
        dpr: window.devicePixelRatio
      }
      return {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        dpr: window.devicePixelRatio
      }
    })()
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    render()
  }

  const resizeObserver = new ResizeObserver(onResize)
  try {
    resizeObserver.observe(canvas, { box: 'device-pixel-content-box' })
  } catch (ex) {
    resizeObserver.observe(canvas, { box: 'content-box' })
  }


  return canvas
}
