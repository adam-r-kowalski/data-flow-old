import { CrossAxisAlignment } from "./alignment"
import { rgba } from "./color"
import { Mat3 } from "./linear_algebra"
import { padding } from "./padding"
import { dispatchRendererEvent } from "./renderer/dispatch"
import { RendererEventKind } from "./renderer/events"
import { webGL2Renderer } from "./renderer/webgl2"
import { column } from "./ui/column"
import { container } from "./ui/container"
import { row } from "./ui/row"
import { scene } from "./ui/scene"
import { stack } from "./ui/stack"
import { text } from "./ui/text"

const theme = {
    background: rgba(1, 22, 39, 255),
    node: rgba(0, 191, 249, 50),
    input: rgba(188, 240, 192, 255)
}

let renderer = webGL2Renderer({
    width: window.innerWidth,
    height: window.innerHeight
})

const spacer = (size: number) =>
    container({ width: size, height: size })

const inputs = () =>
    column([
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            spacer(10),
            text("Long In 0")
        ]),
        spacer(10),
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
            spacer(10),
            text("In 0")
        ])
    ])

const outputs = () =>
    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("Out 0"),
            spacer(10),
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
        ]),
        spacer(10),
        row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
            text("Long Out 1"),
            spacer(10),
            container({
                width: 24,
                height: 24,
                color: theme.input
            }),
        ])
    ])


let count = 0

enum Event {
    INCREMENT,
    DECREMENT
}

const dispatch = (event: Event) => {
    switch (event) {
        case Event.INCREMENT:
            count++
            break

        case Event.DECREMENT:
            count--
            break
    }
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.RENDER,
        ui: ui()
    })
}

const ui = () => stack([
    container({ color: theme.background }),
    scene({ camera: Mat3.identity() }, [
        container({ color: theme.node, padding: padding(5), x: 100, y: 100 },
            column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                text("Node"),
                spacer(10),
                row([
                    inputs(),
                    spacer(30),
                    outputs()
                ])
            ])
        ),

        container({ x: 100, y: 400 },
            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                container({ padding: padding(10), color: theme.node, onClick: () => dispatch(Event.DECREMENT) }, text("-")),
                container({ padding: padding(10) }, text(count.toString())),
                container({ padding: padding(10), color: theme.node, onClick: () => dispatch(Event.INCREMENT) }, text("+")),
            ]))
    ]),
])

renderer = dispatchRendererEvent(renderer, {
    kind: RendererEventKind.RENDER,
    ui: ui()
})

window.addEventListener("pointerdown", p =>
    renderer = dispatchRendererEvent(renderer, {
        kind: RendererEventKind.MOUSE_CLICK,
        x: p.clientX,
        y: p.clientY,
    })
)

document.body.appendChild(renderer.canvas)