import { rgba } from "../color"
import { webGL2Renderer } from "../renderer"
import { container } from "../ui/container"
import { column } from "../ui/column"
import { CrossAxisAlignment } from "../alignment"

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

export const columnCrossAxisAlignmentStart = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
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

export const columnCrossAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
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

export const columnCrossAxisAlignmentEnd = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }),
        container({
            width: 100,
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
