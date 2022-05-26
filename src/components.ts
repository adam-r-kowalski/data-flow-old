import { Entity } from "./ecs";

export class UIRoot { constructor(public entity: Entity) { } }

export class Text { constructor(public value: string) { } }

export class FontSize { constructor(public value: number) { } }

export class FontFamily { constructor(public value: string) { } }

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

export class Layout {
    constructor(
        private impl: (self: Entity, constraints: Constraints) => Size
    ) { }

    layout = (self: Entity, constraints: Constraints) =>
        this.impl(self, constraints)
}

interface RendererImpl {
    setSize: (self: Entity, size: Size) => void
    getSize: (self: Entity) => Size
    clear: (self: Entity) => void
    textSize: (self: Entity, entity: Entity) => Size
    drawText: (self: Entity, entity: Entity) => void
    flush: (self: Entity) => void
}

export class Renderer {
    constructor(
        public entity: Entity,
        private impl: RendererImpl
    ) { }

    setSize = (size: Size) => this.impl.setSize(this.entity, size)
    getSize = () => this.impl.getSize(this.entity)
    clear = () => this.impl.clear(this.entity)
    textSize = (entity: Entity) => this.impl.textSize(this.entity, entity)
    drawText = (entity: Entity) => this.impl.drawText(this.entity, entity)
    flush = () => this.impl.flush(this.entity)
}