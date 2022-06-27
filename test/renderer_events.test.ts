import { rgba } from "../src/color"
import { Mat3 } from "../src/linear_algebra"
import { dispatchRendererEvent } from "../src/renderer/dispatch"
import { RendererEventKind } from "../src/renderer/events"
import { mockRenderer } from "../src/renderer/mock"
import { container } from "../src/ui/container"
import { scene } from "../src/ui/scene"

test("click first container", () => {
    let renderer = mockRenderer({ width: 500, height: 500 })
    let aClickCount = 0
    let bClickCount = 0
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui: scene({ camera: Mat3.identity() }, [
            container({
                width: 50,
                height: 50,
                color: rgba(255, 0, 0, 255),
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255),
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ])
    })
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.MOUSE_CLICK,
        x: 125,
        y: 225
    })
    expect(aClickCount).toEqual(1)
    expect(bClickCount).toEqual(0)
})

test("click second container", () => {
    let renderer = mockRenderer({ width: 500, height: 500 })
    let aClickCount = 0
    let bClickCount = 0
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui: scene({ camera: Mat3.identity() }, [
            container({
                width: 50,
                height: 50,
                color: rgba(255, 0, 0, 255),
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255),
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ])
    })
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.MOUSE_CLICK,
        x: 325,
        y: 275
    })
    expect(aClickCount).toEqual(0)
    expect(bClickCount).toEqual(1)
})

test("click translated container", () => {
    let renderer = mockRenderer({ width: 500, height: 500 })
    let aClickCount = 0
    let bClickCount = 0
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui: scene({ camera: Mat3.translate(100, 0) }, [
            container({
                width: 50,
                height: 50,
                color: rgba(255, 0, 0, 255),
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: rgba(0, 255, 0, 255),
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ])
    })
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.MOUSE_CLICK,
        x: 25,
        y: 225
    })
    expect(aClickCount).toEqual(1)
    expect(bClickCount).toEqual(0)
})
