import { Entry } from "."
import { ClickHandlers } from "./gather_on_click_handlers"
import * as gatherOnClickHandlers from "./gather_on_click_handlers"
import * as gatherOnDragHandlers from "./gather_on_drag_handlers"
import { IdToWorldSpace } from "./id_to_world_space"
import * as buildIdToWorldSpace from "./id_to_world_space"
import { Layers } from "./layer_geometry"
import * as layerGeometry from "./layer_geometry"
import { Connections } from "./gather_connections"
import * as gatherConnections from "./gather_connections"
import { DragHandlers } from "./gather_on_drag_handlers"

export interface Accumulator {
    layers: Layers
    clickHandlers: ClickHandlers
    dragHandlers: DragHandlers
    idToWorldSpace: IdToWorldSpace
    connections: Connections
}

export const initial = (): Accumulator => ({
    layers: layerGeometry.initial(),
    clickHandlers: gatherOnClickHandlers.initial(),
    dragHandlers: gatherOnDragHandlers.initial(),
    idToWorldSpace: buildIdToWorldSpace.initial(),
    connections: gatherConnections.initial(),
})

export const combine = (acc: Accumulator, entry: Entry): Accumulator => ({
    layers: layerGeometry.combine(acc.layers, entry),
    clickHandlers: gatherOnClickHandlers.combine(acc.clickHandlers, entry),
    dragHandlers: gatherOnDragHandlers.combine(acc.dragHandlers, entry),
    idToWorldSpace: buildIdToWorldSpace.combine(acc.idToWorldSpace, entry),
    connections: gatherConnections.combine(acc.connections, entry),
})
