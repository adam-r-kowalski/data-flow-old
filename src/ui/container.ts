import {
    Layout,
    Constraints,
    Geometry,
    Size,
    Child,
    Offset,
    Color,
    Vertices,
    TextureCoordinates,
    Colors,
    VertexIndices,
    Padding,
    Width,
    Height,
    WorldSpace,
    Translate,
    OnDragCallback,
    OnClickCallback,
    OnClick,
    OnDrag
} from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const clamp = (value: number, min: number, max: number): number =>
    Math.max(Math.min(value, max), min)

const layout = (self: Entity, constraints: Constraints) => {
    const padding = self.get(Padding)!.value
    const child = self.get(Child)
    const { x, y } = self.get(Translate)!
    const offset = new Offset(x, y)
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
        self.set(constraints, size, offset)
        return size
    }
    const size = new Size(
        clamp(self.get(Width)!.value, constraints.minWidth, constraints.maxWidth),
        clamp(self.get(Height)!.value, constraints.minHeight, constraints.maxHeight),
    )
    self.set(constraints, size, offset)
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
        const { r, g, b, a } = color
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
                r, g, b, a,
                r, g, b, a,
                r, g, b, a,
                r, g, b, a,
            ]),
            new VertexIndices([
                0, 1, 2,
                1, 2, 3,
            ]),
        )
        layers.push({ z, texture: 0, entity: self })
    }
    const child = self.get(Child)
    if (child) {
        child.entity.get(Geometry)!.geometry(child.entity, offset, layers, z + 1)
    }
    self.set(new WorldSpace(x0, y0, width, height))
}

interface Properties {
    color?: Color
    padding?: number
    width?: number
    height?: number
    x?: number
    y?: number
    onDrag?: OnDragCallback
    onClick?: OnClickCallback
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
        new Translate(properties.x ?? 0, properties.y ?? 0)
    )
    if (properties.color) entity.set(properties.color)
    if (child) entity.set(new Child(child))
    if (properties.onDrag) entity.set(new OnDrag(properties.onDrag))
    if (properties.onClick) entity.set(new OnClick(properties.onClick))
    return entity
}