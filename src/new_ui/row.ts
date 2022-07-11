import { Constraints, Layout, MeasureText, Size, UI, UIKind, layout, Geometry, Offset, geometry, WorldSpace, Entry, traverse } from "."
import { CrossAxisAlignment, MainAxisAlignment } from "./alignment"
import { CameraStack, transformWorldSpace } from "./camera_stack"

export interface RowLayout {
    readonly size: Size
    readonly totalChildWidth: number
    readonly children: Layout[]
}

export interface RowGeometry {
    readonly worldSpace: WorldSpace
    readonly children: Geometry[]
}

export interface Row<UIEvent> {
    readonly kind: UIKind.ROW,
    readonly mainAxisAlignment: MainAxisAlignment
    readonly crossAxisAlignment: CrossAxisAlignment
    readonly children: UI<UIEvent>[]
}


interface Properties {
    readonly mainAxisAlignment?: MainAxisAlignment
    readonly crossAxisAlignment?: CrossAxisAlignment
}

type Overload<UIEvent> = {
    (children: UI<UIEvent>[]): Row<UIEvent>
    (properties: Properties, children: UI<UIEvent>[]): Row<UIEvent>
}

export const row: Overload<UIEvent> = <UIEvent>(...args: any[]): Row<UIEvent> => {
    const [properties, children]: [Properties, UI<UIEvent>[]] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return {
        kind: UIKind.ROW,
        mainAxisAlignment: properties.mainAxisAlignment ?? MainAxisAlignment.START,
        crossAxisAlignment: properties.crossAxisAlignment ?? CrossAxisAlignment.START,
        children
    }
}

export const rowLayout = <UIEvent>(ui: Row<UIEvent>, constraints: Constraints, measureText: MeasureText): RowLayout => {
    const initialChildren: Layout[] = []
    const initial = {
        children: initialChildren,
        totalChildWidth: 0,
        height: 0
    }
    const result = ui.children.reduce((acc, child) => {
        const childLayout = layout(child, constraints, measureText)
        acc.children.push(childLayout)
        acc.totalChildWidth += childLayout.size.width
        acc.height = Math.max(acc.height, childLayout.size.height)
        return acc
    }, initial)
    const { children, totalChildWidth, height } = result
    const width = ui.mainAxisAlignment == MainAxisAlignment.START ? totalChildWidth : constraints.maxWidth
    return { size: { width, height }, totalChildWidth, children }
}

export const rowGeometry = <UIEvent>(ui: Row<UIEvent>, layout: RowLayout, offset: Offset, cameraStack: CameraStack): RowGeometry => {
    const initialChildren: Geometry[] = []
    const freeSpaceX = layout.size.width - layout.totalChildWidth
    const initial = {
        children: initialChildren,
        x: (() => {
            switch (ui.mainAxisAlignment) {
                case MainAxisAlignment.START: return offset.x
                case MainAxisAlignment.CENTER: return offset.x + freeSpaceX / 2
                case MainAxisAlignment.END: return offset.x + freeSpaceX
                case MainAxisAlignment.SPACE_EVENLY: return offset.x + freeSpaceX / (ui.children.length + 1)
                case MainAxisAlignment.SPACE_BETWEEN: return offset.x
            }
        })(),
    }
    const addXStart = (childLayout: Layout) => childLayout.size.width
    const addXCenter = (childLayout: Layout) => childLayout.size.width
    const addXEnd = (childLayout: Layout) => childLayout.size.width
    const addXSpaceEvenly = (childLayout: Layout) => childLayout.size.width + freeSpaceX / (ui.children.length + 1)
    const addXSpaceBetween = (childLayout: Layout) => childLayout.size.width + freeSpaceX / (ui.children.length - 1)
    const addX = (() => {
        switch (ui.mainAxisAlignment) {
            case MainAxisAlignment.START: return addXStart
            case MainAxisAlignment.CENTER: return addXCenter
            case MainAxisAlignment.END: return addXEnd
            case MainAxisAlignment.SPACE_EVENLY: return addXSpaceEvenly
            case MainAxisAlignment.SPACE_BETWEEN: return addXSpaceBetween
        }
    })()
    const offsetYStart = (_: Layout) => offset.y
    const offsetYCenter = (childLayout: Layout) => offset.y + layout.size.height / 2 - childLayout.size.height / 2
    const offsetYEnd = (childLayout: Layout) => offset.y + layout.size.height - childLayout.size.height
    const offsetY = (() => {
        switch (ui.crossAxisAlignment) {
            case CrossAxisAlignment.START: return offsetYStart
            case CrossAxisAlignment.CENTER: return offsetYCenter
            case CrossAxisAlignment.END: return offsetYEnd
        }
    })()
    const result = ui.children.reduce((acc, child, i) => {
        const childLayout = layout.children[i]
        const childOffset = { x: acc.x, y: offsetY(childLayout) }
        const childGeometry = geometry(child, childLayout, childOffset, cameraStack)
        acc.children.push(childGeometry)
        acc.x += addX(childLayout)
        return acc
    }, initial)
    const worldSpace = transformWorldSpace(cameraStack, {
        x0: offset.x,
        y0: offset.y,
        x1: offset.x + layout.size.width,
        y1: offset.y + layout.size.height,
    })
    return { worldSpace, children: result.children }
}

export function* rowTraverse<UIEvent>(ui: Row<UIEvent>, layout: RowLayout, geometry: RowGeometry, z: number): Generator<Entry<UIEvent>> {
    yield { ui, layout, geometry, z }
    const nextZ = z + 1
    let i = 0
    for (const child of ui.children) {
        yield* traverse(child, layout.children[i], geometry.children[i], nextZ)
        i += 1
    }
}