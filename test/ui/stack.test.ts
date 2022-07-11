import { container, center, stack, layout } from '../../src/new_ui'
import { mockDocument, mockWindow } from '../../src/renderer/mock'
import { webGL2Renderer } from '../../src/renderer/webgl2'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})


test("stack layout", () => {
    const renderer = mockRenderer()
    const ui = stack([
        container({ color: red }),
        center(
            container({
                width: 50,
                height: 50,
                color: green
            })
        )
    ])
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 100, height: 100 },
        children: [
            { size: { width: 100, height: 100 } },
            {
                size: { width: 100, height: 100 },
                child: {
                    size: { width: 50, height: 50 }
                }
            }
        ]
    }
    expect(uiLayout).toEqual(expectedLayout)
})
