import * as Studio from '../studio'

const { ECS } = Studio
const { UIRoot, Alignment } = Studio.components
const { text, center, column, row } = Studio.ui
const { render } = Studio.systems
const { webgl2 } = Studio.renderer


export default {
  title: "Text",
}

export const Text = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = text(ecs, "This is some text!")
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const Center = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = center(ecs,
    text(ecs, "This text is centered!")
  )
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const Column = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = column(ecs, [
    text(ecs, "First"),
    text(ecs, "Second"),
    text(ecs, "Third"),
  ])
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const CenteredColumn = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = center(ecs,
    column(ecs, [
      text(ecs, "First"),
      text(ecs, "Second"),
      text(ecs, "Third"),
    ])
  )
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const Row = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = row(ecs, [
    text(ecs, "First"),
    text(ecs, "Second"),
    text(ecs, "Third"),
  ])
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const CenteredRow = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = center(ecs,
    row(ecs, [
      text(ecs, "First"),
      text(ecs, "Second"),
      text(ecs, "Third"),
    ])
  )
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const CenteredRowInColumn = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = center(ecs,
    column(ecs, [
      text(ecs, "Top"),
      row(ecs, [
        text(ecs, "Left"),
        text(ecs, "Middle"),
        text(ecs, "Right"),
      ])
    ])
  )
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const CenteredRowInColumCenterCrossAxisAlignment = () => {
  const ecs = new ECS()
  const renderer = webgl2(ecs, 500, 500)
  const root = center(ecs,
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
      text(ecs, "Top"),
      row(ecs, [
        text(ecs, "Left"),
        text(ecs, "Middle"),
        text(ecs, "Right"),
      ])
    ])
  )
  ecs.set(new UIRoot(root))
  render(ecs)
  return renderer.get(HTMLCanvasElement)!
}
