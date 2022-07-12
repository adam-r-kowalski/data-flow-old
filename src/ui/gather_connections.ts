import { Entry, Connection, UIKind } from "."

export const initial = (): Connection[] => []

export const combine = <AppEvent>(connections: Connection[], entry: Entry<AppEvent>): Connection[] => {
    if (entry.ui.kind == UIKind.SCENE) {
        connections.push(...entry.ui.connections)
    }
    return connections
}
