import { container, Pointer, row, text, UI } from "../src/ui"
import { mockDocument, mockWindow } from "../src/ui/mock"
import { Effects, run, UpdateResult } from "../src/run"
import { makeEffects } from "./mock_effects"
import { AppEvent, EventKind } from "../src/event"
import { Model } from "../src/model"
import { emptyModel } from "../src/model/empty"

const mockRequestAnimationFrame = (callback: () => void) => callback()

const mockSetTimeout = (callback: () => void, _: number) => callback()

const model: Model = emptyModel({ width: 500, height: 500 })

const view = (_: Model): UI => text("")

test("if update does not return render true then view gets called once", () => {
    let viewCallCount = 0
    const view = (_: Model) => {
        ++viewCallCount
        return text("")
    }
    const update = (_: Effects, model: Model, _1: AppEvent) => {
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
        effects: makeEffects(),
    })
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(viewCallCount).toEqual(1)
})

test("if update returns render true then view gets called again", () => {
    let viewCallCount = 0
    const view = (_: Model) => {
        ++viewCallCount
        return text("")
    }
    const update = (_: Effects, model: Model, _1: AppEvent) => {
        return { model, render: true }
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
        effects: makeEffects(),
    })
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(viewCallCount).toEqual(2)
})

test("if update returns scheduled events they get dispatched after some milliseconds", () => {
    const events: AppEvent[] = []
    const update = (
        _: Effects,
        model: Model,
        event: AppEvent
    ): UpdateResult => {
        events.push(event)
        return event.kind === EventKind.RESET_CAMERA
            ? {
                  model,
                  schedule: [
                      {
                          after: { milliseconds: 100 },
                          event: { kind: EventKind.CLICKED_BACKGROUND },
                      },
                      {
                          after: { milliseconds: 200 },
                          event: { kind: EventKind.CLICKED_BACKGROUND },
                      },
                  ],
              }
            : { model }
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
        effects: makeEffects(),
    })
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(events).toEqual([
        { kind: EventKind.RESET_CAMERA },
        { kind: EventKind.CLICKED_BACKGROUND },
        { kind: EventKind.CLICKED_BACKGROUND },
    ])
    expect(timeouts).toEqual([100, 200])
})

test("if update returns dispatch events they get dispatched immediately", () => {
    const events: AppEvent[] = []
    const update = (
        _: Effects,
        model: Model,
        event: AppEvent
    ): UpdateResult => {
        events.push(event)
        return event.kind === EventKind.RESET_CAMERA
            ? {
                  model,
                  dispatch: [
                      { kind: EventKind.CLICKED_BACKGROUND },
                      { kind: EventKind.CLICKED_BACKGROUND },
                  ],
              }
            : { model }
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
        effects: makeEffects(),
    })
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(events).toEqual([
        { kind: EventKind.RESET_CAMERA },
        { kind: EventKind.CLICKED_BACKGROUND },
        { kind: EventKind.CLICKED_BACKGROUND },
    ])
    expect(timeouts).toEqual([])
})

test("if update returns a promise of an event they get dispatched when completed", async () => {
    const events: AppEvent[] = []
    const update = (_: Effects, model: Model, event: AppEvent) => {
        events.push(event)
        return event.kind === EventKind.RESET_CAMERA
            ? {
                  model,
                  promise: (async (): Promise<AppEvent> => ({
                      kind: EventKind.CLICKED_BACKGROUND,
                  }))(),
              }
            : { model }
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
        effects: makeEffects(),
    })
    await dispatch({ kind: EventKind.RESET_CAMERA })
    expect(events).toEqual([
        { kind: EventKind.RESET_CAMERA },
        { kind: EventKind.CLICKED_BACKGROUND },
    ])
    expect(timeouts).toEqual([])
})

test("pointer down events can lead to on click handlers firing", () => {
    const view = (_: Model) =>
        row([
            container({
                onClick: { kind: EventKind.RESET_CAMERA },
                width: 50,
                height: 50,
            }),
            container({
                onClick: { kind: EventKind.CLICKED_BACKGROUND },
                width: 50,
                height: 50,
            }),
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
        pointerDown: (_, pointer) => {
            pointers.push(pointer)
        },
        effects: makeEffects(),
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
    expect(events).toEqual([
        { kind: EventKind.RESET_CAMERA },
        { kind: EventKind.CLICKED_BACKGROUND },
    ])
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
        pointerDown: () => {},
        effects: makeEffects(),
    })
    expect(viewCallCount).toEqual(1)
    window.fireEvent("resize")
    expect(viewCallCount).toEqual(2)
})

test("hide the cursor", () => {
    const update = (_: Effects, model: Model, _0: AppEvent) => ({
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
        effects: makeEffects(),
    })
    expect(document.body.style.cursor).toEqual("auto")
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(document.body.style.cursor).toEqual("none")
})

test("show the cursor", () => {
    const update = (_: Effects, model: Model, _0: AppEvent) => ({
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
        effects: makeEffects(),
    })
    expect(document.body.style.cursor).toEqual("none")
    dispatch({ kind: EventKind.RESET_CAMERA })
    expect(document.body.style.cursor).toEqual("auto")
})
