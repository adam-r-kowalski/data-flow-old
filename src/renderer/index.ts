import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { Mat3 } from "../linear_algebra";
import { MeasureText } from "../ui";

export interface Renderer {
    size: Size
    cameras: Mat3[]
    clear: () => void
    draw: (batch: Batch) => void
    measureText: MeasureText
}