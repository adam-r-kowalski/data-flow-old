import { UUID } from "./graph"

export enum QuickSelectKind {
    NONE,
    INPUT
}

export interface QuickSelectNone {
    readonly kind: QuickSelectKind.NONE
}

export interface QuickSelectInput {
    readonly kind: QuickSelectKind.INPUT
    readonly hotkeys: Readonly<{ [input: UUID]: string }>
}

export type QuickSelect =
    | QuickSelectNone
    | QuickSelectInput