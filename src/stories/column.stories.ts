import { rgba } from "../color"
import { webGL2Renderer } from "../renderer"
import { container } from "../ui/container"
import { column } from "../ui/column"

export default {
    title: 'column'
}

export const columnWithThreeContainers = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 50,
            height: 100,
            color: rgba(0, 255, 0, 255)
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 0, 255, 255)
        })
    ])
    renderer.render(ui)
    return renderer.element
}
