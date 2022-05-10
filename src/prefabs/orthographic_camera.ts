import { ECS, Entity } from '../ecs'
import { physicalEntity } from './physical_entity'
import { orthographicProjection, Orthographic } from '../components'

export const orthographicCamera = (ecs: ECS, orthographic: Orthographic): Entity =>
  physicalEntity(ecs).set(orthographicProjection(orthographic))
