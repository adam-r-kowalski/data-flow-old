export class Rgba {
    constructor(
        readonly r: number,
        readonly g: number,
        readonly b: number,
        readonly a: number,
    ) { }

    rgba = () => this
}

export const rgba = (r: number, g: number, b: number, a: number) =>
    new Rgba(r, g, b, a)

export interface Color {
    rgba: () => Rgba
}