import * as tf from '@tensorflow/tfjs-core';
import { Table } from './table';

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
    NUMBER,
    TABLE,
    TENSOR,
    SCATTER,
    ERROR,
}

export interface NoBody {
    readonly kind: BodyKind.NO
    readonly uuid: UUID
    readonly node: UUID
}

export interface NumberBody {
    readonly kind: BodyKind.NUMBER
    readonly uuid: UUID
    readonly node: UUID
    readonly value: number
    readonly text: string
}

export interface TableBody {
    readonly kind: BodyKind.TABLE
    readonly uuid: UUID
    readonly node: UUID
    readonly table: Table
}


export interface TensorBody {
    readonly kind: BodyKind.TENSOR
    readonly uuid: UUID
    readonly node: UUID
    readonly value: tf.TensorLike
    readonly rank: number
    readonly shape: number[]
}

export interface ScatterBody {
    readonly kind: BodyKind.SCATTER
    readonly uuid: UUID
    readonly node: UUID
    readonly x: number[]
    readonly y: number[]
}

export interface ErrorBody {
    readonly kind: BodyKind.ERROR
    readonly uuid: UUID
    readonly node: UUID
}

export type Body =
    | NoBody
    | NumberBody
    | TableBody
    | TensorBody
    | ScatterBody
    | ErrorBody

export interface Position {
    readonly x: number
    readonly y: number
}

export type Function = (currentBody: Body, ...inputs: Body[]) => Body

export enum NodeKind {
    SOURCE,
    TRANSFORM,
}

export interface NodeSource {
    readonly kind: NodeKind.SOURCE
    readonly uuid: UUID
    readonly name: string
    readonly body: UUID
    readonly outputs: Readonly<UUID[]>
    readonly position: Position
}


export interface NodeTransform {
    readonly kind: NodeKind.TRANSFORM
    readonly uuid: UUID
    readonly name: string
    readonly inputs: Readonly<UUID[]>
    readonly body: UUID
    readonly outputs: Readonly<UUID[]>
    readonly position: Position
    readonly func: Function
}

export type Node =
    | NodeSource
    | NodeTransform

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


export enum OperationKind {
    NUMBER,
    TRANSFORM,
}

export interface OperationNumber {
    readonly kind: OperationKind.NUMBER
    readonly name: string
    readonly outputs: Readonly<string[]>
}

export interface OperationTransform {
    readonly kind: OperationKind.TRANSFORM
    readonly name: string
    readonly inputs: Readonly<string[]>
    readonly outputs: Readonly<string[]>
    readonly func: Function
}

export type Operation =
    | OperationNumber
    | OperationTransform

export type Operations = { [name: string]: Operation }

export const emptyGraph = (): Graph => ({
    nodes: {},
    edges: {},
    inputs: {},
    bodys: {},
    outputs: {},
})