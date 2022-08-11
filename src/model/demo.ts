
import { GenerateUUID } from './graph'
import { addEdge, addNode, changeBodyValue } from "../update/graph"
import { Model, Window } from '.'
import { emptyModel } from './empty'
import { operations } from './operations'

export const demoModel = (window: Window, generateUUID: GenerateUUID): Model => {
    const model: Model = {
        ...emptyModel(window),
        operations
    }
    const { graph: graph0, node: start } = addNode({
        graph: model.graph,
        operation: model.operations["number"],
        position: { x: 25, y: 20 },
        generateUUID
    })
    const graph1 = changeBodyValue(graph0, graph0.nodes[start].body!, () => -5, generateUUID)
    const { graph: graph2, node: stop } = addNode({
        graph: graph1,
        operation: model.operations["number"],
        position: { x: 25, y: 90 },
        generateUUID
    })
    const graph3 = changeBodyValue(graph2, graph2.nodes[stop].body!, () => 5, generateUUID)
    const { graph: graph4, node: num } = addNode({
        graph: graph3,
        operation: model.operations["number"],
        position: { x: 25, y: 160 },
        generateUUID
    })
    const graph5 = changeBodyValue(graph4, graph4.nodes[num].body!, () => 11, generateUUID)
    const { graph: graph6, node: linspace } = addNode({
        graph: graph5,
        operation: model.operations["linspace"],
        position: { x: 175, y: 20 },
        generateUUID
    })
    const { graph: graph7 } = addEdge({
        graph: graph6,
        input: graph6.nodes[linspace].inputs[0],
        output: graph6.nodes[start].outputs[0],
        generateUUID
    })
    const { graph: graph8 } = addEdge({
        graph: graph7,
        input: graph7.nodes[linspace].inputs[1],
        output: graph7.nodes[stop].outputs[0],
        generateUUID
    })
    const { graph: graph9 } = addEdge({
        graph: graph8,
        input: graph8.nodes[linspace].inputs[2],
        output: graph8.nodes[num].outputs[0],
        generateUUID
    })
    const { graph: graph10, node: by } = addNode({
        graph: graph9,
        operation: model.operations["number"],
        position: { x: 255, y: 350 },
        generateUUID
    })
    const graph11 = changeBodyValue(graph10, graph10.nodes[by].body!, () => 10, generateUUID)
    const { graph: graph12, node: mul } = addNode({
        graph: graph11,
        operation: model.operations["mul"],
        position: { x: 425, y: 20 },
        generateUUID
    })
    const { graph: graph13 } = addEdge({
        graph: graph12,
        input: graph12.nodes[mul].inputs[0],
        output: graph12.nodes[linspace].outputs[0],
        generateUUID
    })
    const { graph: graph14 } = addEdge({
        graph: graph13,
        input: graph13.nodes[mul].inputs[1],
        output: graph13.nodes[by].outputs[0],
        generateUUID
    })
    return {
        ...model,
        graph: graph14,
        nodeOrder: [start, stop, num, linspace, by, mul]
    }
}