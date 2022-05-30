import { Entity } from "./ecs";
import { Layers } from "./layers";

export class UIRoot { constructor(public entity: Entity) { } }

export class Text { constructor(public value: string) { } }

export class FontSize { constructor(public value: number) { } }

export class FontFamily { constructor(public value: string) { } }

export class Child { constructor(public entity: Entity) { } }

export class Children { constructor(public entities: Entity[]) { } }

export enum Alignment { START, CENTER, END }

export class CrossAxisAlignment { constructor(public alignment: Alignment) { } }

interface Hsla {
    h: number
    s: number
    l: number
    a: number
}

export class Color {
    h: number
    s: number
    l: number
    a: number

    constructor({ h, s, l, a }: Hsla) {
        this.h = h
        this.s = s
        this.l = l
        this.a = a
    }
}

export class Constraints {
    constructor(
        public minWidth: number,
        public maxWidth: number,
        public minHeight: number,
        public maxHeight: number
    ) { }
}

export class Size {
    constructor(
        public width: number,
        public height: number,
    ) { }
}

export class Offset {
    constructor(
        public x: number,
        public y: number,
    ) { }

    add = (other: Offset) => new Offset(this.x + other.x, this.y + other.y)
}

export class Layout {
    constructor(
        private impl: (self: Entity, constraints: Constraints) => Size
    ) { }

    layout = (self: Entity, constraints: Constraints) =>
        this.impl(self, constraints)
}

export class Vertices {
    data: number[]
    constructor() { this.data = [] }
}

export class TextureCoordinates {
    data: number[]
    constructor() { this.data = [] }
}

export class Colors {
    data: number[]
    constructor() { this.data = [] }
}

export class VertexIndices {
    data: number[]
    constructor() { this.data = [] }
}

export class Geometry {
    constructor(
        private impl: (self: Entity, offset: Offset, layers: Layers, z: number) => void
    ) { }

    geometry = (self: Entity, offset: Offset, layers: Layers, z: number) =>
        this.impl(self, offset, layers, z)
}