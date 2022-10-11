import { Color, container, UI } from "./ui"

interface Properties {
    color: Color
    onClick: () => void
}

export const view = ({ color, onClick }: Properties): UI =>
    container({ color, onClick })
