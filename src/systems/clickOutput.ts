import { Color, ConnectionFrom, Connections, ConnectionTo, UIRoot } from "../components"
import { Entity } from "../ecs"
import { connection } from "../ui"
import { render } from "./render"

export const clickOutput = (entity: Entity) => {
    const ecs = entity.ecs
    const connectionTo = ecs.get(ConnectionTo)!.entity
    const connectionFrom = ecs.get(ConnectionFrom)!.entity
    if (!connectionTo) {
        if (connectionFrom === entity) return
        else if (connectionFrom !== null) connectionFrom.set(new Color(101, 215, 249, 255))
        ecs.update(ConnectionFrom, from => from.entity = entity)
        entity.set(new Color(67, 76, 112, 255))
        requestAnimationFrame(() => render(ecs))
    } else {
        const root = ecs.get(UIRoot)!.entity
        const con = connection(ecs, { from: entity, to: connectionTo })
        root.update(Connections, connections => connections.entities.push(con))
        connectionTo.set(new Color(101, 215, 249, 255))
        ecs.update(ConnectionTo, to => to.entity = null)
        requestAnimationFrame(() => render(ecs))
    }
}
