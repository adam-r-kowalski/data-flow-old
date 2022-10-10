import { EventKind } from "../../src/event"
import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { Model } from "../../src/model"
import { emptyModel } from "../../src/model/empty"
import { FocusKind } from "../../src/model/focus"
import { PointerActionKind } from "../../src/model/pointer_action"
import { QuickSelectKind } from "../../src/model/quick_select"
import { Pointer } from "../../src/ui"
import { mockDocument } from "../../src/ui/mock"
import { update } from "../../src/update"
import { makeEffects, makeTracked, resetTracked } from "../mock_effects"

const model: Model = emptyModel({ width: 500, height: 500 })

test("pointer down starts panning camera", () => {
    const pointer: Pointer = {
        id: 0,
        position: { x: 0, y: 0 },
    }
    const dispatch = () => {}
    const effects = makeEffects(mockDocument())
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.POINTER_DOWN,
            pointer,
        },
        dispatch
    )
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: { left: true, up: false, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "ArrowLeft",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(-0.5, 0),
        panCamera: { left: true, up: false, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "ArrowLeft",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "j",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: { left: false, up: false, down: true, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "j",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "ArrowDown",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, 0.5),
        panCamera: { left: false, up: false, down: true, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "ArrowDown",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "k",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: { left: false, up: true, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "k",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "ArrowUp",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0, -0.5),
        panCamera: { left: false, up: true, down: false, right: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "ArrowUp",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: { left: false, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "ArrowRight",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: translate(0.5, 0),
        panCamera: { left: false, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "ArrowRight",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "h",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.KEYDOWN,
            key: "l",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.PAN_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.PAN_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model3).toEqual({
        ...model,
        camera: identity(),
        panCamera: { left: true, up: false, down: false, right: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("pressing a non hotkey when nothing focused does nothing", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model1 = update(
        effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "m",
        },
        dispatch
    )
    expect(model1).toEqual(model)
    const model2 = update(
        effects,
        model1,
        {
            kind: EventKind.PAN_CAMERA,
        },
        dispatch
    )
    expect(model2).toEqual(model)
    const model3 = update(
        effects,
        model2,
        {
            kind: EventKind.ZOOM_CAMERA,
        },
        dispatch
    )
    expect(model3).toEqual(model)
    const model4 = update(
        effects,
        model3,
        {
            kind: EventKind.KEYUP,
            key: "m",
        },
        dispatch
    )
    expect(model4).toEqual(model)
})

test("ctrl j when nothing focused zooms camera out", () => {
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "<c-j>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.ZOOM_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([10])
    tracked = resetTracked(tracked)
    expect(model2).toEqual({
        ...model,
        camera: [
            1.0069555500567189, 0, -1.7388875141797087, 0, 1.0069555500567189,
            -1.7388875141797087, 0, 0, 1,
        ],
        zoomCamera: { in: false, out: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "<c-j>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "<c-k>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.ZOOM_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model2).toEqual({
        ...model,
        camera: [
            0.9930924954370359, 0, 1.7268761407410125, 0, 0.9930924954370359,
            1.7268761407410125, 0, 0, 1,
        ],
        zoomCamera: { in: true, out: false, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
    tracked = resetTracked(tracked)
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.KEYUP,
            key: "<c-k>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
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
    let tracked = makeTracked()
    const model1 = update(
        tracked.effects,
        model,
        {
            kind: EventKind.KEYDOWN,
            key: "<c-j>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([])
    tracked = resetTracked(tracked)
    const model2 = update(
        tracked.effects,
        model1,
        {
            kind: EventKind.KEYDOWN,
            key: "<c-k>",
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([])
    expect(tracked.times).toEqual([])
    const model3 = update(
        tracked.effects,
        model2,
        {
            kind: EventKind.ZOOM_CAMERA,
        },
        tracked.dispatch
    )
    expect(tracked.events).toEqual([{ kind: EventKind.ZOOM_CAMERA }])
    expect(tracked.times).toEqual([10])
    expect(model3).toEqual({
        ...model,
        camera: identity(),
        zoomCamera: { in: true, out: true, now: 1 },
        nodePlacementLocation: { x: 250, y: 250, show: true },
    })
})

test("clicking reset camera context menu resets camera", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        camera: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.RESET_CAMERA,
        },
        dispatch
    )
    expect(model1).toEqual(model)
})

test("pressing z resets camera", () => {
    const effects = makeEffects(mockDocument())
    const dispatch = () => {}
    const model0: Model = {
        ...model,
        camera: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
    const model1 = update(
        effects,
        model0,
        {
            kind: EventKind.KEYDOWN,
            key: "z",
        },
        dispatch
    )
    expect(model1).toEqual(model)
})
