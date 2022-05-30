import * as Studio from '../studio'

const { ECS, Renderer } = Studio
const { UIRoot, Alignment } = Studio.components
const { text, center, column, row, container } = Studio.ui
const { render } = Studio.systems

export default {
  title: "Text",
}

export const Text = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = text(ecs, "This is some text!")
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Center = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    text(ecs, "This text is centered!")
  )
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Column = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = column(ecs, [
    text(ecs, "Top"),
    text(ecs, "Middle"),
    text(ecs, "Bottom"),
  ])
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumn = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    column(ecs, [
      text(ecs, "Top"),
      text(ecs, "Middle"),
      text(ecs, "Bottom"),
    ])
  )
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Row = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = row(ecs, [
    text(ecs, "Left"),
    text(ecs, "Middle"),
    text(ecs, "Right"),
  ])
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredRow = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    row(ecs, [
      text(ecs, "Left"),
      text(ecs, "Middle"),
      text(ecs, "Right"),
    ])
  )
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumn = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredRowInColumEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRow = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRowCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnInRowEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRow = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRowCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const CenteredColumnCenterCrossAxisAlignedInRowEndCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Container = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      container(ecs, { color: { h: 0, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, "First")),
      container(ecs, { color: { h: 90, s: 1, l: 0.3, a: 1 }, padding: 10 }, text(ecs, "Second")),
      container(ecs, { color: { h: 180, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, "Third")),
    ])
  )
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Node = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    container(ecs, { color: { h: 0, s: 1, l: 0.3, a: 1 } },
      column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { color: { h: 30, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, "Title")),
        row(ecs, [
          column(ecs, [
            container(ecs, { color: { h: 60, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "x")),
            container(ecs, { color: { h: 90, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "y")),
            container(ecs, { color: { h: 120, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "width")),
            container(ecs, { color: { h: 150, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "height")),
          ]),
          column(ecs, [
            container(ecs, { color: { h: 180, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "rectangle")),
            container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 5 }, text(ecs, { fontSize: 18 }, "is square?")),
          ])
        ])
      ])
    )
  )
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}