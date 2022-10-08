import { container, Pointer, row, text, UI } from "../src/ui"
import { mockDocument, mockWindow } from "../src/ui/mock"
import { Dispatch, run, UpdateResult } from "../src/run"

const mockRequestAnimationFrame = (callback: () => void) => callback()

const mockSetTimeout = (callback: () => void, _: number) => callback()

interface Model {
    a: number
    b: number
}

const model: Model = { a: 0, b: 0 }

const view = (_: Model): UI => text("")

const update = (model: Model, event: AppEvent) => {
    switch (event) {
        case AppEvent.A:
            return { model: { a: model.a + 1, b: model.b } }
        case AppEvent.B:
            return { model: { a: model.a, b: model.b + 1 } }
    }
}

enum AppEvent {
    A,
    B,
}

test("if update does not modify model then view gets called once", () => {
    let viewCallCount = 0
    const view = (_: Model) => {
        ++viewCallCount
        return text("")
    }
    const update = (model: Model, _: AppEvent) => {
        return { model }
    }
    const dispatch = run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => {},
    })
    dispatch(AppEvent.A)
    expect(viewCallCount).toEqual(1)
})

test("if update modifies model view gets called again", () => {
    let viewCallCount = 0
    const view = (_: Model) => {
        ++viewCallCount
        return text("")
    }
    const dispatch = run({
        model,
        view,
        update,
        window: mockWindow(),
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => {},
    })
    dispatch(AppEvent.A)
    expect(viewCallCount).toEqual(2)
})

test("if update returns scheduled events they get dispatched after some milliseconds", () => {
    const events: AppEvent[] = []
    const update = (
        model: Model,
        event: AppEvent
    ): UpdateResult<Model, AppEvent> => {
        events.push(event)
        switch (event) {
            case AppEvent.A:
                return {
                    model,
                    schedule: [
                        {
                            after: { milliseconds: 100 },
                            event: AppEvent.B,
                        },
                        {
                            after: { milliseconds: 200 },
                            event: AppEvent.B,
                        },
                    ],
                }
            case AppEvent.B:
                return { model }
        }
    }
    const timeouts: number[] = []
    const dispatch = run({
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
        pointerDown: () => {},
    })
    dispatch(AppEvent.A)
    expect(events).toEqual([AppEvent.A, AppEvent.B, AppEvent.B])
    expect(timeouts).toEqual([100, 200])
})

test("if update returns dispatch events they get dispatched immediately", () => {
    const events: AppEvent[] = []
    const update = (
        model: Model,
        event: AppEvent
    ): UpdateResult<Model, AppEvent> => {
        events.push(event)
        switch (event) {
            case AppEvent.A:
                return {
                    model,
                    dispatch: [AppEvent.B, AppEvent.B],
                }
            case AppEvent.B:
                return { model }
        }
    }
    const timeouts: number[] = []
    const dispatch = run({
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
        pointerDown: () => {},
    })
    dispatch(AppEvent.A)
    expect(events).toEqual([AppEvent.A, AppEvent.B, AppEvent.B])
    expect(timeouts).toEqual([])
})

test("if update returns a promise of an event they get dispatched when completed", async () => {
    const events: AppEvent[] = []
    const update = (model: Model, event: AppEvent) => {
        events.push(event)
        switch (event) {
            case AppEvent.A:
                return {
                    model,
                    promise: (async (): Promise<AppEvent> => AppEvent.B)(),
                }
            case AppEvent.B:
                return { model }
        }
    }
    const timeouts: number[] = []
    const dispatch = run({
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
        pointerDown: () => {},
    })
    await dispatch(AppEvent.A)
    expect(events).toEqual([AppEvent.A, AppEvent.B])
    expect(timeouts).toEqual([])
})

test("pointer down events can lead to on click handlers firing", () => {
    const view = (_: Model, dispatch: Dispatch<AppEvent>) =>
        row([
            container({
                onClick: () => dispatch(AppEvent.A),
                width: 50,
                height: 50,
            }),
            container({
                onClick: () => dispatch(AppEvent.B),
                width: 50,
                height: 50,
            }),
        ])
    const events: AppEvent[] = []
    const update = (model: Model, event: AppEvent) => {
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
        pointerDown: (_, pointer) => {
            pointers.push(pointer)
        },
    })
    document.fireEvent("pointerdown", {
        clientX: 0,
        clientY: 0,
        pointerId: 0,
    })
    document.fireEvent("pointerdown", {
        clientX: 51,
        clientY: 0,
        pointerId: 0,
    })
    document.fireEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 0,
    })
    expect(events).toEqual([AppEvent.A, AppEvent.B])
    expect(pointers).toEqual([
        {
            id: 0,
            position: { x: 0, y: 0 },
        },
        {
            id: 0,
            position: { x: 51, y: 0 },
        },
        {
            id: 0,
            position: { x: 200, y: 200 },
        },
    ])
})

test("resize events trigger a rerender", () => {
    let viewCallCount = 0
    const view = (_: Model) => {
        ++viewCallCount
        return text("")
    }
    const window = mockWindow()
    run({
        model,
        view,
        update,
        window,
        document: mockDocument(),
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => {},
    })
    expect(viewCallCount).toEqual(1)
    window.fireEvent("resize")
    expect(viewCallCount).toEqual(2)
})

test("hide the cursor", () => {
    const update = (model: Model, _: AppEvent) => ({
        model,
        cursor: false,
    })
    const window = mockWindow()
    const document = mockDocument()
    const dispatch = run({
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => {},
    })
    expect(document.body.style.cursor).toEqual("auto")
    dispatch(AppEvent.A)
    expect(document.body.style.cursor).toEqual("none")
})

test("show the cursor", () => {
    const update = (model: Model, _0: AppEvent) => ({
        model,
        cursor: true,
    })
    const window = mockWindow()
    const document = mockDocument()
    document.body.style.cursor = "none"
    const dispatch = run({
        model,
        view,
        update,
        window,
        document,
        requestAnimationFrame: mockRequestAnimationFrame,
        setTimeout: mockSetTimeout,
        pointerDown: () => {},
    })
    expect(document.body.style.cursor).toEqual("none")
    dispatch(AppEvent.A)
    expect(document.body.style.cursor).toEqual("auto")
})
