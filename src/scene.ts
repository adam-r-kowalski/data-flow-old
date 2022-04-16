import { Color } from './color'

export interface Node {
  x: number
  y: number
  color: Color
}

export default class {
  positions: number[][]
  colors: number[][]
  triangles: number

  constructor() {
    this.positions = []
    this.colors = []
    this.triangles = 0
  }

  addNode({ x, y, color }: Node): void {
    const dpr = window.devicePixelRatio
    const x1 = x
    const y1 = y
    const { r, g, b } = color
    const x2 = x1 + 200
    const y2 = y1 + 25
    const y3 = y2 + 1
    const y4 = y2 + 75
    const vertices = [
      x1, y1,
      x2, y1,
      x2, y2,
      x1, y1,
      x1, y2,
      x2, y2,

      x1, y2,
      x2, y2,
      x2, y3,
      x1, y2,
      x1, y3,
      x2, y3,

      x1, y3,
      x2, y3,
      x2, y4,
      x1, y3,
      x1, y4,
      x2, y4,
    ]
    this.positions.push(vertices)
    this.colors.push([
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,

      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,
      0, 0, 0,

      66, 66, 66,
      66, 66, 66,
      66, 66, 66,
      66, 66, 66,
      66, 66, 66,
      66, 66, 66,
    ])
    this.triangles += vertices.length / 2
  }
}


