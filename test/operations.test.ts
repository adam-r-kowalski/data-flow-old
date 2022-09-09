import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu'
import { column, tensorFunc, operations } from '../src/model/operations';
import { BodyKind, ColumnBody, ErrorBody, NoBody, OperationTransform, TableBody, TensorBody, TextBody } from '../src/model/graph';

test("tensor func add two tensors", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0'
    }
    const x: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'x',
        node: 'node 1',
        value: [1, 2, 3],
        rank: 1,
        shape: [3],
    }
    const y: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'y',
        node: 'node 2',
        value: [4, 5, 6],
        rank: 1,
        shape: [3],
    }
    const add = tensorFunc(tf.add)
    const actual = add(current, x, y)
    const expected: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'current',
        node: 'node 0',
        value: [5, 7, 9],
        rank: 1,
        shape: [3],
    }
    expect(actual).toEqual(expected)
})

test("tensor func add tensor and nothing produces error", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0'
    }
    const x: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'x',
        node: 'node 1',
        value: [1, 2, 3],
        rank: 1,
        shape: [3],
    }
    const y: NoBody = {
        kind: BodyKind.NO,
        uuid: 'y',
        node: 'node 2',
    }
    const add = tensorFunc(tf.add)
    const actual = add(current, x, y)
    const expected: ErrorBody = {
        kind: BodyKind.ERROR,
        uuid: 'current',
        node: 'node 0',
    }
    expect(actual).toEqual(expected)
})

test("extract column from table", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0',
    }
    const table: TableBody = {
        kind: BodyKind.TABLE,
        uuid: 'table',
        node: 'node 0',
        value: {
            name: 'demo',
            columns: {

                'a': [1, 2, 3],
                'b': [4, 5, 6],
            }
        }
    }
    const name: TextBody = {
        kind: BodyKind.TEXT,
        uuid: 'y',
        node: 'node 2',
        value: 'a'
    }
    const actual = column(current, table, name)
    const expected: ColumnBody = {
        kind: BodyKind.COLUMN,
        uuid: 'current',
        node: 'node 0',
        name: 'a',
        value: [1, 2, 3]
    }
    expect(actual).toEqual(expected)
})

test("extract non existant column from table", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0',
    }
    const table: TableBody = {
        kind: BodyKind.TABLE,
        uuid: 'table',
        node: 'node 0',
        value: {
            name: 'demo',
            'columns': {
                'a': [1, 2, 3],
                'b': [4, 5, 6],
            }
        }
    }
    const name: TextBody = {
        kind: BodyKind.TEXT,
        uuid: 'y',
        node: 'node 2',
        value: 'c'
    }
    const actual = column(current, table, name)
    const expected: ErrorBody = {
        kind: BodyKind.ERROR,
        uuid: 'current',
        node: 'node 0',
    }
    expect(actual).toEqual(expected)
})

test("concat two tensors", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0'
    }
    const x: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'x',
        node: 'node 1',
        value: [1, 2, 3],
        rank: 1,
        shape: [3],
    }
    const y: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'y',
        node: 'node 2',
        value: [4, 5, 6],
        rank: 1,
        shape: [3],
    }
    const actual = (operations['concat'] as OperationTransform).func(current, x, y)
    const expected: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'current',
        node: 'node 0',
        value: [1, 2, 3, 4, 5, 6],
        rank: 1,
        shape: [6],
    }
    expect(actual).toEqual(expected)
})

test("tile", () => {
    const current: NoBody = {
        kind: BodyKind.NO,
        uuid: 'current',
        node: 'node 0'
    }
    const x: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'x',
        node: 'node 1',
        value: [1, 2, 3],
        rank: 1,
        shape: [3],
    }
    const reps: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'reps',
        node: 'node 2',
        value: 3,
        rank: 0,
        shape: [],
    }
    const actual = (operations['tile'] as OperationTransform).func(current, x, reps)
    const expected: TensorBody = {
        kind: BodyKind.TENSOR,
        uuid: 'current',
        node: 'node 0',
        value: [1, 2, 3, 1, 2, 3, 1, 2, 3],
        rank: 1,
        shape: [9],
    }
    expect(actual).toEqual(expected)
})
