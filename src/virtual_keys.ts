import { EventKind } from "./event"
import { container, row, text, UI } from "./ui"

const map = (key: string): string => {
    switch (key) {
        case "space":
            return " "
        case "del":
            return "Backspace"
        case "ret":
            return "Enter"
        default:
            return key
    }
}

export const virtualKey = (key: string): UI => {
    return container(
        {
            padding: 10,
            onClick: {
                kind: EventKind.KEYDOWN,
                key: map(key),
            },
        },
        text({ size: 24 }, key)
    )
}

export const view = (keys: string[]) => row(keys.map(virtualKey))
