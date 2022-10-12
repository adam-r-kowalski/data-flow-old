import { pointerDown } from "./ui/pointer_down"
import { makeRenderer, resize, render } from "./ui/renderer"
import { Pointer, UI } from "./ui"
import { Document, Window } from "./ui/dom"

export type Dispatch<AppEvent> = (event: AppEvent) => void

type View<Model, AppEvent> = (model: Model, dispatch: Dispatch<AppEvent>) => UI

type Update<Model, AppEvent> = (
    model: Model,
    event: AppEvent,
    dispatch: Dispatch<AppEvent>
) => Model

interface Properties<Model, AppEvent> {
    model: Model
    view: View<Model, AppEvent>
    update: Update<Model, AppEvent>
    window: Window<AppEvent>
    document: Document
    requestAnimationFrame: (callback: () => void) => void
    pointerDown: (dispatch: Dispatch<AppEvent>, pointer: Pointer) => void
}

export const run = <Model, AppEvent>(
    properties: Properties<Model, AppEvent>
): Dispatch<AppEvent> => {
    let { model, view, update, window, document, requestAnimationFrame } =
        properties
    const renderer = makeRenderer({
        width: window.innerWidth,
        height: window.innerHeight,
        window,
        document,
    })
    let renderQueued = false
    const scheduleRender = () => {
        if (renderQueued) return
        renderQueued = true
        requestAnimationFrame(() => {
            render(renderer, view(model, dispatch))
            renderQueued = false
        })
    }
    window.addEventListener("message", (message) => {
        const newModel = update(model, message.data, dispatch)
        const modelChanged = model !== newModel
        model = newModel
        if (modelChanged) scheduleRender()
    })
    const dispatch = (event: AppEvent): void => window.postMessage(event)
    document.body.appendChild(renderer.canvas)
    document.addEventListener("pointerdown", (p) => {
        console.log(p.detail)
        const transformed = {
            id: p.pointerId,
            count: p.detail,
            position: { x: p.clientX, y: p.clientY },
        }
        properties.pointerDown(dispatch, transformed)
        pointerDown(renderer, transformed)
    })
    window.addEventListener("resize", () => {
        resize(renderer, {
            width: window.innerWidth,
            height: window.innerHeight,
        })
        scheduleRender()
    })
    scheduleRender()
    return dispatch
}
