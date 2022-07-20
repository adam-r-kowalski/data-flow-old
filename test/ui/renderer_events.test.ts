import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { pointerDown } from "../../src/ui/pointer_down"
import { render } from "../../src/ui/render"
import { WebGL2Renderer, webGL2Renderer } from "../../src/ui/webgl2"
import { container, scene } from "../../src/ui"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

enum AppEvent { INCREMENT_A, INCREMENT_B }

interface State {
    a: number
    b: number
}

const initialState = (): State => ({
    a: 0,
    b: 0
})

const update = (state: State, event: AppEvent): State => {
    switch (event) {
        case AppEvent.INCREMENT_A:
            state.a++
            return state
        case AppEvent.INCREMENT_B:
            state.b++
            return state
    }
}

const mockRenderer = <AppEvent>(dispatch: (event: AppEvent) => void) => webGL2Renderer<AppEvent>({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow(),
    dispatch
}) as WebGL2Renderer<AppEvent>

test("click first container", () => {
    let state = initialState()
    const dispatch = (event: AppEvent) => { state = update(state, event) }
    let renderer = mockRenderer(dispatch)
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: AppEvent.INCREMENT_A
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: AppEvent.INCREMENT_B
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown<AppEvent, WebGL2Renderer<AppEvent>>(renderer, { x: 125, y: 225, id: 0 })
    expect(state).toEqual({ a: 1, b: 0 })
})

test("click second container", () => {
    let state = initialState()
    const dispatch = (event: AppEvent) => { state = update(state, event) }
    let renderer = mockRenderer(dispatch)
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: AppEvent.INCREMENT_A
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: AppEvent.INCREMENT_B
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown<AppEvent, WebGL2Renderer<AppEvent>>(renderer, { x: 325, y: 275, id: 0 })
    expect(state).toEqual({ a: 0, b: 1 })
})

test("click translated container", () => {
    let state = initialState()
    const dispatch = (event: AppEvent) => { state = update(state, event) }
    let renderer = mockRenderer(dispatch)
    const ui = scene({
        camera: translate(100, 0),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: AppEvent.INCREMENT_A
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: AppEvent.INCREMENT_B
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown<AppEvent, WebGL2Renderer<AppEvent>>(renderer, { x: 25, y: 225, id: 0 })
    expect(state).toEqual({ a: 1, b: 0 })
})

test("renderer starts with identity camera", () => {
    let state = 0
    const dispatch = (_: boolean) => { return { state } }
    const renderer = mockRenderer(dispatch)
    const view = container<boolean>({ width: 50, height: 50, color: red })
    render(renderer, view)
    expect(renderer.cameras).toEqual([identity()])
})
