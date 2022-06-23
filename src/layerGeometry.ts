import { Geometry } from "./geometry"
import { Reducer } from "./reduce"
import { Entry } from "./ui"

export type TextureIndex = number
export type Layer = Map<TextureIndex, Geometry[]>
export type Layers = Layer[]

export const layerGeometry: Reducer<Layers> = {
    initial: () => [],
    combine: (layers: Layers, entry: Entry) => {
        const needed = entry.z - layers.length + 1
        for (let i = 0; i < needed; ++i) layers.push(new Map())
        const layer = layers[entry.z]
        const geometry = (() => {
            const geometry = layer.get(entry.geometry.textureIndex)
            if (geometry) return geometry
            const newGeometry: Geometry[] = []
            layer.set(entry.geometry.textureIndex, newGeometry)
            return newGeometry
        })()
        geometry.push(entry.geometry)
        return layers
    }
}