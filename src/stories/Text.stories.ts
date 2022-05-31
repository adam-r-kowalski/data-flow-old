import * as Studio from '../studio'

const { ECS, Renderer } = Studio
const { UIRoot, Alignment } = Studio.components
const { text, center, column, row, container, scene, connection } = Studio.ui
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

export const NodeWithColors = () => {
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
          column(ecs, { crossAxisAlignment: Alignment.END }, [
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

export const Node = () => {
  const ecs = new ECS()
  const renderer = new Renderer(500, 500)
  const root = center(ecs,
    container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 10 },
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
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}

export const Scene = () => {
  const ecs = new ECS()
  const renderer = new Renderer(800, 500)
  const sourceOut = container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } })
  const source = container(ecs, { color: { h: 110, s: 1, l: 0.3, a: 1 }, padding: 10, x: 25, y: 200 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      container(ecs, { padding: 5 }, text(ecs, "Source")),
      container(ecs, { height: 10 }),
      row(ecs, [
        column(ecs, [
          row(ecs, [
            container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } }),
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
          ]),
          row(ecs, [
            container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } }),
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
          ]),
        ]),
        container(ecs, { width: 30 }),
        column(ecs, { crossAxisAlignment: Alignment.END }, [
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
            container(ecs, { width: 5 }),
            sourceOut
          ]),
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
            container(ecs, { width: 5 }),
            container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } })
          ]),
        ])
      ])
    ])
  )
  const transformIn = container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
  const transformOut = container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
  const transform = container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 10, x: 300, y: 100 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      container(ecs, { padding: 5 }, text(ecs, "Transform")),
      container(ecs, { height: 10 }),
      row(ecs, [
        column(ecs, [
          row(ecs, [
            transformIn,
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
          ]),
          row(ecs, [
            container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } }),
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
          ]),
        ]),
        container(ecs, { width: 30 }),
        column(ecs, { crossAxisAlignment: Alignment.END }, [
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
            container(ecs, { width: 5 }),
            container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
          ]),
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
            container(ecs, { width: 5 }),
            transformOut
          ]),
        ])
      ])
    ])
  )
  const sinkIn = container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
  const sink = container(ecs, { color: { h: 310, s: 1, l: 0.3, a: 1 }, padding: 10, x: 550, y: 250 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      container(ecs, { padding: 5 }, text(ecs, "Sink")),
      container(ecs, { height: 10 }),
      row(ecs, [
        column(ecs, [
          row(ecs, [
            container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } }),
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
          ]),
          row(ecs, [
            sinkIn,
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
          ]),
        ]),
        container(ecs, { width: 30 }),
        column(ecs, { crossAxisAlignment: Alignment.END }, [
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
            container(ecs, { width: 5 }),
            container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
          ]),
          row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
            container(ecs, { width: 5 }),
            container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
          ]),
        ])
      ])
    ])
  )
  const root = scene(ecs, {
    children: [source, transform, sink],
    connections: [
      connection(ecs, { from: sourceOut, to: transformIn }),
      connection(ecs, { from: transformOut, to: sinkIn }),
    ]
  })
  ecs.set(renderer, new UIRoot(root))
  render(ecs)
  return renderer.canvas
}