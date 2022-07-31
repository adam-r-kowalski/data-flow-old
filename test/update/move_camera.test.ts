import { translate } from "../../src/linear_algebra/matrix3x3"
import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { Pointer } from "../../src/ui"
import { EventKind, update } from "../../src/update"
import { makeEffects } from "../mock_effects"

test("pointer down starts panning camera", () => {
    const model = emptyModel()
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 }
    }
    const { model: model1 } = update(makeEffects(), model, {
        kind: EventKind.POINTER_DOWN,
        pointer
    })
    const expectedModel: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("h when nothing focused pans camera left", () => {
    const model = emptyModel()
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: 'h'
    })
    expect(dispatch).toEqual([{ kind: EventKind.MOVE_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.MOVE_CAMERA
    })
    expect(schedule).toEqual([{
        after: { milliseconds: 10 },
        event: { kind: EventKind.MOVE_CAMERA }
    }])
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: 'h'
    })
    expect(dispatch0).toBeUndefined()
    const expectedModel: Model = {
        ...emptyModel(),
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.NONE },
            quickSelect: { kind: QuickSelectKind.NONE }
        },
        camera: translate(-0.5, 0),
        moveCamera: { left: false, up: false, down: false, right: false, now: 1 }
    }
    expect(model3).toEqual(expectedModel)
})
