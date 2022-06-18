export class Mat3 {
    constructor(public data: number[]) { }

    static identity = () => new Mat3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])

    static projection = (width: number, height: number) => new Mat3([
        2 / width, 0, -1,
        0, -2 / height, 1,
        0, 0, 1
    ])
}