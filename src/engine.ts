import { Vertices, Rectangle, Text } from './geometry'
import { Palette } from './color'

interface Node {
  title: string
  inputs: string[]
  outputs: string[]
  translation: number[]
  color: number[]
}

export class Nodes {
  titles: string[]
  inputs: string[][]
  outputs: string[][]
  translations: number[][]
  colors: number[][]

  constructor() {
    this.titles = []
    this.inputs = []
    this.outputs = []
    this.translations = []
    this.colors = []
  }

  push = (node: Node): void => {
    this.titles.push(node.title)
    this.inputs.push(node.inputs)
    this.outputs.push(node.outputs)
    this.translations.push(node.translation)
    this.colors.push(node.color)
  }
}

interface Renderer {
  onResize: (callback: () => void) => void
  clear: () => void
  drawVertices: (vertices: Vertices) => void
  drawText: (text: Text) => void
}

const center = (rectangle: Rectangle): number[] => {
  const [x, y] = rectangle.translation
  const [w, h] = rectangle.scale
  return [x + w / 2, y + h / 2]
}

interface Config {
  renderer: Renderer
  palette: Palette
}

export class Engine {
  nodes: Nodes
  renderer: Renderer
  palette: Palette

  constructor(config: Config) {
    this.nodes = new Nodes()
    this.renderer = config.renderer
    this.renderer.onResize(this.render)
    this.palette = config.palette
  }

  pushNode = (node: Node): void => {
    this.nodes.push(node)
  }

  render = (): void => {
    this.renderer.clear()

    const vertices = new Vertices()

    this.nodes.titles.forEach((title, index) => {
      const titleRectangle = {
        translation: this.nodes.translations[index],
        scale: [200, 40],
        color: this.nodes.colors[index]
      }
      vertices.pushRectangle(titleRectangle)

      const bodyRectangle = {
        translation: [
          titleRectangle.translation[0],
          titleRectangle.translation[1] + titleRectangle.scale[1]
        ],
        scale: [200, 70],
        color: this.palette.grey
      }
      vertices.pushRectangle(bodyRectangle)

      this.renderer.drawText({
        fontSize: 24,
        fontFamily: 'sans-serif',
        textAlign: 'center',
        textBaseline: 'middle',
        color: this.palette.white,
        translation: center(titleRectangle),
        text: title
      })

      const size = 20
      const halfSize = size / 2
      const sizeAndAHalf = size + halfSize

      let [x, y] = bodyRectangle.translation
      y += halfSize
      this.nodes.inputs[index].forEach(i => {
        const inputRectangle = {
          translation: [x, y],
          scale: [size, size],
          color: this.nodes.colors[index]
        }
        vertices.pushRectangle(inputRectangle)
        this.renderer.drawText({
          fontSize: 24,
          fontFamily: 'sans-serif',
          textAlign: 'left',
          textBaseline: 'middle',
          color: this.palette.white,
          translation: [x + sizeAndAHalf, y + halfSize],
          text: i
        })
        y += sizeAndAHalf
      })

      x = bodyRectangle.translation[0] + bodyRectangle.scale[0] - size
      y = bodyRectangle.translation[1] + halfSize
      this.nodes.outputs[index].forEach(i => {
        const outputRectangle = {
          translation: [x, y],
          scale: [size, size],
          color: this.nodes.colors[index]
        }
        vertices.pushRectangle(outputRectangle)
        this.renderer.drawText({
          fontSize: 24,
          fontFamily: 'sans-serif',
          textAlign: 'right',
          textBaseline: 'middle',
          color: this.palette.white,
          translation: [x - halfSize, y + halfSize],
          text: i
        })
        y += sizeAndAHalf
      })
    })
    this.renderer.drawVertices(vertices)
  }
}
