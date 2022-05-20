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

test("explicit top left right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Right(25),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 100 })
})

test("explicit bottom left right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Right(25),
    new Studio.components.Height(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 375, width: 450, height: 100 })
})

test("explicit top left bottom width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Bottom(25),
    new Studio.components.Width(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 100, height: 450 })
})

test("explicit top right bottom width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Width(100),
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 375, y: 25, width: 100, height: 450 })
})

test("nested child explicit top right bottom left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(100),
    new Studio.components.Left(100),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 50, width: 250, height: 50 })
})

test("nested child explicit top bottom right width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Bottom(100),
    new Studio.components.Right(25),
    new Studio.components.Width(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 400, y: 125, width: 50, height: 250 })
})

test("nested child explicit bottom right left height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(100),
    new Studio.components.Left(100),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 400, width: 250, height: 50 })
})

test("nested child explicit top bottom left width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(25),
    new Studio.components.Width(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 50, y: 125, width: 50, height: 250 })
})

test("nested child explicit top left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Width(50),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 50, y: 50, width: 50, height: 50 })
})

test("nested child explicit top right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Width(50),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 400, y: 50, width: 50, height: 50 })
})

test("nested child explicit bottom right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Width(50),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 400, y: 400, width: 50, height: 50 })
})

test("nested child explicit bottom left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Width(50),
    new Studio.components.Height(50),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 50, y: 400, width: 50, height: 50 })
})

test("nested child explicit top right bottom left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
})

test("nested nested child explicit top left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_nested_child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
    new Studio.components.Children([nested_nested_child])
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
  expect(rect(nested_nested_child)).toEqual({ x: 150, y: 150, width: 50, height: 100 })
})

test("nested nested child explicit top right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_nested_child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
    new Studio.components.Children([nested_nested_child])
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
  expect(rect(nested_nested_child)).toEqual({ x: 250, y: 150, width: 100, height: 50 })
})

test("nested nested child explicit bottom right width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_nested_child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
    new Studio.components.Children([nested_nested_child])
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
  expect(rect(nested_nested_child)).toEqual({ x: 300, y: 250, width: 50, height: 100 })
})

test("nested nested child explicit bottom left width height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_nested_child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
    new Studio.components.Children([nested_nested_child])
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
  expect(rect(nested_nested_child)).toEqual({ x: 150, y: 300, width: 100, height: 50 })
})

test("nested nested child explicit top right bottom left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const nested_nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
  )
  const nested_child = ecs.entity(
    new Studio.components.Top(100),
    new Studio.components.Right(100),
    new Studio.components.Bottom(100),
    new Studio.components.Left(100),
    new Studio.components.Children([nested_nested_child])
  )
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Children([nested_child])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 450 })
  expect(rect(nested_child)).toEqual({ x: 125, y: 125, width: 250, height: 250 })
  expect(rect(nested_nested_child)).toEqual({ x: 225, y: 225, width: 50, height: 50 })
})

