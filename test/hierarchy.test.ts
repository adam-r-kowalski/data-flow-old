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
