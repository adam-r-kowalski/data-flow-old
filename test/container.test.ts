import { rgba } from '../src/color'
import { container, containerLayout } from '../src/container'
import { padding } from '../src/padding'

test("container layout", () => {
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const actual = ui.layout(constraints)
    const expected = containerLayout({ width: 50, height: 50 })
    expect(actual).toEqual(expected)
})

test("container with child layout", () => {
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const actual = ui.layout(constraints)
    const expected = containerLayout({ width: 60, height: 60 },
        containerLayout({ width: 50, height: 50 }))
    expect(actual).toEqual(expected)
})