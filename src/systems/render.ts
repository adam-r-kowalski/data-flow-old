import { Renderer } from "../renderer";
import { ECS } from "../ecs";
import { Camera, CameraIndices, Colors, TextureCoordinates, Transform, UIRoot, VertexIndices, Vertices } from "../components";
import { Layers } from "../layers";
import { layout, geometry } from './'
import { Mat3 } from "../linear_algebra";

const renderTriangles = (renderer: Renderer, layers: Layers) => {
    const { gl } = renderer
    let vertices: number[] = []
    let colors: number[] = []
    let textureCoordinates: number[] = []
    let vertexIndices: number[] = []
    let previousTexture: number = -1
    for (const layer of layers.layers) {
        for (const [texture, entities] of layer) {
            if (texture != previousTexture) {
                if (vertices.length) {
                    renderer.draw({ vertices, colors, textureCoordinates, vertexIndices })
                    vertices = []
                    colors = []
                    textureCoordinates = []
                    vertexIndices = []
                }
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
    }
    if (vertices.length == 0) return
    renderer.draw({ vertices, colors, textureCoordinates, vertexIndices })
}

const renderLines = (renderer: Renderer, layers: Layers) => {
    const { gl } = renderer
    let vertices: number[] = []
    let colors: number[] = []
    let textureCoordinates: number[] = []
    let cameraIndices: number[] = []
    gl.bindTexture(gl.TEXTURE_2D, renderer.textures[0])
    for (const entity of layers.lines) {
        vertices.push(...entity.get(Vertices)!.data)
        colors.push(...entity.get(Colors)!.data)
        textureCoordinates.push(...entity.get(TextureCoordinates)!.data)
        cameraIndices.push(...entity.get(CameraIndices)!.data)
    }
    if (vertices.length == 0) return
    renderer.drawLines({ vertices, colors, textureCoordinates })
}

export const render = (ecs: ECS) => {
    const root = ecs.get(UIRoot)!.entity
    layout(root)
    const layers = geometry(root)
    const renderer = ecs.get(Renderer)!
    const projection = Mat3.projection(renderer.width, renderer.height)
    const camera = root.get(Camera)!.entity.get(Transform)!.matrix
    renderer.setMatrix(projection.matMul(camera.inverse()))
    renderer.clear()
    renderTriangles(renderer, layers)
    renderLines(renderer, layers)
    ecs.set(layers)
}