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
    node: rgba(0, 191, 249, 50),
    input: rgba(188, 240, 192, 255)
}

const renderer = webGL2Renderer({
    width: window.innerWidth,
    height: window.innerHeight
})

const spacer = (size: number) =>
    container({ width: size, height: size })

const inputs = () =>
    column([
        row([
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            spacer(5),
            text("Long In 0")
        ]),
        spacer(5),
        row([
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            spacer(5),
            text("In 0")
        ])
    ])

const outputs = () =>
    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        row([
            text("Out 0"),
            spacer(5),
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
        ]),
        spacer(5),
        row([
            text("Long Out 1"),
            spacer(5),
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
                spacer(5),
                row([
                    inputs(),
                    spacer(30),
                    outputs()
                ])
            ])
        )
    ),
])

render(renderer, ui)

document.body.appendChild(renderer.canvas)