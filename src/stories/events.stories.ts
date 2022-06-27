import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { scene } from "../ui/scene"
import { Mat3 } from "../linear_algebra"
import { dispatchRendererEvent } from "../renderer/dispatch"
import { RendererEventKind } from "../renderer/events"

export default {
    title: 'events'
}

export const clickable = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({ camera: Mat3.identity() }, [
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255),
            x: 100,
            y: 200,
            onClick: () => console.log('clicked a')
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250,
            onClick: () => console.log('clicked b')
        }),
    ])
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui
    })
    document.addEventListener('pointerdown', p => {
        dispatchRendererEvent(renderer, {
            kind: RendererEventKind.MOUSE_CLICK,
            x: p.clientX,
            y: p.clientY,
        })
    })
    return renderer.canvas
}
