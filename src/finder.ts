import { Color, column, container, text, UI } from "./ui"
import { CrossAxisAlignment } from "./ui/alignment"
import { fuzzyFind } from "./fuzzy_find"
import { KeyDown } from "./event"

export interface Model {
    readonly search: string
    readonly options: Readonly<string[]>
    readonly selectedIndex: number
}

const shownOptions = (model: Model): string[] =>
    model.options
        .filter((option) =>
            fuzzyFind({ haystack: option, needle: model.search })
        )
        .slice(0, 10)

export interface Theme {
    background: Color
    searchBackground: Color
    searchText: Color
    selected: Color
    unselected: Color
}

interface ViewProperties {
    model: Model
    theme: Theme
    onClick: (option: string) => void
}

export const view = (properties: ViewProperties): UI => {
    const { model, theme, onClick } = properties
    const { search, selectedIndex } = model
    return column({ crossAxisAlignment: CrossAxisAlignment.CENTER }, [
        container({ height: 10 }),
        container(
            { color: theme.background, padding: 4 },
            column([
                container(
                    { color: theme.searchBackground, width: 300, padding: 4 },
                    text(
                        { color: theme.searchText, size: 24 },
                        search.length ? search : "Search ..."
                    )
                ),
                container({ width: 10, height: 10 }),
                ...shownOptions(model).map((option, i) => {
                    const color =
                        i == selectedIndex ? theme.selected : theme.unselected
                    return container(
                        {
                            width: 300,
                            padding: 4,
                            onClick: () => onClick(option),
                        },
                        text({ size: 18, color }, option)
                    )
                }),
            ])
        ),
    ])
}

interface UpdateProperties {
    model: Model
    event: KeyDown
    onSelect: (option: string) => void
    onClose: () => void
}

const decrementIndex = (model: Model): Model => {
    const selectedIndex = Math.max(0, model.selectedIndex - 1)
    return { ...model, selectedIndex }
}

const incrementIndex = (model: Model): Model => {
    const options = shownOptions(model)
    const selectedIndex = Math.min(
        model.selectedIndex + 1,
        options.length - 1,
        9
    )
    return { ...model, selectedIndex }
}

const addToSearch = (model: Model, key: string): Model => {
    const search = model.search + key
    return { ...model, search }
}

export const update = (properties: UpdateProperties): Model => {
    const { model, event, onSelect, onClose } = properties
    switch (event.key) {
        case "Backspace": {
            const search = model.search.slice(0, -1)
            return { ...model, search }
        }
        case "Shift":
        case "Alt":
        case "Control":
        case "Meta":
        case "Tab":
            return model
        case "Enter": {
            const options = shownOptions(model)
            if (options.length > 0) {
                onSelect(options[model.selectedIndex])
                return model
            } else {
                onClose()
                return model
            }
        }
        case "Escape":
            onClose()
            return model
        case "ArrowUp":
        case "<c-k>":
            return decrementIndex(model)
        case "ArrowDown":
        case "<c-j>":
            return incrementIndex(model)
        default:
            return addToSearch(model, event.key)
    }
}
