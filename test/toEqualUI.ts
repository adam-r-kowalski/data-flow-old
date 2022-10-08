import { UI, UIKind } from "../src/ui"
import { Container } from "../src/ui/container"
import { Column } from "../src/ui/column"
import { Row } from "../src/ui/row"
import { Stack } from "../src/ui/stack"
import { Scene } from "../src/ui/scene"
import { CrossAxisAlignment, MainAxisAlignment } from "../src/ui/alignment"

const isEqualPrimitive = <T extends number | string>(
    path: string,
    received: T,
    expected: T
): jest.CustomMatcherResult => {
    return received === expected
        ? { pass: true, message: () => "" }
        : {
              pass: false,
              message: () => `${path} | ${received} does not equal ${expected}`,
          }
}

const isEqualObject = (
    path: string,
    received: object,
    expected: object
): jest.CustomMatcherResult => {
    for (const [key, value] of Object.entries(received)) {
        const result = isEqual(`${path}.${key}`, value, (expected as any)[key])
        if (!result.pass) return result
    }
    return {
        pass: true,
        message: () => "",
    }
}

const isEqual = (
    path: string,
    received: any,
    expected: any
): jest.CustomMatcherResult => {
    const receivedT = typeof received
    const expectedT = typeof expected
    if (receivedT !== expectedT) {
        return {
            pass: false,
            message: () =>
                `${path} | received ${receivedT} expected ${expectedT}`,
        }
    }
    switch (receivedT) {
        case "number":
        case "string":
            return isEqualPrimitive(path, received, expected)
        case "object":
            return isEqualObject(path, received, expected)
        case "undefined":
        case "function":
            return { pass: true, message: () => "" }
        default:
            return {
                pass: false,
                message: () =>
                    `${path} | is equal not implemented for ${receivedT}`,
            }
    }
}

const isEqualContainer = (
    path: string,
    received: Container,
    expected: Container
): jest.CustomMatcherResult => {
    for (const [key, value] of Object.entries(received)) {
        if (key === "child") continue
        const result = isEqual(`${path}.${key}`, value, (expected as any)[key])
        if (!result.pass) return result
    }
    if (received.child !== undefined) {
        if (expected.child === undefined) {
            return {
                pass: false,
                message: () =>
                    `${path} | received child but did not expect child`,
            }
        } else return isEqualUI(path + ".child", received.child, expected.child)
    }
    return {
        pass: true,
        message: () => "",
    }
}

const isEqualWithChildren = <T extends Column | Row | Stack | Scene>(
    path: string,
    received: T,
    expected: T
): jest.CustomMatcherResult => {
    for (const [key, value] of Object.entries(received)) {
        switch (key) {
            case "children":
                continue
            case "mainAxisAlignment": {
                if (value !== (expected as any)[key]) {
                    return {
                        pass: false,
                        message: () =>
                            `${path}.${key} | ${
                                MainAxisAlignment[value]
                            } does not equal ${
                                MainAxisAlignment[(expected as any)[key]]
                            }`,
                    }
                }
                continue
            }
            case "crossAxisAlignment": {
                if (value !== (expected as any)[key]) {
                    return {
                        pass: false,
                        message: () =>
                            `${path}.${key} | ${
                                CrossAxisAlignment[value]
                            } does not equal ${
                                CrossAxisAlignment[(expected as any)[key]]
                            }`,
                    }
                }
                continue
            }
            default: {
                const result = isEqual(
                    `${path}.${key}`,
                    value,
                    (expected as any)[key]
                )
                if (!result.pass) return result
            }
        }
    }
    const receivedC = received.children.length
    const expectedC = expected.children.length
    if (receivedC !== expectedC) {
        return {
            pass: false,
            message: () =>
                `${path} | received ${receivedC} children expected ${expectedC} children`,
        }
    }
    for (let i = 0; i < receivedC; ++i) {
        const result = isEqualUI(
            `${path}.children[${i}]`,
            received.children[i],
            expected.children[i]
        )
        if (!result.pass) return result
    }
    return {
        pass: true,
        message: () => "",
    }
}

const isEqualUI = (
    path: string,
    received: UI,
    expected: UI
): jest.CustomMatcherResult => {
    const receivedK = UIKind[received.kind]
    const expectedK = UIKind[expected.kind]
    if (received.kind !== expected.kind) {
        return {
            pass: false,
            message: () =>
                `${path} | received ${receivedK} expected ${expectedK}`,
        }
    }
    switch (received.kind) {
        case UIKind.CONTAINER:
            return isEqualContainer(path, received, expected as Container)
        case UIKind.COLUMN:
            return isEqualWithChildren(path, received, expected as Column)
        case UIKind.ROW:
            return isEqualWithChildren(path, received, expected as Row)
        case UIKind.STACK:
            return isEqualWithChildren(path, received, expected as Stack)
        case UIKind.SCENE:
            return isEqualWithChildren(path, received, expected as Scene)
        case UIKind.TEXT:
            return isEqual(path, received, expected)
        default:
            return {
                pass: false,
                message: () =>
                    `${path} | is equal ui not implemented for ${receivedK}`,
            }
    }
}

const matchers = {
    toEqualUI(
        this: jest.MatcherContext,
        received: UI,
        expected: UI
    ): jest.CustomMatcherResult {
        return isEqualUI("ui", received, expected)
    },
}

expect.extend(matchers)

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualUI(ui: UI): R
        }
    }
}
