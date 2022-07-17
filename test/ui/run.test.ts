import { container, row, text } from "../../src/ui"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { run } from "../../src/ui/run"

const mockRequestAnimationFrame = (callback: () => void) => callback()

const mockSetTimeout = (callback: () => void, milliseconds: number) => callback()

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
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout
    })
    dispatch(AppEvent.INCREMENT)
    expect(state).toEqual({ value: 1 })
})

test("if update does not return render true then view gets called once", () => {
    type State = number
    type AppEvent = boolean
    const state = 0
    let viewCallCount = 0
    const view = (state: State) => {
        ++viewCallCount
        return text<AppEvent>(state.toString())
    }
    const update = (state: State, event: AppEvent) => {
        return { state }
    }
    const dispatch = run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout
    })
    dispatch(true)
    expect(viewCallCount).toEqual(1)
})

test("if update returns render true then view gets called again", () => {
    type State = number
    type AppEvent = boolean
    const state = 0
    let viewCallCount = 0
    const view = (state: State) => {
        ++viewCallCount
        return text<AppEvent>(state.toString())
    }
    const update = (state: State, event: AppEvent) => {
        return { state, render: true }
    }
    const dispatch = run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout
    })
    dispatch(true)
    expect(viewCallCount).toEqual(2)
})

test("if update returns scheduled events they get dispatched after some milliseconds", () => {
    type State = number
    type AppEvent = boolean
    const state = 0
    const view = (state: State) => text<AppEvent>(state.toString())
    const events: AppEvent[] = []
    const update = (state: State, event: AppEvent) => {
        events.push(event)
        return event ? {
            state,
            schedule: [
                { after: { milliseconds: 100 }, event: false },
                { after: { milliseconds: 200 }, event: false },
            ]
        } : { state }
    }
    const timeouts: number[] = []
    const dispatch = run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: (callback: () => void, milliseconds: number) => {
            timeouts.push(milliseconds)
            callback()
        }
    })
    dispatch(true)
    expect(events).toEqual([true, false, false])
    expect(timeouts).toEqual([100, 200])
})

test("pointer down events can lead to on click handlers firing", () => {
    type State = number
    enum AppEvent { A, B }
    const state: State = 0
    const view = (state: State) => row([
        container({ onClick: AppEvent.A, width: 50, height: 50 }),
        container({ onClick: AppEvent.B, width: 50, height: 50 }),
    ])
    const events: AppEvent[] = []
    const update = (state: State, event: AppEvent) => {
        events.push(event)
        return { state }
    }
    const document = mockDocument()
    run({
        state,
        view,
        update,
        window: mockWindow(),
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout
    })
    document.fireEvent('pointerdown', {
        clientX: 0,
        clientY: 0,
        pointerId: 0
    })
    document.fireEvent('pointerdown', {
        clientX: 51,
        clientY: 0,
        pointerId: 0
    })
    document.fireEvent('pointerdown', {
        clientX: 200,
        clientY: 200,
        pointerId: 0
    })
    expect(events).toEqual([AppEvent.A, AppEvent.B])
})