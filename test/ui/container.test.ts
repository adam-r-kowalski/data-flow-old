import { container, containerLayout } from '../../src/new_ui/container'
import { mockDocument, mockWindow } from '../../src/renderer/mock'
import { webGL2Renderer } from '../../src/renderer/webgl2'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }

const mockRenderer = () => webGL2Renderer({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
})


test("container layout", () => {
    const renderer = mockRenderer()
    const ui = container({
        width: 50,
        height: 50,
        color: red
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = containerLayout(ui, constraints, renderer.measureText)
    const expectedLayout = {
        size: { width: 50, height: 50 }
    }
    expect(layout).toEqual(expectedLayout)
})
