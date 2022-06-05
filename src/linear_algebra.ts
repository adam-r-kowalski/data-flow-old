export class Mat3 {
    constructor(public data: number[]) { }

    static identity = () => new Mat3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])

    mul = (other: Mat3) => {
        const a = this.data
        const b = other.data
        const a11 = a[0]
        const a12 = a[1]
        const a13 = a[2]
        const a21 = a[3]
        const a22 = a[4]
        const a23 = a[5]
        const a31 = a[6]
        const a32 = a[7]
        const a33 = a[8]
        const b11 = b[0]
        const b12 = b[1]
        const b13 = b[2]
        const b21 = b[3]
        const b22 = b[4]
        const b23 = b[5]
        const b31 = b[6]
        const b32 = b[7]
        const b33 = b[8]
        const c11 = a11 * b11 + a12 * b21 + a13 * b31
        const c12 = a11 * b12 + a12 * b22 + a13 * b32
        const c13 = a11 * b13 + a12 * b23 + a13 * b33
        const c21 = a21 * b11 + a22 * b21 + a23 * b31
        const c22 = a21 * b12 + a22 * b22 + a23 * b32
        const c23 = a21 * b13 + a22 * b23 + a23 * b33
        const c31 = a31 * b11 + a32 * b21 + a33 * b31
        const c32 = a31 * b12 + a32 * b22 + a33 * b32
        const c33 = a31 * b13 + a32 * b23 + a33 * b33
        return new Mat3([
            c11, c12, c13,
            c21, c22, c23,
            c31, c32, c33,
        ])
    }
}