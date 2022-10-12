import { Color, container, OnClick, UI } from "./ui"

interface Properties {
    color: Color
    onClick: OnClick
}

export const view = ({ color, onClick }: Properties): UI =>
    container({ color, onClick })
