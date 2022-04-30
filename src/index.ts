import { Renderer } from './webgl_renderer'
import { ECS } from './ecs'
import { Geometry, Translate, Scale } from './components'

const renderer = new Renderer()
const ecs = new ECS()
const rect = ecs.entity(
  new Geometry(
    [
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      -0.5, -0.5, 0,
      0.5, -0.5, 0
    ],
    [
      0, 1, 2,
      2, 3, 1
    ]
  ),
  new Translate(500, 500, 0),
  new Scale(100, 100, 1)
)
renderer.setSize(1000, 1000)
renderer.render(rect)
document.body.appendChild(renderer.element)
