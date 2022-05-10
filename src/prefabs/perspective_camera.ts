import { ECS, Entity } from '../ecs'
import { physicalEntity } from './physical_entity'
import { perspectiveProjection, Perspective } from '../components'

export const perspectiveCamera = (ecs: ECS, perspective: Perspective): Entity =>
  physicalEntity(ecs).set(perspectiveProjection(perspective))
