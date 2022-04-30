export class Mat4x4 {
  data: number[]

  constructor(data: number[]) {
    this.data = data
  }

  mul = (other: Mat4x4): Mat4x4 => {
    const a = this.data
    const b = other.data
    return new Mat4x4([
      b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
      b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
      b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
      b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
      b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
      b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
      b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
      b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
      b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
      b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
      b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
      b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
      b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
      b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
      b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
      b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
    ])
  }
}

export const xRotate = (radians: number): Mat4x4 => {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return new Mat4x4([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
  ])
}

export const yRotate = (radians: number): Mat4x4 => {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return new Mat4x4([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
  ])
}

export const zRotate = (radians: number): Mat4x4 => {
  const c = Math.cos(radians)
  const s = Math.sin(radians)
  return new Mat4x4([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
}


export const projection = (width: number, height: number, depth: number): Mat4x4 =>
  new Mat4x4([
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    -1, 1, 0, 1,
  ])
