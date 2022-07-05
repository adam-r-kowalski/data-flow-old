import { identity, translate } from "../src/linear_algebra/matrix3x3"
import { mockDocument, mockWindow } from "../src/renderer/mock"
import { pointerDown } from "../src/renderer/pointer_down"
import { render } from "../src/renderer/render"
import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"
import { scene } from "../src/ui/scene"

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})


test("click first container", () => {
    let renderer = mockRenderer()
    let aClickCount = 0
    let bClickCount = 0
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, { x: 125, y: 225, id: 0 })
    expect(aClickCount).toEqual(1)
    expect(bClickCount).toEqual(0)
})

test("click second container", () => {
    let renderer = mockRenderer()
    let aClickCount = 0
    let bClickCount = 0
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, { x: 325, y: 275, id: 0 })
    expect(aClickCount).toEqual(0)
    expect(bClickCount).toEqual(1)
})

test("click translated container", () => {
    let renderer = mockRenderer()
    let aClickCount = 0
    let bClickCount = 0
    const ui = scene({
        camera: translate(100, 0),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: () => aClickCount++
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: () => bClickCount++
            }),
        ]
    })
    renderer = render(renderer, ui)
    renderer = pointerDown(renderer, { x: 25, y: 225, id: 0 })
    expect(aClickCount).toEqual(1)
    expect(bClickCount).toEqual(0)
})
