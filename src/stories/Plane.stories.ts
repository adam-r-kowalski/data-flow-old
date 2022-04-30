import { Renderer } from '../webgl_renderer'
import { ECS } from '../ecs'
import { Geometry, Translate, Rotate, Scale, PlaneGeometry } from '../components'

export default {
  title: "PlaneGeometry",
}

export const Square = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(500, 500, 1)
  )
  return renderer.element
}

export const Rectangle = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(750, 250, 1)
  )
  return renderer.element
}

export const TopLeft = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)
  ecs.entity(
    PlaneGeometry(),
    new Translate(600, 300, 0),
    new Rotate(0, 0, 0),
    new Scale(750, 250, 1)
  )
  return renderer.element
}

export const RotatingOnXAxis = () => {
  const ecs = new ECS()
  const renderer = new Renderer(ecs)

  const plane = ecs.entity(
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(500, 500, 1)
  )

  let previousTime = 0
  let theta = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 2000
    plane.set(new Rotate(theta, 0, 0))
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
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(500, 500, 1)
  )

  let previousTime = 0
  let theta = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 2000
    plane.set(new Rotate(0, theta, 0))
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
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(500, 500, 1)
  )

  let previousTime = 0
  let theta = 0

  const update = (currentTime: number): void => {
    requestAnimationFrame(update)
    const deltaTime = currentTime - previousTime
    theta += deltaTime / 2000
    plane.set(new Rotate(0, 0, theta))
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
    PlaneGeometry(),
    new Translate(1500, 900, 0),
    new Rotate(0, 0, 0),
    new Scale(500, 500, 1)
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

