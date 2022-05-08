import { Mat4x4 } from './linear_algebra'
import { Entity } from './ecs'

export class Projection {
  constructor(public matrix: Mat4x4) { }
}

interface Orthographic {
  x: number
  y: number
  width: number
  height: number
  near: number
  far: number
}

export const orthographicProjection = ({ x, y, width, height, near, far }: Orthographic): Projection => {
  const left = x
  const right = x + width
  const top = y
  const bottom = y + height
  return new Projection(
    new Mat4x4([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1
    ])
  )
}

interface Perspective {
  fieldOfView: number
  width: number
  height: number
  near: number
  far: number
}

export const perspectiveProjection = ({ fieldOfView, width, height, near, far }: Perspective): Projection => {
  const aspectRatio = width / height
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView)
  const rangeInv = 1.0 / (near - far)
  return new Projection(
    new Mat4x4([
      f / aspectRatio, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ])
  )
}

export class ActiveCamera {
  constructor(public entity: Entity) { }
}

interface GeometryData {
  vertices: number[]
  indices: number[]
}

export class Geometry {
  vertices: number[]
  indices: number[]

  constructor(data: GeometryData) {
    this.vertices = data.vertices
    this.indices = data.indices
  }
}

interface Vec3 {
  x: number
  y: number
  z: number
}

export class Translate {
  x: number
  y: number
  z: number

  constructor(vec: Vec3) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
  }

  matrix = (): Mat4x4 =>
    new Mat4x4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      this.x, this.y, this.z, 1,
    ])
}

export class Scale {
  x: number
  y: number
  z: number

  constructor(vec: Vec3) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
  }

  matrix = (): Mat4x4 =>
    new Mat4x4([
      this.x, 0, 0, 0,
      0, this.y, 0, 0,
      0, 0, this.z, 0,
      0, 0, 0, 1,
    ])
}

export class Rotate {
  x: number
  y: number
  z: number

  constructor(vec: Vec3) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
  }

  xMatrix = (): Mat4x4 => {
    const radians = this.x
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    return new Mat4x4([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ])
  }

  yMatrix = (): Mat4x4 => {
    const radians = this.y
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    return new Mat4x4([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ])
  }

  zMatrix = (): Mat4x4 => {
    const radians = this.z
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    return new Mat4x4([
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  matrix = (): Mat4x4 =>
    this.xMatrix().mul(this.yMatrix()).mul(this.zMatrix())
}

export const planeGeometry = (): Geometry =>
  new Geometry({
    vertices: [
      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
    ],
    indices: [
      0, 1, 2,
      3, 0, 2,
      2, 1, 0,
      2, 0, 3,
    ]
  })

interface Hsla {
  h: number
  s: number
  l: number
  a: number
}

export class Fill {
  h: number
  s: number
  l: number
  a: number

  constructor(hsla: Hsla) {
    this.h = hsla.h
    this.s = hsla.s
    this.l = hsla.l
    this.a = hsla.a
  }
}

export class Children {
  constructor(public entities: Entity[]) { }
}

export class Root { }

export class LookAt {
  constructor(public entity: Entity) { }
}
