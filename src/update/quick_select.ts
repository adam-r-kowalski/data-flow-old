import { GenerateUUID } from "../effects"
import { Model } from "../model"
import {
    Focus,
    FocusFinderChange,
    FocusFinderInsert,
    FocusKind,
} from "../model/focus"
import { BodyKind, NumberBody, TextBody, UUID } from "../model/graph"
import {
    QuickSelectInput,
    QuickSelectOutput,
    QuickSelectKind,
    QuickSelectNode,
    QuickSelectBody,
} from "../model/quick_select"
import { selectInput, selectOutput } from "./focus"

export const maybeTriggerQuickSelect = (
    model: Model,
    focus: Exclude<Focus, FocusFinderInsert | FocusFinderChange>,
    key: string
): Model => {
    switch (key) {
        case "i": {
            const hotkeys: { [input: UUID]: string } = {}
            Object.keys(model.graph.inputs).forEach((input, i) => {
                hotkeys[input] = String.fromCharCode(97 + i)
            })
            return {
                ...model,
                focus: {
                    ...focus,
                    quickSelect: {
                        kind: QuickSelectKind.INPUT,
                        hotkeys,
                    },
                },
            }
        }
        case "o": {
            const hotkeys: { [output: UUID]: string } = {}
            Object.keys(model.graph.outputs).forEach((output, i) => {
                hotkeys[output] = String.fromCharCode(97 + i)
            })
            return {
                ...model,
                focus: {
                    ...focus,
                    quickSelect: {
                        kind: QuickSelectKind.OUTPUT,
                        hotkeys,
                    },
                },
            }
        }
        case "n": {
            const hotkeys: { [node: UUID]: string } = {}
            Object.keys(model.graph.nodes).forEach((node, i) => {
                hotkeys[node] = String.fromCharCode(97 + i)
            })
            return {
                ...model,
                focus: {
                    ...focus,
                    quickSelect: {
                        kind: QuickSelectKind.NODE,
                        hotkeys,
                    },
                },
            }
        }
        case "b": {
            const hotkeys: { [body: UUID]: string } = {}
            Object.values(model.graph.bodys)
                .filter((body) =>
                    [BodyKind.NUMBER, BodyKind.TEXT].includes(body.kind)
                )
                .forEach(
                    (body, i) =>
                        (hotkeys[body.uuid] = String.fromCharCode(97 + i))
                )
            return {
                ...model,
                focus: {
                    ...focus,
                    quickSelect: {
                        kind: QuickSelectKind.BODY,
                        hotkeys,
                    },
                },
            }
        }
        default:
            return model
    }
}

export const quickSelectInput = (
    model: Model,
    quickSelect: QuickSelectInput,
    key: string,
    generateUUID: GenerateUUID
): Model => {
    const entry = Object.entries(quickSelect.hotkeys).find(
        ([_, hotkey]) => hotkey === key
    )
    if (entry !== undefined) {
        const [input, _] = entry
        return selectInput(model, input, generateUUID)
    } else {
        return {
            ...model,
            focus: {
                ...model.focus,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}

export const quickSelectOutput = (
    model: Model,
    quickSelect: QuickSelectOutput,
    key: string,
    generateUUID: GenerateUUID
): Model => {
    const entry = Object.entries(quickSelect.hotkeys).find(
        ([_, hotkey]) => hotkey === key
    )
    if (entry !== undefined) {
        const [output, _] = entry
        return selectOutput(model, output, generateUUID)
    } else {
        return {
            ...model,
            focus: {
                ...model.focus,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}

export const quickSelectNode = (
    model: Model,
    quickSelect: QuickSelectNode,
    key: string
): Model => {
    const entry = Object.entries(quickSelect.hotkeys).find(
        ([_, hotkey]) => hotkey === key
    )
    if (entry !== undefined) {
        const [node, _] = entry
        return {
            ...model,
            focus: {
                kind: FocusKind.NODE,
                node,
                drag: false,
                move: {
                    left: false,
                    up: false,
                    down: false,
                    right: false,
                    now: 0,
                },
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    } else {
        return {
            ...model,
            focus: {
                ...model.focus,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}

export const quickSelectBody = (
    model: Model,
    quickSelect: QuickSelectBody,
    key: string
): Model => {
    const entry = Object.entries(quickSelect.hotkeys).find(
        ([_, hotkey]) => hotkey === key
    )
    if (entry !== undefined) {
        const [bodyUUID, _] = entry
        const body = model.graph.bodys[bodyUUID] as NumberBody | TextBody
        switch (body.kind) {
            case BodyKind.NUMBER:
                return {
                    ...model,
                    focus: {
                        kind: FocusKind.BODY_NUMBER,
                        body: bodyUUID,
                        quickSelect: { kind: QuickSelectKind.NONE },
                    },
                }
            case BodyKind.TEXT:
                return {
                    ...model,
                    focus: {
                        kind: FocusKind.BODY_TEXT,
                        body: bodyUUID,
                        quickSelect: { kind: QuickSelectKind.NONE },
                        uppercase: false,
                    },
                }
        }
    } else {
        return {
            ...model,
            focus: {
                ...model.focus,
                quickSelect: { kind: QuickSelectKind.NONE },
            },
        }
    }
}
