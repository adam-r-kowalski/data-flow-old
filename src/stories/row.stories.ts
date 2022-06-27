import { CrossAxisAlignment, MainAxisAlignment } from "../alignment"
import { rgba } from "../color"
import { dispatchRendererEvent } from "../renderer/dispatch"
import { RendererEventKind } from "../renderer/events"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { row } from "../ui/row"

export default {
    title: 'row'
}

export const rowWithThreeContainers = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowCrossAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowCrossAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentStart = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentEnd = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentSpaceEvenly = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentSpaceBetween = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}

export const rowMainAxisAlignmentCenterCrossAxisAlignmentCenter = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
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
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    return renderer.canvas
}
