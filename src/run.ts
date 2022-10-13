import { pointerDown } from "./ui/pointer_down"
import { makeRenderer, resize, render } from "./ui/renderer"
import { Pointer, PointerDown, UI } from "./ui"
import { Document, Window } from "./ui/dom"
import { pointerMove } from "./ui/pointer_move"

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
    pointerDown: (dispatch: Dispatch<AppEvent>, event: PointerDown) => void
    pointerMove: (dispatch: Dispatch<AppEvent>, event: Pointer) => void
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
        const event = {
            pointer: {
                id: p.pointerId,
                position: { x: p.clientX, y: p.clientY },
            },
            count: p.detail,
        }
        properties.pointerDown(dispatch, event)
        pointerDown(renderer, event)
    })
    if (typeof PointerEvent.prototype.getCoalescedEvents === "function") {
        document.addEventListener("pointermove", (e) => {
            e.getCoalescedEvents().forEach((p) => {
                const event: Pointer = {
                    id: p.pointerId,
                    position: {
                        x: p.clientX,
                        y: p.clientY,
                    },
                }
                properties.pointerMove(dispatch, event)
                pointerMove(renderer, event)
            })
        })
    } else {
        document.addEventListener("pointermove", (p) => {
            const event: Pointer = {
                id: p.pointerId,
                position: {
                    x: p.clientX,
                    y: p.clientY,
                },
            }
            properties.pointerMove(dispatch, event)
            pointerMove(renderer, event)
        })
    }
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
