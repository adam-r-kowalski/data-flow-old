import * as virtualKeys from "../src/virtual_keys"
import { container, row, text } from "../src/ui"
import { EventKind } from "../src/event"

const { virtualKey } = virtualKeys

test("virtual key", () => {
    const actual = virtualKey("key")
    const expected = container(
        {
            padding: 10,
            onClick: {
                kind: EventKind.KEYDOWN,
                key: "key",
            },
        },
        text({ size: 24 }, "key")
    )
    expect(actual).toEqual(expected)
})

test("remapped virtual key", () => {
    const actual = virtualKey("space")
    const expected = container(
        {
            padding: 10,
            onClick: {
                kind: EventKind.KEYDOWN,
                key: " ",
            },
        },
        text({ size: 24 }, "space")
    )
    expect(actual).toEqual(expected)
})

test("virtual keys", () => {
    const actual = virtualKeys.view(["a", "b", "c"])
    const expected = row([
        container(
            {
                padding: 10,
                onClick: {
                    kind: EventKind.KEYDOWN,
                    key: "a",
                },
            },
            text({ size: 24 }, "a")
        ),
        container(
            {
                padding: 10,
                onClick: {
                    kind: EventKind.KEYDOWN,
                    key: "b",
                },
            },
            text({ size: 24 }, "b")
        ),
        container(
            {
                padding: 10,
                onClick: {
                    kind: EventKind.KEYDOWN,
                    key: "c",
                },
            },
            text({ size: 24 }, "c")
        ),
    ])
    expect(actual).toEqual(expected)
})
