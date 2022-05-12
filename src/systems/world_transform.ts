import { ECS, ChangeData } from '../ecs'
import { LocalTransform } from '../components'
import { Mat4x4 } from '../linear_algebra'

export const register = (ecs: ECS): void =>
  ecs.onChange(LocalTransform, update)

export const update = ({ entity }: ChangeData): void => {
}
