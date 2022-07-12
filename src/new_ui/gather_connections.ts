import { Entry, Connection, UIKind } from "."

export const initial = (): Connection[] => []

export const combine = <UIEvent>(connections: Connection[], entry: Entry<UIEvent>): Connection[] => {
    if (entry.ui.kind == UIKind.SCENE) {
        connections.push(...entry.ui.connections)
    }
    return connections
}
