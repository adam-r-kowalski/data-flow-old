import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { Mat3 } from "../linear_algebra";

export interface Renderer {
    size: Size
    clear: () => void
    draw: (batch: Batch) => void
}