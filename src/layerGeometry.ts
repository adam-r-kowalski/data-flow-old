import { Geometry } from "./geometry"
import { Reducer } from "./reduce"
import { Entry } from "./ui"

type Layer = Geometry[]

export const layerGeometry: Reducer<Layer[]> = {
    initial: () => [],
    combine: (accumulator: Layer[], entry: Entry) => {
        accumulator.push([entry.geometry])
        return accumulator
    }
}