import { action } from '@storybook/addon-actions'

import { rgba } from "../color"
import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { scene } from "../ui/scene"
import { Mat3 } from "../linear_algebra"
import { render } from '../renderer/render'
import { pointerDown } from '../renderer/pointer_down'

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
            onClick: action('clicked red')
        }),
        container({
            width: 50,
            height: 50,
            color: rgba(0, 255, 0, 255),
            x: 300,
            y: 250,
            onClick: action('clicked green')
        }),
    ])
    renderer = render(renderer, ui)
    document.addEventListener('pointerdown', p => {
        renderer = pointerDown(renderer, { x: p.clientX, y: p.clientY, id: p.pointerId })
    })
    return renderer.canvas
}
