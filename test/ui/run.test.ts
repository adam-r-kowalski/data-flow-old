import { container, Pointer, row, text, UI } from "../../src/ui"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { Dispatch, Effects, run, Success } from "../../src/ui/run"
import { ProgramError, ProgramKind } from "../../src/ui/webgl2"
import { makeEffects } from "../mock_effects"

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
    interface Model {
        value: number
    }
    const model = { value: 0 }
    const view = (model: Model) => text<AppEvent>(model.value.toString())
    const update = (_: Effects, model: Model, event: AppEvent) => {
        switch (event) {
            case AppEvent.INCREMENT:
                model.value++
                break
            case AppEvent.DECREMENT:
                model.value--
                break
        }
        return { model }
    }
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }))
    dispatch(AppEvent.INCREMENT)
    expect(model).toEqual({ value: 1 })
})

test("if update does not return render true then view gets called once", () => {
    type Model = number
    type AppEvent = boolean
    const model = 0
    let viewCallCount = 0
    const view = (model: Model) => {
        ++viewCallCount
        return text<AppEvent>(model.toString())
    }
    const update = (_: Effects, model: Model, _1: AppEvent) => {
        return { model }
    }
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }))
    dispatch(true)
    expect(viewCallCount).toEqual(1)
})

test("if update returns render true then view gets called again", () => {
    type Model = number
    type AppEvent = boolean
    const model = 0
    let viewCallCount = 0
    const view = (model: Model) => {
        ++viewCallCount
        return text<AppEvent>(model.toString())
    }
    const update = (_: Effects, model: Model, _1: AppEvent) => {
        return { model, render: true }
    }
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }))
    dispatch(true)
    expect(viewCallCount).toEqual(2)
})

test("if update returns scheduled events they get dispatched after some milliseconds", () => {
    type Model = number
    type AppEvent = boolean
    const model = 0
    const view = (model: Model) => text<AppEvent>(model.toString())
    const events: AppEvent[] = []
    const update = (_: Effects, model: Model, event: AppEvent) => {
        events.push(event)
        return event ? {
            model,
            schedule: [
                { after: { milliseconds: 100 }, event: false },
                { after: { milliseconds: 200 }, event: false },
            ]
        } : { model }
    }
    const timeouts: number[] = []
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: (callback: () => void, milliseconds: number) => {
            timeouts.push(milliseconds)
            callback()
        },
        pointerDown: () => { },
        effects: makeEffects()
    }))
    dispatch(true)
    expect(events).toEqual([true, false, false])
    expect(timeouts).toEqual([100, 200])
})

test("if update returns dispatch events they get dispatched immediately", () => {
    type Model = number
    type AppEvent = boolean
    const model = 0
    const view = (model: Model) => text<AppEvent>(model.toString())
    const events: AppEvent[] = []
    const update = (_: Effects, model: Model, event: AppEvent) => {
        events.push(event)
        return event ? {
            model,
            dispatch: [false, false]
        } : { model }
    }
    const timeouts: number[] = []
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: (callback: () => void, milliseconds: number) => {
            timeouts.push(milliseconds)
            callback()
        },
        pointerDown: () => { },
        effects: makeEffects()
    }))
    dispatch(true)
    expect(events).toEqual([true, false, false])
    expect(timeouts).toEqual([])
})

test("pointer down events can lead to on click handlers firing", () => {
    type Model = number
    enum AppEvent { A, B }
    const model: Model = 0
    const view = (_: Model) => row([
        container({ onClick: AppEvent.A, width: 50, height: 50 }),
        container({ onClick: AppEvent.B, width: 50, height: 50 }),
    ])
    const events: AppEvent[] = []
    const update = (_: Effects, model: Model, event: AppEvent) => {
        events.push(event)
        return { model }
    }
    const document = mockDocument()
    let pointers: Pointer[] = []
    run({
        model,
        view,
        update,
        window: mockWindow(),
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: (_, pointer) => { pointers.push(pointer) },
        effects: makeEffects()
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
    type Model = number
    type AppEvent = boolean
    const model: Model = 0
    let viewCallCount = 0
    const view = (model: Model): UI<AppEvent> => {
        ++viewCallCount
        return text(model.toString())
    }
    const update = (_: Effects, model: Model, _1: AppEvent) => ({ model })
    const window = mockWindow()
    run({
        model,
        view,
        update,
        window,
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    })
    expect(viewCallCount).toEqual(1)
    window.fireEvent('resize')
    expect(viewCallCount).toEqual(2)
})

test("simulate failure", () => {
    type Model = number
    type AppEvent = boolean
    const model: Model = 0
    const view = (model: Model): UI<AppEvent> => text(model.toString())
    const update = (_: Effects, model: Model, _0: AppEvent) => ({ model })
    const window = mockWindow()
    const error = run({
        model,
        view,
        update,
        window,
        document: mockDocument(true),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }) as ProgramError
    expect(error).toEqual({
        kind: ProgramKind.ERROR,
        vertexInfoLog: null,
        fragmentInfoLog: null,
    })
})

test("hide the cursor", () => {
    type Model = number
    type AppEvent = boolean
    const model: Model = 0
    const view = (model: Model): UI<AppEvent> => text(model.toString())
    const update = (_: Effects, model: Model, _0: AppEvent) => ({ model, cursor: false })
    const window = mockWindow()
    const document = mockDocument()
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }))
    expect(document.body.style.cursor).toEqual('auto')
    dispatch(true)
    expect(document.body.style.cursor).toEqual('none')
})

test("show the cursor", () => {
    type Model = number
    type AppEvent = boolean
    const model: Model = 0
    const view = (model: Model): UI<AppEvent> => text(model.toString())
    const update = (_: Effects, model: Model, _0: AppEvent) => ({ model, cursor: true })
    const window = mockWindow()
    const document = mockDocument()
    document.body.style.cursor = 'none'
    const dispatch = extractDispatch(run({
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => { },
        effects: makeEffects()
    }))
    expect(document.body.style.cursor).toEqual('none')
    dispatch(true)
    expect(document.body.style.cursor).toEqual('auto')
})
