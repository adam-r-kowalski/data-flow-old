import { NodeTransform } from "./graph"
import {
    addEdge,
    addNode,
    changeNumberText,
    OnTableUploaded,
} from "../update/graph"
import { Model } from "."
import { Effects } from "../effects"
import { operations } from "./operations"

export const loadDemoModel = (
    model: Model,
    effects: Effects,
    onTableUploaded: OnTableUploaded
): Model => {
    const { graph: graph0, node: start } = addNode({
        graph: model.graph,
        operation: operations["number"],
        position: { x: 25, y: 20 },
        effects,
        onTableUploaded,
    })
    const graph1 = changeNumberText(
        graph0,
        graph0.nodes[start].body!,
        () => "-5"
    )
    const { graph: graph2, node: stop } = addNode({
        graph: graph1,
        operation: operations["number"],
        position: { x: 25, y: 90 },
        effects,
        onTableUploaded,
    })
    const graph3 = changeNumberText(graph2, graph2.nodes[stop].body!, () => "9")
    const { graph: graph4, node: num } = addNode({
        graph: graph3,
        operation: operations["number"],
        position: { x: 25, y: 160 },
        effects,
        onTableUploaded,
    })
    const graph5 = changeNumberText(graph4, graph4.nodes[num].body!, () => "10")
    const { graph: graph6, node: linspace } = addNode({
        graph: graph5,
        operation: operations["linspace"],
        position: { x: 175, y: 20 },
        effects,
        onTableUploaded,
    })
    const { graph: graph7 } = addEdge({
        graph: graph6,
        input: (graph6.nodes[linspace] as NodeTransform).inputs[0],
        output: (graph6.nodes[start] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph8 } = addEdge({
        graph: graph7,
        input: (graph7.nodes[linspace] as NodeTransform).inputs[1],
        output: (graph7.nodes[stop] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph9 } = addEdge({
        graph: graph8,
        input: (graph8.nodes[linspace] as NodeTransform).inputs[2],
        output: (graph8.nodes[num] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph10, node: square } = addNode({
        graph: graph9,
        operation: operations["square"],
        position: { x: 450, y: 350 },
        effects,
        onTableUploaded,
    })
    const { graph: graph11 } = addEdge({
        graph: graph10,
        input: (graph10.nodes[square] as NodeTransform).inputs[0],
        output: (graph10.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph12, node: scatter } = addNode({
        graph: graph11,
        operation: operations["scatter"],
        position: { x: 700, y: 20 },
        effects,
        onTableUploaded,
    })
    const { graph: graph13 } = addEdge({
        graph: graph12,
        input: (graph12.nodes[scatter] as NodeTransform).inputs[0],
        output: (graph12.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph14 } = addEdge({
        graph: graph13,
        input: (graph13.nodes[scatter] as NodeTransform).inputs[1],
        output: (graph13.nodes[square] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph15, node: stack } = addNode({
        graph: graph14,
        operation: operations["stack"],
        position: { x: 750, y: 400 },
        effects,
        onTableUploaded,
    })
    const { graph: graph16 } = addEdge({
        graph: graph15,
        input: (graph15.nodes[stack] as NodeTransform).inputs[0],
        output: (graph15.nodes[linspace] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    const { graph: graph17 } = addEdge({
        graph: graph16,
        input: (graph16.nodes[stack] as NodeTransform).inputs[1],
        output: (graph16.nodes[square] as NodeTransform).outputs[0],
        generateUUID: effects.generateUUID,
    })
    return {
        ...model,
        graph: graph17,
        nodeOrder: [start, stop, num, linspace, square, scatter, stack],
        operations,
    }
}
