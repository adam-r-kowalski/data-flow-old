import { Color } from "../color"
import { UI, Size, Layout, Constraints, MeasureText, UIKind, layout } from './'

export interface ContainerLayout {
    readonly size: Size
    readonly child?: Layout
}

export interface Padding {
    readonly top: number
    readonly right: number
    readonly bottom: number
    readonly left: number
}

export interface Container<Event> {
    readonly kind: UIKind.CONTAINER,
    readonly padding: Padding
    readonly width?: number
    readonly height?: number
    readonly x?: number
    readonly y?: number
    readonly color?: Color
    readonly onClick?: Event
    readonly id?: string
    readonly child?: UI<Event>
}

interface Properties<Event> {
    readonly padding?: number
    readonly width?: number
    readonly height?: number
    readonly x?: number
    readonly y?: number
    readonly color?: Color
    readonly onClick?: Event
    readonly id?: string
}

const transformPadding = (padding?: number): Padding => {
    if (padding) return { top: padding, right: padding, bottom: padding, left: padding }
    return { top: 0, right: 0, bottom: 0, left: 0 }
}

export const container = <Event>({ padding, width, height, color, x, y, onClick, id }: Properties<Event>, child?: UI<Event>): Container<Event> => {
    return {
        kind: UIKind.CONTAINER,
        padding: transformPadding(padding),
        width,
        height,
        x,
        y,
        color,
        onClick,
        id,
        child
    }
}

export const containerLayout = <Event>(ui: Container<Event>, constraints: Constraints, measureText: MeasureText): ContainerLayout => {
    const { top, right, bottom, left } = ui.padding
    if (ui.child) {
        const childLayout = layout(ui.child, constraints, measureText)
        const width = ui.width ?? childLayout.size.width + left + right
        const height = ui.height ?? childLayout.size.height + top + bottom
        return {
            size: { width, height },
            child: childLayout
        }
    }
    const width = (() => {
        if (ui.width) return ui.width + left + right
        return constraints.maxWidth
    })()
    const height = (() => {
        if (ui.height) return ui.height + top + bottom
        return constraints.maxHeight
    })()
    return { size: { width, height } }
}