import { ECS } from '../ecs'
import * as localTransform from './local_transform'

export const register = (ecs: ECS): void => {
  localTransform.register(ecs)
}
