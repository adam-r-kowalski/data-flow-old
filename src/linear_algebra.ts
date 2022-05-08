export class Vec3 {
  constructor(public x: number, public y: number, public z: number) { }

  normalize = (): Vec3 => {
    const lengthSquared = this.x * this.x + this.y * this.y + this.z * this.z
    const length = Math.sqrt(lengthSquared)
    return length > 0.00001 ?
      new Vec3(this.x / length, this.y / length, this.z / length) :
      new Vec3(0, 0, 0)
  }

  scale = (scalar: number): Vec3 => new Vec3(this.x * scalar, this.y * scalar, this.z * scalar)
}

export class Mat4x4 {
  constructor(public data: number[]) { }

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

  inverse = (): Mat4x4 => {
    const m00 = this.data[0]
    const m01 = this.data[1]
    const m02 = this.data[2]
    const m03 = this.data[3]
    const m10 = this.data[4]
    const m11 = this.data[5]
    const m12 = this.data[6]
    const m13 = this.data[7]
    const m20 = this.data[8]
    const m21 = this.data[9]
    const m22 = this.data[10]
    const m23 = this.data[11]
    const m30 = this.data[12]
    const m31 = this.data[13]
    const m32 = this.data[14]
    const m33 = this.data[15]
    const tmp_0 = m22 * m33
    const tmp_1 = m32 * m23
    const tmp_2 = m12 * m33
    const tmp_3 = m32 * m13
    const tmp_4 = m12 * m23
    const tmp_5 = m22 * m13
    const tmp_6 = m02 * m33
    const tmp_7 = m32 * m03
    const tmp_8 = m02 * m23
    const tmp_9 = m22 * m03
    const tmp_10 = m02 * m13
    const tmp_11 = m12 * m03
    const tmp_12 = m20 * m31
    const tmp_13 = m30 * m21
    const tmp_14 = m10 * m31
    const tmp_15 = m30 * m11
    const tmp_16 = m10 * m21
    const tmp_17 = m20 * m11
    const tmp_18 = m00 * m31
    const tmp_19 = m30 * m01
    const tmp_20 = m00 * m21
    const tmp_21 = m20 * m01
    const tmp_22 = m00 * m11
    const tmp_23 = m10 * m01
    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    return new Mat4x4([
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ])
  }
}
