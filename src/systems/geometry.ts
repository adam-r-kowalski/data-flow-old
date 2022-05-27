import { UIRoot, Geometry, Offset } from "../components";
import { ECS } from "../ecs";
import { Layers } from "../layers";

export const geometry = (ecs: ECS): Layers => {
    const layers = new Layers()
    const ui = ecs.get(UIRoot)!.entity
    ui.get(Geometry)!.geometry(ui, new Offset(0, 0), layers, 0)
    return layers
}