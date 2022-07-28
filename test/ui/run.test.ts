import { container, Pointer, row, text, UI } from "../../src/ui"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { Dispatch, run, Success } from "../../src/ui/run"
import { ProgramError, ProgramKind } from "../../src/ui/webgl2"

const mockRequestAnimationFrame = (callback: () => void) => callback()

const mockSetTimeout = (callback: () => void, milliseconds: number) => callback()

const extractDispatch = <AppEvent>(successOrError: Success<AppEvent> | ProgramError): Dispatch<AppEvent> => {
    switch (successOrError.kind) {
        case ProgramKind.DATA:
            return successOrError.dispatch
        case ProgramKind.ERROR:
            throw successOrError
    }
}

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
    const dispatch = extractDispatch(run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { }
    }))
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
    const dispatch = extractDispatch(run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { }
    }))
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
    const dispatch = extractDispatch(run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { }
    }))
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
    const dispatch = extractDispatch(run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: (callback: () => void, milliseconds: number) => {
            timeouts.push(milliseconds)
            callback()
        },
        pointerDown: () => { }
    }))
    dispatch(true)
    expect(events).toEqual([true, false, false])
    expect(timeouts).toEqual([100, 200])
})

test("if update returns dispatch events they get dispatched immediately", () => {
    type State = number
    type AppEvent = boolean
    const state = 0
    const view = (state: State) => text<AppEvent>(state.toString())
    const events: AppEvent[] = []
    const update = (state: State, event: AppEvent) => {
        events.push(event)
        return event ? {
            state,
            dispatch: [false, false]
        } : { state }
    }
    const timeouts: number[] = []
    const dispatch = extractDispatch(run({
        state,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: (callback: () => void, milliseconds: number) => {
            timeouts.push(milliseconds)
            callback()
        },
        pointerDown: () => { }
    }))
    dispatch(true)
    expect(events).toEqual([true, false, false])
    expect(timeouts).toEqual([])
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
    let pointers: Pointer[] = []
    run({
        state,
        view,
        update,
        window: mockWindow(),
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: (_, pointer) => { pointers.push(pointer) }
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
    expect(pointers).toEqual([
        {
            id: 0,
            position: { x: 0, y: 0 }
        },
        {
            id: 0,
            position: { x: 51, y: 0 }
        },
        {
            id: 0,
            position: { x: 200, y: 200 }
        },
    ])
})

test("resize events trigger a rerender", () => {
    type State = number
    type AppEvent = boolean
    const state: State = 0
    let viewCallCount = 0
    const view = (state: State): UI<AppEvent> => {
        ++viewCallCount
        return text(state.toString())
    }
    const update = (state: State, event: AppEvent) => ({ state })
    const window = mockWindow()
    run({
        state,
        view,
        update,
        window,
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { }
    })
    expect(viewCallCount).toEqual(1)
    window.fireEvent('resize')
    expect(viewCallCount).toEqual(2)
})

test("simulate failure", () => {
    type State = number
    type AppEvent = boolean
    const state: State = 0
    const view = (state: State): UI<AppEvent> => text(state.toString())
    const update = (state: State, event: AppEvent) => ({ state })
    const window = mockWindow()
    const error = run({
        state,
        view,
        update,
        window,
        document: mockDocument(true),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { }
    }) as ProgramError
    expect(error).toEqual({
        kind: ProgramKind.ERROR,
        vertexInfoLog: null,
        fragmentInfoLog: null,
    })
})
