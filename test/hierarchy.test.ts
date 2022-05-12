import * as Studio from '../src/studio'

test("set children", () => {
  const ecs = Studio.initECS()
  const children = Array.from({ length: 5 }, () => ecs.entity())
  const parent = ecs.entity(new Studio.Children(children))
  for (const child of children) {
    expect(child.get(Studio.Parent)!.entity).toEqual(parent)
  }
  expect(parent.get(Studio.Children)!.entities).toEqual(children)
})

test("set parent", () => {
  const ecs = Studio.initECS()
  const children = Array.from({ length: 5 }, () => ecs.entity())
  const parent = ecs.entity()
  for (const child of children) child.set(new Studio.Parent(parent))
  for (const child of children) {
    expect(child.get(Studio.Parent)!.entity).toEqual(parent)
  }
  expect(parent.get(Studio.Children)!.entities).toEqual(children)
})

test("re parent", () => {
  const ecs = Studio.initECS()
  const parent0 = ecs.entity()
  const parent1 = ecs.entity()
  const child0 = ecs.entity(new Studio.Parent(parent0))
  const child1 = ecs.entity(new Studio.Parent(parent0))
  expect(parent0.get(Studio.Children)!.entities).toEqual([child0, child1])
  expect(parent1.get(Studio.Children)).toBeUndefined()
  child0.set(new Studio.Parent(parent1))
  expect(parent0.get(Studio.Children)!.entities).toEqual([child1])
  expect(parent1.get(Studio.Children)!.entities).toEqual([child0])
})
