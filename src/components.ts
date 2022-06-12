import { Entity } from "./ecs";
import { Layers } from "./layers";
import { Mat3 } from "./linear_algebra";

export class UIRoot { constructor(public entity: Entity) { } }

export class Text { constructor(public value: string) { } }

export class FontSize { constructor(public value: number) { } }

export class FontFamily { constructor(public value: string) { } }

export class Child { constructor(public entity: Entity) { } }

export class Children { constructor(public entities: Entity[]) { } }

export class Connections { constructor(public entities: Entity[]) { } }

export class Camera { constructor(public entity: Entity) { } }

export enum Alignment { START, CENTER, END }

export class CrossAxisAlignment { constructor(public alignment: Alignment) { } }

export class Width { constructor(public value: number) { } }

export class Height { constructor(public value: number) { } }

export class Translate {
    constructor(public x: number, public y: number) { }
}

export class Transform { constructor(public matrix: Mat3) { } }

export class Zoom {
    constructor(
        public scale: number,
        public x: number,
        public y: number,
    ) { }
}

export class From { constructor(public entity: Entity) { } }

export class To { constructor(public entity: Entity) { } }

export class Color {
    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a: number
    ) { }
}

export class Padding { constructor(public value: number) { } }

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

export class WorldSpace {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) { }
}

export class Vertices { constructor(public data: number[]) { } }

export class TextureCoordinates { constructor(public data: number[]) { } }

export class Colors { constructor(public data: number[]) { } }

export class VertexIndices { constructor(public data: number[]) { } }

export class CameraIndices { constructor(public data: number[]) { } }

export class Geometry {
    constructor(
        private impl: (self: Entity, parentOffset: Offset, layers: Layers, z: number) => void
    ) { }

    geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) =>
        this.impl(self, parentOffset, layers, z)
}

export type OnDragCallback = (entity: Entity, x: number, y: number) => void

export class OnDrag { constructor(public callback: OnDragCallback) { } }

export type OnClickCallback = (entity: Entity) => void

export class OnClick { constructor(public callback: OnClickCallback) { } }

export class Pointers {
    constructor(public events: PointerEvent[]) { }
}

export class PointerDistance {
    constructor(public value: number) { }
}

export class Dragging {
    constructor(public value: boolean) { }
}

export class DraggedEntity {
    constructor(public entity: Entity | null) { }
}

export class ConnectionFrom {
    constructor(public entity: Entity | null) { }
}

export class ConnectionTo {
    constructor(public entity: Entity | null) { }
}