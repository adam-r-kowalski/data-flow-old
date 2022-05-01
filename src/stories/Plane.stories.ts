import { Renderer } from '../webgl_renderer'
import { ECS } from '../ecs'
import { Geometry, Translate, Rotate, Scale, Fill, Plane } from '../components'

export default {
  title: "Plane",
}

export const Square = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  return renderer.element
}

export const Rectangle = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 150, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  return renderer.element
}

export const RotatingOnXAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const plane = ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).x += deltaTime / 1000
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnYAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const plane = ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).y += deltaTime / 1000
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnZAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const plane = ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 100, y: 100, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).z += deltaTime / 1000
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const RotatingOnAllAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const plane = ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
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
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const ThreePlanes = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const planes = [200, 400, 600].map(x => ecs.entity(
    Plane(),
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
    planes[0].get(Rotate).x += theta
    planes[1].get(Rotate).y += theta
    planes[2].get(Rotate).z += theta
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const TrackMouse = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const plane = ecs.entity(
    Plane(),
    new Translate({ x: 200, y: 200, z: 0 }),
    new Rotate({ x: 0, y: 0, z: 0 }),
    new Scale({ x: 10, y: 10, z: 1 }),
    new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )
  let mouse = {
    x: 200,
    y: 200,
    held: false
  }
  document.addEventListener('mousemove', e => {
    mouse.x = e.x
    mouse.y = e.y
    plane.set(new Translate({ x: e.x, y: e.y, z: 0 }))
    renderer.render()
  })
  const onMouseHeld = () => {
    if (mouse.held) {
      requestAnimationFrame(onMouseHeld)
    }
    ecs.entity(
      Plane(),
      new Translate({ x: mouse.x, y: mouse.y, z: 0 }),
      new Rotate({ x: 0, y: 0, z: 0 }),
      new Scale({ x: 10, y: 10, z: 1 }),
      new Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
    )
    renderer.render()
  }
  document.addEventListener('mousedown', e => {
    mouse.held = true
    requestAnimationFrame(onMouseHeld)
  })
  document.addEventListener('mouseup', e => mouse.held = false)
  return renderer.element
}

export const Benchmark = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const planes = []
  for (let i = 0; i < 10000; ++i) {
    const x = Math.floor(Math.random() * 1000)
    const y = Math.floor(Math.random() * 1000)
    const h = Math.floor(Math.random() * 360)
    const s = Math.random() * (0.9 - 0.5) + 0.5
    const l = Math.random() * (0.7 - 0.4) + 0.4
    planes.push(ecs.entity(
      Plane(),
      new Translate({ x, y, z: 0 }),
      new Rotate({ x: 0, y: 0, z: 0 }),
      new Scale({ x: 25, y: 25, z: 1 }),
      new Fill({ h, s, l, a: 1 }),
    ))
  }
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const deltaRotate = deltaTime / 500
    planes.forEach((p, i) => {
      const rotate = p.get(Rotate)
      if (i % 2 == 0) {
        rotate.x += deltaRotate
      }
      else if (i % 3 == 0) {
        rotate.y += deltaRotate
      }
      else {
        rotate.z += deltaRotate
      }

    })
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}
