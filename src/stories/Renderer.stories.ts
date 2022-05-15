import * as Studio from '../studio'

export default {
  title: "Renderer",
}

export const Empty = () => {
  const renderer = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.c.UI(),
  )
  ecs.set(new Studio.c.ActiveUI(ui))
  renderer.render(ecs)
  return renderer.element
}

export const BackgroundColor = () => {
  const renderer = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.c.UI(),
    new Studio.c.BackgroundColor({ h: 279, s: 1, l: 0.7, a: 255 })
  )
  ecs.set(new Studio.c.ActiveUI(ui))
  renderer.render(ecs)
  return renderer.element
}

export const ExplicitWidthAndHeight = () => {
  const renderer = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.c.UI(),
    new Studio.c.Children([
      ecs.entity(
        new Studio.c.Top(25),
        new Studio.c.Left(25),
        new Studio.c.Width(200),
        new Studio.c.Height(100),
        new Studio.c.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 255 })
      ),
      ecs.entity(
        new Studio.c.Top(25),
        new Studio.c.Right(25),
        new Studio.c.Width(100),
        new Studio.c.Height(200),
        new Studio.c.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 255 })
      ),
      ecs.entity(
        new Studio.c.Bottom(25),
        new Studio.c.Right(25),
        new Studio.c.Width(200),
        new Studio.c.Height(100),
        new Studio.c.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 255 })
      ),
      ecs.entity(
        new Studio.c.Bottom(25),
        new Studio.c.Left(25),
        new Studio.c.Width(100),
        new Studio.c.Height(200),
        new Studio.c.BackgroundColor({ h: 270, s: 1, l: 0.7, a: 255 })
      ),
    ]),
  )
  ecs.set(new Studio.c.ActiveUI(ui))
  renderer.render(ecs)
  return renderer.element
}

// export const ImplicitWidth = () => {
//   const renderer = new Studio.renderer.WebGL2({ width: 500, height: 500 })
//   const ecs = new Studio.ECS()
//   const ui = ecs.entity(
//     new Studio.c.UI(),
//     new Studio.c.Children([
//       ecs.entity(
//         new Studio.c.Top(25),
//         new Studio.c.Left(25),
//         new Studio.c.Right(25),
//         new Studio.c.Height(100),
//         new Studio.c.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 255 })
//       ),
//     ]),
//   )
//   ecs.set(new Studio.c.ActiveUI(ui))
//   renderer.render(ecs)
//   return renderer.element
// }
