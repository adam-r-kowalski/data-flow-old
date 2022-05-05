import * as Studio from '../studio'

export default {
  title: "F",
}

const degToRad = (d: number): number => d * Math.PI / 180

const leftColumnFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        0, 0, 0,
        0, 150, 0,
        30, 0, 0,
        30, 150, 0,
      ],
      [
        0, 1, 2,
        1, 3, 2,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )

const topRungFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 0, 0,
        30, 30, 0,
        100, 0, 0,
        100, 30, 0,
      ],
      [
        0, 1, 2,
        1, 3, 2,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const middleRungFront = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 60, 0,
        30, 90, 0,
        67, 60, 0,
        67, 90, 0,
      ],
      [
        0, 1, 2,
        1, 3, 2,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const leftColumnBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        30, 150, 30,
      ],
      [
        0, 1, 2,
        1, 3, 2,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const topRungBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        100, 30, 30,
      ],
      [
        0, 1, 2,
        1, 3, 2,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )


const middleRungBack = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        67, 90, 30,
      ],
      [
        0, 1, 2,
        1, 3, 2,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const top = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 30,
      ],
      [
        0, 1, 2,
        0, 2, 3,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 90, s: 1, l: 0.7, a: 1 }),
  )

const topRungRight = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 30,
      ],
      [
        0, 1, 2,
        0, 2, 3,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 120, s: 1, l: 0.7, a: 1 }),
  )

const underTopRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        100, 30, 0,
      ],
      [
        0, 1, 2,
        0, 2, 3,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 150, s: 1, l: 0.7, a: 1 }),
  )

const betweenTopRungAndMiddle = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 30, 0,
        30, 60, 30,
        30, 30, 30,
        30, 60, 0,
        30, 60, 30,
      ],
      [
        0, 1, 2,
        0, 3, 4,

      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 180, s: 1, l: 0.7, a: 1 }),
  )

const topOfMiddleRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 60, 0,
        67, 60, 30,
        30, 60, 30,
        67, 60, 0,
      ],
      [
        0, 1, 2,
        0, 3, 1,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 210, s: 1, l: 0.7, a: 1 }),
  )

const rightOfMiddleRung = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        67, 60, 0,
        67, 90, 30,
        67, 60, 30,
        67, 90, 0,
      ],
      [
        0, 1, 2,
        0, 3, 1,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 240, s: 1, l: 0.7, a: 1 }),
  )

const bottomOfMiddleRing = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        67, 90, 0,
      ],
      [
        0, 1, 2,
        0, 2, 3,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 270, s: 1, l: 0.7, a: 1 }),
  )

const rightOfBottom = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        30, 90, 0,
        30, 150, 30,
        30, 90, 30,
        30, 150, 0,
      ],
      [
        0, 1, 2,
        0, 3, 1,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 300, s: 1, l: 0.7, a: 1 }),
  )

const bottom = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        30, 150, 0,
      ],
      [
        0, 1, 2,
        0, 2, 3,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 330, s: 1, l: 0.7, a: 1 }),
  )

const leftSide = (ecs: Studio.ECS) =>
  ecs.entity(
    new Studio.Geometry(
      [
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 150, 0,
      ],
      [
        0, 1, 2,
        0, 2, 3,
      ]
    ),
    new Studio.Translate({ x: 0, y: 0, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
    new Studio.Fill({ h: 360, s: 1, l: 0.7, a: 1 }),
  )


const F = (ecs: Studio.ECS): Studio.Entity =>
  ecs.entity(
    new Studio.Translate({ x: 250, y: 250, z: 0 }),
    new Studio.Rotate({ x: degToRad(40), y: degToRad(25), z: degToRad(325) }),
    new Studio.Scale({ x: 1, y: 1, z: 1 }),
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
    new Studio.Root()
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
  const f = F(ecs)
  let lastTime = 0
  const update = (currentTime: number) => {
    requestAnimationFrame(update)
    const delta = (currentTime - lastTime) / 1000
    const rotate = f.get(Studio.Rotate)!
    rotate.y += delta
    rotate.x += delta / 2
    renderer.render(ecs)
    lastTime = currentTime
  }
  requestAnimationFrame(update)
  return renderer.element
}
