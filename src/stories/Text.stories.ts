import * as Studio from '../studio'

export default {
  title: "Text",
}

export const Text = () => {
  const ecs = new Studio.ECS()
  const renderer = Studio.renderer.webgl2(ecs, 500, 500)
  const root = Studio.ui.text(ecs, "Hello Crazy World!")
  ecs.set(new Studio.components.UIRoot(root))
  Studio.systems.render(ecs)
  return renderer.get(HTMLCanvasElement)!
}