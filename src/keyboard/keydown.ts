export const eventKind = "keydown"

export interface Event {
    kind: typeof eventKind
    key: string
    ctrl: boolean
}
