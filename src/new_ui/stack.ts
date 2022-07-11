import { Constraints, layout, Layout, MeasureText, Size, UI, UIKind } from ".";

export interface StackLayout {
    readonly size: Size
    readonly children: Layout[]
}

export interface Stack<UIEvent> {
    kind: UIKind.STACK
    children: UI<UIEvent>[]
}

export const stack = <UIEvent>(children: UI<UIEvent>[]): Stack<UIEvent> => ({
    kind: UIKind.STACK,
    children
})

export const stackLayout = <UIEvent>(ui: Stack<UIEvent>, constraints: Constraints, measureText: MeasureText): StackLayout => {
    const children = ui.children.map(c => layout(c, constraints, measureText))
    const width = constraints.maxWidth
    const height = constraints.maxHeight
    return { size: { width, height }, children }
}
