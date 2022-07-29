import { pointerDown } from "./pointer_down"
import { render } from "./render"
import { ProgramError, ProgramKind, WebGL2Renderer, webGL2Renderer } from "./webgl2"
import { Pointer, UI } from "."
import { Document, Window, PointerEvent } from "./dom"

export const transformPointer = (p: PointerEvent): Pointer => ({
    id: p.pointerId,
    position: { x: p.clientX, y: p.clientY }
})

export type Dispatch<AppEvent> = (event: AppEvent) => void

type View<Model, AppEvent> = (model: Model) => UI<AppEvent>

interface Milliseconds {
    milliseconds: number
}

interface Scheduled<AppEvent> {
    after: Milliseconds
    event: AppEvent
}

export interface UpdateResult<Model, AppEvent> {
    model: Model
    render?: boolean
    schedule?: Scheduled<AppEvent>[]
    dispatch?: AppEvent[]
}

type Update<Model, AppEvent> = (model: Model, event: AppEvent) => UpdateResult<Model, AppEvent>

interface Properties<Model, AppEvent> {
    model: Model
    view: View<Model, AppEvent>
    update: Update<Model, AppEvent>
    window: Window
    document: Document
    requestAnimationFrame: (callback: () => void) => void
    setTimeout: (callback: () => void, milliseconds: number) => void
    pointerDown: (dispatch: Dispatch<AppEvent>, pointer: Pointer) => void
}

export interface Success<AppEvent> {
    kind: ProgramKind.DATA
    dispatch: Dispatch<AppEvent>
}

export const run = <Model, AppEvent>(properties: Properties<Model, AppEvent>): Success<AppEvent> | ProgramError => {
    let { model, view, update, window, document, requestAnimationFrame, setTimeout } = properties
    const renderer_or_error = webGL2Renderer<AppEvent>({
        width: window.innerWidth,
        height: window.innerHeight,
        window,
        document,
    })
    switch (renderer_or_error.kind) {
        case ProgramKind.ERROR:
            return renderer_or_error
        case ProgramKind.DATA:
            let renderer = renderer_or_error
            let renderQueued = false
            const scheduleRender = () => {
                if (!renderQueued) {
                    renderQueued = true
                    requestAnimationFrame(() => {
                        renderer = render(renderer, view(model))
                        renderQueued = false
                    })
                }
            }
            const dispatch = (event: AppEvent) => {
                const { model: newModel, render, schedule, dispatch: dispatchEvents } = update(model, event)
                model = newModel
                if (render) scheduleRender()
                for (const { after, event } of schedule ?? []) {
                    const { milliseconds } = after
                    setTimeout(() => dispatch(event), milliseconds)
                }
                for (const event of dispatchEvents ?? []) dispatch(event)
            }
            renderer.dispatch = dispatch
            document.body.appendChild(renderer.canvas)
            document.addEventListener("pointerdown", p => {
                const transformed = transformPointer(p)
                properties.pointerDown(dispatch, transformed)
                renderer = pointerDown<AppEvent, WebGL2Renderer<AppEvent>>(renderer, transformed)
            })
            window.addEventListener("resize", () => {
                renderer.size = { width: window.innerWidth, height: window.innerHeight }
                scheduleRender()
            })
            scheduleRender()
            return { kind: ProgramKind.DATA, dispatch }
    }
}
