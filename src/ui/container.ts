import { Color } from "../color"
import { Geometry, Offset, Position } from "../geometry"
import { Constraints, Layout, Size } from "../layout"
import { Padding, padding as paddingAll } from "../padding"
import { UI } from "../ui"

export class ContainerLayout {
    constructor(
        readonly size: Size,
        readonly child?: Layout
    ) { }
}

export const containerLayout = (size: Size, child?: Layout) =>
    new ContainerLayout(size, child)


export class ContainerGeometry {
    constructor(
        readonly position: Position,
        readonly child?: Geometry
    ) { }
}

export const containerGeometry = (position: Position, child?: Geometry) =>
    new ContainerGeometry(position, child)

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
            const { left, top } = this.padding
            const width = layout.size.width + left + this.padding.right
            const height = layout.size.height + top + this.padding.bottom
            return containerLayout({ width, height }, layout)
        }
        const width = this.width ?? constraints.maxWidth
        const height = this.height ?? constraints.maxHeight
        return containerLayout({ width, height })
    }

    geometry = (layout: Layout, offset: Offset) => {
        if (this.child) {
            const childLayout = (layout as ContainerLayout).child!
            const childOffset = {
                x: offset.x + this.padding.left,
                y: offset.y + this.padding.top
            }
            const childGeometry = this.child.geometry(childLayout, childOffset)
            return containerGeometry({ x: offset.x, y: offset.y }, childGeometry)
        }
        return containerGeometry({ x: offset.x, y: offset.y })
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