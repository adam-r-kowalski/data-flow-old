export interface PanCamera {
    readonly left: boolean
    readonly down: boolean
    readonly up: boolean
    readonly right: boolean
    readonly now: number
}

export interface ZoomCamera {
    readonly in: boolean
    readonly out: boolean
    readonly now: number
}