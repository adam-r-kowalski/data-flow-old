
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
    const { graph: graph0, node: number0 } = addNode({
        graph: model.graph,
        operation: model.operations["number"],
        position: { x: 25, y: 20 },
        generateUUID
    })
    const graph1 = changeBodyValue(graph0, graph0.nodes[number0].body!, () => 10, generateUUID)
    const { graph: graph2, node: number1 } = addNode({
        graph: graph1,
        operation: model.operations["number"],
        position: { x: 25, y: 105 },
        generateUUID
    })
    const graph3 = changeBodyValue(graph2, graph2.nodes[number1].body!, () => 25, generateUUID)
    const { graph: graph4, node: add } = addNode({
        graph: graph3,
        operation: model.operations["add"],
        position: { x: 175, y: 20 },
        generateUUID
    })
    const { graph: graph5 } = addEdge({
        graph: graph4,
        input: graph4.nodes[add].inputs[0],
        output: graph4.nodes[number0].outputs[0],
        generateUUID
    })
    const { graph: graph6 } = addEdge({
        graph: graph5,
        input: graph5.nodes[add].inputs[1],
        output: graph5.nodes[number1].outputs[0],
        generateUUID
    })
    const { graph: graph7, node: number2 } = addNode({
        graph: graph6,
        operation: model.operations["number"],
        position: { x: 227, y: 115 },
        generateUUID
    })
    const graph8 = changeBodyValue(graph7, graph7.nodes[number2].body!, () => 5, generateUUID)
    const { graph: graph9, node: div } = addNode({
        graph: graph8,
        operation: model.operations["div"],
        position: { x: 370, y: 20 },
        generateUUID
    })
    const { graph: graph10 } = addEdge({
        graph: graph9,
        input: graph9.nodes[div].inputs[0],
        output: graph9.nodes[add].outputs[0],
        generateUUID
    })
    const { graph: graph11 } = addEdge({
        graph: graph10,
        input: graph10.nodes[div].inputs[1],
        output: graph10.nodes[number2].outputs[0],
        generateUUID
    })
    return {
        ...model,
        graph: graph11,
        nodeOrder: [number0, number1, add, number2, div]
    }
}