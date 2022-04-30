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
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(100, 100, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )
  return renderer.element
}

export const Rectangle = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    Plane(),
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(300, 200, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )
  return renderer.element
}

export const RotatingOnXAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)

  const plane = ecs.entity(
    Plane(),
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(100, 100, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )

  let previousTime = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).x += deltaTime / 2000
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
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(100, 100, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )

  let previousTime = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).y += deltaTime / 2000
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
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(100, 100, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )

  let previousTime = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    plane.get(Rotate).z += deltaTime / 2000
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
    new Translate(200, 200, 0),
    new Rotate(0, 0, 0),
    new Scale(100, 100, 1),
    new Fill(279, 1, 0.7, 1),
    new WireFrame(279, 1, 0.3, 1),
  )

  let previousTime = 0
  let theta = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 2000
    plane.set(new Rotate(theta, theta, theta))
    renderer.render()
    previousTime = currentTime
  }

  requestAnimationFrame(update)

  return renderer.element
}

