import { CameraStack } from "../camera_stack";
import { Color } from "../color";
import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";
import { Matrix3x3 } from "../linear_algebra/matrix3x3";

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

export interface Pointer {
    x: number
    y: number
    id: number
}

export type OnClick = (pointer: Pointer) => void

export type Id = string

export interface Connection {
    from: Id
    to: Id
    color: Color
}


export interface UI {
    camera?: Matrix3x3
    onClick?: OnClick
    id?: Id
    connections?: Connection[]
    layout: (constraints: Constraints, measureText: MeasureText) => Layout
    geometry: (layout: Layout, offset: Offset, cameraStack: CameraStack) => Geometry,
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}