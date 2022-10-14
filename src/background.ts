import { Color, container, OnClick, OnDoubleClick, OnDrag, UI } from "./ui"

interface Properties {
    color: Color
    onClick: OnClick
    onDoubleClick: OnDoubleClick
    onDrag: OnDrag
}

export const view = ({
    color,
    onClick,
    onDoubleClick,
    onDrag,
}: Properties): UI => container({ color, onClick, onDoubleClick, onDrag })
