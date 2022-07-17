import { Entry, Connection, UIKind } from "."
import { inverse, multiplyMatrixVector } from "../linear_algebra/matrix3x3"
import { length } from "../linear_algebra/vector3"

export interface ConnectionsAndScale {
    connections: Connection[]
    scale: number
}

export type Connections = ConnectionsAndScale[][]

export const initial = (): Connections => []

export const combine = <AppEvent>(connections: Connections, entry: Entry<AppEvent>): Connections => {
    if (entry.ui.kind == UIKind.SCENE) {
        if (entry.ui.connections.length === 0) return connections
        const needed = entry.z - connections.length + 1
        for (let i = 0; i < needed; ++i) connections.push([])
        const layer = connections[entry.z]
        layer.push({
            connections: entry.ui.connections,
            scale: length(multiplyMatrixVector(inverse(entry.ui.camera), [0, 1, 0]))
        })
        return connections
    }
    return connections
}
