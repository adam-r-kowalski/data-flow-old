import { Color } from "../ui"

export interface Theme {
    readonly background: Color
    readonly node: Color
    readonly nodePlacementLocation: Color
    readonly focusNode: Color
    readonly input: Color
    readonly focusInput: Color
    readonly connection: Color
    readonly error: Color
}
