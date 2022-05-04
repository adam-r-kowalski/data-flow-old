import { Mat4x4 } from './linear_algebra'
import { ECS, Entity } from './ecs'
import { Geometry, Translate, Scale, Rotate, Fill, ActiveCamera, Projection } from './components'

interface Attribute {
  buffer: WebGLBuffer
  location: number
}

interface Viewport {
  x: number
  y: number
  width: number
  height: number
}

type OnResize = (viewport: Viewport) => void

export class Renderer {
  element: HTMLCanvasElement
  gl: WebGL2RenderingContext
  uMatrix: WebGLUniformLocation
  uColor: WebGLUniformLocation
  aPosition: Attribute
  aIndex: Attribute
  vertexIndexBuffer: WebGLBuffer
  maxBatchSize: number
  onResize: OnResize | null

  constructor(viewport: Viewport) {
    const canvas = document.createElement('canvas')
    canvas.style.width = viewport.width.toString()
    canvas.style.height = viewport.height.toString()
    canvas.style.display = 'block'
    const gl = canvas.getContext('webgl2')!
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    this.element = canvas
    this.gl = gl

    this.maxBatchSize = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 5)

    const vertexShaderSource = `#version 300 es
uniform mat4[${this.maxBatchSize}] u_matrix;
uniform vec4[${this.maxBatchSize}] u_color;

in vec4 a_position;
in uint a_index;

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

    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)

    this.aPosition = {
      buffer: gl.createBuffer()!,
      location: gl.getAttribLocation(program, 'a_position')
    }
    gl.enableVertexAttribArray(this.aPosition.location)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aPosition.buffer)
    gl.vertexAttribPointer(this.aPosition.location, /*size*/3, /*type*/gl.FLOAT, /*normalize*/false, /*stride*/0, /*offset*/0)

    this.vertexIndexBuffer = gl.createBuffer()!

    this.aIndex = {
      buffer: gl.createBuffer()!,
      location: gl.getAttribLocation(program, 'a_index')
    }
    gl.enableVertexAttribArray(this.aIndex.location)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.aIndex.buffer)
    gl.vertexAttribIPointer(this.aIndex.location, /*size*/1, /*type*/gl.UNSIGNED_SHORT, /*stride*/0, /*offset*/0)

    this.uMatrix = gl.getUniformLocation(program, 'u_matrix')!
    this.uColor = gl.getUniformLocation(program, 'u_color')!

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
      const entry = entries[0]
      this.onResize && this.onResize((() => {
        if (entry.devicePixelContentBoxSize) return {
          x: 0,
          y: 0,
          width: entry.devicePixelContentBoxSize[0].inlineSize,
          height: entry.devicePixelContentBoxSize[0].blockSize,
        }
        const dpr = window.devicePixelRatio
        if (entry.contentBoxSize) return {
          x: 0,
          y: 0,
          width: entry.contentBoxSize[0].inlineSize * dpr,
          height: entry.contentBoxSize[0].blockSize * dpr,
        }
        return {
          x: 0,
          y: 0,
          width: entry.contentRect.width * dpr,
          height: entry.contentRect.height * dpr,
        }
      })())
    })
    try {
      resizeObserver.observe(canvas, { box: 'device-pixel-content-box' })
    } catch (ex) {
      resizeObserver.observe(canvas, { box: 'content-box' })
    }

    this.viewport(viewport)
  }

  viewport = ({ x, y, width, height }: Viewport): void => {
    this.element.width = width
    this.element.height = height
    this.gl.viewport(x, y, width, height)
  }

  render = (ecs: ECS): void => {
    const start = performance.now()
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const dpr = window.devicePixelRatio
    const camera = ecs.get(ActiveCamera)!.entity
    const view = camera.get(Projection)!.matrix.mul(
      new Mat4x4([
        dpr, 0, 0, 0,
        0, dpr, 0, 0,
        0, 0, dpr, 0,
        0, 0, 0, 1
      ])
    )
    let entities = ecs.query(Geometry)
    while (entities.length) {
      const positions: number[] = []
      const vertexIndices: number[] = []
      const indices: number[] = []
      const matrices: number[] = []
      const fills: number[] = []
      let index = 0
      let offset = 0
      for (const entity of entities.slice(0, this.maxBatchSize)) {
        const geometry = entity.get(Geometry)!
        positions.push(...geometry.vertices)
        for (const i of geometry.indices) {
          vertexIndices.push(i + offset)
        }
        const vertexCount = geometry.vertices.length / 3
        offset += vertexCount
        const matrix = view
          .mul(entity.get(Translate)!.matrix())
          .mul(entity.get(Rotate)!.matrix())
          .mul(entity.get(Scale)!.matrix())
        matrices.push(...matrix.data)
        const fill = entity.get(Fill)!
        fills.push(fill.h, fill.s, fill.l, fill.a)
        for (let i = 0; i < vertexCount; ++i) {
          indices.push(index)
        }
        ++index;
      }
      gl.uniformMatrix4fv(this.uMatrix, /*transpose*/false, matrices)
      gl.uniform4fv(this.uColor, fills)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.aPosition.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.aIndex.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
      gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*index type*/gl.UNSIGNED_SHORT, /*offset*/0)
      entities = entities.slice(this.maxBatchSize)
    }
    const stop = performance.now()
    //console.log(stop - start)
  }
}
