import { Model } from "."
import { FocusKind } from "./focus"
import { PointerActionKind } from "./pointer_action"
import { identity } from "../linear_algebra/matrix3x3"
import { emptyGraph } from './graph'
import { QuickSelectKind } from "./quick_select"

export const emptyModel = (): Model => ({
    graph: emptyGraph(),
    nodeOrder: [],
    pointers: [],
    camera: identity(),
    focus: {
        kind: FocusKind.NONE,
        pointerAction: { kind: PointerActionKind.NONE },
        quickSelect: { kind: QuickSelectKind.NONE }
    },
    openFinderFirstClick: false,
    nodePlacementLocation: { x: 0, y: 0 },
    operations: {},
    moveCamera: { left: false, down: false, up: false, right: false, now: 0 },
    theme: {
        background: { red: 2, green: 22, blue: 39, alpha: 255 },
        node: { red: 41, green: 95, blue: 120, alpha: 255 },
        focusNode: { red: 23, green: 54, blue: 69, alpha: 255 },
        input: { red: 188, green: 240, blue: 192, alpha: 255 },
        focusInput: { red: 175, green: 122, blue: 208, alpha: 255 },
        connection: { red: 255, green: 255, blue: 255, alpha: 255 },
    },
})