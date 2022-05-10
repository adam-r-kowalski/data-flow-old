import { ECS } from '../ecs'
import { Translate, Rotate, Scale, LocalTransform, WorldTransform } from '../components'
import { Mat4x4 } from '../linear_algebra'

export const physicalEntity = (ecs: ECS) =>
  ecs.entity(
    new Translate({ x: 0, y: 0, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 1, y: 1, z: 1 }),
    new LocalTransform(Mat4x4.identity()),
    new WorldTransform(Mat4x4.identity()),
  )
