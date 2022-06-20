import { Size } from "./layout"

export class Mat3 {
    constructor(public data: number[]) { }

    static identity = () => new Mat3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])

    static projection = ({ width, height }: Size) => new Mat3([
        2 / width, 0, -1,
        0, -2 / height, 1,
        0, 0, 1
    ])
}