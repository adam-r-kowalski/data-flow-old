import { Constraints, Layout, layout, MeasureText, Size, UI, UIKind } from "."
import { MainAxisAlignment, CrossAxisAlignment } from "./alignment"

export interface ColumnLayout {
    readonly size: Size
    readonly totalChildHeight: number
    readonly children: Layout[]
}

export interface Column<UIEvent> {
    readonly kind: UIKind.COLUMN,
    readonly mainAxisAlignment: MainAxisAlignment
    readonly crossAxisAlignment: CrossAxisAlignment
    readonly children: UI<UIEvent>[]
}

interface Properties {
    readonly mainAxisAlignment?: MainAxisAlignment
    readonly crossAxisAlignment?: CrossAxisAlignment
}

type Overload<UIEvent> = {
    (children: UI<UIEvent>[]): Column<UIEvent>
    (properties: Properties, children: UI<UIEvent>[]): Column<UIEvent>
}

export const column: Overload<UIEvent> = <UIEvent>(...args: any[]): Column<UIEvent> => {
    const [properties, children]: [Properties, UI<UIEvent>[]] = (() =>
        args[0] instanceof Array ? [{}, args[0]] : [args[0], args[1]]
    )()
    return {
        kind: UIKind.COLUMN,
        mainAxisAlignment: properties.mainAxisAlignment ?? MainAxisAlignment.START,
        crossAxisAlignment: properties.crossAxisAlignment ?? CrossAxisAlignment.START,
        children
    }
}

export const columnLayout = <UIEvent>(ui: Column<UIEvent>, constraints: Constraints, measureText: MeasureText): ColumnLayout => {
    const initialChildren: Layout[] = []
    const initial = {
        children: initialChildren,
        width: 0,
        totalChildHeight: 0
    }
    const result = ui.children.reduce((acc, child) => {
        const childLayout = layout(child, constraints, measureText)
        acc.children.push(childLayout)
        acc.totalChildHeight += childLayout.size.height
        acc.width = Math.max(acc.width, childLayout.size.width)
        return acc
    }, initial)
    const { children, width, totalChildHeight } = result
    const height = ui.mainAxisAlignment == MainAxisAlignment.START ? totalChildHeight : constraints.maxHeight
    return {
        size: { width, height },
        totalChildHeight,
        children
    }
}
