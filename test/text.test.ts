import { mockMeasureText } from '../src/renderer/mock'
import { text, textLayout } from '../src/ui/text'


test("center layout", () => {
    const ui = text("abc")
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints, mockMeasureText)
    const expectedLayout = textLayout({ width: 24 * 3, height: 24 })
    expect(layout).toEqual(expectedLayout)
})
