import { pointerDown } from "./pointer_down"
import { render } from "./render"
import { ProgramError, ProgramKind, WebGL2Renderer, webGL2Renderer } from "./webgl2"
import { Pointer, UI } from "."
import { Document, Window, PointerEvent } from "./dom"

export const transformPointer = (p: PointerEvent): Pointer => ({
    x: p.clientX,
    y: p.clientY,
    id: p.pointerId,
})

export type Dispatch<AppEvent> = (event: AppEvent) => void

type View<State, AppEvent> = (state: State) => UI<AppEvent>

interface Milliseconds {
    milliseconds: number
}

interface Scheduled<AppEvent> {
    after: Milliseconds
    event: AppEvent
}

export interface UpdateResult<State, AppEvent> {
    state: State
    render?: boolean
    schedule?: Scheduled<AppEvent>[]
    dispatch?: AppEvent[]
}

type Update<State, AppEvent> = (state: State, event: AppEvent) => UpdateResult<State, AppEvent>

interface Properties<State, AppEvent> {
    state: State
    view: View<State, AppEvent>
    update: Update<State, AppEvent>
    window: Window
    document: Document
    requestAnimationFrame: (callback: () => void) => void
    setTimeout: (callback: () => void, milliseconds: number) => void
}

export interface Success<AppEvent> {
    kind: ProgramKind.DATA
    dispatch: Dispatch<AppEvent>
}

export const run = <State, AppEvent>(properties: Properties<State, AppEvent>): Success<AppEvent> | ProgramError => {
    let { state, view, update, window, document, requestAnimationFrame, setTimeout } = properties
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
                        renderer = render(renderer, view(state))
                        renderQueued = false
                    })
                }
            }
            const dispatch = (event: AppEvent) => {
                const { state: newState, render, schedule, dispatch: dispatchEvents } = update(state, event)
                state = newState
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
                renderer = pointerDown<AppEvent, WebGL2Renderer<AppEvent>>(renderer, transformPointer(p))
            })
            window.addEventListener("resize", () => {
                renderer.size = { width: window.innerWidth, height: window.innerHeight }
                scheduleRender()
            })
            scheduleRender()
            return { kind: ProgramKind.DATA, dispatch }
    }
}
