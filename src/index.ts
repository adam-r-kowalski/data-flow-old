import { WebGL2, Rectangle, Text } from './webgl2'
import { graph } from './titanic'
import { Kind, Graph } from './graph'

const webgl2 = new WebGL2()
webgl2.clear()

interface Graphics {
  drawRectangle(rectangle: Rectangle): void,
  drawText(text: Text): void,
}

const drawGraph = (graph: Graph, graphics: Graphics) => {
  graph.nodes.forEach((entities, row) => {
    entities.forEach((entity, column) => {
      console.assert(entity.kind == Kind.TABLE)

      const x = column * 100 + 100
      const y = row * 100 + 100

      graphics.drawRectangle({
        x,
        y,
        width: 300,
        height: 30,
        red: 0.1,
        green: 0.46,
        blue: 0.82,
        alpha: 1
      })

      const columns = graph.tables.columns[entity.index]
      const fontSize = 16
      graphics.drawRectangle({
        x,
        y: y + 30,
        width: 300,
        height: columns.length * (fontSize + 10) + 15,
        red: 0.26,
        green: 0.26,
        blue: 0.26,
        alpha: 1
      })

      graphics.drawText({
        message: graph.tables.names[entity.index],
        x: x + 5,
        y: y + 5,
        fontFamily: 'sans-serif',
        fontSize: 18,
        textAlign: 'left',
        fillStyle: 'white'
      })

      columns.map((column, i) => {
        graphics.drawText({
          message: column,
          x: x + 265,
          y: y + i * (fontSize + 10) + 40,
          fontFamily: 'sans-serif',
          fontSize: fontSize,
          textAlign: 'right',
          fillStyle: 'white'
        })

        graphics.drawRectangle({
          x: x + 300 - fontSize - 10,
          y: y + i * (fontSize + 10) + 40,
          width: fontSize,
          height: fontSize,
          red: 0.1,
          green: 0.46,
          blue: 0.82,
          alpha: 1
        })
      })

    })
  })
}

drawGraph(graph, webgl2)
