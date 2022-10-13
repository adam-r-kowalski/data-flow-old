import { pointerDown } from "./ui/pointer_down"
import { makeRenderer, resize, render } from "./ui/renderer"
import { Pointer, UI } from "./ui"
import { Document, PointerEvent, Window } from "./ui/dom"
import { pointerMove } from "./ui/pointer_move"
import { pointerUp } from "./ui/pointer_up"

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
    pointerDown: (dispatch: Dispatch<AppEvent>, event: Pointer) => void
    pointerMove: (dispatch: Dispatch<AppEvent>, event: Pointer) => void
    pointerUp: (dispatch: Dispatch<AppEvent>, event: Pointer) => void
    supportsCoalesced?: boolean
}

const transformPointer = (p: PointerEvent): Pointer => ({
    id: p.pointerId,
    position: {
        x: p.clientX,
        y: p.clientY,
    },
    count: p.detail,
})

const registerPointerMove = (
    supportsCoalesced: boolean,
    document: Document,
    cb: (p: Pointer) => void
): void => {
    if (supportsCoalesced) {
        document.addEventListener("pointermove", (e) => {
            e.getCoalescedEvents().forEach((p) => {
                cb(transformPointer(p))
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
                count: p.detail,
            }
            cb(event)
        })
    }
}

export const run = <Model, AppEvent>(
    properties: Properties<Model, AppEvent>
): Dispatch<AppEvent> => {
    let {
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame,
        supportsCoalesced,
    } = properties
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
        const pointer = transformPointer(p)
        properties.pointerDown(dispatch, pointer)
        pointerDown(renderer, pointer)
    })
    document.addEventListener("pointerup", (p) => {
        const pointer = transformPointer(p)
        properties.pointerUp(dispatch, pointer)
        pointerUp(renderer, pointer)
    })
    registerPointerMove(supportsCoalesced ?? false, document, (pointer) => {
        properties.pointerMove(dispatch, pointer)
        pointerMove(renderer, pointer)
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
