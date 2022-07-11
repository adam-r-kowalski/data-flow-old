import { Constraints, Layout, MeasureText, Size, UI, UIKind, layout } from "."
import { CrossAxisAlignment, MainAxisAlignment } from "./alignment"

export interface RowLayout {
    readonly size: Size
    readonly totalChildWidth: number
    readonly children: Layout[]
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
