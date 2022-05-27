import * as Studio from '../studio'

export default {
  title: "Text",
}

export const Text = () => {
  const ecs = new Studio.ECS()
  const renderer = Studio.renderer.webgl2(ecs, 500, 500)
  const root = Studio.ui.text(ecs, "This is some text!")
  ecs.set(new Studio.components.UIRoot(root))
  Studio.systems.render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const Center = () => {
  const ecs = new Studio.ECS()
  const renderer = Studio.renderer.webgl2(ecs, 500, 500)
  const root = Studio.ui.center(ecs,
    Studio.ui.text(ecs, "This text is centered!")
  )
  ecs.set(new Studio.components.UIRoot(root))
  Studio.systems.render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const Column = () => {
  const ecs = new Studio.ECS()
  const renderer = Studio.renderer.webgl2(ecs, 500, 500)
  const root = Studio.ui.column(ecs, [
    Studio.ui.text(ecs, "First"),
    Studio.ui.text(ecs, "Second"),
    Studio.ui.text(ecs, "Third"),
  ])
  ecs.set(new Studio.components.UIRoot(root))
  Studio.systems.render(ecs)
  return renderer.get(HTMLCanvasElement)!
}

export const CenteredColumn = () => {
  const ecs = new Studio.ECS()
  const renderer = Studio.renderer.webgl2(ecs, 500, 500)
  const root = Studio.ui.center(ecs,
    Studio.ui.column(ecs, [
      Studio.ui.text(ecs, "First"),
      Studio.ui.text(ecs, "Second"),
      Studio.ui.text(ecs, "Third"),
    ]))
  ecs.set(new Studio.components.UIRoot(root))
  Studio.systems.render(ecs)
  return renderer.get(HTMLCanvasElement)!
}