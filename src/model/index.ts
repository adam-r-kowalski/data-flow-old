import { Matrix3x3 } from "../linear_algebra/matrix3x3"
import { Pointer } from "../ui"
import { Graph, Operations, Position, UUID } from './graph'
import { Focus } from './focus'
import { Theme } from './theme'
import { MoveCamera } from './move_camera'

export interface Model {
    readonly graph: Graph
    readonly nodeOrder: Readonly<UUID[]>
    readonly pointers: Readonly<Pointer[]>
    readonly focus: Focus
    readonly openFinderFirstClick: boolean
    readonly nodePlacementLocation: Position
    readonly camera: Matrix3x3
    readonly operations: Readonly<Operations>
    readonly moveCamera: MoveCamera
    readonly theme: Theme
}