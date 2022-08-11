import * as tf from '@tensorflow/tfjs'

import { Body, Edge, GenerateUUID, Graph, Inputs, Node, Operation, Outputs, Position, UUID } from "../model/graph"

interface AddNodeInputs {
    graph: Graph
    operation: Operation
    position: Position
    generateUUID: GenerateUUID
}

interface AddNodeOutputs {
    graph: Graph
    node: UUID
}

export const addNode = ({ graph, operation, position, generateUUID }: AddNodeInputs): AddNodeOutputs => {
    const nodeUUID = generateUUID()
    const inputs: Inputs = { ...graph.inputs }
    const inputUUIDs = []
    for (const name of operation.inputs) {
        const uuid = generateUUID()
        inputs[uuid] = {
            uuid,
            node: nodeUUID,
            name
        }
        inputUUIDs.push(uuid)
    }
    const outputs: Outputs = { ...graph.outputs }
    const outputUUIDs = []
    for (const name of operation.outputs) {
        const uuid = generateUUID()
        outputs[uuid] = {
            uuid,
            node: nodeUUID,
            name,
            edges: []
        }
        outputUUIDs.push(uuid)
    }
    const node: Node = {
        uuid: nodeUUID,
        name: operation.name,
        inputs: inputUUIDs,
        outputs: outputUUIDs,
        position,
        operation: operation.operation
    }
    if (operation.body !== undefined) {
        const body: Body = {
            uuid: generateUUID(),
            node: nodeUUID,
            value: operation.body,
            rank: 0,
            editable: true
        }
        return {
            graph: {
                ...graph,
                nodes: { ...graph.nodes, [node.uuid]: { ...node, body: body.uuid } },
                inputs,
                outputs,
                bodys: { ...graph.bodys, [body.uuid]: body }
            },
            node: nodeUUID
        }
    } else {
        return {
            graph: {
                ...graph,
                nodes: { ...graph.nodes, [node.uuid]: node },
                inputs,
                outputs
            },
            node: nodeUUID
        }
    }
}

export const removeNode = (graph: Graph, node: UUID): Graph => {
    const nodes = { ...graph.nodes }
    const removedNode = nodes[node]
    delete nodes[node]
    const edgeUUIDs: UUID[] = []
    for (const input of removedNode.inputs) {
        const edge = graph.inputs[input].edge
        if (edge) edgeUUIDs.push(edge)
    }
    for (const output of removedNode.outputs) {
        for (const edge of graph.outputs[output].edges) {
            edgeUUIDs.push(edge)
        }
    }
    const edges = { ...graph.edges }
    const inputs = { ...graph.inputs }
    const outputs = { ...graph.outputs }
    for (const uuid of edgeUUIDs) {
        const edge = edges[uuid]
        const input = inputs[edge.input]
        inputs[edge.input] = {
            ...input,
            edge: undefined
        }
        const output = outputs[edge.output]
        outputs[edge.output] = {
            ...output,
            edges: output.edges.filter(e => e !== uuid)
        }
        delete edges[uuid]
    }
    for (const input of removedNode.inputs) delete inputs[input]
    for (const output of removedNode.outputs) delete outputs[output]
    return {
        ...graph,
        nodes,
        edges,
        inputs,
        outputs
    }
}

export const removeInputEdge = (graph: Graph, input: UUID, generateUUID: GenerateUUID): Graph => {
    const edgeUUID = graph.inputs[input].edge
    if (edgeUUID) {
        const edge = graph.edges[edgeUUID]
        const output = graph.outputs[edge.output]
        const outputs = {
            ...graph.outputs,
            [edge.output]: {
                ...output,
                edges: output.edges.filter(e => e !== edge.uuid)
            }
        }
        const input = graph.inputs[edge.input]
        const inputs = {
            ...graph.inputs,
            [edge.input]: {
                ...input,
                edge: undefined
            }
        }
        const edges = { ...graph.edges }
        delete edges[edgeUUID]
        const graph1 = {
            ...graph,
            outputs,
            inputs,
            edges
        }
        return evaluateNode(graph1, input.node, generateUUID)
    } else {
        return graph
    }
}

export const removeOutputEdges = (graph: Graph, output: UUID, generateUUID: GenerateUUID): Graph => {
    const edges = { ...graph.edges }
    const inputs = { ...graph.inputs }
    const outputs = { ...graph.outputs }
    const nodes: UUID[] = []
    for (const uuid of graph.outputs[output].edges) {
        const edge = graph.edges[uuid]
        const input = inputs[edge.input]
        nodes.push(input.node)
        inputs[edge.input] = {
            ...input,
            edge: undefined
        }
        const output = outputs[edge.output]
        outputs[edge.output] = {
            ...output,
            edges: output.edges.filter(e => e !== uuid)
        }
        delete edges[uuid]
    }
    const graph1 = {
        ...graph,
        outputs,
        inputs,
        edges
    }
    return nodes.reduce((graph, node) => evaluateNode(graph, node, generateUUID), graph1)
}

const evaluateNodeOutputs = (graph: Graph, node: Node, generateUUID: GenerateUUID): Graph =>
    node.outputs.reduce((graph1: Graph, output: UUID): Graph => {
        return graph1.outputs[output].edges.reduce((graph2: Graph, edge: UUID): Graph => {
            const input = graph2.edges[edge].input
            const node = graph2.inputs[input].node
            return evaluateNode(graph2, node, generateUUID)
        }, graph1)
    }, graph)


const evaluateNode = (graph: Graph, nodeUUID: UUID, generateUUID: GenerateUUID): Graph => {
    const node = graph.nodes[nodeUUID]
    if (node.inputs.length === 0) {
        return evaluateNodeOutputs(graph, node, generateUUID)
    } else {
        const values = node.inputs
            .map(input => graph.inputs[input].edge)
            .filter(edgeUUID => edgeUUID !== undefined)
            .map(edgeUUID => {
                const edge = graph.edges[edgeUUID!]
                const output = graph.outputs[edge.output]
                return graph.nodes[output.node].body
            })
            .filter(bodyUUID => bodyUUID !== undefined)
            .map(bodyUUID => graph.bodys[bodyUUID!].value)
        if (values.length > 0 && values.length === node.inputs.length) {
            const result = node.operation!.apply(this, values)
            const body: Body = {
                uuid: generateUUID(),
                node: node.uuid,
                value: result.arraySync(),
                rank: result.rank,
                editable: false,
            }
            const graph1 = {
                ...graph,
                nodes: {
                    ...graph.nodes,
                    [node.uuid]: {
                        ...node,
                        body: body.uuid
                    }
                },
                bodys: {
                    ...graph.bodys,
                    [body.uuid]: body
                }
            }
            if (node.body === undefined) {
                return evaluateNodeOutputs(graph1, node, generateUUID)
            } else {
                delete graph1.bodys[node.body]
                return evaluateNodeOutputs(graph1, node, generateUUID)
            }
        } else if (node.body !== undefined) {
            const bodys = { ...graph.bodys }
            delete bodys[node.body]
            const graph1 = {
                ...graph,
                nodes: {
                    ...graph.nodes,
                    [node.uuid]: {
                        ...node,
                        body: undefined
                    }
                },
                bodys
            }
            return evaluateNodeOutputs(graph1, node, generateUUID)
        } else {
            return graph
        }
    }
}


interface AddEdgeInputs {
    graph: Graph
    input: UUID
    output: UUID
    generateUUID: GenerateUUID
}

interface AddEdgeOutputs {
    graph: Graph
    edge: UUID
}

export const addEdge = ({ graph, input, output, generateUUID }: AddEdgeInputs): AddEdgeOutputs => {
    const edge: Edge = {
        uuid: generateUUID(),
        input,
        output
    }
    const inputs: Inputs = {
        ...graph.inputs,
        [input]: {
            ...graph.inputs[input],
            edge: edge.uuid
        }
    }
    const currentOutput = graph.outputs[output]
    const outputs: Outputs = {
        ...graph.outputs,
        [output]: {
            ...currentOutput,
            edges: [...currentOutput.edges, edge.uuid]
        }
    }
    const graph1: Graph = {
        ...graph,
        inputs,
        outputs,
        edges: {
            ...graph.edges,
            [edge.uuid]: edge
        }
    }
    return {
        graph: evaluateNode(graph1, graph1.inputs[input].node, generateUUID),
        edge: edge.uuid
    }
}

export const changeNodePosition = (graph: Graph, node: UUID, transform: (position: Position) => Position): Graph => {
    const currentNode = graph.nodes[node]
    return {
        ...graph,
        nodes: {
            ...graph.nodes,
            [node]: {
                ...currentNode,
                position: transform(currentNode.position)
            }
        }
    }
}

export const changeBodyValue = (graph: Graph, body: UUID, transform: (value: tf.TensorLike) => tf.TensorLike, generateUUID: GenerateUUID): Graph => {
    const currentBody = graph.bodys[body]
    const graph1 = {
        ...graph,
        bodys: {
            ...graph.bodys,
            [body]: {
                ...currentBody,
                value: transform(currentBody.value)
            }
        }
    }
    const node = graph1.bodys[body].node
    return evaluateNode(graph1, node, generateUUID)
}