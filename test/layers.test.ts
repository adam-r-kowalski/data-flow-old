import * as Studio from '../src/studio'

test("push 3 entities to layer 0", () => {
  const ecs = new Studio.ECS()
  const entity0 = ecs.entity()
  const entity1 = ecs.entity()
  const entity2 = ecs.entity()
  const layers = new Studio.components.Layers()
  layers.push(0, entity0)
  layers.push(0, entity1)
  layers.push(0, entity2)
  expect(layers.stack).toEqual([[entity0, entity1, entity2]])
})


test("push 2 entities to layer 0 and 1 entity to layer 1", () => {
  const ecs = new Studio.ECS()
  const entity0 = ecs.entity()
  const entity1 = ecs.entity()
  const entity2 = ecs.entity()
  const layers = new Studio.components.Layers()
  layers.push(0, entity0)
  layers.push(0, entity1)
  layers.push(1, entity2)
  expect(layers.stack).toEqual([[entity0, entity1], [entity2]])
})
