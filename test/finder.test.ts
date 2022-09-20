import * as finder from "../src/finder"
import { column, container, text } from "../src/ui"
import { CrossAxisAlignment } from "../src/ui/alignment"

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
    const onClick = (option: string) => ({ kind: "click", option })
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
                        onClick: {
                            kind: "click",
                            option: "foo",
                        },
                    },
                    text({ size: 18, color: theme.selected }, "foo")
                ),
                container(
                    {
                        width: 300,
                        padding: 4,
                        onClick: {
                            kind: "click",
                            option: "bar",
                        },
                    },
                    text({ size: 18, color: theme.unselected }, "bar")
                ),
            ])
        ),
    ])
    expect(actual).toEqual(expected)
})
