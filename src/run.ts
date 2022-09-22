import { pointerDown } from "./ui/pointer_down"
import { render } from "./ui/render"
import { webGL2Renderer } from "./ui/webgl2"
import { Pointer, UI } from "./ui"
import { Document, Window, PointerEvent } from "./ui/dom"
import { GenerateUUID } from "./model/graph"
import { Table } from "./model/table"
import { Model } from "./model"
import { AppEvent } from "./event"

export const transformPointer = (p: PointerEvent): Pointer => ({
    id: p.pointerId,
    position: { x: p.clientX, y: p.clientY },
})

export type Dispatch = (event: AppEvent) => Promise<void>

type View = (model: Model) => UI

interface Milliseconds {
    milliseconds: number
}

interface Scheduled {
    after: Milliseconds
    event: AppEvent
}

export interface UpdateResult {
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

type Update = (effects: Effects, model: Model, event: AppEvent) => UpdateResult

interface Properties {
    model: Model
    view: View
    update: Update
    window: Window
    document: Document
    requestAnimationFrame: (callback: () => void) => void
    setTimeout: (callback: () => void, milliseconds: number) => void
    pointerDown: (dispatch: Dispatch, pointer: Pointer) => void
    effects: Effects
}

export const run = (properties: Properties): Dispatch => {
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
    let renderer = webGL2Renderer({
        width: window.innerWidth,
        height: window.innerHeight,
        window,
        document,
    })
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
        renderer = pointerDown(renderer, transformed)
    })
    window.addEventListener("resize", () => {
        renderer.size = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        scheduleRender()
    })
    scheduleRender()
    return dispatch
}
