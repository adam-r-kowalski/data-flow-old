import { container, row, text, UI } from "./ui"
import * as keydown from "./keyboard/keydown"

export type Key =
    | string
    | {
          display: string
          event: string
      }

export const virtualKey = (key: Key): UI => {
    const { display, event } = (() =>
        typeof key === "string" ? { display: key, event: key } : key)()
    return container(
        {
            padding: 10,
            onClick: {
                kind: keydown.eventKind,
                key: event,
                ctrl: false,
            },
        },
        text({ size: 24 }, display)
    )
}

export const view = (keys: Key[]) => row(keys.map(virtualKey))
