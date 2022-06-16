import { rgba } from '../src/color'
import { container, containerLayout, containerGeometry } from '../src/ui/container'
import { padding } from '../src/padding'

test("container layout", () => {
    const ui = container({
        width: 50,
        height: 50,
        color: rgba(255, 0, 0, 255)
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedLayout = containerLayout({ width: 50, height: 50 })
    const expectedGeometry = containerGeometry({ x: 0, y: 0 })
    expect(layout).toEqual(expectedLayout)
    expect(geometry).toEqual(expectedGeometry)
})

test("container with child layout", () => {
    const ui = container({ padding: padding(5) },
        container({
            width: 50,
            height: 50,
            color: rgba(255, 0, 0, 255)
        }))
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const layout = ui.layout(constraints)
    const offsets = { x: 0, y: 0 }
    const geometry = ui.geometry(layout, offsets)
    const expectedLayout = containerLayout({ width: 60, height: 60 },
        containerLayout({ width: 50, height: 50 }))
    const expectedGeometry = containerGeometry({ x: 0, y: 0 },
        containerGeometry({ x: 5, y: 5 }))
    expect(layout).toEqual(expectedLayout)
    expect(geometry).toEqual(expectedGeometry)
})