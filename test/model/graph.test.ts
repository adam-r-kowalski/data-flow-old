import { emptyGraph, Input, Node, Output, Edge, Body, BodyKind } from "../../src/model/graph"
import { addNode, addEdge, changeNodePosition, removeNode, removeInputEdge, removeOutputEdges } from "../../src/update/graph"

const generateUUID = () => {
    let i = 0
    return () => {
        const uuid = i.toString()
        ++i
        return uuid
    }
}

test("empty graph", () => {
    expect(emptyGraph()).toEqual({
        nodes: {},
        edges: {},
        inputs: {},
        bodys: {},
        outputs: {},
    })
})

test("add operation to graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node } = addNode({
        graph,
        operation: {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
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
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: bodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
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
            name: 'Number',
            inputs: [],
            body: 0,
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
        uuid: numberUUID,
        name: 'Number',
        inputs: [],
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


test("add two operations to graph", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: actualAddUUID } = addNode({
        graph,
        operation: {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: actualLogUUID } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    expect(graph).toEqual(emptyGraph())
    const addUUID = generateUUID1()
    const xUUID = generateUUID1()
    const yUUID = generateUUID1()
    const outUUID = generateUUID1()
    const addBodyUUID = generateUUID1()
    const add: Node = {
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: addBodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
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
    const addBody: Body = {
        kind: BodyKind.NO,
        uuid: addBodyUUID,
        node: addUUID,
    }
    const logUUID = generateUUID1()
    const valueUUID = generateUUID1()
    const logBodyUUID = generateUUID1()
    const log: Node = {
        uuid: logUUID,
        name: 'Log To Console',
        inputs: [valueUUID],
        body: logBodyUUID,
        outputs: [],
        position: { x: 50, y: 50 }
    }
    const value: Input = {
        uuid: valueUUID,
        node: logUUID,
        name: 'value'
    }
    const logBody: Body = {
        kind: BodyKind.NO,
        uuid: logBodyUUID,
        node: logUUID,
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
            [out.uuid]: out
        },
    })
    expect(actualAddUUID).toEqual(add.uuid)
    expect(graph2).toEqual({
        nodes: {
            [add.uuid]: add,
            [log.uuid]: log
        },
        edges: {},
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
            [value.uuid]: value,
        },
        bodys: {
            [addBody.uuid]: addBody,
            [logBody.uuid]: logBody,
        },
        outputs: {
            [out.uuid]: out
        },
    })
    expect(actualLogUUID).toEqual(log.uuid)
})

test("add edge between two operations", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const { graph, edge: actualEdgeUUID } = (() => {
        const graph = emptyGraph()
        const { graph: graph1, node: add } = addNode({
            graph,
            operation: {
                name: 'Add',
                inputs: ['x', 'y'],
                outputs: ['out'],
            },
            position: { x: 0, y: 0 },
            generateUUID: generateUUID0
        })
        const { graph: graph2, node: log } = addNode({
            graph: graph1,
            operation: {
                name: 'Log To Console',
                inputs: ['value'],
                outputs: [],
            },
            position: { x: 50, y: 50 },
            generateUUID: generateUUID0
        })
        const value = graph2.nodes[log].inputs[0]
        const out = graph2.nodes[add].outputs[0]
        return addEdge({
            graph: graph2,
            input: value,
            output: out,
            generateUUID: generateUUID0
        })
    })()
    const addUUID = generateUUID1()
    const xUUID = generateUUID1()
    const yUUID = generateUUID1()
    const outUUID = generateUUID1()
    const addBodyUUID = generateUUID1()
    const logUUID = generateUUID1()
    const valueUUID = generateUUID1()
    const logBodyUUID = generateUUID1()
    const edgeUUID = generateUUID1()
    const add: Node = {
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: addBodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
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
        edges: [edgeUUID]
    }
    const addBody: Body = {
        kind: BodyKind.NO,
        uuid: addBodyUUID,
        node: add.uuid,
    }
    const log: Node = {
        uuid: logUUID,
        name: 'Log To Console',
        inputs: [valueUUID],
        body: logBodyUUID,
        outputs: [],
        position: { x: 50, y: 50 }
    }
    const value: Input = {
        uuid: valueUUID,
        node: logUUID,
        name: 'value',
        edge: edgeUUID
    }
    const logBody: Body = {
        kind: BodyKind.NO,
        uuid: logBodyUUID,
        node: log.uuid,
    }
    const edge: Edge = {
        uuid: edgeUUID,
        input: value.uuid,
        output: out.uuid,
    }
    expect(graph).toEqual({
        nodes: {
            [add.uuid]: add,
            [log.uuid]: log
        },
        edges: {
            [edge.uuid]: edge,
        },
        inputs: {
            [x.uuid]: x,
            [y.uuid]: y,
            [value.uuid]: value,
        },
        bodys: {
            [addBody.uuid]: addBody,
            [logBody.uuid]: logBody,
        },
        outputs: {
            [out.uuid]: out
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
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
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
        uuid: addUUID,
        name: 'Add',
        inputs: [xUUID, yUUID],
        body: bodyUUID,
        outputs: [outUUID],
        position: { x: 0, y: 0 },
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
                uuid: addUUID,
                name: 'Add',
                inputs: [xUUID, yUUID],
                body: bodyUUID,
                outputs: [outUUID],
                position: { x: 25, y: -25 },
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
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: log } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const value = graph2.nodes[log].inputs[0]
    const out = graph2.nodes[add].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: value,
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
        const logUUID = generateUUID1()
        const valueUUID = generateUUID1()
        const logBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
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
            edges: [edgeUUID]
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const log: Node = {
            uuid: logUUID,
            name: 'Log To Console',
            inputs: [valueUUID],
            body: logBodyUUID,
            outputs: [],
            position: { x: 50, y: 50 }
        }
        const value: Input = {
            uuid: valueUUID,
            node: logUUID,
            name: 'value',
            edge: edgeUUID
        }
        const logBody: Body = {
            kind: BodyKind.NO,
            uuid: logBodyUUID,
            node: log.uuid,
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: value.uuid,
            output: out.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: value,
            },
            bodys: {
                [addBodyUUID]: addBody,
                [logBodyUUID]: logBody,
            },
            outputs: {
                [out.uuid]: out
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [log.uuid]: log
            },
            edges: {},
            inputs: {
                [value.uuid]: {
                    uuid: valueUUID,
                    node: log.uuid,
                    name: 'value',
                },
            },
            bodys: {
                [logBodyUUID]: logBody,
            },
            outputs: {},
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
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: log } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const value = graph2.nodes[log].inputs[0]
    const out = graph2.nodes[add].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: value,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeInputEdge(graph3, value, generateUUID0)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const logUUID = generateUUID1()
        const valueUUID = generateUUID1()
        const logBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
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
            edges: [edgeUUID]
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const log: Node = {
            uuid: logUUID,
            name: 'Log To Console',
            inputs: [valueUUID],
            body: logBodyUUID,
            outputs: [],
            position: { x: 50, y: 50 }
        }
        const value: Input = {
            uuid: valueUUID,
            node: logUUID,
            name: 'value',
            edge: edgeUUID
        }
        const logBody: Body = {
            kind: BodyKind.NO,
            uuid: logBodyUUID,
            node: log.uuid,
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: value.uuid,
            output: out.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: value,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [logBody.uuid]: logBody,
            },
            outputs: {
                [out.uuid]: out
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {},
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: {
                    uuid: valueUUID,
                    node: log.uuid,
                    name: 'value',
                },
            },
            bodys: {
                [addBody.uuid]: addBody,
                [logBody.uuid]: logBody,
            },
            outputs: {
                [out.uuid]: {
                    ...out,
                    edges: []
                }
            },
        })
    }
})

test("remove node with input edge", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1, node: add } = addNode({
        graph,
        operation: {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: log } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const value = graph2.nodes[log].inputs[0]
    const out = graph2.nodes[add].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: value,
        output: out,
        generateUUID: generateUUID0
    })
    const graph4 = removeNode(graph3, log)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const logUUID = generateUUID1()
        const valueUUID = generateUUID1()
        const logBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
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
            edges: [edgeUUID]
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const log: Node = {
            uuid: logUUID,
            name: 'Log To Console',
            inputs: [valueUUID],
            body: logBodyUUID,
            outputs: [],
            position: { x: 50, y: 50 }
        }
        const value: Input = {
            uuid: valueUUID,
            node: logUUID,
            name: 'value',
            edge: edgeUUID
        }
        const logBody: Body = {
            kind: BodyKind.NO,
            uuid: logBodyUUID,
            node: log.uuid,
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: value.uuid,
            output: out.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: value,
            },
            bodys: {
                [addBodyUUID]: addBody,
                [logBodyUUID]: logBody,
            },
            outputs: {
                [out.uuid]: out
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
            },
            edges: {},
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
            },
            bodys: {
                [addBodyUUID]: addBody,
            },
            outputs: {
                [out.uuid]: {
                    ...out,
                    edges: []
                }
            },
        })
    }
})


test("remove input edge when node has no inputs nothing changes", () => {
    const generateUUID0 = generateUUID()
    const generateUUID1 = generateUUID()
    const graph = emptyGraph()
    const { graph: graph1 } = addNode({
        graph,
        operation: {
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const input = graph2.nodes[node].inputs[0]
    const graph3 = removeInputEdge(graph2, input, generateUUID0)
    {
        const addUUID = generateUUID1()
        const xUUID = generateUUID1()
        const yUUID = generateUUID1()
        const outUUID = generateUUID1()
        const addBodyUUID = generateUUID1()
        const logUUID = generateUUID1()
        const valueUUID = generateUUID1()
        const logBodyUUID = generateUUID1()
        const add: Node = {
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
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
        const log: Node = {
            uuid: logUUID,
            name: 'Log To Console',
            inputs: [valueUUID],
            body: logBodyUUID,
            outputs: [],
            position: { x: 50, y: 50 }
        }
        const value: Input = {
            uuid: valueUUID,
            node: logUUID,
            name: 'value',
        }
        const logBody: Body = {
            kind: BodyKind.NO,
            uuid: logBodyUUID,
            node: log.uuid,
        }
        expect(graph2).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {},
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: value,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [logBody.uuid]: logBody,
            },
            outputs: {
                [out.uuid]: out
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
            name: 'Add',
            inputs: ['x', 'y'],
            outputs: ['out'],
        },
        position: { x: 0, y: 0 },
        generateUUID: generateUUID0
    })
    const { graph: graph2, node: log } = addNode({
        graph: graph1,
        operation: {
            name: 'Log To Console',
            inputs: ['value'],
            outputs: [],
        },
        position: { x: 50, y: 50 },
        generateUUID: generateUUID0
    })
    const value = graph2.nodes[log].inputs[0]
    const out = graph2.nodes[add].outputs[0]
    const { graph: graph3 } = addEdge({
        graph: graph2,
        input: value,
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
        const logUUID = generateUUID1()
        const valueUUID = generateUUID1()
        const logBodyUUID = generateUUID1()
        const edgeUUID = generateUUID1()
        const add: Node = {
            uuid: addUUID,
            name: 'Add',
            inputs: [xUUID, yUUID],
            body: addBodyUUID,
            outputs: [outUUID],
            position: { x: 0, y: 0 },
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
            edges: [edgeUUID]
        }
        const addBody: Body = {
            kind: BodyKind.NO,
            uuid: addBodyUUID,
            node: add.uuid,
        }
        const log: Node = {
            uuid: logUUID,
            name: 'Log To Console',
            inputs: [valueUUID],
            body: logBodyUUID,
            outputs: [],
            position: { x: 50, y: 50 }
        }
        const value: Input = {
            uuid: valueUUID,
            node: logUUID,
            name: 'value',
            edge: edgeUUID
        }
        const logBody: Body = {
            kind: BodyKind.NO,
            uuid: logBodyUUID,
            node: log.uuid,
        }
        const edge: Edge = {
            uuid: edgeUUID,
            input: value.uuid,
            output: out.uuid,
        }
        expect(graph3).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {
                [edge.uuid]: edge,
            },
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: value,
            },
            bodys: {
                [addBody.uuid]: addBody,
                [logBody.uuid]: logBody,
            },
            outputs: {
                [out.uuid]: out
            },
        })
        expect(graph4).toEqual({
            nodes: {
                [add.uuid]: add,
                [log.uuid]: log
            },
            edges: {},
            inputs: {
                [x.uuid]: x,
                [y.uuid]: y,
                [value.uuid]: {
                    uuid: valueUUID,
                    node: log.uuid,
                    name: 'value',
                },
            },
            bodys: {
                [addBody.uuid]: addBody,
                [logBody.uuid]: logBody,
            },
            outputs: {
                [out.uuid]: {
                    ...out,
                    edges: []
                }
            },
        })
    }
})
