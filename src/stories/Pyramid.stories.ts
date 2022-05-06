import * as Studio from '../studio'

export default {
  title: "Pyramid",
}

export const Single = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = ecs.entity(
    Studio.perspectiveProjection({ ...viewport, near, far, fieldOfView })
  )
  ecs.set(new Studio.ActiveCamera(camera))
  ecs.entity(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: 0,
      y: 0,
      z: -100
    }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 50, y: 50, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  renderer.render(ecs)
  return renderer.element
}
