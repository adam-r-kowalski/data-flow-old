import { CrossAxisAlignment } from "./alignment"
import { rgba } from "./color"
import { padding } from "./padding"
import { render } from "./render"
import { webGL2Renderer } from "./renderer/webgl2"
import { center } from "./ui/center"
import { column } from "./ui/column"
import { container } from "./ui/container"
import { row } from "./ui/row"
import { stack } from "./ui/stack"
import { text } from "./ui/text"

const theme = {
    background: rgba(1, 22, 39, 255),
    node: rgba(0, 191, 249, 100),
    input: rgba(145, 218, 205, 255)
}

const renderer = webGL2Renderer({
    width: window.innerWidth,
    height: window.innerHeight
})

const inputs = () =>
    column([
        row([
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            container({ width: 5, height: 5 }),
            text("Long In 0")
        ]),
        container({ width: 5, height: 5 }),
        row([
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            container({ width: 5, height: 5 }),
            text("In 0")
        ])
    ])

const outputs = () =>
    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        row([
            text("Out 0"),
            container({ width: 5, height: 5 }),
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
        ]),
        container({ width: 5, height: 5 }),
        row([
            text("Long Out 1"),
            container({ width: 5, height: 5 }),
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
        ])
    ])

const ui = stack([
    container({ color: theme.background }),
    center(
        container({ color: theme.node, padding: padding(5) },
            column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                text("Node"),
                container({ width: 5, height: 5 }),
                row([
                    inputs(),
                    container({ width: 30, height: 5 }),
                    outputs()
                ])
            ])
        )
    ),
])

render(renderer, ui)

document.body.appendChild(renderer.canvas)