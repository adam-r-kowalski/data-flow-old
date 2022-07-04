export type Vector3 = number[]

export const length = ([a, b, c]: Vector3) =>
    Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2))