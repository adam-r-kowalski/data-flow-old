import * as tf from '@tensorflow/tfjs-core'

import { emptyGraph, Input, Node, Output, Edge, Body, BodyKind, OperationKind, NodeKind, NodeTransform } from "../../src/model/graph"
import { tensorFunc } from "../../src/model/operations"
import { addNode, addEdge, changeNodePosition, removeNode, removeInputEdge, removeOutputEdges, parseNumber, changeNumberText } from "../../src/update/graph"

const generateUUID = () => {
    let i = 0
    return () => {
        const uuid = i.toString()
        ++i
        return uuid
    }
}

test("parse number", () => {
    expect(parseNumber('')).toEqual(0)
    expect(parseNumber('-')).toEqual(0)
    expect(parseNumber('.')).toEqual(0)
    expect(parseNumber('2.3')).toEqual(2.3)
})

test("empty graph", () => {
    expect(emptyGraph()).toEqual({
        nodes: {},
        edges: {},
        inputs: {},
        bodys: {},
        outputs: {},
    })
})

const addFunc = tensorFunc(tf.add)

test("add operation to graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    expect(graph).toEqual(emptyGraph())
    const addUUID = generateUUID1()
    const xUUID = generateUUID1()
    const yUUID = generateUUID1()
    const outUUID = generateUUID1()
    const bodyUUID = generateUUID1()
    const add: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: bodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
        func: addFunc
    }
    const x: Input = {
        uuid: xUUID,
        node: addUUID,
        name: 'x'
    }
    const y: Input = {
        uuid: yUUID,
        node: addUUID,
        name: 'y'
    }
    const out: Output = {
        uuid: outUUID,
        node: addUUID,
        name: 'out',
        edges: []
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: bodyUUID,
        node: addUUID,
    }
    expect(graph1).toEqual({
        nodes: {
            [add.uuid]: add
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: { [body.uuid]: body },
        outputs: {
            [out.uuid]: out
        },
    })
    expect(node).toEqual(add.uuid)
})

test("add operation with body to graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    expect(graph).toEqual(emptyGraph())
    const numberUUID = generateUUID1()
    const outUUID = generateUUID1()
    const bodyUUID = generateUUID1()
    const number: Node = {
        kind: NodeKind.SOURCE,
        uuid: numberUUID,
        name: 'Number',
        outputs: [outUUID],
        body: bodyUUID,
        position: { x: 0, y: 0 },
    }
    const out: Output = {
        uuid: outUUID,
        node: numberUUID,
        name: 'out',
        edges: []
    }
    const body: Body = {
        kind: BodyKind.NUMBER,
        uuid: bodyUUID,
        node: numberUUID,
        value: 0,
        text: '0'
    }
    expect(graph1).toEqual({
        nodes: { [number.uuid]: number },
        edges: {},
        inputs: {},
        bodys: { [body.uuid]: body },
        outputs: { [out.uuid]: out },
    })
    expect(node).toEqual(number.uuid)
})


test("add text operation", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            kind: OperationKind.TEXT,
            name: 'text',
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    expect(graph).toEqual(emptyGraph())
    const textUUID = generateUUID1()
    const outUUID = generateUUID1()
    const bodyUUID = generateUUID1()
    const text: Node = {
        kind: NodeKind.SOURCE,
        uuid: textUUID,
        name: 'text',
        outputs: [outUUID],
        body: bodyUUID,
        position: { x: 0, y: 0 },
    }
    const out: Output = {
        uuid: outUUID,
        node: textUUID,
        name: 'out',
        edges: []
    }
    const body: Body = {
        kind: BodyKind.TEXT,
        uuid: bodyUUID,
        node: textUUID,
        value: '',
    }
    expect(graph1).toEqual({
        nodes: { [text.uuid]: text },
        edges: {},
        inputs: {},
        bodys: { [body.uuid]: body },
        outputs: { [out.uuid]: out },
    })
    expect(node).toEqual(text.uuid)
})


test("add two operations to graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: actualAddUUID } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: actualNumberUUID } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    expect(graph).toEqual(emptyGraph())
    const addUUID = generateUUID1()
    const x: Input = {
        uuid: generateUUID1(),
        node: addUUID,
        name: 'x'
    }
    const y: Input = {
        uuid: generateUUID1(),
        node: addUUID,
        name: 'y'
    }
    const addOut: Output = {
        uuid: generateUUID1(),
        node: addUUID,
        name: 'out',
        edges: []
    }
    const addBody: Body = {
        kind: BodyKind.NO,
        uuid: generateUUID1(),
        node: addUUID,
    }
    const add: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: addUUID,
        name: 'Add',
        inputs: [x.uuid, y.uuid],
        body: addBody.uuid,
        outputs: [addOut.uuid],
        position: { x: 0, y: 0 },
        func: addFunc
    }
    const numberUUID = generateUUID1()
    const numberOut: Output = {
        uuid: generateUUID1(),
        node: numberUUID,
        name: 'out',
        edges: []
    }
    const numberBody: Body = {
        kind: BodyKind.NUMBER,
        uuid: generateUUID1(),
        node: numberUUID,
        value: 0,
        text: '0'
    }
    const number: Node = {
        kind: NodeKind.SOURCE,
        uuid: numberUUID,
        name: 'Number',
        body: numberBody.uuid,
        outputs: [numberOut.uuid],
        position: { x: 50, y: 50 }
    }
    expect(graph1).toEqual({
        nodes: {
            [add.uuid]: add
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: { [addBody.uuid]: addBody },
        outputs: {
            [addOut.uuid]: addOut
        },
    })
    expect(actualAddUUID).toEqual(add.uuid)
    expect(graph2).toEqual({
        nodes: {
            [add.uuid]: add,
            [number.uuid]: number
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: {
            [addBody.uuid]: addBody,
            [numberBody.uuid]: numberBody,
        },
        outputs: {
            [addOut.uuid]: addOut,
            [numberOut.uuid]: numberOut
        },
    })
    expect(actualNumberUUID).toEqual(number.uuid)
})

test("add edge between two operations", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const { graph, edge: actualEdgeUUID } = (() => {
        const graph = emptyGraph()
        const { graph: graph1, node: add } = addNode({
            graph,
            operation: {
                kind: OperationKind.TRANSFORM,
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
                func: addFunc
            },
            position: { x: 0, y: 0 },
            generateUUID: generateUUID0
        })
        const { graph: graph2, node: number } = addNode({
            graph: graph1,
            operation: {
                kind: OperationKind.NUMBER,
                name: 'Number',
                outputs: ['out'],
            },
            position: { x: 50, y: 50 },
            generateUUID: generateUUID0
        })
        const out = graph2.nodes[number].outputs[0]
        const x = (graph2.nodes[add] as NodeTransform).inputs[0]
        return addEdge({
            graph: graph2,
            input: x,
            output: out,
            generateUUID: generateUUID0
        })
    })()
    const addUUID = generateUUID1()
    const xUUID = generateUUID1()
    const yUUID = generateUUID1()
    const outUUID = generateUUID1()
    const addBodyUUID = generateUUID1()
    const numberUUID = generateUUID1()
    const numberOutUUID = generateUUID1()
    const numberBodyUUID = generateUUID1()
    const edgeUUID = generateUUID1()
    const add: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: addBodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
        func: addFunc
    }
    const x: Input = {
        uuid: xUUID,
        node: addUUID,
        name: 'x',
        edge: edgeUUID
    }
    const y: Input = {
        uuid: yUUID,
        node: addUUID,
        name: 'y'
    }
    const out: Output = {
        uuid: outUUID,
        node: addUUID,
        name: 'out',
        edges: []
    }
    const addBody: Body = {
        kind: BodyKind.NO,
        uuid: addBodyUUID,
        node: add.uuid,
    }
    const number: Node = {
        kind: NodeKind.SOURCE,
        uuid: numberUUID,
        name: 'Number',
        body: numberBodyUUID,
        outputs: [numberOutUUID],
        position: { x: 50, y: 50 }
    }
    const numberOut: Output = {
        uuid: numberOutUUID,
        node: numberUUID,
        name: 'out',
        edges: [edgeUUID]
    }
    const numberBody: Body = {
        kind: BodyKind.NUMBER,
        uuid: numberBodyUUID,
        node: number.uuid,
        value: 0,
        text: '0'
    }
    const edge: Edge = {
        uuid: edgeUUID,
        input: x.uuid,
        output: numberOut.uuid,
    }
    expect(graph).toEqual({
        nodes: {
            [add.uuid]: add,
            [number.uuid]: number
        },
        edges: {
            [edge.uuid]: edge,
        },
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: {
            [addBody.uuid]: addBody,
            [numberBody.uuid]: numberBody,
        },
        outputs: {
            [out.uuid]: out,
            [numberOut.uuid]: numberOut
        },
    })
    expect(actualEdgeUUID).toEqual(edge.uuid)
})

test("change node position", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const graph2 = changeNodePosition(graph1, node, p => ({ x: p.x + 25, y: p.y - 25 }))
    const addUUID = generateUUID1()
    const xUUID = generateUUID1()
    const yUUID = generateUUID1()
    const outUUID = generateUUID1()
    const bodyUUID = generateUUID1()
    const add: Node = {
        kind: NodeKind.TRANSFORM,
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: bodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
        func: addFunc
    }
    const x: Input = {
        uuid: xUUID,
        node: addUUID,
        name: 'x'
    }
    const y: Input = {
        uuid: yUUID,
        node: addUUID,
        name: 'y'
    }
    const out: Output = {
        uuid: outUUID,
        node: addUUID,
        name: 'out',
        edges: []
    }
    const body: Body = {
        kind: BodyKind.NO,
        uuid: bodyUUID,
        node: add.uuid,
    }
    expect(graph).toEqual(emptyGraph())
    expect(graph1).toEqual({
        nodes: {
            [add.uuid]: add
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: { [bodyUUID]: body },
        outputs: {
            [out.uuid]: out
        },
    })
    expect(graph2).toEqual({
        nodes: {
            [add.uuid]: {
                kind: NodeKind.TRANSFORM,
                uuid: addUUID,
                name: 'Add',
                inputs: [xUUID, yUUID],
                body: bodyUUID,
                outputs: [outUUID],
                position: { x: 25, y: -25 },
                func: addFunc
            }
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
        },
        bodys: { [bodyUUID]: body },
        outputs: {
            [out.uuid]: out
        },
    })
})

test("remove node from graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: number } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const out = graph2.nodes[number].outputs[0]
    const x = (graph2.nodes[add] as NodeTransform).inputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: x,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeNode(graph3, add)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const numberUUID = generateUUID1()
        const numberOutUUID = generateUUID1()
        const numberBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            kind: NodeKind.TRANSFORM,
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
            func: addFunc
        }
        const x: Input = {
            uuid: xUUID,
            node: addUUID,
            name: 'x',
            edge: edgeUUID
        }
        const y: Input = {
            uuid: yUUID,
            node: addUUID,
            name: 'y'
        }
        const out: Output = {
            uuid: outUUID,
            node: addUUID,
            name: 'out',
            edges: []
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const number: Node = {
            kind: NodeKind.SOURCE,
            uuid: numberUUID,
            name: 'Number',
            body: numberBodyUUID,
            outputs: [numberOutUUID],
            position: { x: 50, y: 50 }
        }
        const numberOut: Output = {
            uuid: numberOutUUID,
            node: numberUUID,
            name: 'out',
            edges: [edgeUUID]
        }
        const numberBody: Body = {
            kind: BodyKind.NUMBER,
            uuid: numberBodyUUID,
            node: number.uuid,
            value: 0,
            text: '0'
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: x.uuid,
            output: numberOut.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBodyUUID]: addBody,
                [numberBodyUUID]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: numberOut
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [number.uuid]: number
            },
            edges: {},
            inputs: {
            },
            bodys: {
                [numberBodyUUID]: numberBody,
            },
            outputs: {
                [numberOut.uuid]: {
                    ...numberOut,
                    edges: []
                }
            },
        })
    }
})

test("remove input edge", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: number } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const x = (graph2.nodes[add] as NodeTransform).inputs[0]
    const out = graph2.nodes[number].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: x,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeInputEdge(graph3, x, generateUUID0)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const numberUUID = generateUUID1()
        const numberOutUUID = generateUUID1()
        const numberBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            kind: NodeKind.TRANSFORM,
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
            func: addFunc
        }
        const x: Input = {
            uuid: xUUID,
            node: addUUID,
            name: 'x',
            edge: edgeUUID
        }
        const y: Input = {
            uuid: yUUID,
            node: addUUID,
            name: 'y'
        }
        const out: Output = {
            uuid: outUUID,
            node: addUUID,
            name: 'out',
            edges: []
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const number: Node = {
            kind: NodeKind.SOURCE,
            uuid: numberUUID,
            name: 'Number',
            body: numberBodyUUID,
            outputs: [numberOutUUID],
            position: { x: 50, y: 50 },
        }
        const numberOut: Output = {
            uuid: numberOutUUID,
            node: numberUUID,
            name: 'out',
            edges: [edgeUUID]
        }
        const numberBody: Body = {
            kind: BodyKind.NUMBER,
            uuid: numberBodyUUID,
            node: number.uuid,
            value: 0,
            text: '0'
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: x.uuid,
            output: numberOut.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [numberBody.uuid]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: numberOut,
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {},
            inputs: {
                [x.uuid]: {
                    ...x,
                    edge: undefined
                },
                [y.uuid]: y,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [numberBody.uuid]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: {
                    ...numberOut,
                    edges: []
                },
            },
        })
    }
})

test("remove node with output edges", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: number } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const x = (graph2.nodes[add] as NodeTransform).inputs[0]
    const out = graph2.nodes[number].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: x,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeNode(graph3, number)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const numberUUID = generateUUID1()
        const numberOutUUID = generateUUID1()
        const numberBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            kind: NodeKind.TRANSFORM,
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
            func: addFunc
        }
        const x: Input = {
            uuid: xUUID,
            node: addUUID,
            name: 'x',
            edge: edgeUUID
        }
        const y: Input = {
            uuid: yUUID,
            node: addUUID,
            name: 'y'
        }
        const out: Output = {
            uuid: outUUID,
            node: addUUID,
            name: 'out',
            edges: []
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const number: Node = {
            kind: NodeKind.SOURCE,
            uuid: numberUUID,
            name: 'Number',
            body: numberBodyUUID,
            outputs: [numberOutUUID],
            position: { x: 50, y: 50 }
        }
        const numberOut: Output = {
            uuid: numberOutUUID,
            node: numberUUID,
            name: 'out',
            edges: [edgeUUID]
        }
        const numberBody: Body = {
            kind: BodyKind.NUMBER,
            uuid: numberBodyUUID,
            node: number.uuid,
            value: 0,
            text: '0'
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: x.uuid,
            output: numberOut.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBodyUUID]: addBody,
                [numberBodyUUID]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: numberOut,
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
            },
            edges: {},
            inputs: {
                [x.uuid]: {
                    ...x,
                    edge: undefined
                },
                [y.uuid]: y,
            },
            bodys: {
                [addBodyUUID]: addBody,
            },
            outputs: {
                [out.uuid]: out
            },
        })
    }
})


test("remove input edge when node has no inputs nothing changes", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2 } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const input = (graph2.nodes[add] as NodeTransform).inputs[0]
    const graph3 = removeInputEdge(graph2, input, generateUUID0)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const numberUUID = generateUUID1()
        const numberOutUUID = generateUUID1()
        const numberBodyUUID = generateUUID1()
        const add: Node = {
            kind: NodeKind.TRANSFORM,
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
            func: addFunc
        }
        const x: Input = {
            uuid: xUUID,
            node: addUUID,
            name: 'x'
        }
        const y: Input = {
            uuid: yUUID,
            node: addUUID,
            name: 'y'
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const out: Output = {
            uuid: outUUID,
            node: addUUID,
            name: 'out',
            edges: []
        }
        const number: Node = {
            kind: NodeKind.SOURCE,
            uuid: numberUUID,
            name: 'Number',
            body: numberBodyUUID,
            outputs: [numberOutUUID],
            position: { x: 50, y: 50 }
        }
        const numberOut: Output = {
            uuid: numberOutUUID,
            node: numberUUID,
            name: 'out',
            edges: []
        }
        const numberBody: Body = {
            kind: BodyKind.NUMBER,
            uuid: numberBodyUUID,
            node: number.uuid,
            value: 0,
            text: '0'
        }
        expect(graph2).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {},
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [numberBody.uuid]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: numberOut,
            },
        })
        expect(graph3).toEqual(graph2)
    }
})


test("remove output edge", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            kind: OperationKind.TRANSFORM,
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
            func: addFunc
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: number } = addNode({
        graph: graph1,
        operation: {
            kind: OperationKind.NUMBER,
            name: 'Number',
            outputs: ['out'],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const x = (graph2.nodes[add] as NodeTransform).inputs[0]
    const out = graph2.nodes[number].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: x,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeOutputEdges(graph3, out)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const numberUUID = generateUUID1()
        const numberOutUUID = generateUUID1()
        const numberBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            kind: NodeKind.TRANSFORM,
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
            func: addFunc
        }
        const x: Input = {
            uuid: xUUID,
            node: addUUID,
            name: 'x',
            edge: edgeUUID
        }
        const y: Input = {
            uuid: yUUID,
            node: addUUID,
            name: 'y'
        }
        const out: Output = {
            uuid: outUUID,
            node: addUUID,
            name: 'out',
            edges: []
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const number: Node = {
            kind: NodeKind.SOURCE,
            uuid: numberUUID,
            name: 'Number',
            body: numberBodyUUID,
            outputs: [numberOutUUID],
            position: { x: 50, y: 50 }
        }
        const numberOut: Output = {
            uuid: numberOutUUID,
            node: numberUUID,
            name: 'out',
            edges: [edgeUUID]
        }
        const numberBody: Body = {
            kind: BodyKind.NUMBER,
            uuid: numberBodyUUID,
            node: number.uuid,
            value: 0,
            text: '0'
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: x.uuid,
            output: numberOut.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [numberBody.uuid]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: numberOut,
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
                [number.uuid]: number
            },
            edges: {},
            inputs: {
                [x.uuid]: {
                    ...x,
                    edge: undefined
                },
                [y.uuid]: y,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [numberBody.uuid]: numberBody,
            },
            outputs: {
                [out.uuid]: out,
                [numberOut.uuid]: {
                    ...numberOut,
                    edges: []
                },
            },
        })
    }
})

test("change number text of wrong body kind does nothing", () => {
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            kind: OperationKind.TEXT,
            name: 'Text',
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID()
    })
    const body = graph1.nodes[node].body
    const graph2 = changeNumberText(graph1, body, () => '100')
    expect(graph2).toEqual(graph1)
})
