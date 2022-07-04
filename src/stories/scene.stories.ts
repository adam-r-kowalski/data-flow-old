import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { render } from "../renderer/render"
import { scene } from "../ui/scene"
import { Mat3 } from "../linear_algebra"

export default {
    title: 'scene'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

export const sceneCamera = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: Mat3.identity(),
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
        camera: Mat3.translate(100, 0),
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
        camera: Mat3.scale(2, 2),
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
        camera: Mat3.translate(-100, -200).matMul(Mat3.scale(2, 2)),
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