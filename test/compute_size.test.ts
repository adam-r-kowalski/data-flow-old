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

test("vertical stack", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(100))
  const child1 = ecs.entity(new Studio.components.Height(200))
  const child2 = ecs.entity(new Studio.components.Height(100))
  const child3 = ecs.entity(new Studio.components.Height(100))
  const ui = ecs.entity(new Studio.components.VerticalStack([child0, child1, child2, child3]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child0)).toEqual({ x: 0, y: 0, width: 500, height: 100 })
  expect(rect(child1)).toEqual({ x: 0, y: 100, width: 500, height: 200 })
  expect(rect(child2)).toEqual({ x: 0, y: 300, width: 500, height: 100 })
  expect(rect(child3)).toEqual({ x: 0, y: 400, width: 500, height: 100 })
})

test("vertical stack explicit top left bottom width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(100))
  const child2 = ecs.entity(new Studio.components.Height(100))
  const child3 = ecs.entity(new Studio.components.Height(100))
  const child4 = ecs.entity(new Studio.components.Height(100))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Bottom(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 200, height: 450 })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 25, y: 50, width: 200, height: 100 })
  expect(rect(child2)).toEqual({ x: 25, y: 150, width: 200, height: 100 })
  expect(rect(child3)).toEqual({ x: 25, y: 250, width: 200, height: 100 })
  expect(rect(child4)).toEqual({ x: 25, y: 350, width: 200, height: 100 })
})

test("vertical stack explicit top right bottom width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(100))
  const child2 = ecs.entity(new Studio.components.Height(100))
  const child3 = ecs.entity(new Studio.components.Height(100))
  const child4 = ecs.entity(new Studio.components.Height(100))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Bottom(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 25, width: 200, height: 450 })
  expect(rect(child0)).toEqual({ x: 275, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 275, y: 50, width: 200, height: 100 })
  expect(rect(child2)).toEqual({ x: 275, y: 150, width: 200, height: 100 })
  expect(rect(child3)).toEqual({ x: 275, y: 250, width: 200, height: 100 })
  expect(rect(child4)).toEqual({ x: 275, y: 350, width: 200, height: 100 })
})

test("vertical stack explicit top left width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(50))
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(new Studio.components.Height(50))
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 25, y: 50, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 25, y: 100, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 25, y: 125, width: 200, height: 50 })
  expect(rect(child4)).toEqual({ x: 25, y: 175, width: 200, height: 25 })
})

test("vertical stack explicit top right width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(50))
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(new Studio.components.Height(50))
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 25, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 275, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 275, y: 50, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 275, y: 100, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 275, y: 125, width: 200, height: 50 })
  expect(rect(child4)).toEqual({ x: 275, y: 175, width: 200, height: 25 })
})

test("vertical stack explicit bottom right width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(50))
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(new Studio.components.Height(50))
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 300, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 275, y: 300, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 275, y: 325, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 275, y: 375, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 275, y: 400, width: 200, height: 50 })
  expect(rect(child4)).toEqual({ x: 275, y: 450, width: 200, height: 25 })
})

test("vertical stack explicit bottom left width", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(new Studio.components.Height(50))
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(new Studio.components.Height(50))
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Width(200),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 300, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 25, y: 300, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 25, y: 325, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 25, y: 375, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 25, y: 400, width: 200, height: 50 })
  expect(rect(child4)).toEqual({ x: 25, y: 450, width: 200, height: 25 })
})

test("vertical stack explicit top left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(
    new Studio.components.Width(200),
    new Studio.components.Height(50),
  )
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 25, y: 50, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 25, y: 100, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 25, y: 125, width: 100, height: 50 })
  expect(rect(child4)).toEqual({ x: 25, y: 175, width: 200, height: 25 })
})

test("vertical stack explicit top right", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(
    new Studio.components.Width(200),
    new Studio.components.Height(50),
  )
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 25, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 275, y: 25, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 275, y: 50, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 275, y: 100, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 275, y: 125, width: 100, height: 50 })
  expect(rect(child4)).toEqual({ x: 275, y: 175, width: 200, height: 25 })
})

test("vertical stack explicit bottom right", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(
    new Studio.components.Width(200),
    new Studio.components.Height(50),
  )
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 275, y: 300, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 275, y: 300, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 275, y: 325, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 275, y: 375, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 275, y: 400, width: 100, height: 50 })
  expect(rect(child4)).toEqual({ x: 275, y: 450, width: 200, height: 25 })
})

test("vertical stack explicit bottom left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Height(25))
  const child1 = ecs.entity(
    new Studio.components.Width(200),
    new Studio.components.Height(50),
  )
  const child2 = ecs.entity(new Studio.components.Height(25))
  const child3 = ecs.entity(
    new Studio.components.Width(100),
    new Studio.components.Height(50),
  )
  const child4 = ecs.entity(new Studio.components.Height(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.VerticalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 300, width: 200, height: 175 })
  expect(rect(child0)).toEqual({ x: 25, y: 300, width: 200, height: 25 })
  expect(rect(child1)).toEqual({ x: 25, y: 325, width: 200, height: 50 })
  expect(rect(child2)).toEqual({ x: 25, y: 375, width: 200, height: 25 })
  expect(rect(child3)).toEqual({ x: 25, y: 400, width: 100, height: 50 })
  expect(rect(child4)).toEqual({ x: 25, y: 450, width: 200, height: 25 })
})

test("horizontal stack", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(100))
  const child1 = ecs.entity(new Studio.components.Width(200))
  const child2 = ecs.entity(new Studio.components.Width(100))
  const child3 = ecs.entity(new Studio.components.Width(100))
  const ui = ecs.entity(new Studio.components.HorizontalStack([child0, child1, child2, child3]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child0)).toEqual({ x: 0, y: 0, width: 100, height: 500 })
  expect(rect(child1)).toEqual({ x: 100, y: 0, width: 200, height: 500 })
  expect(rect(child2)).toEqual({ x: 300, y: 0, width: 100, height: 500 })
  expect(rect(child3)).toEqual({ x: 400, y: 0, width: 100, height: 500 })
})

test("horizontal stack explicit top left right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(100))
  const child2 = ecs.entity(new Studio.components.Width(100))
  const child3 = ecs.entity(new Studio.components.Width(100))
  const child4 = ecs.entity(new Studio.components.Width(100))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Right(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 450, height: 200, })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 25, height: 200, })
  expect(rect(child1)).toEqual({ x: 50, y: 25, width: 100, height: 200, })
  expect(rect(child2)).toEqual({ x: 150, y: 25, width: 100, height: 200, })
  expect(rect(child3)).toEqual({ x: 250, y: 25, width: 100, height: 200, })
  expect(rect(child4)).toEqual({ x: 350, y: 25, width: 100, height: 200, })
})

test("horizontal stack explicit left bottom right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(100))
  const child2 = ecs.entity(new Studio.components.Width(100))
  const child3 = ecs.entity(new Studio.components.Width(100))
  const child4 = ecs.entity(new Studio.components.Width(100))
  const child = ecs.entity(
    new Studio.components.Left(25),
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 275, width: 450, height: 200 })
  expect(rect(child0)).toEqual({ x: 25, y: 275, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 50, y: 275, width: 100, height: 200 })
  expect(rect(child2)).toEqual({ x: 150, y: 275, width: 100, height: 200 })
  expect(rect(child3)).toEqual({ x: 250, y: 275, width: 100, height: 200 })
  expect(rect(child4)).toEqual({ x: 350, y: 275, width: 100, height: 200 })
})

test("horizontal stack explicit top left height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(50))
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(new Studio.components.Width(50))
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 50, y: 25, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 100, y: 25, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 125, y: 25, width: 50, height: 200 })
  expect(rect(child4)).toEqual({ x: 175, y: 25, width: 25, height: 200 })
})

test("horizontal stack explicit top right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(50))
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(new Studio.components.Width(50))
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 300, y: 25, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 300, y: 25, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 325, y: 25, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 375, y: 25, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 400, y: 25, width: 50, height: 200 })
  expect(rect(child4)).toEqual({ x: 450, y: 25, width: 25, height: 200 })
})

test("horizontal stack explicit bottom right height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(50))
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(new Studio.components.Width(50))
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 300, y: 275, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 300, y: 275, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 325, y: 275, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 375, y: 275, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 400, y: 275, width: 50, height: 200 })
  expect(rect(child4)).toEqual({ x: 450, y: 275, width: 25, height: 200 })
})

test("horizontal stack explicit bottom left height", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(new Studio.components.Width(50))
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(new Studio.components.Width(50))
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.Height(200),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 275, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 25, y: 275, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 50, y: 275, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 100, y: 275, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 125, y: 275, width: 50, height: 200 })
  expect(rect(child4)).toEqual({ x: 175, y: 275, width: 25, height: 200 })
})

test("horizontal stack explicit top left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(200),
  )
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 25, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 25, y: 25, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 50, y: 25, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 100, y: 25, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 125, y: 25, width: 50, height: 100 })
  expect(rect(child4)).toEqual({ x: 175, y: 25, width: 25, height: 200 })
})

test("horizontal stack explicit top right", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(200),
  )
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Right(25),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 300, y: 25, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 300, y: 25, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 325, y: 25, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 375, y: 25, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 400, y: 25, width: 50, height: 100 })
  expect(rect(child4)).toEqual({ x: 450, y: 25, width: 25, height: 200 })
})

test("horizontal stack explicit bottom right", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(200),
  )
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Right(25),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 300, y: 275, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 300, y: 275, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 325, y: 275, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 375, y: 275, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 400, y: 275, width: 50, height: 100 })
  expect(rect(child4)).toEqual({ x: 450, y: 275, width: 25, height: 200 })
})

test("horizontal stack explicit bottom left", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const child0 = ecs.entity(new Studio.components.Width(25))
  const child1 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(200),
  )
  const child2 = ecs.entity(new Studio.components.Width(25))
  const child3 = ecs.entity(
    new Studio.components.Width(50),
    new Studio.components.Height(100),
  )
  const child4 = ecs.entity(new Studio.components.Width(25))
  const child = ecs.entity(
    new Studio.components.Bottom(25),
    new Studio.components.Left(25),
    new Studio.components.HorizontalStack([child0, child1, child2, child3, child4])
  )
  const ui = ecs.entity(new Studio.components.Children([child]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(child)).toEqual({ x: 25, y: 275, width: 175, height: 200 })
  expect(rect(child0)).toEqual({ x: 25, y: 275, width: 25, height: 200 })
  expect(rect(child1)).toEqual({ x: 50, y: 275, width: 50, height: 200 })
  expect(rect(child2)).toEqual({ x: 100, y: 275, width: 25, height: 200 })
  expect(rect(child3)).toEqual({ x: 125, y: 275, width: 50, height: 100 })
  expect(rect(child4)).toEqual({ x: 175, y: 275, width: 25, height: 200 })
})

test("horizontal stack in vertical stack", () => {
  const testing = new Studio.renderer.Testing({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const top = ecs.entity(new Studio.components.Height(25))
  const left = ecs.entity(new Studio.components.Width(100))
  const right = ecs.entity(new Studio.components.Width(100))
  const horizontalStack = ecs.entity(
    new Studio.components.Width(200),
    new Studio.components.Height(75),
    new Studio.components.HorizontalStack([left, right])
  )
  const verticalStack = ecs.entity(
    new Studio.components.Top(25),
    new Studio.components.Left(25),
    new Studio.components.VerticalStack([top, horizontalStack]),
  )
  const ui = ecs.entity(new Studio.components.Children([verticalStack]))
  ecs.set(
    new Studio.components.Renderer(testing),
    new Studio.components.UI(ui)
  )
  Studio.systems.computeSize(ecs)
  expect(rect(ui)).toEqual({ x: 0, y: 0, width: 500, height: 500 })
  expect(rect(verticalStack)).toEqual({ x: 25, y: 25, width: 200, height: 100 })
  expect(rect(horizontalStack)).toEqual({ x: 25, y: 50, width: 200, height: 75 })
  expect(rect(right)).toEqual({ x: 125, y: 50, width: 100, height: 75 })
  expect(rect(left)).toEqual({ x: 25, y: 50, width: 100, height: 75 })
  expect(rect(top)).toEqual({ x: 25, y: 25, width: 200, height: 25 })
})

