import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { center } from "../ui/center"
import { render } from "../render"

export default {
    title: 'center'
}

export const centeredContainer = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        })
    )
    render(renderer, ui)
    return renderer.canvas
}
