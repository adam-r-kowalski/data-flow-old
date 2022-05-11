import { Parent, Children } from "../components";
import { ECS, ChangeData } from "../ecs";

export const register = (ecs: ECS): void => {
  ecs.onChange(Children, updateParent)
}

export const updateParent = ({ entity }: ChangeData): void => {
  for (const child of entity.get(Children)!.entities) {
    child.set(new Parent(entity))
  }
}
