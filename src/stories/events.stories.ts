import { action } from '@storybook/addon-actions'

import { webGL2Renderer } from "../renderer/webgl2"
import { container } from "../ui/container"
import { scene } from "../ui/scene"
import { Mat3 } from "../linear_algebra"
import { render } from '../renderer/render'
import { pointerDown } from '../renderer/pointer_down'

export default {
    title: 'events'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

export const clickable = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = scene({
        camera: Mat3.identity(),
        children: [
            container({
                width: 50,
                height: 50,
                color: red,
                x: 100,
                y: 200,
                onClick: action('clicked red')
            }),
            container({
                width: 50,
                height: 50,
                color: green,
                x: 300,
                y: 250,
                onClick: action('clicked green')
            }),
        ]
    })
    renderer = render(renderer, ui)
    document.addEventListener('pointerdown', p => {
        renderer = pointerDown(renderer, { x: p.clientX, y: p.clientY, id: p.pointerId })
    })
    return renderer.canvas
}
