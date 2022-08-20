
import { GenerateUUID, NodeTransform } from './graph'
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
        input: (graph6.nodes[linspace] as NodeTransform).inputs[0],
        output: (graph6.nodes[start] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph8 } = addEdge({
        graph: graph7,
        input: (graph7.nodes[linspace] as NodeTransform).inputs[1],
        output: (graph7.nodes[stop] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph9 } = addEdge({
        graph: graph8,
        input: (graph8.nodes[linspace] as NodeTransform).inputs[2],
        output: (graph8.nodes[num] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph10, node: square } = addNode({
        graph: graph9,
        operation: model.operations["square"],
        position: { x: 400, y: 325 },
        generateUUID
    })
    const { graph: graph11 } = addEdge({
        graph: graph10,
        input: (graph10.nodes[square] as NodeTransform).inputs[0],
        output: (graph10.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph12, node: scatter } = addNode({
        graph: graph11,
        operation: model.operations["scatter"],
        position: { x: 700, y: 20 },
        generateUUID
    })
    const { graph: graph13 } = addEdge({
        graph: graph12,
        input: (graph12.nodes[scatter] as NodeTransform).inputs[0],
        output: (graph12.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph14 } = addEdge({
        graph: graph13,
        input: (graph13.nodes[scatter] as NodeTransform).inputs[1],
        output: (graph13.nodes[square] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph15, node: stack } = addNode({
        graph: graph14,
        operation: model.operations["stack"],
        position: { x: 700, y: 400 },
        generateUUID
    })
    const { graph: graph16 } = addEdge({
        graph: graph15,
        input: (graph15.nodes[stack] as NodeTransform).inputs[0],
        output: (graph15.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID
    })
    const { graph: graph17 } = addEdge({
        graph: graph16,
        input: (graph16.nodes[stack] as NodeTransform).inputs[1],
        output: (graph16.nodes[square] as NodeTransform).outputs[0],
        generateUUID
    })
    return {
        ...model,
        graph: graph17,
        nodeOrder: [start, stop, num, linspace, square, scatter, stack]
    }
}