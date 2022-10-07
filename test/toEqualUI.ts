import { UI, UIKind } from "../src/ui"
import { Container } from "../src/ui/container"

const isEqual = (received: any, expected: any): jest.CustomMatcherResult => {
    return {
        pass: false,
        message: () => "is equal not yet implemented",
    }
}

const isEqualContainer = (
    received: Container,
    expected: Container
): jest.CustomMatcherResult => {
    for (const [key, value] of Object.entries(received)) {
        if (key === "child") continue
        const result = isEqual(value, (expected as any)[key])
        if (!result.pass) return result
    }
    if (received.child !== undefined) {
        if (expected.child === undefined) {
            return {
                pass: false,
                message: () => "received child but did not expect child",
            }
        } else return isEqualUI(received.child, expected.child)
    }
    return {
        pass: true,
        message: () => "",
    }
}

const isEqualUI = (received: UI, expected: UI): jest.CustomMatcherResult => {
    const receivedK = UIKind[received.kind]
    const expectedK = UIKind[expected.kind]
    if (received.kind !== expected.kind) {
        return {
            pass: false,
            message: () => `received ${receivedK} expected ${expectedK}`,
        }
    }
    switch (received.kind) {
        case UIKind.CONTAINER:
            return isEqualContainer(received, expected as Container)
        default:
            return {
                pass: false,
                message: () => `unhandled object type ${receivedK}`,
            }
    }
}

const matchers = {
    toEqualUI(
        this: jest.MatcherContext,
        received: UI,
        expected: UI
    ): jest.CustomMatcherResult {
        return isEqualUI(received, expected)
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
