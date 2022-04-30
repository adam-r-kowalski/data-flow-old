import { Renderer } from '../webgl_renderer'
import { ECS } from '../ecs'
import { Geometry, Translate, Rotate, Scale, Fill, WireFrame, Plane } from '../components'

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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
    new WireFrame({ h: 279, s: 1, l: 0.3, a: 1 }),
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
  const planes = [200, 400, 600].map(x => {
    const h = Math.floor(Math.random() * 360)
    const s = Math.random() * (0.9 - 0.5) + 0.5
    const l = Math.random() * (0.7 - 0.4) + 0.4
    return ecs.entity(
      Plane(),
      new Translate({ x, y: 200, z: 0 }),
      new Rotate({ x: 0, y: 0, z: 0 }),
      new Scale({ x: 100, y: 100, z: 1 }),
      new Fill({ h, s, l, a: 1 }),
      new WireFrame({ h, s, l: l - 0.3, a: 1 }),
    )
  })
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
