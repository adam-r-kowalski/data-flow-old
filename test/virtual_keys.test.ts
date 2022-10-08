import * as virtualKeys from "../src/virtual_keys"
import { container, row, text } from "../src/ui"
import "./toEqualData"

const { virtualKey } = virtualKeys

test("virtual key", () => {
    const onClick = () => {}
    const actual = virtualKey("key", onClick)
    const expected = container(
        {
            padding: 10,
            onClick,
        },
        text({ size: 24 }, "key")
    )
    expect(actual).toEqualData(expected)
})

test("remapped virtual key", () => {
    const onClick = () => {}
    const actual = virtualKey("space", onClick)
    const expected = container(
        {
            padding: 10,
            onClick,
        },
        text({ size: 24 }, "space")
    )
    expect(actual).toEqualData(expected)
})

test("virtual keys", () => {
    const onClick = () => {}
    const actual = virtualKeys.view(["a", "b", "c"], onClick)
    const expected = row([
        container(
            {
                padding: 10,
                onClick,
            },
            text({ size: 24 }, "a")
        ),
        container(
            {
                padding: 10,
                onClick,
            },
            text({ size: 24 }, "b")
        ),
        container(
            {
                padding: 10,
                onClick,
            },
            text({ size: 24 }, "c")
        ),
    ])
    expect(actual).toEqualData(expected)
})
