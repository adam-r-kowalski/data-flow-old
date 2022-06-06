import * as Studio from '../src/studio'
const { Mat3, Vec3 } = Studio.linear_algebra

test("matrix multiplication by identity rhs", () => {
    const a = new Mat3([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ])
    const b = Mat3.identity()
    const c = a.matMul(b)
    expect(c.data).toEqual(a.data)
})

test("matrix multiplication by identity lhs", () => {
    const a = new Mat3([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ])
    const b = Mat3.identity()
    const c = b.matMul(a)
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
    const c = a.matMul(b)
    expect(c.data).toEqual([
        130, 120, 240,
        51, 47, 73,
        35, 33, 45
    ])
})

test("matrix inverse", () => {
    const a = new Mat3([
        1, 2, -1,
        2, 1, 2,
        -1, 2, 1
    ])
    const b = a.inverse()
    const expected = [
        3 / 16, 1 / 4, -5 / 16,
        1 / 4, 0, 1 / 4,
        -5 / 16, 1 / 4, 3 / 16
    ]
    b.data.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index])
    )
})

test("matrix inverse of translate", () => {
    const a = new Mat3([
        1, 0, 5,
        0, 1, 10,
        0, 0, 1
    ])
    const b = a.inverse()
    const expected = [
        1, 0, -5,
        0, 1, -10,
        0, 0, 1
    ]
    b.data.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index])
    )
})

test("matrix inverse of scale", () => {
    const a = new Mat3([
        2, 0, 0,
        0, 2, 0,
        0, 0, 1
    ])
    const b = a.inverse()
    const expected = [
        1 / 2, 0, 0,
        0, 1 / 2, 0,
        0, 0, 1
    ]
    b.data.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index])
    )
})

test("matrix vector multiplication by identity", () => {
    const a = Mat3.identity()
    const b = new Vec3([1, 2, 3])
    const c = a.vecMul(b)
    expect(c.data).toEqual(b.data)
})


test("scale vector", () => {
    const a = Mat3.scaling(2, 2)
    const b = new Vec3([1, 2, 1])
    const c = a.vecMul(b)
    expect(c.data).toEqual([2, 4, 1])
})

test("translate vector", () => {
    const a = Mat3.translation(2, 2)
    const b = new Vec3([1, 2, 1])
    const c = a.vecMul(b)
    expect(c.data).toEqual([3, 4, 1])
})

test("rotate vector", () => {
    const a = Mat3.rotation(-Math.PI / 2)
    const b = new Vec3([1, 0, 1])
    const c = a.vecMul(b)
    const expected = [0, 1, 1]
    c.data.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index])
    )
})