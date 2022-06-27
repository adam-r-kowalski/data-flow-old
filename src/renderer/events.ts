import { UI } from "../ui"

export enum RendererEventKind {
    RENDER,
    MOUSE_CLICK
}

export interface Render {
    kind: RendererEventKind.RENDER
    ui: UI
}

export interface MouseClick {
    kind: RendererEventKind.MOUSE_CLICK
    x: number
    y: number
}

export type RendererEvent =
    Render
    | MouseClick