import * as Studio from '../src/studio'

const rect = (entity: Studio.Entity) => entity.get(Studio.components.ComputedRectangle)!

test("empty", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity()
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
})

test("explicit top left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Width(200),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 200, height: 100 })
})

test("explicit top right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Width(200),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 25, width: 200, height: 100 })
})

test("explicit bottom right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Width(200),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 375, width: 200, height: 100 })
})

test("explicit bottom left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Width(200),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 375, width: 200, height: 100 })
})
