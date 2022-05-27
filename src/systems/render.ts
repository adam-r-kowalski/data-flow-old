import { ECS } from "../ecs";
import { Colors, Renderer, TextureCoordinates, VertexIndices, Vertices } from "../components";
import { systems } from "../studio";

export const render = (ecs: ECS) => {
    systems.layout(ecs)
    const layers = systems.geometry(ecs)
    const renderer = ecs.get(Renderer)!
    renderer.clear()
    const vertices = renderer.entity.get(Vertices)!
    const colors = renderer.entity.get(Colors)!
    const textureCoordinates = renderer.entity.get(TextureCoordinates)!
    const indices = renderer.entity.get(VertexIndices)!
    for (const layer of layers.data) {
        for (const entity of layer) {
            const offset = vertices.data.length / 2
            vertices.data.push(...entity.get(Vertices)!.data)
            colors.data.push(...entity.get(Colors)!.data)
            textureCoordinates.data.push(...entity.get(TextureCoordinates)!.data)
            for (const index of entity.get(VertexIndices)!.data) {
                indices.data.push(offset + index)
            }
        }
    }
    renderer.draw()
}