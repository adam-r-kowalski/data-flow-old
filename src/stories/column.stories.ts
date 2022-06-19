import { rgba } from "../color"
import { webGL2Renderer } from "../renderer"
import { container } from "../ui/container"
import { column } from "../ui/column"
import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"

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

export const columnMainAxisAlignmentStart = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.START }, [
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

export const columnMainAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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

export const columnMainAxisAlignmentEnd = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.END }, [
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

export const columnMainAxisAlignmentSpaceEvenly = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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

export const columnMainAxisAlignmentSpaceBetween = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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

export const columnMainAxisAlignmentCenterCrossAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column({ mainAxisAlignment: MainAxisAlignment.CENTER, crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
