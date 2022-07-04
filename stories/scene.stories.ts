import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"
import { render } from "../src/renderer/render"
import { scene } from "../src/ui/scene"
import { identity, multiplyMatrices, scale, translate } from "../src/linear_algebra/matrix3x3"

export default {
    title: 'scene'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

export const sceneCamera = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250
            }),
        ]
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const sceneTranslated = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: translate(100, 0),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250
            }),
        ]
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const sceneScaled = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: scale(2, 2),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250
            }),
        ]
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const sceneScaledAndTranslated = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: multiplyMatrices(translate(-100, -200), scale(2, 2)),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250
            }),
        ]
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}