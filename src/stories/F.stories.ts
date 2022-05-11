import * as Studio from '../studio'

export default {
  title: "F",
}

export const Orthographic = () => {
  const [near, far] = [500, -500]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.orthographicCamera(ecs, { ...viewport, near, far })
  ecs.set(new Studio.ActiveCamera(camera))
  const f = Studio.prefabs.F(ecs)
    .set(new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
      new Studio.Root())
  let lastTime = 0
  let theta = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    theta += (currentTime - lastTime) / 1000
    f.set(new Studio.Rotate({
      x: theta / 2,
      y: theta,
      z: 0
    }))
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const Perspective = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = Studio.perspectiveCamera(ecs, { ...viewport, near, far, fieldOfView })
  ecs.set(new Studio.ActiveCamera(camera))
  const f = Studio.prefabs.F(ecs)
    .set(
      new Studio.Translate({ x: 0, y: 0, z: -300 }),
      new Studio.Root()
    )
  let lastTime = 0
  let theta = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    theta += (currentTime - lastTime) / 1000
    f.set(new Studio.Rotate({
      x: theta / 2,
      y: theta,
      z: 0
    }))
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const ManyFs = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = Studio.initECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const radius = 500
  const numFs = 10
  const tau = 2 * Math.PI
  const camera = Studio.perspectiveCamera(ecs, { ...viewport, near, far, fieldOfView })
    .set(new Studio.Translate({
      x: 50,
      y: -50,
      z: radius * 2,
    }))
  ecs.set(new Studio.ActiveCamera(camera))
  const fs = Array.from({ length: numFs }, (v, i) =>
    Studio.prefabs.F(ecs)
      .set(
        new Studio.Root(),
        new Studio.Rotate({
          x: 0,
          y: Math.PI,
          z: Math.PI,
        }),
        new Studio.Translate({
          x: Math.cos((i / numFs) * tau) * radius,
          y: 0,
          z: Math.sin((i / numFs) * tau) * radius
        })
      )
  )
  let moveForward = 0
  let moveBackward = 0
  let moveLeft = 0
  let moveRight = 0
  let moveUp = 0
  let moveDown = 0
  document.addEventListener('keydown', e => {
    if (e.key == 'ArrowUp') moveForward = 1
    else if (e.key == 'ArrowDown') moveBackward = 1
    else if (e.key == 'ArrowLeft') moveLeft = 1
    else if (e.key == 'ArrowRight') moveRight = 1
    else if (e.key == 'Shift') moveUp = 1
    else if (e.key == 'Control') moveDown = 1
  })
  document.addEventListener('keyup', e => {
    if (e.key == 'ArrowUp') moveForward = 0
    else if (e.key == 'ArrowDown') moveBackward = 0
    else if (e.key == 'ArrowLeft') moveLeft = 0
    else if (e.key == 'ArrowRight') moveRight = 0
    else if (e.key == 'Shift') moveUp = 0
    else if (e.key == 'Control') moveDown = 0
  })
  let lastTime = 0
  const speed = 500
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = (currentTime - lastTime) / 1000 * speed
    const translate = camera.get(Studio.Translate)!
    camera.set(new Studio.Translate({
      x: translate.x + (moveRight - moveLeft) * delta,
      y: translate.y + (moveUp - moveDown) * delta,
      z: translate.z + (moveBackward - moveForward) * delta
    }))
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}
