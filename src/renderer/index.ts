import { Batch } from "./batch_geometry";
import { WorldSpace } from "../geometry";
import { Size } from "../layout";
import { MeasureText, OnClick } from "../ui";
import { Lines } from "./connection_geometry";
import { Matrix3x3 } from "../linear_algebra/matrix3x3";

export interface ClickHandler {
    onClick: OnClick
    worldSpace: WorldSpace
}

export type ClickHandlers = ClickHandler[][]

export interface Renderer {
    size: Size
    cameras: Matrix3x3[]
    clickHandlers: ClickHandlers
    clear: () => void
    draw: (batch: Batch) => void
    drawLines: (lines: Lines) => void
    measureText: MeasureText
}