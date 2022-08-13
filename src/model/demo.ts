
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
    const graph1 = changeBodyValue(graph0, graph0.nodes[start].body!, () => -5)
    const { graph: graph2, node: stop } = addNode({
        graph: graph1,
        operation: model.operations["number"],
        position: { x: 25, y: 90 },
        generateUUID
    })
    const graph3 = changeBodyValue(graph2, graph2.nodes[stop].body!, () => 5)
    const { graph: graph4, node: num } = addNode({
        graph: graph3,
        operation: model.operations["number"],
        position: { x: 25, y: 160 },
        generateUUID
    })
    const graph5 = changeBodyValue(graph4, graph4.nodes[num].body!, () => 11)
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
    const { graph: graph10, node: diag } = addNode({
        graph: graph9,
        operation: model.operations["diag"],
        position: { x: 400, y: 20 },
        generateUUID
    })
    const { graph: graph11 } = addEdge({
        graph: graph10,
        input: graph10.nodes[diag].inputs[0],
        output: graph10.nodes[linspace].outputs[0],
        generateUUID
    })
    return {
        ...model,
        graph: graph11,
        nodeOrder: [start, stop, num, linspace, diag]
    }
}