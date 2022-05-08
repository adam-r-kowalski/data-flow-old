import * as Studio from '../studio'

export default {
  title: "F",
}

const degToRad = (d: number): number => d * Math.PI / 180

const leftColumnFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        0, 0, 0,
        0, 150, 0,
        30, 0, 0,
        30, 150, 0,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )

const topRungFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 0, 0,
        30, 30, 0,
        100, 0, 0,
        100, 30, 0,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const middleRungFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 60, 0,
        30, 90, 0,
        67, 60, 0,
        67, 90, 0,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const leftColumnBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        30, 150, 30,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const topRungBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        100, 30, 30,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )


const middleRungBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        67, 90, 30,
      ],
      indices: [
        0, 1, 2,
        1, 3, 2,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const top = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 30,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 90, s: 1, l: 0.7, a: 1 }),
  )

const topRungRight = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 30,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 120, s: 1, l: 0.7, a: 1 }),
  )

const underTopRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        100, 30, 0,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 150, s: 1, l: 0.7, a: 1 }),
  )

const betweenTopRungAndMiddle = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 30, 0,
        30, 60, 30,
        30, 30, 30,
        30, 60, 0,
        30, 60, 30,
      ],
      indices: [
        0, 1, 2,
        0, 3, 4,

      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 180, s: 1, l: 0.7, a: 1 }),
  )

const topOfMiddleRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 60, 0,
        67, 60, 30,
        30, 60, 30,
        67, 60, 0,
      ],
      indices: [
        0, 1, 2,
        0, 3, 1,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 210, s: 1, l: 0.7, a: 1 }),
  )

const rightOfMiddleRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        67, 60, 0,
        67, 90, 30,
        67, 60, 30,
        67, 90, 0,
      ],
      indices: [
        0, 1, 2,
        0, 3, 1,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 240, s: 1, l: 0.7, a: 1 }),
  )

const bottomOfMiddleRing = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        67, 90, 0,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 270, s: 1, l: 0.7, a: 1 }),
  )

const rightOfBottom = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        30, 90, 0,
        30, 150, 30,
        30, 90, 30,
        30, 150, 0,
      ],
      indices: [
        0, 1, 2,
        0, 3, 1,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 300, s: 1, l: 0.7, a: 1 }),
  )

const bottom = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        30, 150, 0,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 330, s: 1, l: 0.7, a: 1 }),
  )

const leftSide = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry({
      vertices: [
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 150, 0,
      ],
      indices: [
        0, 1, 2,
        0, 2, 3,
      ]
    }),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 360, s: 1, l: 0.7, a: 1 }),
  )


const F = (ecs: Studio.ECS): Studio.Entity =>
  ecs.entity(
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Root(),
    new Studio.Children([
      leftColumnFront(ecs),
      topRungFront(ecs),
      middleRungFront(ecs),
      leftColumnBack(ecs),
      topRungBack(ecs),
      middleRungBack(ecs),
      top(ecs),
      topRungRight(ecs),
      underTopRung(ecs),
      betweenTopRungAndMiddle(ecs),
      topOfMiddleRung(ecs),
      rightOfMiddleRung(ecs),
      bottomOfMiddleRing(ecs),
      rightOfBottom(ecs),
      bottom(ecs),
      leftSide(ecs),
    ]),
  )

export const Orthographic = () => {
  const [near, far] = [500, -500]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = ecs.entity(
    Studio.orthographicProjection({ ...viewport, near, far })
  )
  ecs.set(new Studio.ActiveCamera(camera))
  const f = F(ecs).set(
    new Studio.Translate({
      x: viewport.width / 2,
      y: viewport.height / 2,
      z: 0
    }),
  )
  let lastTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = (currentTime - lastTime) / 1000
    f.update(Studio.Rotate, rotate => {
      rotate.y += delta
      rotate.x += delta / 2
    })
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const Perspective = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 500, height: 500 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const camera = ecs.entity(
    Studio.perspectiveProjection({ ...viewport, near, far, fieldOfView })
  )
  ecs.set(new Studio.ActiveCamera(camera))
  const f = F(ecs).set(new Studio.Translate({ x: 0, y: 0, z: -300 }))
  let lastTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = (currentTime - lastTime) / 1000
    f.update(Studio.Rotate, rotate => {
      rotate.y += delta
      rotate.x += delta / 2
    })
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}

export const ManyFs = () => {
  const [near, far, fieldOfView] = [1, 2000, Math.PI / 2]
  const ecs = new Studio.ECS()
  const viewport = { x: 0, y: 0, width: 1000, height: 1000 }
  const renderer = new Studio.renderer.WebGL2(viewport)
  const numFs = 5
  const radius = 300
  const fs = Array.from({ length: numFs }, (v, i) => {
    const angle = i * Math.PI * 2 / numFs
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return F(ecs).set(
      new Studio.Translate({ x, y: 0, z }),
      new Studio.Rotate({ x: 0, y: Math.PI, z: Math.PI })
    )
  })
  const camera = ecs.entity(
    Studio.perspectiveProjection({ ...viewport, near, far, fieldOfView }),
    new Studio.Translate({ x: 0, y: -50, z: radius * 2 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.LookAt(fs[0]),
  )
  ecs.set(new Studio.ActiveCamera(camera))
  let move = new Studio.Vec3(0, 0, 0)
  let moveForward = 0
  let moveBackward = 0
  let moveLeft = 0
  let moveRight = 0
  let moveUp = 0
  let moveDown = 0
  document.addEventListener('keydown', e => {
    if (e.key == 'e') moveForward = 1
    else if (e.key == 'd') moveBackward = 1
    else if (e.key == 's') moveLeft = 1
    else if (e.key == 'f') moveRight = 1
    else if (e.key == 'r') moveUp = 1
    else if (e.key == 'w') moveDown = 1
  })
  document.addEventListener('keyup', e => {
    if (e.key == 'e') moveForward = 0
    else if (e.key == 'd') moveBackward = 0
    else if (e.key == 's') moveLeft = 0
    else if (e.key == 'f') moveRight = 0
    else if (e.key == 'r') moveUp = 0
    else if (e.key == 'w') moveDown = 0
  })
  let then = 0
  const speed = 300
  const update = (now: number) => {
    requestAnimationFrame(update)
    const delta = (now - then) / 1000 * speed
    let move = new Studio.Vec3(moveRight - moveLeft, moveUp - moveDown, moveBackward - moveForward)
      .normalize()
      .scale(delta)
    camera.update(Studio.Translate, translate => {
      translate.x += move.x
      translate.y += move.y
      translate.z += move.z
    })
    then = now
    renderer.render(ecs)
  }
  requestAnimationFrame(update)
  return renderer.element
}
