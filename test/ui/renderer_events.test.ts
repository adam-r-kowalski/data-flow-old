import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { pointerDown } from "../../src/ui/pointer_down"
import { render } from "../../src/ui/render"
import { webGL2Renderer } from "../../src/ui/webgl2"
import { container, scene } from "../../src/ui"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

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

const mockRenderer = webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow(),
})

test("click first container", () => {
    let model = initialModel
    let renderer = mockRenderer
    const dispatch = (event: AppEvent) => (model = update(model, event))
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, {
        position: { x: 125, y: 225 },
        id: 0,
    })
    expect(model).toEqual({ a: 1, b: 0 })
})

test("click second container", () => {
    let model = initialModel
    let renderer = mockRenderer
    const dispatch = (event: AppEvent) => (model = update(model, event))
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, {
        position: { x: 325, y: 275 },
        id: 0,
    })
    expect(model).toEqual({ a: 0, b: 1 })
})

test("click translated container", () => {
    let model = initialModel
    const dispatch = (event: AppEvent) => (model = update(model, event))
    let renderer = mockRenderer
    const ui = scene({
        camera: translate(100, 0),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => dispatch(AppEvent.A),
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => dispatch(AppEvent.B),
            }),
        ],
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, {
        position: { x: 25, y: 225 },
        id: 0,
    })
    expect(model).toEqual({ a: 1, b: 0 })
})

test("renderer starts with identity camera", () => {
    const renderer = mockRenderer
    const view = container({ width: 50, height: 50, color: red })
    render(renderer, view)
    expect(renderer.cameras).toEqual([identity()])
})
