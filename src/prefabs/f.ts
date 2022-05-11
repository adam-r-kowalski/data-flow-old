import { ECS, Entity } from '../ecs'
import { Geometry, Fill, Children } from '../components'
import { physicalEntity } from './physical_entity'

const leftColumnFront = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )

const topRungFront = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const middleRungFront = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 30, s: 1, l: 0.7, a: 1 }),
  )


const leftColumnBack = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const topRungBack = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )


const middleRungBack = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 60, s: 1, l: 0.7, a: 1 }),
  )

const top = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 90, s: 1, l: 0.7, a: 1 }),
  )

const topRungRight = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 120, s: 1, l: 0.7, a: 1 }),
  )

const underTopRung = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 150, s: 1, l: 0.7, a: 1 }),
  )

const betweenTopRungAndMiddle = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 180, s: 1, l: 0.7, a: 1 }),
  )

const topOfMiddleRung = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 210, s: 1, l: 0.7, a: 1 }),
  )

const rightOfMiddleRung = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 240, s: 1, l: 0.7, a: 1 }),
  )

const bottomOfMiddleRing = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 270, s: 1, l: 0.7, a: 1 }),
  )

const rightOfBottom = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 300, s: 1, l: 0.7, a: 1 }),
  )

const bottom = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 330, s: 1, l: 0.7, a: 1 }),
  )

const leftSide = (ecs: ECS) =>
  physicalEntity(ecs).set(
    new Geometry({
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
    new Fill({ h: 360, s: 1, l: 0.7, a: 1 }),
  )


export const F = (ecs: ECS): Entity =>
  physicalEntity(ecs).set(
    new Children([
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
    ]))
