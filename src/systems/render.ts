import { ECS } from '../ecs'
import * as components from '../components'
import { computeSize } from './compute_size'


export const render = (ecs: ECS): void => {
  computeSize(ecs)
  const renderer = ecs.get(components.Renderer)!
  renderer.clear()
  for (const layer of ecs.get(components.Layers)!.stack) {
    for (const entity of layer) {
      const color = entity.get(components.BackgroundColor)
      if (!color) continue
      renderer.drawRectangle(entity.get(components.ComputedRectangle)!, color)
    }
  }
  renderer.flush()
}
