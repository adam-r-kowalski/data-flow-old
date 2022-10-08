import { EventKind } from "../src/event"
import * as finder from "../src/finder"
import { column, container, text } from "../src/ui"
import { CrossAxisAlignment } from "../src/ui/alignment"
import "./toEqualData"

test("finder with no search shows all options", () => {
    const model = {
        search: "",
        options: ["foo", "bar"],
        selectedIndex: 0,
    }
    const theme = {
        background: { red: 41, green: 95, blue: 120, alpha: 255 },
        searchBackground: { red: 2, green: 22, blue: 39, alpha: 255 },
        searchText: { red: 188, green: 240, blue: 192, alpha: 255 },
        selected: { red: 188, green: 240, blue: 192, alpha: 255 },
        unselected: { red: 255, green: 255, blue: 255, alpha: 255 },
    }
    const onClick = () => {}
    const actual = finder.view({ model, theme, onClick })
    const expected = column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({ height: 10 }),
        container(
            { color: theme.background, padding: 4 },
            column([
                container(
                    { color: theme.searchBackground, width: 300, padding: 4 },
                    text({ color: theme.searchText, size: 24 }, "Search ...")
                ),
                container({ width: 10, height: 10 }),
                container(
                    {
                        width: 300,
                        padding: 4,
                        onClick,
                    },
                    text({ size: 18, color: theme.selected }, "foo")
                ),
                container(
                    {
                        width: 300,
                        padding: 4,
                        onClick,
                    },
                    text({ size: 18, color: theme.unselected }, "bar")
                ),
            ])
        ),
    ])
    expect(actual).toEqualData(expected)
})

test("arrow up decrements selected index", () => {
    const model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 1,
    }
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "ArrowUp",
        },
        onSelect,
        onClose,
    })
    const expectedModel: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    expect(result.model).toEqual(expectedModel)
    expect(result.event).toBeUndefined()
})

test("ctrl k decrements selected index", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    const model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 1,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "<c-k>",
        },
        onSelect,
        onClose,
    })
    const expectedModel: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    expect(result.model).toEqual(expectedModel)
    expect(result.event).toBeUndefined()
})

test("arrow down increments from selected index", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    const model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "ArrowDown",
        },
        onSelect,
        onClose,
    })
    const expectedModel: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 1,
    }
    expect(result.model).toEqual(expectedModel)
    expect(result.event).toBeUndefined()
})

test("ctrl k increments from selected index", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    const model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "<c-j>",
        },
        onSelect,
        onClose,
    })
    const expectedModel: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 1,
    }
    expect(result.model).toEqual(expectedModel)
    expect(result.event).toBeUndefined()
})

test("not hot key down appends to search", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    for (const key of "add") {
        const result = finder.update({
            model,
            event: {
                kind: EventKind.KEYDOWN,
                key,
            },
            onSelect,
            onClose,
        })
        model = result.model
    }
    const expectedModel: finder.Model = {
        search: "add",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    expect(model).toEqual(expectedModel)
})

test("backspace key deletes from search", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    for (const key of "add") {
        const result = finder.update({
            model,
            event: {
                kind: EventKind.KEYDOWN,
                key,
            },
            onSelect,
            onClose,
        })
        model = result.model
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "Backspace",
        },
        onSelect,
        onClose,
    })
    model = result.model
    const expectedModel: finder.Model = {
        search: "ad",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    expect(model).toEqual(expectedModel)
})

test("enter key down inserts selected operation", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        onSelect,
        onClose,
    })
    expect(result.model).toEqual(model)
    expect(result.event).toEqual({
        kind: EventKind.FINDER_INSERT,
        option: "Add",
    })
})

test("enter key down with search inserts selected operation", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "s",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        onSelect,
        onClose,
    })
    expect(result.model).toEqual(model)
    expect(result.event).toEqual({
        kind: EventKind.FINDER_INSERT,
        option: "Sub",
    })
})

test("enter key down with invalid search closes finder", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "z",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "Enter",
        },
        onSelect,
        onClose,
    })
    expect(result.model).toEqual(model)
    expect(result.event).toEqual({
        kind: EventKind.FINDER_CLOSE,
    })
})

test("escape key down closes finder", () => {
    const onSelect = (option: string) => ({
        kind: EventKind.FINDER_INSERT,
        option,
    })
    const onClose = { kind: EventKind.FINDER_CLOSE }
    let model: finder.Model = {
        search: "",
        options: ["Add", "Sub"],
        selectedIndex: 0,
    }
    const result = finder.update({
        model,
        event: {
            kind: EventKind.KEYDOWN,
            key: "Escape",
        },
        onSelect,
        onClose,
    })
    expect(result.model).toEqual(model)
    expect(result.event).toEqual({
        kind: EventKind.FINDER_CLOSE,
    })
})
