import { material } from './color'
import { Renderer } from './renderer'
import { Engine } from './engine'

const palette = material

const renderer = new Renderer({
  element: document.body,
  clearColor: palette.darkGrey
})

const engine = new Engine({ renderer, palette })

engine.pushNode({
  title: 'Scatter',
  inputs: ['x', 'y'],
  outputs: ['plot'],
  translation: [100, 200],
  color: palette.lightBlue
})

engine.pushNode({
  title: 'Line',
  inputs: ['x', 'y'],
  outputs: ['plot'],
  translation: [500, 500],
  color: palette.green
})
