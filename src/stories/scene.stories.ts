import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { render } from "../render"
import { scene } from "../ui/scene"

export default {
    title: 'scene'
}

export const sceneWithTwoContainers = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene([
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
    const ui = scene({ x: 100 }, [
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
