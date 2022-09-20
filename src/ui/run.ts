import { pointerDown } from "./pointer_down"
import { render } from "./render"
import {
    ProgramError,
    ProgramKind,
    WebGL2Renderer,
    webGL2Renderer,
} from "./webgl2"
import { Pointer, UI, AppEvent } from "."
import { Document, Window, PointerEvent } from "./dom"
import { GenerateUUID } from "../model/graph"
import { Table } from "../model/table"

export const transformPointer = (p: PointerEvent): Pointer => ({
    id: p.pointerId,
    position: { x: p.clientX, y: p.clientY },
})

export type Dispatch = (event: AppEvent) => Promise<void>

type View<Model> = (model: Model) => UI

interface Milliseconds {
    milliseconds: number
}

interface Scheduled {
    after: Milliseconds
    event: AppEvent
}

export interface UpdateResult<Model> {
    model: Model
    render?: boolean
    schedule?: Scheduled[]
    dispatch?: AppEvent[]
    promise?: Promise<AppEvent>
    cursor?: boolean
}

export type CurrentTime = () => number

export interface Effects {
    currentTime: CurrentTime
    generateUUID: GenerateUUID
    promptUserForTable: () => Promise<Table>
}

type Update<Model> = (
    effects: Effects,
    model: Model,
    event: AppEvent
) => UpdateResult<Model>

interface Properties<Model> {
    model: Model
    view: View<Model>
    update: Update<Model>
    window: Window
    document: Document
    requestAnimationFrame: (callback: () => void) => void
    setTimeout: (callback: () => void, milliseconds: number) => void
    pointerDown: (dispatch: Dispatch, pointer: Pointer) => void
    effects: Effects
}

export interface Success {
    kind: ProgramKind.DATA
    dispatch: Dispatch
}

export const run = <Model>(
    properties: Properties<Model>
): Success | ProgramError => {
    let {
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame,
        setTimeout,
        effects,
    } = properties
    const renderer_or_error = webGL2Renderer({
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
            const dispatch = async (event: AppEvent): Promise<void> => {
                const {
                    model: newModel,
                    render,
                    schedule,
                    dispatch: dispatchEvents,
                    promise,
                    cursor,
                } = update(effects, model, event)
                model = newModel
                if (render) scheduleRender()
                for (const { after, event } of schedule ?? []) {
                    const { milliseconds } = after
                    setTimeout(() => dispatch(event), milliseconds)
                }
                for (const event of dispatchEvents ?? []) dispatch(event)
                if (cursor !== undefined) {
                    document.body.style.cursor = cursor ? "auto" : "none"
                }
                if (promise !== undefined) await promise.then(dispatch)
            }
            renderer.dispatch = dispatch
            document.body.appendChild(renderer.canvas)
            document.addEventListener("pointerdown", (p) => {
                const transformed = transformPointer(p)
                properties.pointerDown(dispatch, transformed)
                renderer = pointerDown<WebGL2Renderer>(renderer, transformed)
            })
            window.addEventListener("resize", () => {
                renderer.size = {
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
                scheduleRender()
            })
            scheduleRender()
            return { kind: ProgramKind.DATA, dispatch }
    }
}
