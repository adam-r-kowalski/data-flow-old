import { rgba } from "../color"
import { render } from "../renderer/render"
import { webGL2Renderer } from "../renderer/webgl2"
import { center } from "../ui/center"
import { container } from "../ui/container"
import { stack } from "../ui/stack"

export default {
    title: 'stack'
}

export const stackContainerAndCenteredContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = stack([
        container({ color: rgba(255, 0, 0, 255) }),
        center(
            container({
                width: 100,
                height: 50,
                color: rgba(0, 255, 0, 255)
            })),
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}
