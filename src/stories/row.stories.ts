import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
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
    renderer.render(ui)
    return renderer.element
}
