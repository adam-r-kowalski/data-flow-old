import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { render } from "../renderer/render"
import { scene } from "../ui/scene"
import { Mat3 } from "../linear_algebra"

export default {
    title: 'scene'
}

export const sceneCamera = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({ camera: Mat3.identity() }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255),
            x: 100,
            y: 200
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250
        }),
    ])
    render(renderer, ui)
    return renderer.canvas
}

export const sceneTranslated = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({ camera: Mat3.translate(100, 0) }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255),
            x: 100,
            y: 200
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250
        }),
    ])
    render(renderer, ui)
    return renderer.canvas
}

export const sceneScaled = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({ camera: Mat3.scale(2, 2) }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255),
            x: 100,
            y: 200
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250
        }),
    ])
    render(renderer, ui)
    return renderer.canvas
}

export const sceneScaledAndTranslated = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({ camera: Mat3.translate(-100, -200).matMul(Mat3.scale(2, 2)) }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255),
            x: 100,
            y: 200
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250
        }),
    ])
    render(renderer, ui)
    return renderer.canvas
}