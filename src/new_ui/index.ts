import { Container, ContainerLayout, containerLayout } from './container'

export enum UIKind {
    CONTAINER
}

export type UI<Event> =
    | Container<Event>


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

export const layout = <Event>(ui: UI<Event>, constraints: Constraints, measureText: MeasureText): Layout => {
    switch (ui.kind) {
        case UIKind.CONTAINER:
            return containerLayout(ui, constraints, measureText)
    }
}