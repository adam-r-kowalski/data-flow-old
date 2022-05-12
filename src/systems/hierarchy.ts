import { Parent, Children } from "../components";
import { ECS, ChangeData } from "../ecs";

export const register = (ecs: ECS): void => {
  ecs.onChange(Children, updateParent)
  ecs.onChange(Parent, updateChildren)
}

export const updateParent = ({ entity }: ChangeData): void => {
  for (const child of entity.get(Children)!.entities) {
    const parent = child.get(Parent)
    if (parent && parent.entity.id === entity.id) continue
    child.set(new Parent(entity))
  }
}

export const updateChildren = ({ entity }: ChangeData): void => {
  const parent = entity.get(Parent)!.entity
  const children = (() => {
    const currentChildren = parent.get(Children)
    if (currentChildren) return currentChildren
    const newChildren = new Children([])
    parent.set(newChildren)
    return newChildren
  })()
  children.entities.push(entity)
}
