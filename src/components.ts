import { Mat4x4 } from './linear_algebra'

export class Geometry {
  vertices: number[]
  indices: number[]

  constructor(vertices: number[], indices: number[]) {
    this.vertices = vertices
    this.indices = indices
  }
}

export class Translate {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
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

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  matrix = (): Mat4x4 =>
    new Mat4x4([
      this.x, 0, 0, 0,
      0, this.y, 0, 0,
      0, 0, this.z, 0,
      0, 0, 0, 1,
    ])
}

