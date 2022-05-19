import * as Studio from '../studio'

export default {
  title: "Renderer",
}


export const Empty = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity()
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const BackgroundColor = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.BackgroundColor({ h: 279, s: 1, l: 0.7, a: 1 })
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const ExplicitWidthAndHeight = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Width(200),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Width(100),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Right(25),
        new Studio.components.Width(200),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.Width(100),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 270, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const ImplicitWidth = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Right(25),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.Right(25),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const ImplicitHeight = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Bottom(25),
        new Studio.components.Width(100),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Bottom(25),
        new Studio.components.Width(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const ImplicitWidthAndHeight = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const Transparency = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Width(200),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Width(100),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 0.8 })
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Right(25),
        new Studio.components.Width(200),
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 0.6 })
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.Width(100),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 0.4 })
      ),
      ecs.entity(
        new Studio.components.Top(200),
        new Studio.components.Right(200),
        new Studio.components.Bottom(200),
        new Studio.components.Left(200),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 0.2 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const NestedChildren = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
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
  return webgl2.element
}

export const VerticalStack = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.VerticalStack([
      ecs.entity(
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Height(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const VerticalStackInChildren = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Bottom(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 120, s: 1, l: 0.7, a: 1 })
          ),
        ]),
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Bottom(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 150, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 210, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 240, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Height(100),
            new Studio.components.BackgroundColor({ h: 270, s: 1, l: 0.7, a: 1 })
          ),
        ]),
      )
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const VerticalStackImplicitHeight = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 120, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Right(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 150, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 210, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 240, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const VerticalStackImplicitWidth = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(200),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(200),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 120, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Right(25),
        new Studio.components.Bottom(25),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(200),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 150, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Left(25),
        new Studio.components.Bottom(25),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.VerticalStack([
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(200),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 210, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.Height(50),
            new Studio.components.BackgroundColor({ h: 240, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Height(25)),
        ]),
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const HorizontalStack = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.HorizontalStack([
      ecs.entity(
        new Studio.components.Width(100),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Width(200),
        new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Width(100),
        new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
      ),
      ecs.entity(
        new Studio.components.Width(100),
        new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}

export const HorizontalStackInChildren = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Left(25),
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 120, s: 1, l: 0.7, a: 1 })
          ),
        ]),
      ),
      ecs.entity(
        new Studio.components.Left(25),
        new Studio.components.Bottom(25),
        new Studio.components.Right(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 150, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 210, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 240, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(
            new Studio.components.Width(100),
            new Studio.components.BackgroundColor({ h: 270, s: 1, l: 0.7, a: 1 })
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
  return webgl2.element
}

export const HorizontalStackImplicitWidth = () => {
  const webgl2 = new Studio.renderer.WebGL2({ width: 500, height: 500 })
  const ecs = new Studio.ECS()
  const ui = ecs.entity(
    new Studio.components.Children([
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Left(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 30, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 60, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Top(25),
        new Studio.components.Right(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 90, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 120, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Right(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 150, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 180, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
        ]),
      ),
      ecs.entity(
        new Studio.components.Bottom(25),
        new Studio.components.Left(25),
        new Studio.components.Height(200),
        new Studio.components.BackgroundColor({ h: 0, s: 1, l: 0.7, a: 1 }),
        new Studio.components.HorizontalStack([
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 210, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
          ecs.entity(
            new Studio.components.Width(50),
            new Studio.components.BackgroundColor({ h: 240, s: 1, l: 0.7, a: 1 })
          ),
          ecs.entity(new Studio.components.Width(25)),
        ]),
      ),
    ]),
  )
  ecs.set(
    new Studio.components.Renderer(webgl2),
    new Studio.components.UI(ui)
  )
  Studio.systems.render(ecs)
  return webgl2.element
}
