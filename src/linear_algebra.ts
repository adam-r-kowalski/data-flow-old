export class Mat3 {
    constructor(public data: number[]) { }

    static identity = () => new Mat3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])
}