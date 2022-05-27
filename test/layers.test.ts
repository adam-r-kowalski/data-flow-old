import * as Studio from '../src/studio'

test("push entity to layer zero", () => {
    const layers = new Studio.Layers()
    expect(layers.data).toEqual([])
})

test("push entities to layer zero", () => {
    const ecs = new Studio.ECS()
    const layers = new Studio.Layers()
    const entity0 = ecs.entity()
    const entity1 = ecs.entity()
    layers.push(0, entity0)
    expect(layers.data).toEqual([[entity0]])
    layers.push(0, entity1)
    expect(layers.data).toEqual([[entity0, entity1]])
})

test("push entities to layer zero then one", () => {
    const ecs = new Studio.ECS()
    const layers = new Studio.Layers()
    const entity0 = ecs.entity()
    const entity1 = ecs.entity()
    const entity2 = ecs.entity()
    layers.push(0, entity0)
    layers.push(0, entity1)
    layers.push(1, entity2)
    expect(layers.data).toEqual([[entity0, entity1], [entity2]])
})