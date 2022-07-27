import { Size } from "../ui"
import { Vector3 } from "./vector3"

export type Matrix3x3 = Readonly<number[]>

export const identity = (): Matrix3x3 => [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
]

export const projection = ({ width, height }: Size): Matrix3x3 => [
    2 / width, 0, -1,
    0, -2 / height, 1,
    0, 0, 1
]

export const translate = (x: number, y: number): Matrix3x3 => [
    1, 0, x,
    0, 1, y,
    0, 0, 1
]

export const scale = (x: number, y: number): Matrix3x3 => [
    x, 0, 0,
    0, y, 0,
    0, 0, 1
]

export const rotate = (radians: number): Matrix3x3 => {
    const c = Math.cos(radians)
    const s = Math.sin(radians)
    return [
        c, s, 0,
        -s, c, 0,
        0, 0, 1
    ]
}

export const multiplyMatrices = (...matrices: Matrix3x3[]) => {
    const [head, ...tail] = matrices
    return tail.reduce((a, b) => {
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
        return [
            c11, c12, c13,
            c21, c22, c23,
            c31, c32, c33,
        ]
    }, head)
}

export const multiplyMatrixVector = (a: Matrix3x3, b: Vector3): Vector3 => {
    const a11 = a[0]
    const a12 = a[1]
    const a13 = a[2]
    const a21 = a[3]
    const a22 = a[4]
    const a23 = a[5]
    const a31 = a[6]
    const a32 = a[7]
    const a33 = a[8]
    const b1 = b[0]
    const b2 = b[1]
    const b3 = b[2]
    const c1 = a11 * b1 + a12 * b2 + a13 * b3
    const c2 = a21 * b1 + a22 * b2 + a23 * b3
    const c3 = a31 * b1 + a32 * b2 + a33 * b3
    return [c1, c2, c3]
}

export const inverse = (a: Matrix3x3): Matrix3x3 => {
    const a11 = a[0]
    const a12 = a[1]
    const a13 = a[2]
    const a21 = a[3]
    const a22 = a[4]
    const a23 = a[5]
    const a31 = a[6]
    const a32 = a[7]
    const a33 = a[8]
    const b11 = a22 * a33 - a23 * a32
    const b12 = a21 * a33 - a23 * a31
    const b13 = a21 * a32 - a22 * a31
    const b21 = a12 * a33 - a13 * a32
    const b22 = a11 * a33 - a13 * a31
    const b23 = a11 * a32 - a12 * a31
    const b31 = a12 * a23 - a13 * a22
    const b32 = a11 * a23 - a13 * a21
    const b33 = a11 * a22 - a12 * a21
    const det = a31 * b31 - a32 * b32 + a33 * b33
    const idet = 1 / det
    return [
        idet * b11, idet * -b21, idet * b31,
        idet * -b12, idet * b22, idet * -b32,
        idet * b13, idet * -b23, idet * b33
    ]
}