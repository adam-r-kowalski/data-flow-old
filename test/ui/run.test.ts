import { text } from "../../src/ui"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { run } from "../../src/ui/run"

test("run returns a dispatch function which can run your events", () => {
    enum AppEvent { INCREMENT, DECREMENT }
    interface State {
        value: number
    }
    const state = { value: 0 }
    const view = (state: State) => text<AppEvent>(state.value.toString())
    const update = (state: State, event: AppEvent) => {
        switch (event) {
            case AppEvent.INCREMENT:
                state.value++
                break
            case AppEvent.DECREMENT:
                state.value--
                break
        }
        return { state }
    }
    const dispatch = run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: (callack: () => void) => { },
        setTimeout: (callback: () => void, milliseconds: number) => { },
    })
    dispatch(AppEvent.INCREMENT)
    expect(state).toEqual({ value: 1 })
})