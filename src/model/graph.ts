import * as tf from '@tensorflow/tfjs-core';

export type UUID = string

export type GenerateUUID = () => UUID

export interface Input {
    readonly uuid: UUID
    readonly node: UUID
    readonly name: string
    readonly edge?: UUID
}

export interface Output {
    readonly uuid: UUID
    readonly node: UUID
    readonly name: string
    readonly edges: Readonly<UUID[]>
}

export enum BodyKind {
    NO,
    TENSOR,
    SCATTER
}

export interface NoBody {
    readonly kind: BodyKind.NO
    readonly uuid: UUID
    readonly node: UUID
    readonly editable: boolean
}

export interface TensorBody {
    readonly kind: BodyKind.TENSOR
    readonly uuid: UUID
    readonly node: UUID
    readonly value: tf.TensorLike
    readonly rank: number
    readonly shape: number[]
    readonly editable: boolean
}

export interface ScatterBody {
    readonly kind: BodyKind.SCATTER
    readonly uuid: UUID
    readonly node: UUID
    readonly x: tf.TensorLike
    readonly y: tf.TensorLike
    readonly editable: boolean
}

export type Body =
    | NoBody
    | TensorBody
    | ScatterBody

export interface Position {
    readonly x: number
    readonly y: number
}

export interface Node {
    readonly uuid: UUID
    readonly name: string
    readonly inputs: Readonly<UUID[]>
    readonly body: UUID
    readonly outputs: Readonly<UUID[]>
    readonly position: Position
    readonly operation?: (...inputs: Tensor[]) => tf.Tensor<tf.Rank>
}

export interface Edge {
    readonly uuid: UUID
    readonly input: UUID
    readonly output: UUID
}

export type Nodes = { [uuid: UUID]: Node }
export type Edges = { [uuid: UUID]: Edge }
export type Inputs = { [uuid: UUID]: Input }
export type Bodys = { [uuid: UUID]: Body }
export type Outputs = { [uuid: UUID]: Output }

export interface Graph {
    readonly nodes: Readonly<Nodes>
    readonly edges: Readonly<Edges>
    readonly inputs: Readonly<Inputs>
    readonly bodys: Readonly<Bodys>
    readonly outputs: Readonly<Outputs>
}

export type Tensor = tf.TensorLike | tf.Tensor<tf.Rank>

export interface Operation {
    readonly name: string
    readonly inputs: Readonly<string[]>
    readonly body?: number
    readonly outputs: Readonly<string[]>
    readonly operation?: (...inputs: Tensor[]) => tf.Tensor<tf.Rank>
}

export type Operations = { [name: string]: Operation }

export const emptyGraph = (): Graph => ({
    nodes: {},
    edges: {},
    inputs: {},
    bodys: {},
    outputs: {},
})