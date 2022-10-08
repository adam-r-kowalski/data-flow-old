import { pointerDown } from "./ui/pointer_down"
import { render } from "./ui/render"
import { webGL2Renderer } from "./ui/webgl2"
import { Pointer, UI } from "./ui"
import { Document, Window, PointerEvent } from "./ui/dom"

export const transformPointer = (p: PointerEvent): Pointer => ({
    id: p.pointerId,
    position: { x: p.clientX, y: p.clientY },
})

export type Dispatch<AppEvent> = (event: AppEvent) => Promise<void>

type View<Model, AppEvent> = (model: Model, dispatch: Dispatch<AppEvent>) => UI

interface Milliseconds {
    milliseconds: number
}

interface Scheduled<AppEvent> {
    after: Milliseconds
    event: AppEvent
}

export interface UpdateResult<Model, AppEvent> {
    model: Model
    schedule?: Scheduled<AppEvent>[]
    dispatch?: AppEvent[]
    promise?: Promise<AppEvent>
    cursor?: boolean
}

type Update<Model, AppEvent> = (
    model: Model,
    event: AppEvent
) => UpdateResult<Model, AppEvent>

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
        setTimeout,
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
                renderer = render(renderer, view(model, dispatch))
                renderQueued = false
            })
        }
    }
    const dispatch = async (event: AppEvent): Promise<void> => {
        const {
            model: newModel,
            schedule,
            dispatch: dispatchEvents,
            promise,
            cursor,
        } = update(model, event)
        const modelChanged = model !== newModel
        model = newModel
        if (modelChanged) scheduleRender()
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
