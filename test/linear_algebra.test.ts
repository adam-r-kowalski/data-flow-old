import * as Studio from '../src/studio'
const { Mat3 } = Studio.linear_algebra

test("matrix multiplication by identity rhs", () => {
    const a = new Mat3([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ])
    const b = Mat3.identity()
    const c = a.mul(b)
    expect(c.data).toEqual(a.data)
})

test("matrix multiplication by identity lhs", () => {
    const a = new Mat3([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ])
    const b = Mat3.identity()
    const c = b.mul(a)
    expect(c.data).toEqual(a.data)
})

test("matrix multiplication", () => {
    const a = new Mat3([
        10, 20, 10,
        4, 5, 6,
        2, 3, 5
    ])
    const b = new Mat3([
        3, 2, 4,
        3, 3, 9,
        4, 4, 2
    ])
    const c = a.mul(b)
    expect(c.data).toEqual([
        130, 120, 240,
        51, 47, 73,
        35, 33, 45
    ])
})