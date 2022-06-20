import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { column } from "../ui/column"
import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { render } from "../render"

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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
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
    render(renderer, ui)
    return renderer.canvas
}
