import { ClickHandlers, Renderer } from "."
import { batchGeometry } from "../batch_geometry"
import { CameraStack } from "../camera_stack"
import { Geometry, WorldSpace } from "../geometry"
import { Mat3 } from "../linear_algebra"
import { reduce, Reducer } from "../reduce"
import { Connection, Entry, UI } from "../ui"

export type Cameras = Mat3[]
export type TextureIndex = number
export type Layer = Map<TextureIndex, Geometry[]>
export type Layers = Layer[]
export type IdToWorldSpace = { [id: string]: WorldSpace }

interface Accumulator {
    layers: Layers,
    clickHandlers: ClickHandlers,
    idToWorldSpace: IdToWorldSpace
    connections: Connection[]
}

export const layerGeometry: Reducer<Layers> = {
    initial: () => [],
    combine: (layers: Layers, entry: Entry) => {
        if (entry.geometry.vertices.length == 0) return layers
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

export const gatherOnClickHandlers: Reducer<ClickHandlers> = {
    initial: () => [],
    combine: (handlers: ClickHandlers, entry: Entry) => {
        if (!entry.ui.onClick) return handlers
        const needed = entry.z - handlers.length + 1
        for (let i = 0; i < needed; ++i) handlers.push([])
        handlers[entry.z].push({
            onClick: entry.ui.onClick,
            worldSpace: entry.geometry.worldSpace
        })
        return handlers
    }
}


export const buildIdToWorldSpace: Reducer<IdToWorldSpace> = {
    initial: () => ({}),
    combine: (lookup: IdToWorldSpace, entry: Entry) => {
        if (!entry.ui.id) return lookup
        lookup[entry.ui.id] = entry.geometry.worldSpace
        return lookup
    }
}

export const gatherConnections: Reducer<Connection[]> = {
    initial: () => [],
    combine: (connections: Connection[], entry: Entry) => {
        if (!entry.ui.connections) return connections
        connections.push(...entry.ui.connections)
        return connections
    }
}


export const reducer: Reducer<Accumulator> = {
    initial: () => ({
        layers: layerGeometry.initial(),
        clickHandlers: gatherOnClickHandlers.initial(),
        idToWorldSpace: buildIdToWorldSpace.initial(),
        connections: gatherConnections.initial()
    }),
    combine: (acc: Accumulator, entry: Entry) => {
        return {
            layers: layerGeometry.combine(acc.layers, entry),
            clickHandlers: gatherOnClickHandlers.combine(acc.clickHandlers, entry),
            idToWorldSpace: buildIdToWorldSpace.combine(acc.idToWorldSpace, entry),
            connections: gatherConnections.combine(acc.connections, entry)
        }
    }
}

export const render = <R extends Renderer>(renderer: R, ui: UI): R => {
    const { width, height } = renderer.size
    renderer.clear()
    const constraints = {
        minWidth: 0,
        maxWidth: width,
        minHeight: 0,
        maxHeight: height
    }
    const layout = ui.layout(constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const cameraStack = new CameraStack()
    const geometry = ui.geometry(layout, offsets, cameraStack)
    const { layers, clickHandlers } = reduce(ui, layout, geometry, reducer)
    const batches = batchGeometry(layers)
    renderer.cameras = cameraStack.cameras
    renderer.clickHandlers = clickHandlers
    for (const batch of batches) renderer.draw(batch)
    return renderer
}
