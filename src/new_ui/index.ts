import { Center, CenterLayout, centerLayout, CenterGeometry, centerGeometry, centerTraverse } from './center'
import { Column, ColumnLayout, columnLayout, ColumnGeometry, columnGeometry, columnTraverse } from './column'
import { Container, ContainerLayout, containerLayout, ContainerGeometry, containerGeometry, containerTraverse } from './container'
import { Row, RowLayout, rowLayout, RowGeometry, rowGeometry, rowTraverse } from './row'
import { Stack, StackLayout, stackLayout, StackGeometry, stackGeometry, stackTraverse } from './stack'
import { Text, TextLayout, textLayout, TextGeometry, textGeometry, textTraverse } from './text'
import { CameraStack } from './camera_stack'

export { center } from './center'
export { column } from './column'
export { container } from './container'
export { row } from './row'
export { stack } from './stack'
export { text } from './text'

export enum UIKind {
    CENTER,
    COLUMN,
    CONTAINER,
    ROW,
    STACK,
    TEXT,
}

export type UI<UIEvent> =
    | Center<UIEvent>
    | Column<UIEvent>
    | Container<UIEvent>
    | Row<UIEvent>
    | Stack<UIEvent>
    | Text

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
    | CenterLayout
    | ColumnLayout
    | ContainerLayout
    | RowLayout
    | StackLayout
    | TextLayout

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
        case UIKind.CENTER:
            return centerLayout(ui, constraints, measureText)
        case UIKind.COLUMN:
            return columnLayout(ui, constraints, measureText)
        case UIKind.CONTAINER:
            return containerLayout(ui, constraints, measureText)
        case UIKind.ROW:
            return rowLayout(ui, constraints, measureText)
        case UIKind.STACK:
            return stackLayout(ui, constraints, measureText)
        case UIKind.TEXT:
            return textLayout(ui, constraints, measureText)
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
    | CenterGeometry
    | ColumnGeometry
    | ContainerGeometry
    | RowGeometry
    | StackGeometry
    | TextGeometry

export const geometry = <UIEvent>(ui: UI<UIEvent>, layout: Layout, offset: Offset, cameraStack: CameraStack): Geometry => {
    switch (ui.kind) {
        case UIKind.CENTER:
            return centerGeometry(ui, layout as CenterLayout, offset, cameraStack)
        case UIKind.COLUMN:
            return columnGeometry(ui, layout as ColumnLayout, offset, cameraStack)
        case UIKind.CONTAINER:
            return containerGeometry(ui, layout as ContainerLayout, offset, cameraStack)
        case UIKind.ROW:
            return rowGeometry(ui, layout as RowLayout, offset, cameraStack)
        case UIKind.TEXT:
            return textGeometry(ui, layout as TextLayout, offset, cameraStack)
        case UIKind.STACK:
            return stackGeometry(ui, layout as StackLayout, offset, cameraStack)
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
        case UIKind.CENTER:
            yield* centerTraverse(ui, layout as CenterLayout, geometry as CenterGeometry, z)
            break
        case UIKind.COLUMN:
            yield* columnTraverse(ui, layout as ColumnLayout, geometry as ColumnGeometry, z)
            break
        case UIKind.CONTAINER:
            yield* containerTraverse(ui, layout as ContainerLayout, geometry as ContainerGeometry, z)
            break
        case UIKind.ROW:
            yield* rowTraverse(ui, layout as RowLayout, geometry as RowGeometry, z)
            break
        case UIKind.STACK:
            yield* stackTraverse(ui, layout as StackLayout, geometry as StackGeometry, z)
            break
        case UIKind.TEXT:
            yield* textTraverse(ui, layout as TextLayout, geometry as TextGeometry, z)
            break
    }
}
