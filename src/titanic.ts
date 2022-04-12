import { Graph, Kind, Tables } from './graph'

export const graph: Graph = {
  nodes: [[{ kind: Kind.TABLE, index: 0 }]],
  tables: {
    names: ['Titanic'],
    columns: [['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Survived']]
  }
}
