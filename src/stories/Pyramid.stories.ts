import * as Studio from '../studio'

export default {
  title: "Pyramid",
}

const pyramidGeometry = () =>
  new Studio.Geometry({
    vertices: [
      0, 0.5, 0,
      -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
      0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5,
    ],
    indices: [
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 1,
      3, 2, 1,
      1, 4, 3,
    ]
  })

const initPyramid = (ecs: Studio.ECS) =>
  ecs.entity(
    pyramidGeometry(),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 279, s: 1, l: 0.7, a: 1 }),
  )

export const Single = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = ecs.entity(
    Studio.perspectiveProjection({ ...viewport, near, far, fieldOfView }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
  )
  ecs.set(new Studio.ActiveCamera(camera))
  const pyramid = initPyramid(ecs).set(
    new Studio.Translate({ x: 0, y: 0, z: -100 }),
    new Studio.Scale({ x: 50, y: 50, z: 50 }),
    new Studio.Root(),
  )
  let previousTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = (currentTime - previousTime) / 1000
    pyramid.update(Studio.Rotate, rotate => {
      rotate.y += delta
      rotate.x += delta
    })
    previousTime = currentTime
    renderer.render(ecs)
  }
  requestAnimationFrame(update)
  return renderer.element
}

const levelOne = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Children([
      initPyramid(ecs).set(new Studio.Translate({ x: -0.5, y: -0.5, z: -0.5 })),
      initPyramid(ecs).set(new Studio.Translate({ x: 0.5, y: -0.5, z: -0.5 })),
      initPyramid(ecs).set(new Studio.Translate({ x: -0.5, y: -0.5, z: 0.5 })),
      initPyramid(ecs).set(new Studio.Translate({ x: 0.5, y: -0.5, z: 0.5 })),
      initPyramid(ecs).set(new Studio.Translate({ x: 0, y: 0.5, z: 0 })),
    ])
  )

const levelTwo = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Children([
      levelOne(ecs).set(new Studio.Translate({ x: -1, y: 0, z: -1 })),
      levelOne(ecs).set(new Studio.Translate({ x: 1, y: 0, z: -1 })),
      levelOne(ecs).set(new Studio.Translate({ x: -1, y: 0, z: 1 })),
      levelOne(ecs).set(new Studio.Translate({ x: 1, y: 0, z: 1 })),
      levelOne(ecs).set(new Studio.Translate({ x: 0, y: 2, z: 0 })),
    ]),
  )

const levelThree = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Children([
      levelTwo(ecs).set(new Studio.Translate({ x: -2, y: 0, z: -2 })),
      levelTwo(ecs).set(new Studio.Translate({ x: 2, y: 0, z: -2 })),
      levelTwo(ecs).set(new Studio.Translate({ x: -2, y: 0, z: 2 })),
      levelTwo(ecs).set(new Studio.Translate({ x: 2, y: 0, z: 2 })),
      levelTwo(ecs).set(new Studio.Translate({ x: 0, y: 4, z: 0 })),
    ]),
  )

export const SierpinskiPyramid = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = ecs.entity(
    Studio.perspectiveProjection({ ...viewport, near, far, fieldOfView }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
  )
  ecs.set(new Studio.ActiveCamera(camera))
  const fractal = levelThree(ecs).set(
    new Studio.Translate({ x: 0, y: 0, z: -10 }),
    new Studio.Root(),
  )
  let previousTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = currentTime - previousTime
    for (const entity of ecs.query(Studio.Rotate)) {
      if (entity.id === camera.id) continue
      entity.update(Studio.Rotate, rotate => rotate.y += delta / 5000)
    }
    previousTime = currentTime
    renderer.render(ecs)
  }
  requestAnimationFrame(update)
  return renderer.element
}
