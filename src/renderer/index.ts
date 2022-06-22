import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { MeasureText } from "../ui";

export interface Renderer {
    size: Size
    clear: () => void
    draw: (batch: Batch) => void
    measureText: MeasureText
}