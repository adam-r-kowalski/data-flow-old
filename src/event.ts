import { Pointer } from "./ui"
import { Table } from "./model/table"
import { Position, UUID } from "./model/graph"

export enum EventKind {
    POINTER_MOVE,
    POINTER_DOWN,
    POINTER_UP,
    CLICKED_NODE,
    WHEEL,
    CLICKED_INPUT,
    CLICKED_OUTPUT,
    KEYDOWN,
    KEYUP,
    CLICKED_FINDER_OPTION,
    CLICKED_BODY,
    CLICKED_BACKGROUND,
    DRAGGED_BACKGROUND,
    CHANGE_NODE,
    DELETE_NODE,
    DELETE_INPUT_EDGE,
    DELETE_OUTPUT_EDGES,
    PAN_CAMERA,
    ZOOM_CAMERA,
    RESET_CAMERA,
    MOVE_NODE,
    UPLOAD_TABLE,
    UPLOAD_CSV,
    FINDER_INSERT,
    FINDER_CHANGE,
    FINDER_CLOSE,
    LOAD_DEMO_MODEL,
}

export interface PointerMove {
    readonly kind: EventKind.POINTER_MOVE
    readonly pointer: Pointer
}

export interface PointerDown {
    readonly kind: EventKind.POINTER_DOWN
    readonly pointer: Pointer
    readonly count: number
}

export interface PointerUp {
    readonly kind: EventKind.POINTER_UP
    readonly pointer: Pointer
}

export interface ClickedNode {
    readonly kind: EventKind.CLICKED_NODE
    readonly node: UUID
}

export interface Wheel {
    readonly kind: EventKind.WHEEL
    readonly position: Position
    readonly deltaY: number
}

export interface ClickedInput {
    readonly kind: EventKind.CLICKED_INPUT
    readonly input: UUID
}

export interface ClickedOutput {
    readonly kind: EventKind.CLICKED_OUTPUT
    readonly output: UUID
}

export interface KeyDown {
    readonly kind: EventKind.KEYDOWN
    readonly key: string
}

export interface KeyUp {
    readonly kind: EventKind.KEYUP
    readonly key: string
}

export interface ClickedBody {
    readonly kind: EventKind.CLICKED_BODY
    readonly body: UUID
}

export interface ClickedBackground {
    readonly kind: EventKind.CLICKED_BACKGROUND
    readonly count: number
    readonly position: Position
}

export interface DraggedBackground {
    readonly kind: EventKind.DRAGGED_BACKGROUND
    readonly x: number
    readonly y: number
}

export interface ChangeNode {
    readonly kind: EventKind.CHANGE_NODE
    readonly node: UUID
}

export interface DeleteNode {
    readonly kind: EventKind.DELETE_NODE
    readonly node: UUID
}

export interface DeleteInputEdge {
    readonly kind: EventKind.DELETE_INPUT_EDGE
    readonly input: UUID
}

export interface DeleteOutputEdges {
    readonly kind: EventKind.DELETE_OUTPUT_EDGES
    readonly output: UUID
}

export interface PanCamera {
    readonly kind: EventKind.PAN_CAMERA
}

export interface ZoomCamera {
    readonly kind: EventKind.ZOOM_CAMERA
}

export interface ResetCamera {
    readonly kind: EventKind.RESET_CAMERA
}

export interface MoveNode {
    readonly kind: EventKind.MOVE_NODE
}

export interface UploadTable {
    readonly kind: EventKind.UPLOAD_TABLE
    readonly table: Table
    readonly position: Position
}

export interface UploadCsv {
    readonly kind: EventKind.UPLOAD_CSV
    readonly table: Table
    readonly node: UUID
}

export interface FinderInsert {
    readonly kind: EventKind.FINDER_INSERT
    readonly option: string
}

export interface FinderChange {
    readonly kind: EventKind.FINDER_CHANGE
    readonly option: string
    readonly node: UUID
}

export interface FinderClose {
    readonly kind: EventKind.FINDER_CLOSE
}

export interface LoadDemoModel {
    readonly kind: EventKind.LOAD_DEMO_MODEL
}

export type AppEvent =
    | PointerMove
    | PointerDown
    | PointerUp
    | ClickedNode
    | Wheel
    | ClickedInput
    | ClickedOutput
    | KeyDown
    | KeyUp
    | ClickedBody
    | ClickedBackground
    | DraggedBackground
    | ChangeNode
    | DeleteNode
    | DeleteInputEdge
    | DeleteOutputEdges
    | PanCamera
    | ZoomCamera
    | ResetCamera
    | MoveNode
    | UploadTable
    | UploadCsv
    | FinderInsert
    | FinderChange
    | FinderClose
    | LoadDemoModel
