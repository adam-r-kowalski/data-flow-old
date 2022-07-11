import { Entry, UIKind } from "."
import { ContainerGeometry } from "./container"
import { TextGeometry } from "./text"

type Geometry = ContainerGeometry | TextGeometry
export type Layer = { [textureIndex: number]: Geometry[] }
export type Layers = Layer[]

export const layerGeometry = {
    initial: () => [],
    combine: <UIEvent>(layers: Layers, entry: Entry<UIEvent>): Layers => {
        switch (entry.ui.kind) {
            case UIKind.CONTAINER:
            case UIKind.TEXT:
                const entryGeometry = entry.geometry as Geometry
                if (entryGeometry.vertices.length == 0) return layers
                const needed = entry.z - layers.length + 1
                for (let i = 0; i < needed; ++i) layers.push({})
                const layer = layers[entry.z]
                const geometry = (() => {
                    const geometry = layer[entryGeometry.textureIndex]
                    if (geometry) return geometry
                    const newGeometry: Geometry[] = []
                    layer[entryGeometry.textureIndex] = newGeometry
                    return newGeometry
                })()
                geometry.push(entryGeometry)
                return layers
            default:
                return layers
        }
    }
}
