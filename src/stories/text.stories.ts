import { CrossAxisAlignment } from "../alignment"
import { rgba } from "../color"
import { padding } from "../padding"
import { render } from "../renderer/render"
import { webGL2Renderer } from "../renderer/webgl2"
import { center } from "../ui/center"
import { column } from "../ui/column"
import { container } from "../ui/container"
import { row } from "../ui/row"
import { text } from "../ui/text"

export default {
    title: 'text'
}

export const defaultFontAndSize = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text("Hello World")
    render(renderer, ui)
    return renderer.canvas
}

export const colored = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ color: rgba(255, 0, 0, 255) }, "Hello World")
    render(renderer, ui)
    return renderer.canvas
}

export const sansSerif = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ font: 'sans-serif' }, "Hello World")
    render(renderer, ui)
    return renderer.canvas
}

export const largeSerif = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ font: 'serif', size: 72 }, "Hello World")
    render(renderer, ui)
    return renderer.canvas
}

export const centered = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(text("Hello World"))
    render(renderer, ui)
    return renderer.canvas
}

export const centeredContained = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({ color: rgba(0, 255, 0, 255) },
            text("Hello World")))
    render(renderer, ui)
    return renderer.canvas
}

export const centeredColumn = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        column([
            container({ color: rgba(0, 255, 0, 255), width: 50, height: 50 }),
            text("Hello World"),
            text("Hello World"),
        ]))
    render(renderer, ui)
    return renderer.canvas
}

export const weirdArangement = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        column([
            text("Hello World"),
            row([
                container({ color: rgba(255, 0, 0, 255), width: 50, height: 50 }),
                container({ color: rgba(0, 255, 0, 255), width: 50, height: 50 }),
                container({ color: rgba(0, 0, 255, 255), width: 50, height: 50 }),
                container({ color: rgba(0, 255, 0, 255) }, text("Hello World")),
            ]),
        ]))
    render(renderer, ui)
    return renderer.canvas
}

export const node = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({ color: rgba(100, 150, 75, 255) },
            column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                container({ padding: padding(5) }, text("Source")),
                row([
                    column([
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                container({ width: 24, height: 24, color: rgba(255, 0, 0, 255) }),
                                container({ width: 5, height: 5 }),
                                text("Long Input 0"),
                            ])),
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                container({ width: 24, height: 24, color: rgba(255, 0, 0, 255) }),
                                container({ width: 5, height: 5 }),
                                text("In 1"),
                            ])),
                    ]),
                    container({ width: 40, height: 10 }),
                    column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                text("Out 0"),
                                container({ width: 5, height: 5 }),
                                container({ width: 24, height: 24, color: rgba(255, 0, 0, 255) }),
                            ])),
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                text("Long Output 1"),
                                container({ width: 5, height: 5 }),
                                container({ width: 24, height: 24, color: rgba(255, 0, 0, 255) }),
                            ])),
                    ])

                ])
            ])
        ))
    render(renderer, ui)
    return renderer.canvas
}

export const columnOfText = () => {
    const renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column([
        container({ color: rgba(255, 0, 0, 255) }, text({ font: "monospace" }, "monospace")),
        container({ color: rgba(255, 0, 0, 255) }, text({ font: "sans-serif" }, "sans-serif")),
        text({ font: "sans-serif" }, "sans-serif"),
        text({ font: "serif" }, "serif"),
        text({ font: "arial" }, "arial"),
        text({ font: "cursive" }, "cursive")
    ])
    render(renderer, ui)
    return renderer.canvas
}
