import { mockTextWidth } from '../src/renderer/mock'
import { text, textLayout } from '../src/ui/text'


test("text layout", () => {
    const ui = text("abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockTextWidth)
    const expectedLayout = textLayout([24, 24, 24], { width: 24 * 3, height: 24 })
    expect(layout).toEqual(expectedLayout)
})
