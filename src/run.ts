import { pointerDown } from "./renderer/pointer_down"
import { render } from "./renderer/render"
import { webGL2Renderer } from "./renderer/webgl2"
import { Pointer, UI } from "./ui"

export const transformPointer = (p: PointerEvent): Pointer => ({
    x: p.clientX,
    y: p.clientY,
    id: p.pointerId,
})

export type Dispatch<Event> = (event: Event) => void

type View<State, Event> = (dispatch: Dispatch<Event>, state: State) => UI

interface UpdateResult<State> {
    state: State
    rerender: boolean
}

type Update<State, Event> = (state: State, event: Event) => UpdateResult<State>

export const run = <State, Event>(state: State, view: View<State, Event>, update: Update<State, Event>): Dispatch<Event> => {
    let renderer = webGL2Renderer({
        width: window.innerWidth,
        height: window.innerHeight
    })
    let renderQueued = false
    const scheduleRender = () => {
        if (!renderQueued) {
            renderQueued = true
            requestAnimationFrame(() => {
                renderer = render(renderer, view(dispatch, state))
                renderQueued = false
            })
        }
    }
    const dispatch = (event: Event) => {
        const { state: newState, rerender } = update(state, event)
        state = newState
        if (rerender) scheduleRender()
    }
    document.body.appendChild(renderer.canvas)
    document.addEventListener("pointerdown", p => {
        renderer = pointerDown(renderer, transformPointer(p))
    })
    window.addEventListener("resize", () => {
        renderer.size = { width: window.innerWidth, height: window.innerHeight }
        scheduleRender()
    })
    scheduleRender()
    return dispatch
}
