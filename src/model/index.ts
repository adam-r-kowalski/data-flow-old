import { Matrix3x3 } from "../linear_algebra/matrix3x3"
import { Pointer } from "../ui"
import { Graph, Operations, UUID } from "./graph"
import { Focus } from "./focus"
import { Theme } from "./theme"
import { PanCamera, ZoomCamera } from "./move_camera"

export interface Window {
    readonly width: number
    readonly height: number
}

export interface NodePlacementLocation {
    readonly x: number
    readonly y: number
    readonly show: boolean
}

export interface Model {
    readonly graph: Graph
    readonly nodeOrder: Readonly<UUID[]>
    readonly pointers: Readonly<Pointer[]>
    readonly focus: Focus
    readonly nodePlacementLocation: NodePlacementLocation
    readonly window: Window
    readonly camera: Matrix3x3
    readonly operations: Readonly<Operations>
    readonly panCamera: PanCamera
    readonly zoomCamera: ZoomCamera
    readonly theme: Theme
}
