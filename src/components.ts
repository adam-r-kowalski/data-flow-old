import { Mat4x4 } from './linear_algebra'

export class Geometry {
  vertices: number[]
  indices: number[]

  constructor(vertices: number[], indices: number[]) {
    this.vertices = vertices
    this.indices = indices
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

export const Plane = (): Geometry =>
  new Geometry(
    [
      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
    ],
    [
      0, 1, 2,
      3, 0, 2,
      2, 1, 0,
      2, 0, 3,
    ]
  )

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
