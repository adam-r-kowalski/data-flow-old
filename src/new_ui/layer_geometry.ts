import { Geometry, Entry } from "."

export type Layer = { [textureIndex: number]: Geometry[] }
export type Layers = Layer[]

export const layerGeometry = {
    initial: () => [],
    combine: <UIEvent>(layers: Layers, entry: Entry<UIEvent>): Layers => {
        if (entry.geometry.vertices.length == 0) return layers
        const needed = entry.z - layers.length + 1
        for (let i = 0; i < needed; ++i) layers.push({})
        const layer = layers[entry.z]
        const geometry = (() => {
            const geometry = layer[entry.geometry.textureIndex]
            if (geometry) return geometry
            const newGeometry: Geometry[] = []
            layer[entry.geometry.textureIndex] = newGeometry
            return newGeometry
        })()
        geometry.push(entry.geometry)
        return layers
    }
}
