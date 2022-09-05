import * as papa from 'papaparse'
import { EventKind, UploadCsv } from '.'

import { Body, BodyKind, Edge, GenerateUUID, Graph, Inputs, Node, NodeKind, NodeSource, NodeTransform, Operation, OperationKind, Outputs, Position, UUID } from "../model/graph"
import { Table, Value } from "../model/table"

interface AddNodeInputs {
    graph: Graph
    operation: Operation
    position: Position
    generateUUID: GenerateUUID
}

interface AddNodeOutputs {
    graph: Graph
    node: UUID
    event?: Promise<UploadCsv>
}

export const addNode = ({ graph, operation, position, generateUUID }: AddNodeInputs): AddNodeOutputs => {
    const nodeUUID = generateUUID()
    const inputs = { ...graph.inputs }
    const outputs = { ...graph.outputs }
    const bodys = { ...graph.bodys }
    switch (operation.kind) {
        case OperationKind.NUMBER: {
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
            const body: Body = {
                kind: BodyKind.NUMBER,
                uuid: generateUUID(),
                node: nodeUUID,
                value: 0,
                text: '0'
            }
            const node: NodeSource = {
                kind: NodeKind.SOURCE,
                uuid: nodeUUID,
                name: operation.name,
                outputs: outputUUIDs,
                body: body.uuid,
                position,
            }
            bodys[body.uuid] = body
            return {
                graph: {
                    ...graph,
                    nodes: { ...graph.nodes, [node.uuid]: { ...node, body: node.body } },
                    inputs,
                    outputs,
                    bodys
                },
                node: nodeUUID
            }
        }
        case OperationKind.TEXT: {
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
            const body: Body = {
                kind: BodyKind.TEXT,
                uuid: generateUUID(),
                node: nodeUUID,
                value: '',
            }
            const node: NodeSource = {
                kind: NodeKind.SOURCE,
                uuid: nodeUUID,
                name: operation.name,
                outputs: outputUUIDs,
                body: body.uuid,
                position,
            }
            bodys[body.uuid] = body
            return {
                graph: {
                    ...graph,
                    nodes: { ...graph.nodes, [node.uuid]: { ...node, body: node.body } },
                    inputs,
                    outputs,
                    bodys
                },
                node: nodeUUID
            }
        }
        case OperationKind.TRANSFORM: {
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
            const body: Body = {
                kind: BodyKind.NO,
                uuid: generateUUID(),
                node: nodeUUID,
            }
            const node: NodeTransform = {
                kind: NodeKind.TRANSFORM,
                uuid: nodeUUID,
                name: operation.name,
                inputs: inputUUIDs,
                body: body.uuid,
                outputs: outputUUIDs,
                position,
                func: operation.func
            }
            bodys[body.uuid] = body
            return {
                graph: {
                    ...graph,
                    nodes: { ...graph.nodes, [node.uuid]: { ...node, body: node.body } },
                    inputs,
                    outputs,
                    bodys
                },
                node: nodeUUID
            }
        }
        case OperationKind.UPLOAD_CSV: {
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
            const body: Body = {
                kind: BodyKind.NO,
                uuid: generateUUID(),
                node: nodeUUID,
            }
            const node: NodeSource = {
                kind: NodeKind.SOURCE,
                uuid: nodeUUID,
                name: operation.name,
                outputs: outputUUIDs,
                body: body.uuid,
                position,
            }
            bodys[body.uuid] = body
            type Row = { [name: string]: Value }
            const event = new Promise<File>((resolve, reject) => {
                const element = document.createElement('input')
                element.type = 'file'
                element.accept = '.csv'
                element.addEventListener('change', (event) => {
                    const file = (event.target! as HTMLInputElement).files![0]
                    resolve(file)
                })
                element.click()
            }).then(file => {
                return new Promise<UploadCsv>((resolve, reject) => {
                    papa.parse(file, {
                        worker: true,
                        header: true,
                        dynamicTyping: true,
                        complete: async results => {
                            const table: Table = {}
                            for (const name of results.meta.fields!) {
                                table[name] = []
                            }
                            const errorRows = results.errors.map(e => e.row)
                            results.data.forEach((row, i) => {
                                if (!errorRows.includes(i)) {
                                    for (const [name, value] of Object.entries(row as Row)) {
                                        table[name].push(value ?? undefined)
                                    }
                                }
                            })
                            resolve({
                                kind: EventKind.UPLOAD_CSV,
                                name: file.name,
                                table,
                                node: nodeUUID
                            })
                        }
                    })
                })
            })
            return {
                graph: {
                    ...graph,
                    nodes: { ...graph.nodes, [node.uuid]: { ...node, body: node.body } },
                    inputs,
                    outputs,
                    bodys
                },
                node: nodeUUID,
                event
            }
        }
    }
}

export const removeNode = (graph: Graph, node: UUID): Graph => {
    const nodes = { ...graph.nodes }
    const removedNode = nodes[node]
    delete nodes[node]
    const edgeUUIDs: UUID[] = []
    if (removedNode.kind === NodeKind.TRANSFORM) {
        for (const input of removedNode.inputs) {
            const edge = graph.inputs[input].edge
            if (edge) edgeUUIDs.push(edge)
        }
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
    if (removedNode.kind === NodeKind.TRANSFORM) {
        for (const input of removedNode.inputs) delete inputs[input]
    }
    for (const output of removedNode.outputs) delete outputs[output]
    const bodys = { ...graph.bodys }
    delete bodys[removedNode.body]
    return {
        nodes,
        edges,
        inputs,
        outputs,
        bodys
    }
}

export const removeInputEdge = (graph: Graph, input: UUID): Graph => {
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
        return evaluateNode(graph1, input.node)
    } else {
        return graph
    }
}

export const removeOutputEdges = (graph: Graph, output: UUID): Graph => {
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
    return nodes.reduce((graph, node) => evaluateNode(graph, node), graph1)
}

const evaluateNodeOutputs = (graph: Graph, node: Node): Graph =>
    node.outputs.reduce((graph1: Graph, output: UUID): Graph => {
        return graph1.outputs[output].edges.reduce((graph2: Graph, edge: UUID): Graph => {
            const input = graph2.edges[edge].input
            const node = graph2.inputs[input].node
            return evaluateNode(graph2, node)
        }, graph1)
    }, graph)


export const evaluateNode = (graph: Graph, nodeUUID: UUID): Graph => {
    const node = graph.nodes[nodeUUID]
    switch (node.kind) {
        case NodeKind.SOURCE:
            return evaluateNodeOutputs(graph, node)
        case NodeKind.TRANSFORM: {
            const values = node.inputs
                .map(input => graph.inputs[input].edge)
                .filter(edgeUUID => edgeUUID !== undefined)
                .map(edgeUUID => {
                    const edge = graph.edges[edgeUUID!]
                    const output = graph.outputs[edge.output]
                    return graph.nodes[output.node].body
                })
                .map(bodyUUID => graph.bodys[bodyUUID!])
                .filter(body => !(body.kind === BodyKind.NO || body.kind === BodyKind.ERROR))
            const graph1: Graph = (() => {
                if (values.length > 0 && values.length === node.inputs.length) {
                    const body = node.func(graph.bodys[node.body], ...values)
                    return {
                        ...graph,
                        bodys: {
                            ...graph.bodys,
                            [body.uuid]: body
                        }
                    }
                } else if (graph.bodys[node.body].kind !== BodyKind.NO) {
                    const body: Body = {
                        kind: BodyKind.NO,
                        uuid: node.body,
                        node: node.uuid,
                    }
                    return {
                        ...graph,
                        bodys: {
                            ...graph.bodys,
                            [body.uuid]: body
                        }
                    }
                } else {
                    return graph
                }
            })()
            return evaluateNodeOutputs(graph1, node)
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
    edge?: UUID
}

export const hasCycle = (graph: Graph, inputUUID: UUID, outputUUID: UUID): boolean => {
    const visited: Set<UUID> = new Set()
    visited.add(graph.outputs[outputUUID].node)
    const visitNode = (nodeUUID: UUID): boolean => {
        if (visited.has(nodeUUID)) {
            return true
        } else {
            visited.add(nodeUUID)
            for (const outputUUID of graph.nodes[nodeUUID].outputs) {
                const output = graph.outputs[outputUUID]
                for (const edgeUUID of output.edges) {
                    const edge = graph.edges[edgeUUID]
                    const input = graph.inputs[edge.input]
                    if (visitNode(input.node)) {
                        return true
                    }
                }
            }
            return false
        }
    }
    return visitNode(graph.inputs[inputUUID].node)
}

export const addEdge = ({ graph, input, output, generateUUID }: AddEdgeInputs): AddEdgeOutputs => {
    if (hasCycle(graph, input, output)) {
        return { graph }
    }
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
        graph: evaluateNode(graph1, graph1.inputs[input].node),
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

export const parseNumber = (text: string): number => {
    switch (text) {
        case '':
        case '-':
        case '.':
            return 0
        default:
            return parseFloat(text)
    }
}

export const changeNumberText = (graph: Graph, body: UUID, transform: (text: string) => string): Graph => {
    const currentBody = graph.bodys[body]
    switch (currentBody.kind) {
        case BodyKind.NUMBER:
            const text = transform(currentBody.text)
            const graph1 = {
                ...graph,
                bodys: {
                    ...graph.bodys,
                    [body]: {
                        ...currentBody,
                        value: parseNumber(text),
                        text
                    }
                }
            }
            const node = graph1.bodys[body].node
            return evaluateNode(graph1, node)
        default:
            return graph
    }
}