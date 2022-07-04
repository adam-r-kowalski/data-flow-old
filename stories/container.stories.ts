import { padding } from "../src/padding"
import { render } from "../src/renderer/render"
import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"

export default {
    title: 'container'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

export const singleContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const nestedContainer = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({ padding: padding(20) }, container({
        width: 50,
        height: 50,
        color: red
    }))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const nestedContainerWithColor = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = container({ padding: padding(20), color: red },
        container({ padding: padding(20), color: green },
            container({ width: 50, height: 50, color: blue })))
    renderer = render(renderer, ui)
    return renderer.canvas
}