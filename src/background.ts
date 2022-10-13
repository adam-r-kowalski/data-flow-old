import { Color, container, OnClick, OnDrag, UI } from "./ui"

interface Properties {
    color: Color
    onClick: OnClick
    onDrag: OnDrag
}

export const view = ({ color, onClick, onDrag }: Properties): UI =>
    container({ color, onClick, onDrag })
