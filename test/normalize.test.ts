import { normalize } from "../src/normalize"

test("normalize", () => {
    const values = [-5, -3, 0, 3, 5]
    const normalized = normalize(values, [0, 300])
    expect(normalized).toEqual([0, 60, 150, 240, 300])
})