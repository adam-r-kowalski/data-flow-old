import { Color } from "./color"
import { Constraints, Layout, Size } from "./layout"
import { Padding, padding as paddingAll } from "./padding"
import { UI } from "./ui"

export class ContainerLayout {
    constructor(
        readonly size: Size,
        readonly child?: Layout
    ) { }
}

export const containerLayout = (size: Size, child?: Layout) =>
    new ContainerLayout(size, child)

export class Container {
    constructor(
        readonly padding: Padding,
        readonly width?: number,
        readonly height?: number,
        readonly color?: Color,
        readonly child?: UI
    ) { }

    layout = (constraints: Constraints) => {
        if (this.child) {
            const layout = this.child.layout(constraints)
            const width = layout.size.width + this.padding.left + this.padding.right
            const height = layout.size.height + this.padding.top + this.padding.bottom
            return containerLayout({ width, height }, layout)
        }
        return containerLayout({
            width: this.width ?? constraints.maxWidth,
            height: this.height ?? constraints.maxHeight
        })
    }
}

interface Props {
    padding?: Padding
    width?: number
    height?: number
    color?: Color
    child?: UI
}

export const container = ({ padding, width, height, color }: Props, child?: UI): Container =>
    new Container(padding ?? paddingAll(0), width, height, color, child)