import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
    Offset,
    Hsla,
    Color,
    Vertices,
    TextureCoordinates,
    Colors,
    VertexIndices,
    Padding,
    Width,
    Height
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const clamp = (value: number, min: number, max: number): number =>
    Math.max(Math.min(value, max), min)

const layout = (self: Entity, constraints: Constraints) => {
    const padding = self.get(Padding)!.value
    const child = self.get(Child)
    if (child) {
        const childSize = child.entity.get(Layout)!.layout(child.entity, constraints)
        const size = new Size(
            Math.min(constraints.maxWidth, childSize.width + 2 * padding),
            Math.min(constraints.maxHeight, childSize.height + 2 * padding),
        )
        child.entity.update(Offset, offset => {
            offset.x = padding
            offset.y = padding
        })
        self.set(constraints, size, new Offset(0, 0))
        return size
    }
    const size = new Size(
        clamp(self.get(Width)!.value, constraints.minWidth, constraints.maxWidth),
        clamp(self.get(Height)!.value, constraints.minHeight, constraints.maxHeight),
    )
    self.set(constraints, size, new Offset(0, 0))
    return size
}

const geometry = (self: Entity, parentOffset: Offset, layers: Layers, z: number) => {
    const offset = parentOffset.add(self.get(Offset)!)
    const { width, height } = self.get(Size)!
    const x0 = offset.x
    const x1 = x0 + width
    const y0 = offset.y
    const y1 = y0 + height
    const color = self.get(Color)
    if (color) {
        const { h, s, l, a } = color
        self.set(
            new Vertices([
                x0, y0,
                x0, y1,
                x1, y0,
                x1, y1,
            ]),
            new TextureCoordinates([
                0, 0,
                0, 0,
                0, 0,
                0, 0,
            ]),
            new Colors([
                h, s, l, a,
                h, s, l, a,
                h, s, l, a,
                h, s, l, a,
            ]),
            new VertexIndices([
                0, 1, 2,
                1, 2, 3,
            ])
        )
        layers.push({ z, texture: 0, entity: self })
    }
    const child = self.get(Child)
    if (child) {
        child.entity.get(Geometry)!.geometry(child.entity, offset, layers, z)
    }
}

interface Properties {
    color?: Hsla
    padding?: number
    width?: number
    height?: number
}

type Overload = {
    (ecs: ECS, properties: Properties): Entity
    (ecs: ECS, properties: Properties, child: Entity): Entity
}

export const container: Overload = (ecs: ECS, properties: Properties, child?: Entity) => {
    const entity = ecs.entity(
        new Layout(layout),
        new Geometry(geometry),
        new Padding(properties.padding ?? 0),
        new Width(properties.width ?? 0),
        new Height(properties.height ?? 0),
    )
    if (properties.color) entity.set(new Color(properties.color))
    if (child) entity.set(new Child(child))
    return entity
}