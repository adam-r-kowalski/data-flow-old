import { Renderer } from "../renderer";
import { ECS } from "../ecs";
import { CameraIndices, Colors, TextureCoordinates, VertexIndices, Vertices } from "../components";
import { Layers } from "../layers";
import { layout, geometry } from './'
import { Mat3 } from "../linear_algebra";

const renderTriangles = (renderer: Renderer, layers: Layers) => {
    const { gl } = renderer
    let vertices: number[] = []
    let colors: number[] = []
    let textureCoordinates: number[] = []
    let vertexIndices: number[] = []
    let cameraIndices: number[] = []
    let previousTexture: number = -1
    for (const layer of layers.layers) {
        for (const [texture, entities] of layer) {
            if (texture != previousTexture) {
                if (vertices.length) {
                    renderer.draw({ vertices, colors, textureCoordinates, vertexIndices, cameraIndices })
                    vertices = []
                    colors = []
                    textureCoordinates = []
                    vertexIndices = []
                    cameraIndices = []
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
                cameraIndices.push(...entity.get(CameraIndices)!.data)
            }
        }
    }
    if (vertices.length == 0) return
    renderer.draw({ vertices, colors, textureCoordinates, vertexIndices, cameraIndices })
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
    renderer.drawLines({ vertices, colors, textureCoordinates, cameraIndices })
}


export const render = (ecs: ECS) => {
    const begin = performance.now()
    layout(ecs)
    const layers = geometry(ecs)
    const renderer = ecs.get(Renderer)!
    const projection = Mat3.projection(renderer.width, renderer.height)
    renderer.setMatrices(layers.cameras.map(camera => projection.matMul(camera.inverse())))
    renderer.clear()
    renderTriangles(renderer, layers)
    renderLines(renderer, layers)
    const end = performance.now()
    return end - begin
}