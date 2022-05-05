import { Mat4x4 } from './linear_algebra'
import { ECS, Entity } from './ecs'
import { Root, Children, Geometry, Translate, Scale, Rotate, Fill, ActiveCamera, Projection } from './components'

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

interface RenderData {
  entity: Entity
  transform: Mat4x4
}

export class Renderer {
  element: HTMLCanvasElement
  gl: WebGL2RenderingContext
  uMatrix: WebGLUniformLocation
  uColor: WebGLUniformLocation
  aPosition: Attribute
  aIndex: Attribute
  vertexIndexBuffer: WebGLBuffer
  maxBatchSize: number

  constructor(viewport: Viewport) {
    const canvas = document.createElement('canvas')
    canvas.style.width = viewport.width.toString()
    canvas.style.height = viewport.height.toString()
    canvas.style.display = 'block'
    const gl = canvas.getContext('webgl2')!
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
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
    this.viewport(viewport)
  }

  viewport = ({ x, y, width, height }: Viewport): void => {
    this.element.width = width
    this.element.height = height
    this.gl.viewport(x, y, width, height)
  }

  renderEntities = function*(ecs: ECS): Generator<RenderData> {
    const renderChildren = function*(renderData: RenderData): Generator<RenderData> {
      const children = renderData.entity.get(Children)
      if (children) for (const child of children.entities) {
        const localTransform = child.get(Translate)!.matrix()
          .mul(child.get(Rotate)!.matrix())
          .mul(child.get(Scale)!.matrix())
        const transform = renderData.transform.mul(localTransform)
        const childRenderData = {
          entity: child,
          transform
        }
        yield childRenderData
        yield* renderChildren(childRenderData)
      }
    }
    const camera = ecs.get(ActiveCamera)!.entity
    const view = camera.get(Projection)!.matrix
    for (const root of ecs.query(Root)) {
      const localTransform = root.get(Translate)!.matrix()
        .mul(root.get(Rotate)!.matrix())
        .mul(root.get(Scale)!.matrix())
      const transform = view.mul(localTransform)
      const renderData = { transform, entity: root }
      yield renderData
      yield* renderChildren(renderData)
    }
  }

  render = (ecs: ECS): void => {
    const start = performance.now()
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const camera = ecs.get(ActiveCamera)!.entity
    const view = camera.get(Projection)!.matrix
    let positions: number[] = []
    let vertexIndices: number[] = []
    let indices: number[] = []
    let matrices: number[] = []
    let fills: number[] = []
    let index = 0
    let offset = 0
    const drawBatch = () => {
      console.log('positions', positions)
      console.log('vertexIndices', vertexIndices)
      console.log('indices', indices)
      console.log('matrices', matrices)
      console.log('fills', fills)
      console.log('index', index)
      console.log('offset', offset)
      gl.uniformMatrix4fv(this.uMatrix, /*transpose*/false, matrices)
      gl.uniform4fv(this.uColor, fills)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.aPosition.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.aIndex.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
      gl.drawElements(gl.TRIANGLES, /*count*/vertexIndices.length, /*index type*/gl.UNSIGNED_SHORT, /*offset*/0)
    }
    for (const { entity, transform } of this.renderEntities(ecs)) {
      const geometry = entity.get(Geometry)
      if (!geometry) continue
      positions.push(...geometry.vertices)
      for (const i of geometry.indices) vertexIndices.push(i + offset)
      const vertexCount = geometry.vertices.length / 3
      offset += vertexCount
      matrices.push(...transform.data)
      const fill = entity.get(Fill)!
      fills.push(fill.h, fill.s, fill.l, fill.a)
      for (let i = 0; i < vertexCount; ++i) indices.push(index)
      if (++index == this.maxBatchSize) {
        drawBatch()
        positions = []
        vertexIndices = []
        indices = []
        matrices = []
        fills = []
        index = 0
        offset = 0
      }
    }
    if (index != 0) drawBatch()
    const stop = performance.now()
    //console.log(stop - start)
  }
}
