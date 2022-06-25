import { Geometry, Offset } from "../geometry";
import { Constraints, Layout } from "../layout";
import { Mat3 } from "../linear_algebra";

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

export type CameraIndex = number

export interface CameraStack {
    activeCameraIndex: CameraIndex
    nextCameraIndex: CameraIndex
}

interface GeometryResult {
    geometry: Geometry
    nextCameraIndex: CameraIndex
}

export interface UI {
    camera?: Mat3
    layout: (constraints: Constraints, measureText: MeasureText) => Layout
    geometry: (layout: Layout, offset: Offset, cameraStack: CameraStack) => GeometryResult,
    traverse: (layout: Layout, geometry: Geometry, z: number) => Generator<Entry>
}