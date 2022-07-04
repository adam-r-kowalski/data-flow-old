export interface Size {
    readonly width: number
    readonly height: number
}

export interface Constraints {
    readonly minWidth: number
    readonly maxWidth: number
    readonly minHeight: number
    readonly maxHeight: number
}

export interface Layout {
    readonly size: Size
}