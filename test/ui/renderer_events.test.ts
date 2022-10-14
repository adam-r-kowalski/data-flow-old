import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { onClick } from "../../src/ui/on_click"
import { pointerMove } from "../../src/ui/pointer_move"
import { pointerUp } from "../../src/ui/pointer_up"
import { makeRenderer, render } from "../../src/ui/renderer"
import { container, PointerDrag, scene } from "../../src/ui"
import { pointerDown } from "../../src/ui/pointer_down"
import { onDoubleClick } from "../../src/ui/on_double_click"

interface Model {
    a: number
    b: number
}

const initialModel: Model = {
    a: 0,
    b: 0,
}

enum AppEvent {
    A,
    B,
}

const update = (model: Model, event: AppEvent): Model => {
    switch (event) {
        case AppEvent.A:
            return { a: model.a + 1, b: model.b }
        case AppEvent.B:
            return { a: model.a, b: model.b + 1 }
    }
}

const mockRenderer = () =>
    makeRenderer({
        width: 500,
        height: 500,
        document: mockDocument(),
        window: mockWindow(),
    })

test("click first container", () => {
    let model = initialModel
    const renderer = mockRenderer()
    const dispatch = (event: AppEvent) => (model = update(model, event))
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    render(renderer, ui)
    onClick(renderer, { x: 125, y: 225 })
    expect(model).toEqual({ a: 1, b: 0 })
})

test("click second container", () => {
    let model = initialModel
    const renderer = mockRenderer()
    const dispatch = (event: AppEvent) => (model = update(model, event))
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    render(renderer, ui)
    onClick(renderer, { x: 325, y: 275 })
    expect(model).toEqual({ a: 0, b: 1 })
})

test("click translated container", () => {
    let model = initialModel
    const dispatch = (event: AppEvent) => (model = update(model, event))
    const renderer = mockRenderer()
    const ui = scene({
        camera: translate(100, 0),
        children: [
            container({
                width: 50,
                height: 50,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    render(renderer, ui)
    onClick(renderer, { x: 25, y: 225 })
    expect(model).toEqual({ a: 1, b: 0 })
})

test("renderer starts with identity camera", () => {
    const renderer = mockRenderer()
    const view = container({})
    render(renderer, view)
    expect(renderer.cameras).toEqual([identity()])
})

test("double click", () => {
    const renderer = mockRenderer()
    let count = 0
    const dispatch = () => ++count
    const ui = container({
        width: 50,
        height: 50,
        x: 100,
        y: 200,
        onDoubleClick: dispatch,
    })
    render(renderer, ui)
    onDoubleClick(renderer, { x: 125, y: 225 })
    expect(count).toEqual(1)
})

test("on drag", () => {
    const renderer = mockRenderer()
    const dragEvents: PointerDrag[] = []
    const dispatch = (event: PointerDrag) => dragEvents.push(event)
    const ui = container({
        width: 50,
        height: 50,
        x: 100,
        y: 200,
        onDrag: dispatch,
    })
    render(renderer, ui)
    expect(dragEvents).toEqual([])
    expect(renderer.onDrag).toBeUndefined()
    pointerDown(renderer, {
        position: { x: 120, y: 210 },
        id: 0,
        count: 1,
    })
    expect(dragEvents).toEqual([])
    expect(renderer.onDrag).toEqual(dispatch)
    pointerMove(renderer, {
        position: { x: 150, y: 220 },
        id: 0,
        count: 1,
    })
    expect(dragEvents).toEqual([{ x: 30, y: 10 }])
    expect(renderer.onDrag).toEqual(dispatch)
    pointerUp(renderer, {
        position: { x: 120, y: 210 },
        id: 0,
        count: 1,
    })
    expect(dragEvents).toEqual([{ x: 30, y: 10 }])
    expect(renderer.onDrag).toBeUndefined()
})
