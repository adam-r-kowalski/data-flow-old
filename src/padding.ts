export class Padding {
    constructor(
        readonly top: number,
        readonly right: number,
        readonly bottom: number,
        readonly left: number
    ) { }
}

export const padding = (value: number) =>
    new Padding(value, value, value, value)