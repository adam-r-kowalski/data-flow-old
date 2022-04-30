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


export const Benchmark = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  const planes = []
  for (let i = 0; i < 20000; ++i) {
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
      new WireFrame({ h, s, l: l - 0.3, a: 1 }),
    ))
  }
  let previousTime = 0
  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    const theta = deltaTime / 1000
    planes.forEach((p, i) => {
      if (i % 2 == 0) {
        p.get(Rotate).x += theta
      }
      else if (i % 3 == 0) {
        p.get(Rotate).y += theta
      }
      else {
        p.get(Rotate).z += theta
      }

    })
    renderer.render()
    previousTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}
