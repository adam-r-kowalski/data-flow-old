import { ECS } from '../ecs'
import * as localTransform from './local_transform'
import * as hierarchy from './hierarchy'

export const register = (ecs: ECS): void => {
  localTransform.register(ecs)
  hierarchy.register(ecs)
}
