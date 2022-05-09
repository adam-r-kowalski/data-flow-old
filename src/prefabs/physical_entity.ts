import { ECS } from '../ecs'
import { Translate, Rotate, Scale } from '../components'

export const physicalEntity = (ecs: ECS) =>
  ecs.entity(
    new Translate({ x: 0, y: 0, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 1, y: 1, z: 1 }),
  )
