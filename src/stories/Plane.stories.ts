import * as Studio from '../studio'

export default {
  title: "Plane",
}

export const Square = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  renderer.render(ecs)
  return renderer.element
}

export const Rectangle = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Scale({ x: 150, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  renderer.render(ecs)
  return renderer.element
}

export const RotatingOnXAxis = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const plane = Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const rotate = plane.get(Studio.Rotate)!
    plane.set(new Studio.Rotate({
      x: rotate.x + deltaTime / 1000,
      y: rotate.y,
      z: rotate.z
    }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnYAxis = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const plane = Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const rotate = plane.get(Studio.Rotate)!
    plane.set(new Studio.Rotate({
      x: rotate.x,
      y: rotate.y + deltaTime / 1000,
      z: rotate.z
    }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnZAxis = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const plane = Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const rotate = plane.get(Studio.Rotate)!
    plane.set(new Studio.Rotate({
      x: rotate.x,
      y: rotate.y,
      z: rotate.z + deltaTime / 1000,
    }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnAllAxis = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const plane = Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
  let previousTime = 0
  let theta = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 1000
    const rotate = plane.get(Studio.Rotate)!
    plane.set(new Studio.Rotate({
      x: theta,
      y: theta,
      z: theta,
    }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const ThreePlanes = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const planes = [100, 250, 400].map(x => Studio.physicalEntity(ecs).set(
    Studio.planeGeometry(),
    new Studio.Translate({ x, y: x, z: 0 }),
    new Studio.Scale({ x: 100, y: 100, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  ))
  let previousTime = 0
  let theta = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    theta += (currentTime - previousTime) / 1000
    planes[0].set(new Studio.Rotate({ x: theta, y: 0, z: 0 }))
    planes[1].set(new Studio.Rotate({ x: 0, y: theta, z: 0 }))
    planes[2].set(new Studio.Rotate({ x: 0, y: 0, z: theta }))
    renderer.render(ecs)
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const TrackMouse = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  let mouseHeld = false
  const addPlane = (x, y, h) =>
    Studio.physicalEntity(ecs).set(
      Studio.planeGeometry(),
      new Studio.Translate({ x, y, z: 0 }),
      new Studio.Scale({ x: 10, y: 10, z: 1 }),
      new Studio.Fill({ h, s: 1, l: 0.7, a: 1 }),
      new Studio.Root(),
    )
  const plane = addPlane(viewport.width / 2, viewport.height / 2, 279)
  document.addEventListener('pointermove', e => {
    plane.set(new Studio.Translate({ x: e.x, y: e.y, z: 0 }))
    if (mouseHeld) {
      for (const c of e.getCoalescedEvents()) {
        addPlane(c.x, c.y, Math.floor(Math.random() * 360))
      }
    }
    renderer.render(ecs)
  })
  document.addEventListener('mousedown', e => {
    mouseHeld = true
    addPlane(e.x, e.y, Math.floor(Math.random() * 360))
    renderer.render(ecs)
  })
  document.addEventListener('mouseup', () => mouseHeld = false)
  let lastTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    for (const entity of ecs.query(Studio.Rotate)) {
      if (entity.id === camera.id) continue
      const rotate = entity.get(Studio.Rotate)!
      entity.set(new Studio.Rotate({
        x: rotate.x + (currentTime - lastTime) / 1000,
        y: rotate.y,
        z: rotate.z,
      }))
    }
    lastTime = currentTime
    renderer.render(ecs)
  }
  requestAnimationFrame(update)
  return renderer.element
}

