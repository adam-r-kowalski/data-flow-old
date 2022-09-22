import { EventKind } from "../../src/event"
import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { Pointer } from "../../src/ui"
import { update } from "../../src/update"
import { makeEffects } from "../mock_effects"

const model: Model = emptyModel({ width: 500, height: 500 })

test("pointer down starts panning camera", () => {
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const { model: model1 } = update(makeEffects(), model, {
        kind: EventKind.POINTER_DOWN,
        pointer,
    })
    const expectedModel: Model = {
        ...model,
        focus: {
            kind: FocusKind.NONE,
            pointerAction: { kind: PointerActionKind.PAN },
            quickSelect: { kind: QuickSelectKind.NONE },
        },
        pointers: [pointer],
    }
    expect(model1).toEqual(expectedModel)
})

test("h when nothing focused pans camera left", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "h",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: { left: true, up: false, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "h",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("Left arrow when nothing focused pans camera left", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "ArrowLeft",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: { left: true, up: false, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "ArrowLeft",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("j when nothing focused pans camera down", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "j",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: { left: false, up: false, down: true, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "j",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("Down arrow when nothing focused pans camera down", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "ArrowDown",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: { left: false, up: false, down: true, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "ArrowDown",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("k when nothing focused pans camera up", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "k",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: { left: false, up: true, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "k",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("Up Arrow when nothing focused pans camera up", () => {
    const effects = makeEffects()
    const { model: model1 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "ArrowUp",
    })
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: { left: false, up: true, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "ArrowUp",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("l when nothing focused pans camera right", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "l",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: { left: false, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "l",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("Right arrow when nothing focused pans camera right", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "ArrowRight",
    })
    expect(dispatch).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: { left: false, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "ArrowRight",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: {
            left: false,
            up: false,
            down: false,
            right: false,
            now: 1,
        },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("pressing h then l when nothing focused does nothing", () => {
    const effects = makeEffects()
    const { model: model1, dispatch: dispatch0 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "h",
    })
    expect(dispatch0).toEqual([{ kind: EventKind.PAN_CAMERA }])
    const { model: model2, dispatch: dispatch1 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: "l",
    })
    expect(dispatch1).toBeUndefined()
    const { model: model3, schedule } = update(effects, model2, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.PAN_CAMERA },
        },
    ])
    expect(model3).toEqual({
        ...model,
        camera: identity(),
        panCamera: { left: true, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("pressing a non hotkey when nothing focused does nothing", () => {
    const effects = makeEffects()
    const { model: model1, dispatch: dispatch0 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "m",
    })
    expect(dispatch0).toBeUndefined()
    expect(model1).toEqual(model)
    const { model: model2, schedule: schedule0 } = update(effects, model1, {
        kind: EventKind.PAN_CAMERA,
    })
    expect(schedule0).toBeUndefined()
    expect(model2).toEqual(model)
    const { model: model3, schedule: schedule1 } = update(effects, model2, {
        kind: EventKind.ZOOM_CAMERA,
    })
    expect(schedule1).toBeUndefined()
    expect(model3).toEqual(model)
    const { model: model4, dispatch: dispatch1 } = update(effects, model3, {
        kind: EventKind.KEYUP,
        key: "m",
    })
    expect(dispatch1).toBeUndefined()
    expect(model4).toEqual(model)
})

test("ctrl j when nothing focused zooms camera out", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "<c-j>",
    })
    expect(dispatch).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.ZOOM_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.ZOOM_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: [
            1.0069555500567189, 0, -1.7388875141797087, 0, 1.0069555500567189,
            -1.7388875141797087, 0, 0, 1,
        ],
        zoomCamera: { in: false, out: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "<c-j>",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: [
            1.0069555500567189, 0, -1.7388875141797087, 0, 1.0069555500567189,
            -1.7388875141797087, 0, 0, 1,
        ],
        zoomCamera: { in: false, out: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("ctrl k when nothing focused zooms camera in", () => {
    const effects = makeEffects()
    const { model: model1, dispatch } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "<c-k>",
    })
    expect(dispatch).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    const { model: model2, schedule } = update(effects, model1, {
        kind: EventKind.ZOOM_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.ZOOM_CAMERA },
        },
    ])
    expect(model2).toEqual({
        ...model,
        camera: [
            0.9930924954370359, 0, 1.7268761407410125, 0, 0.9930924954370359,
            1.7268761407410125, 0, 0, 1,
        ],
        zoomCamera: { in: true, out: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const { model: model3, dispatch: dispatch0 } = update(effects, model2, {
        kind: EventKind.KEYUP,
        key: "<c-k>",
    })
    expect(dispatch0).toBeUndefined()
    expect(model3).toEqual({
        ...model,
        camera: [
            0.9930924954370359, 0, 1.7268761407410125, 0, 0.9930924954370359,
            1.7268761407410125, 0, 0, 1,
        ],
        zoomCamera: { in: false, out: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("pressing ctrl j then ctrl k when nothing focused does nothing", () => {
    const effects = makeEffects()
    const { model: model1, dispatch: dispatch0 } = update(effects, model, {
        kind: EventKind.KEYDOWN,
        key: "<c-j>",
    })
    expect(dispatch0).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    const { model: model2, dispatch: dispatch1 } = update(effects, model1, {
        kind: EventKind.KEYDOWN,
        key: "<c-k>",
    })
    expect(dispatch1).toBeUndefined()
    const { model: model3, schedule } = update(effects, model2, {
        kind: EventKind.ZOOM_CAMERA,
    })
    expect(schedule).toEqual([
        {
            after: { milliseconds: 10 },
            event: { kind: EventKind.ZOOM_CAMERA },
        },
    ])
    expect(model3).toEqual({
        ...model,
        camera: identity(),
        zoomCamera: { in: true, out: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("clicking reset camera context menu resets camera", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        camera: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.RESET_CAMERA,
    })
    expect(model1).toEqual(model)
})

test("pressing z resets camera", () => {
    const effects = makeEffects()
    const model0: Model = {
        ...model,
        camera: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
    const { model: model1 } = update(effects, model0, {
        kind: EventKind.KEYDOWN,
        key: "z",
    })
    expect(model1).toEqual(model)
})
