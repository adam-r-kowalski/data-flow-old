import { ECS, Entity, ChangeData } from '../ecs'
import { Translate, Rotate, Scale, LocalTransform } from '../components'
import { Mat4x4 } from '../linear_algebra'

export const register = (ecs: ECS): void =>
  ecs.onAnyChange([Translate, Rotate, Scale], update)

export const update = ({ entity }: ChangeData): void => {
  let matrix = Mat4x4.identity()
  const translate = entity.get(Translate)!
  if (translate.x !== 0 || translate.y !== 0 || translate.z !== 0) {
    matrix = matrix.mul(new Mat4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      translate.x, translate.y, translate.z, 1,
    ]))
  }
  const rotate = entity.get(Rotate)!
  if (rotate.x !== 0) {
    const radians = rotate.x
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    matrix = matrix.mul(new Mat4x4([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ]))
  }
  if (rotate.y !== 0) {
    const radians = rotate.y
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    matrix = matrix.mul(new Mat4x4([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ]))
  }
  if (rotate.z !== 0) {
    const radians = rotate.z
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    matrix = matrix.mul(new Mat4x4([
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]))
  }
  const scale = entity.get(Scale)!
  if (scale.x !== 1 || scale.y !== 1 || scale.z !== 1) {
    matrix = matrix.mul(new Mat4x4([
      scale.x, 0, 0, 0,
      0, scale.y, 0, 0,
      0, 0, scale.z, 0,
      0, 0, 0, 1,
    ]))
  }
  entity.set(new LocalTransform(matrix))
}
