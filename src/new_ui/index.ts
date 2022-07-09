import { Container, ContainerLayout, containerLayout, ContainerGeometry, containerGeometry, containerTraverse } from './container'
import { CameraStack } from './camera_stack'

export { container } from './container'

export enum UIKind {
    CONTAINER
}

export type UI<UIEvent> =
    | Container<UIEvent>

export interface Color {
    red: number
    green: number
    blue: number
    alpha: number
}

export interface Size {
    readonly width: number
    readonly height: number
}

export interface Constraints {
    readonly minWidth: number
    readonly maxWidth: number
    readonly minHeight: number
    readonly maxHeight: number
}

export type Layout =
    | ContainerLayout

export interface Font {
    readonly family: string
    readonly size: number
}

export interface TextMeasurements {
    readonly widths: number[]
    readonly textureIndex: number
    readonly textureCoordinates: number[][]
}

export type MeasureText = (font: Font, str: string) => TextMeasurements

export const layout = <UIEvent>(ui: UI<UIEvent>, constraints: Constraints, measureText: MeasureText): Layout => {
    switch (ui.kind) {
        case UIKind.CONTAINER:
            return containerLayout(ui, constraints, measureText)
    }
}

export interface Offset {
    readonly x: number
    readonly y: number
}

export interface WorldSpace {
    readonly x0: number
    readonly y0: number
    readonly x1: number
    readonly y1: number
}

export type Geometry =
    | ContainerGeometry

export const geometry = <UIEvent>(ui: UI<UIEvent>, layout: Layout, offset: Offset, cameraStack: CameraStack): Geometry => {
    switch (ui.kind) {
        case UIKind.CONTAINER:
            return containerGeometry(ui, layout, offset, cameraStack)
    }
}

export interface Entry<UIEvent> {
    readonly ui: UI<UIEvent>
    readonly layout: Layout
    readonly geometry: Geometry
    readonly z: number
}


export function* traverse<UIEvent>(ui: UI<UIEvent>, layout: Layout, geometry: Geometry, z: number): Generator<Entry<UIEvent>> {
    switch (ui.kind) {
        case UIKind.CONTAINER:
            yield* containerTraverse(ui, layout, geometry, z)
    }
}
