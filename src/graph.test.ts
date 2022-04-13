import { Graph, Kind } from './graph'

test('connect output and input', () => {
  const graph: Graph = {
    sources: [
      {
        name: 'Titanic',
        outputs: [
          {
            name: 'Sex',
            translate: { x: 0, y: 30 },
            edges: [
              {
                entity: { kind: Kind.TRANSFORM, index: 0 },
                index: 0,
              }
            ]
          },
          {
            name: 'Survived',
            translate: { x: 0, y: 50 },
            edges: [
              {
                entity: { kind: Kind.TRANSFORM, index: 0 },
                index: 1,
              }
            ]
          }
        ],
        translate: { x: 0, y: 0 },
        scale: { x: 300, y: 200 },
      }
    ],
    transforms: [
      {
        name: 'Scatter',
        inputs: [
          {
            name: 'x',
            translate: { x: 0, y: 30 },
            edge: {
              entity: { kind: Kind.SOURCE, index: 0 },
              index: 0
            }
          },
          {
            name: 'y',
            translate: { x: 0, y: 50 },
            edge: {
              entity: { kind: Kind.SOURCE, index: 0 },
              index: 1
            }
          },
        ],
        outputs: [
          {
            name: 'plot',
            translate: { x: 0, y: 30 },
            edges: []
          },
        ],
        translate: { x: 0, y: 0 },
        scale: { x: 300, y: 200 },
      }
    ],
    sinks: []
  }

})

