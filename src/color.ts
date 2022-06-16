export class Rgba {
    constructor(
        readonly red: number,
        readonly green: number,
        readonly blue: number,
        readonly alpha: number,
    ) { }

    rgba = () => this
}

export const rgba = (red: number, green: number, blue: number, alpha: number) =>
    new Rgba(red, green, blue, alpha)

export interface Color {
    rgba: () => Rgba
}