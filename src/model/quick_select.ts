import { UUID } from "./graph"

export enum QuickSelectKind {
    NONE,
    INPUT,
    OUTPUT,
    NODE
}

export interface QuickSelectNone {
    readonly kind: QuickSelectKind.NONE
}

export interface QuickSelectInput {
    readonly kind: QuickSelectKind.INPUT
    readonly hotkeys: Readonly<{ [input: UUID]: string }>
}

export interface QuickSelectOutput {
    readonly kind: QuickSelectKind.OUTPUT
    readonly hotkeys: Readonly<{ [output: UUID]: string }>
}

export interface QuickSelectNode {
    readonly kind: QuickSelectKind.NODE
    readonly hotkeys: Readonly<{ [node: UUID]: string }>
}


export type QuickSelect =
    | QuickSelectNone
    | QuickSelectInput
    | QuickSelectOutput
    | QuickSelectNode