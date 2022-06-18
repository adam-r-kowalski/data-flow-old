import { Geometry } from "./geometry"
import { Reducer } from "./reduce"
import { Entry } from "./ui"

type Layer = Geometry[]

export const layerGeometry: Reducer<Layer[]> = {
    initial: () => [],
    combine: (accumulator: Layer[], entry: Entry) => {
        const needed = entry.z - accumulator.length + 1
        for (let i = 0; i < needed; ++i) {
            accumulator.push([])
        }
        accumulator[entry.z].push(entry.geometry)
        return accumulator
    }
}