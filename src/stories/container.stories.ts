import { rgba } from "../color"
import { padding } from "../padding"
import { render } from "../renderer/render"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"

export default {
    title: 'container'
}

export const singleContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const nestedContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({ padding: padding(20) }, container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    }))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const nestedContainerWithColor = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({ padding: padding(20), color: rgba(255, 0, 0, 255) },
        container({ padding: padding(20), color: rgba(0, 255, 0, 255) },
            container({ width: 50, height: 50, color: rgba(0, 0, 255, 255) })))
    renderer = render(renderer, ui)
    return renderer.canvas
}