import { Color, Colors, From, Hsla, TextureCoordinates, To, Vertices, WorldSpace } from "../components";
import { ECS, Entity } from "../ecs";
import { Layers } from "../layers";

const linspace = (start: number, stop: number, num: number): number[] => {
    const step = (stop - start) / (num - 1)
    return Array.from({ length: num }, (_, i) => start + step * i)
}

const cubicBezier = (ts: number[], from: WorldSpace, to: WorldSpace): number[] => {
    const p0x = from.x + from.width / 2
    const p0y = from.y + from.height / 2
    const p1x = p0x + 50
    const p1y = p0y
    const p3x = to.x + to.width / 2
    const p3y = to.y + to.height / 2
    const p2x = p3x - 50
    const p2y = p3y
    const result: number[] = []
    let lastX = 0
    let lastY = 0
    for (const t of ts) {
        const tSquared = t * t
        const tCubed = tSquared * t
        const oneMinusT = 1 - t
        const oneMinusTSquared = oneMinusT * oneMinusT
        const oneMinusTCubed = oneMinusTSquared * oneMinusT
        const a = oneMinusTCubed
        const b = 3 * oneMinusTSquared * t
        const c = 3 * oneMinusT * tSquared
        const d = tCubed
        const x = a * p0x + b * p1x + c * p2x + d * p3x
        const y = a * p0y + b * p1y + c * p2y + d * p3y
        if (result.length) result.push(lastX, lastY)
        else result.push(x, y)
        result.push(x, y)
        lastX = x
        lastY = y
    }
    return result
}

export const geometry = (connections: Entity[], layers: Layers) => {
    const samples = 20
    const ts = linspace(0, 1, samples)
    const textureCoordinates = Array(samples * 4).fill(0)
    for (const entity of connections) {
        const from = entity.get(From)!.entity.get(WorldSpace)!
        const to = entity.get(To)!.entity.get(WorldSpace)!
        const vertices = cubicBezier(ts, from, to)
        const { h, s, l, a } = entity.get(Color)!
        const colors: number[] = []
        for (let i = 0; i < samples * 2; ++i) colors.push(h, s, l, a)
        entity.set(
            new Vertices(vertices),
            new TextureCoordinates(textureCoordinates),
            new Colors(colors)
        )
        layers.lines.push(entity)
    }
}

interface Properties {
    from: Entity
    to: Entity
    color?: Hsla
}

export const connection = (ecs: ECS, properties: Properties): Entity =>
    ecs.entity(
        new From(properties.from),
        new To(properties.to),
        new Color(properties.color ?? { h: 0, s: 1, l: 1, a: 1 }),
    )