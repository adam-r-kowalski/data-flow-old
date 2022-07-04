import { CrossAxisAlignment, MainAxisAlignment } from "../src/alignment"
import { render } from "../src/renderer/render"
import { webGL2Renderer } from "../src/renderer/webgl2"
import { container } from "../src/ui/container"
import { row } from "../src/ui/row"

export default {
    title: 'row'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

export const rowWithThreeContainers = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row([
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 50,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowCrossAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowCrossAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ crossAxisAlignment: CrossAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.START }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.END }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentSpaceEvenly = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_EVENLY }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentSpaceBetween = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const rowMainAxisAlignmentCenterCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = row({ mainAxisAlignment: MainAxisAlignment.CENTER, crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({
            width: 50,
            height: 50,
            color: red
        }),
        container({
            width: 100,
            height: 100,
            color: green
        }),
        container({
            width: 50,
            height: 50,
            color: blue
        })
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}
