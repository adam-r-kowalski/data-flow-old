export const isEqualPrimitive = <T extends number | string>(
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

export const isEqualObject = (
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

export const isEqual = (
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

const matchers = {
    toEqualData(
        this: jest.MatcherContext,
        received: object,
        expected: object
    ): jest.CustomMatcherResult {
        return isEqual("root", received, expected)
    },
}

expect.extend(matchers)

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualData(o: object): R
        }
    }
}
