import * as keydown from "../src/keyboard/keydown"
import * as virtualKeys from "../src/virtual_keys"
import { container, row, text } from "../src/ui"

const { virtualKey } = virtualKeys

test("virtual key", () => {
    const actual = virtualKey("key")
    const expected = container(
        {
            padding: 10,
            onClick: {
                kind: keydown.eventKind,
                key: "key",
                ctrl: false,
            },
        },
        text({ size: 24 }, "key")
    )
    expect(actual).toEqual(expected)
})

test("remapped virtual key", () => {
    const actual = virtualKey({ display: "key", event: "f" })
    const expected = container(
        {
            padding: 10,
            onClick: {
                kind: keydown.eventKind,
                key: "f",
                ctrl: false,
            },
        },
        text({ size: 24 }, "key")
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
                    kind: keydown.eventKind,
                    key: "a",
                    ctrl: false,
                },
            },
            text({ size: 24 }, "a")
        ),
        container(
            {
                padding: 10,
                onClick: {
                    kind: keydown.eventKind,
                    key: "b",
                    ctrl: false,
                },
            },
            text({ size: 24 }, "b")
        ),
        container(
            {
                padding: 10,
                onClick: {
                    kind: keydown.eventKind,
                    key: "c",
                    ctrl: false,
                },
            },
            text({ size: 24 }, "c")
        ),
    ])
    expect(actual).toEqual(expected)
})
