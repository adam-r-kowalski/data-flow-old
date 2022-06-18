import { Geometry } from "./geometry"
import { Reducer } from "./reduce"
import { Entry } from "./ui"

export type Layer = Geometry[]
export type Layers = Layer[]

export const layerGeometry: Reducer<Layers> = {
    initial: () => [],
    combine: (layers: Layers, entry: Entry) => {
        const needed = entry.z - layers.length + 1
        for (let i = 0; i < needed; ++i) {
            layers.push([])
        }
        layers[entry.z].push(entry.geometry)
        return layers
    }
}