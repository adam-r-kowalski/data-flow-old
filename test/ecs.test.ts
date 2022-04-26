import { ECS } from '../src/ecs'

test("create entity", () => {
  const ecs = new ECS()
  expect(ecs.createEntity()).toEqual(0)
  expect(ecs.createEntity()).toEqual(1)
})

test("set and get component", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const entity = ecs.createEntity()
  ecs.set(entity, new Name("Joe"))
  const name = ecs.get(entity, Name)
  expect(name.value).toEqual("Joe")
})
