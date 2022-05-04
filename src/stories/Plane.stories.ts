import { Renderer } from '../webgl_renderer'
import { ECS } from '../ecs'
import { Geometry, Translate, Rotate, Scale, Fill, planeGeometry, orthographicProjection, ActiveCamera } from '../components'

export default {
  title: "Plane",
}

export const Square = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  renderer.render(ecs)
  return renderer.element
}

export const Rectangle = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 150, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  renderer.render(ecs)
  return renderer.element
}

export const RotatingOnXAxis = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  const plane = ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate)!.x += deltaTime / 1000
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnYAxis = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  const plane = ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate)!.y += deltaTime / 1000
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnZAxis = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  const plane = ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate)!.z += deltaTime / 1000
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnAllAxis = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  const plane = ecs.entity(
    planeGeometry(),
    new Translate({ x: viewport.width / 2, y: viewport.height / 2, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  let theta = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 1000
    plane.set(new Rotate({ x: theta, y: theta, z: theta }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const ThreePlanes = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  const planes = [100, 250, 400].map(x => ecs.entity(
    planeGeometry(),
    new Translate({ x, y: x, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  ))
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const theta = deltaTime / 1000
    planes[0].get(Rotate)!.x += theta
    planes[1].get(Rotate)!.y += theta
    planes[2].get(Rotate)!.z += theta
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const TrackMouse = () => {
  const [near, far] = [500, -500]
  const ecs = new ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Renderer(viewport)
  const camera = ecs.entity(orthographicProjection({ ...viewport, near, far }))
  ecs.set(new ActiveCamera(camera))
  let mouseHeld = false
  const addPlane = (x, y) =>
    ecs.entity(
      planeGeometry(),
      new Translate({ x, y, z: 0 }),
      new Rotate({ x: 0, y: 0, z: 0 }),
      new Scale({ x: 10, y: 10, z: 1 }),
      new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    )
  const plane = addPlane(viewport.width / 2, viewport.height / 2)
  document.addEventListener('pointermove', e => {
    plane.set(new Translate({ x: e.x, y: e.y, z: 0 }))
    if (mouseHeld) {
      for (const c of e.getCoalescedEvents()) {
        addPlane(c.x, c.y)
      }
    }
    renderer.render(ecs)
  })
  document.addEventListener('mousedown', e => {
    mouseHeld = true
    addPlane(e.x, e.y)
    renderer.render(ecs)
  })
  document.addEventListener('mouseup', () => mouseHeld = false)
  renderer.render(ecs)
  return renderer.element
}

