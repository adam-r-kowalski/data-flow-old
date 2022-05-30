import {
    Layout,
    Text,
    FontSize,
    FontFamily,
    Constraints,
    Color,
    Offset,
    Geometry,
    Size,
    Vertices,
    TextureCoordinates,
    Colors,
    VertexIndices
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";
import { Renderer } from "../renderer";

const textSize = (renderer: Renderer, entity: Entity) => {
    const text = entity.get(Text)!.value
    const fontSize = entity.get(FontSize)!.value
    const fontFamily = entity.get(FontFamily)!.value
    const atlas = renderer.fontAtlas(fontFamily, fontSize)
    let size = new Size(0, 0)
    for (const c of text) {
        const metric = atlas.metric(c)
        size.width += metric.width
        size.height = Math.max(metric.height, size.height)
    }
    return size
}

const textGeometry = (renderer: Renderer, entity: Entity, parentOffset: Offset): number => {
    const text = entity.get(Text)!.value
    const fontSize = entity.get(FontSize)!.value
    const fontFamily = entity.get(FontFamily)!.value
    const { h, s, l, a } = entity.get(Color)!
    const atlas = renderer.fontAtlas(fontFamily, fontSize)
    let x = 0
    let indexOffset = 0
    const vertices = new Vertices()
    const textureCoordinates = new TextureCoordinates()
    const colors = new Colors()
    const indices = new VertexIndices()
    const offset = entity.get(Offset)!.add(parentOffset)
    for (const c of text) {
        const metric = atlas.metric(c)
        const x0 = offset.x + x
        const x1 = x0 + metric.width
        const y0 = offset.y
        const y1 = y0 + metric.height
        vertices.data.push(
            x0, y0,
            x0, y1,
            x1, y0,
            x1, y1,
        )
        textureCoordinates.data.push(
            metric.x, metric.y,
            metric.x, metric.y + metric.height,
            metric.x + metric.width, metric.y,
            metric.x + metric.width, metric.y + metric.height,
        )
        colors.data.push(
            h, s, l, a,
            h, s, l, a,
            h, s, l, a,
            h, s, l, a,
        )
        indices.data.push(
            indexOffset + 0, indexOffset + 1, indexOffset + 2,
            indexOffset + 1, indexOffset + 2, indexOffset + 3,
        )
        x += metric.width
        indexOffset += 4
    }
    entity.set(vertices, textureCoordinates, colors, indices)
    return atlas.texture
}

const layout = (self: Entity, constraints: Constraints) => {
    const size = textSize(self.ecs.get(Renderer)!, self)
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, offset: Offset, layers: Layers, z: number) => {
    const texture = textGeometry(self.ecs.get(Renderer)!, self, offset)
    layers.push({ z, entity: self, texture })
}

export const text = (ecs: ECS, data: string) =>
    ecs.entity(
        new Text(data),
        new FontSize(24),
        new FontFamily("monospace"),
        new Color({ h: 0, s: 1, l: 1, a: 1 }),
        new Layout(layout),
        new Geometry(geometry),
    )