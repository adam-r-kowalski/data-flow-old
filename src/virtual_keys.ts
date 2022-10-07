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

export const virtualKey = (key: string, onClick: (key: string) => void): UI => {
    return container(
        {
            padding: 10,
            onClick: () => onClick(map(key)),
        },
        text({ size: 24 }, key)
    )
}

export const view = (keys: string[], onClick: (key: string) => void) =>
    row(keys.map((key) => virtualKey(key, onClick)))
