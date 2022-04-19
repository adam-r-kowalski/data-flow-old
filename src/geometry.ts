
export interface Rectangle {
  translation: number[]
  scale: number[]
  color: number[]
}

export class Vertices {
  positions: number[]
  colors: number[]

  constructor() {
    this.positions = []
    this.colors = []
  }

  pushRectangle = (rectangle: Rectangle): void => {
    const [x1, y1] = rectangle.translation
    const [w, h] = rectangle.scale
    const [r, g, b] = rectangle.color
    const [x2, y2] = [x1 + w, y1 + h]
    this.positions.push(
      x1, y1,
      x1, y2,
      x2, y1,
      x1, y2,
      x2, y1,
      x2, y2,
    )
    this.colors.push(
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
      r, g, b,
    )
  }
}

export interface Text {
  fontSize: number
  fontFamily: string
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  color: number[]
  translation: number[]
  text: string
}
