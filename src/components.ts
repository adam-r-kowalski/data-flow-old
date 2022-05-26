import { Entity } from "./ecs";

export class UIRoot { constructor(public entity: Entity) { } }

export class Text { constructor(public value: string) { } }

export class FontSize { constructor(public value: number) { } }

export class FontFamily { constructor(public value: string) { } }

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
        private impl: (entity: Entity, constraints: Constraints) => Size
    ) { }

    layout = (entity: Entity, constraints: Constraints) =>
        this.impl(entity, constraints)
}

interface RendererImpl {
    setSize: (entity: Entity, size: Size) => void
    getSize: (entity: Entity) => Size
    clear: (entity: Entity) => void
}

export class Renderer {
    constructor(
        public entity: Entity,
        private impl: RendererImpl
    ) { }

    setSize = (size: Size) => this.impl.setSize(this.entity, size)
    getSize = () => this.impl.getSize(this.entity)
    clear = () => this.impl.clear(this.entity)
}