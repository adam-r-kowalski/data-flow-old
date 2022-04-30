import { Renderer } from '../webgl_renderer'
import { ECS } from '../ecs'
import { Geometry, Translate, Scale } from '../components'

export default {
  title: "Rectangle",
}

export const Primary = () => {
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
    new Translate(200, 200, 0),
    new Scale(50, 50, 1)
  )
  renderer.setSize(500, 300)
  renderer.render(rect)
  return renderer.element
}

