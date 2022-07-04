import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"
import { center } from "../src/ui/center"
import { render } from "../src/renderer/render"

export default {
    title: 'center'
}

export const centeredContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({
            width: 50,
            height: 50,
            color: { red: 255, green: 0, blue: 0, alpha: 255 }
        })
    )
    renderer = render(renderer, ui)
    return renderer.canvas
}
