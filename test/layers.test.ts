import * as Studio from '../src/studio'

test("push entity to layer zero", () => {
    const layers = new Studio.Layers()
    expect(layers.layers).toEqual([])
})

test("push entities to layer zero with same texture", () => {
    const ecs = new Studio.ECS()
    const layers = new Studio.Layers()
    const entity0 = ecs.entity()
    const entity1 = ecs.entity()
    const texture = 0
    layers.push({ z: 0, entity: entity0, texture })
    {
        const map = new Map<WebGLTexture, Studio.Entity[]>()
        map.set(texture, [entity0])
        expect(layers.layers).toEqual([map])
    }
    layers.push({ z: 0, entity: entity1, texture })
    {
        const map = new Map<WebGLTexture, Studio.Entity[]>()
        map.set(texture, [entity0, entity1])
        expect(layers.layers).toEqual([map])
    }
})

test("push entities to layer zero then one", () => {
    const ecs = new Studio.ECS()
    const layers = new Studio.Layers()
    const entity0 = ecs.entity()
    const entity1 = ecs.entity()
    const entity2 = ecs.entity()
    const texture = 0
    layers.push({ z: 0, entity: entity0, texture })
    layers.push({ z: 0, entity: entity1, texture })
    layers.push({ z: 1, entity: entity2, texture })
    const map0 = new Map<WebGLTexture, Studio.Entity[]>()
    map0.set(texture, [entity0, entity1])
    const map1 = new Map<WebGLTexture, Studio.Entity[]>()
    map1.set(texture, [entity2])
    expect(layers.layers).toEqual([map0, map1])
})