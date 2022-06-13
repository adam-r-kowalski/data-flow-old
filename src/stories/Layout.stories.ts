import { Camera, Color, Transform } from '../components'
import { Mat3 } from '../linear_algebra'
import * as Studio from '../studio'
const { ECS, Renderer } = Studio
const { UIRoot, Alignment } = Studio.components
const { text, center, column, row, container, scene, connection } = Studio.ui
const { render } = Studio.systems

export default {
  title: "Layout",
}

const rendererWithSize = (width: number, height: number) => {
  const renderer = new Renderer(width, height)
  renderer.canvas.style.width = '500px'
  renderer.canvas.style.height = '500px'
  return renderer
}

export const Text = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = text(ecs, "This is some text!")
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Center = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    text(ecs, "This text is centered!")
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Column = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = column(ecs, [
    text(ecs, "Top"),
    text(ecs, "Middle"),
    text(ecs, "Bottom"),
  ])
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumn = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    column(ecs, [
      text(ecs, "Top"),
      text(ecs, "Middle"),
      text(ecs, "Bottom"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Row = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = row(ecs, [
    text(ecs, "Left"),
    text(ecs, "Middle"),
    text(ecs, "Right"),
  ])
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredRow = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, [
      text(ecs, "Left"),
      text(ecs, "Middle"),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumn = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    column(ecs, [
      text(ecs, "Top"),
      row(ecs, [
        text(ecs, "Left"),
        text(ecs, "Middle"),
        text(ecs, "Right"),
      ]),
      text(ecs, "Bottom"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      text(ecs, "Top"),
      row(ecs, [
        text(ecs, "Left"),
        text(ecs, "Middle"),
        text(ecs, "Right"),
      ]),
      text(ecs, "Bottom"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    column(ecs, { crossAxisAlignment: Alignment.END }, [
      text(ecs, "Top"),
      row(ecs, [
        text(ecs, "Left"),
        text(ecs, "Middle"),
        text(ecs, "Right"),
      ]),
      text(ecs, "Bottom"),
    ]),
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRow = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, [
      text(ecs, "Left"),
      column(ecs, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRowCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      text(ecs, "Left"),
      column(ecs, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRowEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, { crossAxisAlignment: Alignment.END }, [
      text(ecs, "Left"),
      column(ecs, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRow = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, [
      text(ecs, "Left"),
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRowCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      text(ecs, "Left"),
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRowEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    row(ecs, { crossAxisAlignment: Alignment.END }, [
      text(ecs, "Left"),
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        text(ecs, "Top"),
        text(ecs, "Middle"),
        text(ecs, "Bottom"),
      ]),
      text(ecs, "Right"),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Container = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      container(ecs, { color: new Color(255, 0, 0, 255), padding: 5 }, text(ecs, "First")),
      container(ecs, { color: new Color(0, 255, 0, 255), padding: 10 }, text(ecs, "Second")),
      container(ecs, { color: new Color(0, 0, 255, 255), padding: 5 }, text(ecs, "Third")),
    ])
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const NodeWithColors = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    container(ecs, { color: new Color(255, 0, 0, 255) },
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { color: new Color(0, 0, 255, 255), padding: 5 }, text(ecs, "Title")),
        row(ecs, [
          column(ecs, [
            container(ecs, { color: new Color(0, 255, 0, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "x")),
            container(ecs, { color: new Color(0, 255, 0, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "y")),
            container(ecs, { color: new Color(0, 255, 0, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "width")),
            container(ecs, { color: new Color(0, 255, 0, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "height")),
          ]),
          column(ecs, { crossAxisAlignment: Alignment.END }, [
            container(ecs, { color: new Color(128, 0, 128, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "rectangle")),
            container(ecs, { color: new Color(128, 0, 128, 255), padding: 5 }, text(ecs, { fontSize: 18 }, "is square?")),
          ])
        ])
      ])
    )
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Node = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const root = center(ecs,
    container(ecs, { color: new Color(255, 0, 0, 255), padding: 10 },
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Title")),
        container(ecs, { height: 10 }),
        row(ecs, [
          column(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "x")),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "y")),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "width")),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "height")),
          ]),
          container(ecs, { width: 50 }),
          column(ecs, { crossAxisAlignment: Alignment.END }, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "rectangle")),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "is square?")),
          ])
        ])
      ])
    )
  )
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}

export const Scene = () => {
  const ecs = new ECS()
  const renderer = rendererWithSize(500, 500)
  const a = container(ecs, { color: new Color(255, 0, 0, 255), padding: 10, x: 50, y: 150 },
    text(ecs, { fontSize: 18 }, "a")
  )
  const b = container(ecs, { color: new Color(0, 255, 0, 255), padding: 10, x: 400, y: 250 },
    text(ecs, { fontSize: 18 }, "b")
  )
  const root = scene(ecs, {
    children: [a, b],
    connections: [
      connection(ecs, { from: a, to: b }),
    ]
  })
  const camera = ecs.entity(new Transform(Mat3.identity()))
  ecs.set(renderer, new UIRoot(root), new Camera(camera))
  render(ecs)
  return renderer.canvas
}