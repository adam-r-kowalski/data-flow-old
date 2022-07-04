import { render } from "../renderer/render"
import { webGL2Renderer } from "../renderer/webgl2"
import { center } from "../ui/center"
import { container } from "../ui/container"
import { stack } from "../ui/stack"

export default {
    title: 'stack'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

export const stackContainerAndCenteredContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 100,
                height: 50,
                color: green
            })),
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}
