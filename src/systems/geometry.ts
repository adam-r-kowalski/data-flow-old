import { Geometry, Offset } from "../components";
import { Entity } from "../ecs";
import { Layers } from "../layers";

export const geometry = (root: Entity): Layers => {
    const layers = new Layers()
    root.get(Geometry)!.geometry(root, new Offset(0, 0), layers, 0)
    return layers
}