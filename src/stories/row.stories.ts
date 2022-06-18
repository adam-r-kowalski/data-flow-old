import { rgba } from "../color"
import { webGL2Renderer } from "../renderer"
import { container } from "../ui/container"
import { row } from "../ui/row"

export default {
    title: 'row'
}

export const rowWithThreeContainers = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
            height: 50,
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
