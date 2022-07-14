import { Entry, Connection, UIKind } from "."

export type Connections = Connection[][]

export const initial = (): Connections => []

export const combine = <AppEvent>(connections: Connections, entry: Entry<AppEvent>): Connections => {
    if (entry.ui.kind == UIKind.SCENE) {
        if (entry.ui.connections.length === 0) return connections
        const needed = entry.z - connections.length + 1
        for (let i = 0; i < needed; ++i) connections.push([])
        const layer = connections[entry.z]
        layer.push(...entry.ui.connections)
        return connections
    }
    return connections
}
