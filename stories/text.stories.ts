import { CrossAxisAlignment } from "../src/alignment"
import { padding } from "../src/padding"
import { render } from "../src/renderer/render"
import { webGL2Renderer } from "../src/renderer/webgl2"
import { center } from "../src/ui/center"
import { column } from "../src/ui/column"
import { container } from "../src/ui/container"
import { row } from "../src/ui/row"
import { text } from "../src/ui/text"

export default {
    title: 'text'
}

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const blue = { red: 0, green: 0, blue: 255, alpha: 255 }

export const defaultFontAndSize = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text("Hello World")
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const colored = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ color: red }, "Hello World")
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const sansSerif = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ font: 'sans-serif' }, "Hello World")
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const largeSerif = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = text({ font: 'serif', size: 72 }, "Hello World")
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const centered = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(text("Hello World"))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const centeredContained = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({ color: green },
            text("Hello World")))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const centeredColumn = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        column([
            container({ color: green, width: 50, height: 50 }),
            text("Hello World"),
            text("Hello World"),
        ]))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const weirdArangement = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        column([
            text("Hello World"),
            row([
                container({ color: red, width: 50, height: 50 }),
                container({ color: green, width: 50, height: 50 }),
                container({ color: blue, width: 50, height: 50 }),
                container({ color: green }, text("Hello World")),
            ]),
        ]))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const node = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = center(
        container({ color: { red: 100, green: 150, blue: 75, alpha: 255 } },
            column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                container({ padding: padding(5) }, text("Source")),
                row([
                    column([
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                container({ width: 24, height: 24, color: red }),
                                container({ width: 5, height: 5 }),
                                text("Long Input 0"),
                            ])),
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                container({ width: 24, height: 24, color: red }),
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
                                container({ width: 24, height: 24, color: red }),
                            ])),
                        container({ padding: padding(5) },
                            row({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
                                text("Long Output 1"),
                                container({ width: 5, height: 5 }),
                                container({ width: 24, height: 24, color: red }),
                            ])),
                    ])

                ])
            ])
        ))
    renderer = render(renderer, ui)
    return renderer.canvas
}

export const columnOfText = () => {
    let renderer = webGL2Renderer({ width: 500, height: 500 })
    const ui = column([
        container({ color: red }, text({ font: "monospace" }, "monospace")),
        container({ color: red }, text({ font: "sans-serif" }, "sans-serif")),
        text({ font: "sans-serif" }, "sans-serif"),
        text({ font: "serif" }, "serif"),
        text({ font: "arial" }, "arial"),
        text({ font: "cursive" }, "cursive")
    ])
    renderer = render(renderer, ui)
    return renderer.canvas
}
