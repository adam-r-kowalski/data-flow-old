import { CameraStack } from "../camera_stack";
import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";
import { Mat3 } from "../linear_algebra";
import { MouseClick } from "../renderer/events";

export interface Entry {
    readonly ui: UI
    readonly layout: Layout
    readonly geometry: Geometry
    readonly z: number
}

export interface Font {
    readonly family: string
    readonly size: number
}

export interface TextMeasurements {
    widths: number[]
    textureIndex: number
    textureCoordinates: number[][]
}

export type MeasureText = (font: Font, str: string) => TextMeasurements

export type OnClick = (click: MouseClick) => void

export interface UI {
    camera?: Mat3
    onClick?: OnClick
    layout: (constraints: Constraints, measureText: MeasureText) => Layout
    geometry: (layout: Layout, offset: Offset, cameraStack: CameraStack) => Geometry,
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}