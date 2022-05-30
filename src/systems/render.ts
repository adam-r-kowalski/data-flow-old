import { Renderer } from "../renderer";
import { ECS } from "../ecs";
import { Colors, TextureCoordinates, VertexIndices, Vertices } from "../components";
import { systems } from "../studio";

export const render = (ecs: ECS) => {
    systems.layout(ecs)
    const layers = systems.geometry(ecs)
    const renderer = ecs.get(Renderer)!
    const { gl } = renderer
    renderer.clear()
    let vertices: number[] = []
    let colors: number[] = []
    let textureCoordinates: number[] = []
    let vertexIndices: number[] = []
    let previousTexture: number = -1
    for (const layer of layers.layers) {
        for (const [texture, entities] of layer) {
            if (texture != previousTexture) {
                renderer.draw({ vertices, colors, textureCoordinates, vertexIndices })
                vertices = []
                colors = []
                textureCoordinates = []
                vertexIndices = []
                previousTexture = texture
                gl.bindTexture(gl.TEXTURE_2D, renderer.textures[texture])
            }
            for (const entity of entities) {
                const offset = vertices.length / 2
                vertices.push(...entity.get(Vertices)!.data)
                colors.push(...entity.get(Colors)!.data)
                textureCoordinates.push(...entity.get(TextureCoordinates)!.data)
                for (const index of entity.get(VertexIndices)!.data) {
                    vertexIndices.push(offset + index)
                }
            }
        }
        renderer.draw({ vertices, colors, textureCoordinates, vertexIndices })
    }
}