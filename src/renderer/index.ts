import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { Font } from "../ui";

export interface Renderer {
    size: Size
    clear: () => void
    draw: (batch: Batch) => void
    measureText: (font: Font, str: string) => Size
}