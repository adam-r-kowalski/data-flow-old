import { Body, BodyKind, Edge, GenerateUUID, Graph, Inputs, Node, Operation, Outputs, Position, UUID } from "../model/graph"

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
    const uuid = generateUUID()
    const body: Body = operation.body !== undefined ?
        {
            kind: BodyKind.NUMBER,
            uuid,
            node: nodeUUID,
            value: operation.body,
        } :
        {
            kind: BodyKind.NO,
            uuid,
            node: nodeUUID,
        }
    const node: Node = {
        uuid: nodeUUID,
        name: operation.name,
        inputs: inputUUIDs,
        outputs: outputUUIDs,
        body: uuid,
        position,
        operation: operation.operation
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


const evaluateNode = (graph: Graph, nodeUUID: UUID): Graph => {
    const node = graph.nodes[nodeUUID]
    if (node.inputs.length === 0) {
        return evaluateNodeOutputs(graph, node)
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
            .map(bodyUUID => graph.bodys[bodyUUID!])
            .filter(body => !(body.kind === BodyKind.NO || body.kind === BodyKind.ERROR))
        if (values.length > 0 && values.length === node.inputs.length) {
            const body = node.operation!(graph.bodys[node.body], ...values)
            const graph1: Graph = {
                ...graph,
                bodys: {
                    ...graph.bodys,
                    [body.uuid]: body
                }
            }
            return evaluateNodeOutputs(graph1, node)
        } else if (graph.bodys[node.body].kind !== BodyKind.NO) {
            const body: Body = {
                kind: BodyKind.NO,
                uuid: node.body,
                node: node.uuid,
            }
            const graph1: Graph = {
                ...graph,
                bodys: {
                    ...graph.bodys,
                    [body.uuid]: body
                }
            }
            return evaluateNodeOutputs(graph1, node)
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

export const changeBodyValue = (graph: Graph, body: UUID, transform: (value: number) => number): Graph => {
    const currentBody = graph.bodys[body]
    switch (currentBody.kind) {
        case BodyKind.NUMBER:
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
            return evaluateNode(graph1, node)
        default:
            return graph
    }
}