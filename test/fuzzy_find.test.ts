import { fuzzyFind } from "../src/fuzzy_find"

test("find an exact match", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "hello world" })).toBeTruthy()
})

test("matches are case insensitive", () => {
    expect(fuzzyFind({ haystack: "Hello World", needle: "hello world" })).toBeTruthy()
})


test("no matching characters", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "sap" })).toBeFalsy()
})

test("fnd an partial match in first half of word", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "hello" })).toBeTruthy()
})

test("fnd an partial match in second half of word", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "world" })).toBeTruthy()
})

test("find an partial match with start of each word", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "hw" })).toBeTruthy()
})

test("no partial match if word starts are flipped", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "wh" })).toBeFalsy()
})

test("empty needle always matches", () => {
    expect(fuzzyFind({ haystack: "hello world", needle: "" })).toBeTruthy()
})