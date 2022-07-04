import { identity, inverse, multiplyMatrices, multiplyMatrixVector, rotate, scale, translate } from "../src/linear_algebra/matrix3x3"

test("matrix multiplication by identity rhs", () => {
    const a = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ]
    const b = identity()
    const c = multiplyMatrices(a, b)
    expect(c).toEqual(a)
})

test("matrix multiplication by identity lhs", () => {
    const a = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    ]
    const b = identity()
    const c = multiplyMatrices(b, a)
    expect(c).toEqual(a)
})

test("matrix multiplication", () => {
    const a = [
        10, 20, 10,
        4, 5, 6,
        2, 3, 5
    ]
    const b = [
        3, 2, 4,
        3, 3, 9,
        4, 4, 2
    ]
    const c = multiplyMatrices(a, b)
    expect(c).toEqual([
        130, 120, 240,
        51, 47, 73,
        35, 33, 45
    ])
})

test("matrix inverse", () => {
    const a = [
        1, 2, -1,
        2, 1, 2,
        -1, 2, 1
    ]
    const b = inverse(a)
    const expected = [
        3 / 16, 1 / 4, -5 / 16,
        1 / 4, 0, 1 / 4,
        -5 / 16, 1 / 4, 3 / 16
    ]
    b.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index]!)
    )
})

test("matrix inverse of translate", () => {
    const a = [
        1, 0, 5,
        0, 1, 10,
        0, 0, 1
    ]
    const b = inverse(a)
    const expected = [
        1, 0, -5,
        0, 1, -10,
        0, 0, 1
    ]
    b.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index]!)
    )
})

test("matrix inverse of scale", () => {
    const a = [
        2, 0, 0,
        0, 2, 0,
        0, 0, 1
    ]
    const b = inverse(a)
    const expected = [
        1 / 2, 0, 0,
        0, 1 / 2, 0,
        0, 0, 1
    ]
    b.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index]!)
    )
})

test("matrix vector multiplication by identity", () => {
    const a = identity()
    const b = [1, 2, 3]
    const c = multiplyMatrixVector(a, b)
    expect(c).toEqual(b)
})

test("scale vector", () => {
    const a = scale(2, 2)
    const b = [1, 2, 1]
    const c = multiplyMatrixVector(a, b)
    expect(c).toEqual([2, 4, 1])
})

test("translate vector", () => {
    const a = translate(2, 2)
    const b = [1, 2, 1]
    const c = multiplyMatrixVector(a, b)
    expect(c).toEqual([3, 4, 1])
})

test("rotate vector", () => {
    const a = rotate(-Math.PI / 2)
    const b = [1, 0, 1]
    const c = multiplyMatrixVector(a, b)
    const expected = [0, 1, 1]
    c.forEach((value, index) =>
        expect(value).toBeCloseTo(expected[index]!)
    )
})