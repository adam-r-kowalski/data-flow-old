import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { column } from "../ui/column"
import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { render } from "../renderer/render"

export default {
    title: 'column'
}

export const columnWithThreeContainers = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnCrossAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnCrossAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentSpaceEvenly = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentSpaceBetween = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnMainAxisAlignmentCenterCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = render(renderer, ui)
    return renderer.canvas
}
