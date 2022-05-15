import * as c from '../components'
import { ECS, Entity } from '../ecs'

interface DrawData {
  positions: number[]
  colors: number[]
  indices: number[]
}

class DefaultProgram {
  program: WebGLProgram
  resolutionLocation: WebGLUniformLocation
  positionBuffer: WebGLBuffer
  colorBuffer: WebGLBuffer
  indexBuffer: WebGLBuffer
  vertexArrayObject: WebGLVertexArrayObject
  gl: WebGL2RenderingContext
  count: number

  constructor(gl: WebGL2RenderingContext) {
    const vertexShaderSource = `#version 300 es
uniform vec2 u_resolution;

in vec2 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
  vec2 zeroToOne = a_position.xy / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = a_color;
}
`

    const fragmentShaderSource = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 fragColor;

vec4 hslToRgb(in vec4 hsl) {
 float h = hsl.x / 360.0;
 vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
 return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w / 255.0);
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

    this.vertexArrayObject = gl.createVertexArray()!
    gl.bindVertexArray(this.vertexArrayObject)

    this.positionBuffer = gl.createBuffer()!
    const aPositionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPositionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(
      aPositionLocation,
      /*size*/2,
      /*type*/gl.FLOAT,
      /*normalize*/false,
      /*stride*/0,
      /*offset*/0
    )

    this.colorBuffer = gl.createBuffer()!
    const aColorLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(aColorLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.vertexAttribPointer(
      aColorLocation,
      /*size*/4,
      /*type*/gl.FLOAT,
      /*normalize*/false,
      /*stride*/0,
      /*offset*/0
    )

    this.indexBuffer = gl.createBuffer()!

    this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution')!

    this.program = program
    this.gl = gl
  }

  use = () => {
    const gl = this.gl
    gl.useProgram(this.program)
    gl.bindVertexArray(this.vertexArrayObject)
  }

  setResolution = (x: number, y: number) =>
    this.gl.uniform2f(this.resolutionLocation, x, y)

  draw = ({ positions, colors, indices }: DrawData) => {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    gl.drawElements(gl.TRIANGLES, /*count*/indices.length, /*type*/gl.UNSIGNED_SHORT, /*offset*/0)
  }
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

const computeX = (parentRect: Rectangle, entity: Entity, width: number): number => {
  const left = entity.get(c.Left)
  if (left) return parentRect.x + left.pixels
  const right = entity.get(c.Right)!.pixels
  return parentRect.x + parentRect.width - width - right
}

const computeY = (parentRect: Rectangle, entity: Entity, height: number): number => {
  const top = entity.get(c.Top)
  if (top) return parentRect.y + top.pixels
  const bottom = entity.get(c.Bottom)!.pixels
  return parentRect.y + parentRect.height - height - bottom
}

const explicitWidthAndHeight = (parentRect: Rectangle, entity: Entity, width: number): Rectangle => {
  const height = entity.get(c.Height)!.pixels
  const x = computeX(parentRect, entity, width)
  const y = computeY(parentRect, entity, height)
  return { x, y, width, height }
}

const implicitWidth = (parentRect: Rectangle, entity: Entity, height: number): Rectangle => {
  const y = computeY(parentRect, entity, height)
  const right = entity.get(c.Right)!.pixels
  const left = entity.get(c.Left)!.pixels
  const width = parentRect.width - right - left
  const x = left + parentRect.x
  return { x, y, width, height }
}

const implicitHeight = (parentRect: Rectangle, entity: Entity, width: number): Rectangle => {
  const x = computeX(parentRect, entity, width)
  const bottom = entity.get(c.Bottom)!.pixels
  const top = entity.get(c.Top)!.pixels
  const height = parentRect.height - bottom - top
  const y = top + parentRect.y
  return { x, y, width, height }
}

const implicitWidthAndHeight = (parentRect: Rectangle, entity: Entity): Rectangle => {
  const top = entity.get(c.Top)!.pixels
  const right = entity.get(c.Right)!.pixels
  const bottom = entity.get(c.Bottom)!.pixels
  const left = entity.get(c.Left)!.pixels
  const x = left + parentRect.x
  const y = top + parentRect.y
  const height = parentRect.height - bottom - top
  const width = parentRect.width - right - left
  return { x, y, width, height }
}

export class WebGL2 {
  element: HTMLCanvasElement
  gl: WebGL2RenderingContext
  defaultProgram: DefaultProgram
  drawData: DrawData
  rect: Rectangle

  constructor({ width, height }: { width: number, height: number }) {
    this.rect = { x: 0, y: 0, width, height }
    const canvas = document.createElement('canvas')
    this.element = canvas
    canvas.width = width
    canvas.height = height
    canvas.style.display = 'block'
    const gl = canvas.getContext('webgl2')!
    this.gl = gl

    this.defaultProgram = new DefaultProgram(gl)
    this.defaultProgram.use()

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.viewport(0, 0, width, height)

    this.defaultProgram.setResolution(width, height)

    this.drawData = {
      colors: [],
      positions: [],
      indices: [],
    }
  }

  pushRect = ({ x, y, width, height }: Rectangle, { h, s, l, a }: c.Hsla) => {
    const offset = this.drawData.positions.length / 2
    this.drawData.colors.push(
      h, s, l, a,
      h, s, l, a,
      h, s, l, a,
      h, s, l, a,
    )
    this.drawData.positions.push(
      x, y,
      x, y + height,
      x + width, y,
      x + width, y + height,
    )
    this.drawData.indices.push(
      0 + offset, 1 + offset, 2 + offset,
      1 + offset, 2 + offset, 3 + offset,
    )
  }

  drawBatch = (): void => {
    this.defaultProgram.draw(this.drawData)
    this.drawData = {
      colors: [],
      positions: [],
      indices: [],
    }
  }

  renderChild = (parentRect: Rectangle, entity: Entity): void => {
    const bg = entity.get(c.BackgroundColor)
    const width = entity.get(c.Width)
    const height = entity.get(c.Height)
    const rect = (() => {
      if (!width && !height) return implicitWidthAndHeight(parentRect, entity)
      if (!width) return implicitWidth(parentRect, entity, height!.pixels)
      if (!height) return implicitHeight(parentRect, entity, width.pixels)
      return explicitWidthAndHeight(parentRect, entity, width.pixels)
    })()
    if (bg) this.pushRect(rect, bg)
    this.renderChildren(rect, entity)
  }

  renderChildren = (parentRect: Rectangle, entity: Entity): void => {
    const children = entity.get(c.Children)
    if (!children) return
    for (const child of children.entities) {
      this.renderChild(parentRect, child)
    }
  }

  render = (ecs: ECS): void => {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)
    const ui = ecs.get(c.ActiveUI)!.entity
    const bg = ui.get(c.BackgroundColor)
    if (bg) this.pushRect(this.rect, bg)
    this.renderChildren(this.rect, ui)
    this.drawBatch()
  }
}
