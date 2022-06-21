import { Batch } from "../batchGeometry";
import { Size } from "../layout";
import { Font } from "../ui";

export interface Renderer {
    size: Size
    clear: () => void
    draw: (batch: Batch) => void
    textWidth: (font: Font, str: string) => number[]
}