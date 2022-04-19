import { Graph, Kind } from '../src/graph'

test("add number", () => {
  const graph = new Graph()
  graph.addNumber(42)
  expect(graph.nodes).toEqual({
    title: ['Number'],
    inputs: [[]],
    outputs: [['value']],
    kind: [Kind.NUMBER],
    index: [0],
  })
  expect(graph.numbers).toEqual({
    value: [42],
  })
})

test("add transform", () => {
  const graph = new Graph()
  graph.addTransform({ title: 'Add', inputs: ['a', 'b'], outputs: ['result'] })
  expect(graph.nodes).toEqual({
    title: ['Number'],
    inputs: [[]],
    outputs: [['value']],
    kind: [Kind.NUMBER],
    index: [0],
  })
  expect(graph.numbers).toEqual({
    value: [42],
  })
})
