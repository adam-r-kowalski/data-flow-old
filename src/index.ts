import * as Studio from './studio'

const webgl2 = new Studio.renderer.WebGL2({ width: window.innerWidth, height: window.innerHeight })
document.body.appendChild(webgl2.element)

const ecs = new Studio.ECS()

const ui = ecs.entity(
  new Studio.components.Children([
    ecs.entity(
      new Studio.components.Top(25),
      new Studio.components.Right(25),
      new Studio.components.Bottom(25),
      new Studio.components.Left(25),
      new Studio.components.BackgroundColor({ h: 0, s: 0.5, l: 0.7, a: 1 }),
      new Studio.components.Children([
        ecs.entity(
          new Studio.components.Top(25),
          new Studio.components.Right(100),
          new Studio.components.Left(100),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 30, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Top(100),
          new Studio.components.Bottom(100),
          new Studio.components.Right(25),
          new Studio.components.Width(50),
          new Studio.components.BackgroundColor({ h: 60, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Bottom(25),
          new Studio.components.Right(100),
          new Studio.components.Left(100),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 90, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Top(100),
          new Studio.components.Bottom(100),
          new Studio.components.Left(25),
          new Studio.components.Width(50),
          new Studio.components.BackgroundColor({ h: 120, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Top(25),
          new Studio.components.Left(25),
          new Studio.components.Width(50),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 150, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Top(25),
          new Studio.components.Right(25),
          new Studio.components.Width(50),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 180, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Bottom(25),
          new Studio.components.Right(25),
          new Studio.components.Width(50),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 210, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Bottom(25),
          new Studio.components.Left(25),
          new Studio.components.Width(50),
          new Studio.components.Height(50),
          new Studio.components.BackgroundColor({ h: 240, s: 0.7, l: 0.7, a: 1 }),
        ),
        ecs.entity(
          new Studio.components.Top(100),
          new Studio.components.Right(100),
          new Studio.components.Bottom(100),
          new Studio.components.Left(100),
          new Studio.components.BackgroundColor({ h: 270, s: 0.7, l: 0.7, a: 1 }),
          new Studio.components.Children([
            ecs.entity(
              new Studio.components.Top(25),
              new Studio.components.Left(25),
              new Studio.components.Width(50),
              new Studio.components.Height(100),
              new Studio.components.BackgroundColor({ h: 300, s: 0.9, l: 0.7, a: 1 }),
            ),
            ecs.entity(
              new Studio.components.Top(25),
              new Studio.components.Right(25),
              new Studio.components.Width(100),
              new Studio.components.Height(50),
              new Studio.components.BackgroundColor({ h: 330, s: 0.9, l: 0.7, a: 1 }),
            ),
            ecs.entity(
              new Studio.components.Bottom(25),
              new Studio.components.Right(25),
              new Studio.components.Width(50),
              new Studio.components.Height(100),
              new Studio.components.BackgroundColor({ h: 0, s: 0.9, l: 0.7, a: 1 }),
            ),
            ecs.entity(
              new Studio.components.Bottom(25),
              new Studio.components.Left(25),
              new Studio.components.Width(100),
              new Studio.components.Height(50),
              new Studio.components.BackgroundColor({ h: 30, s: 0.9, l: 0.7, a: 1 }),
            ),
            ecs.entity(
              new Studio.components.Top(100),
              new Studio.components.Right(100),
              new Studio.components.Bottom(100),
              new Studio.components.Left(100),
              new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 }),
            ),
          ])
        ),
      ]),
    ),
  ]),
)

ecs.set(
  new Studio.components.Renderer(webgl2),
  new Studio.components.UI(ui)
)

Studio.systems.render(ecs)

window.addEventListener('resize', () => {
  webgl2.setSize({ width: window.innerWidth, height: window.innerHeight })
  Studio.systems.render(ecs)
})
