import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { rgba } from "../color"
import { render } from "../render"
import { webGL2Renderer } from "../renderer/webgl2"
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
    render(renderer, ui)
    return renderer.canvas
}

export const rowCrossAxisAlignmentStart = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
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

export const rowCrossAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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

export const rowCrossAxisAlignmentEnd = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
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

export const rowMainAxisAlignmentStart = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
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

export const rowMainAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
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

export const rowMainAxisAlignmentEnd = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
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

export const rowMainAxisAlignmentSpaceEvenly = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
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

export const rowMainAxisAlignmentSpaceBetween = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
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

export const rowMainAxisAlignmentCenterCrossAxisAlignmentCenter = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER, crossAxisAlignment: CrossAxisAlignment.CENTER }, [
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
