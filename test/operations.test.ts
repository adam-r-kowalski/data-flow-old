import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu'
import { tensorFunc } from '../src/model/operations';
import { BodyKind, ErrorBody, NoBody, TensorBody } from '../src/model/graph';

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