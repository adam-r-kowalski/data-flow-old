import { column, container, row, text } from "../../src/ui"
import { MainAxisAlignment } from "../../src/ui/alignment"
import { contextMenu } from "../../src/view/context_menu"

test("context menu", () => {
    const onClick = () => {}
    const actual = contextMenu({
        items: [
            {
                name: "First",
                shortcut: "a",
                onClick,
            },
            {
                name: "Second",
                shortcut: "b",
                onClick,
            },
        ],
        backgroundColor: { red: 255, green: 0, blue: 255, alpha: 255 },
    })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container(
                {
                    padding: 4,
                    color: { red: 255, green: 0, blue: 255, alpha: 255 },
                },
                column([
                    container(
                        {
                            padding: 10,
                            onClick,
                        },
                        text({ size: 18 }, "(a) First")
                    ),
                    container(
                        {
                            padding: 10,
                            onClick,
                        },
                        text({ size: 18 }, "(b) Second")
                    ),
                ])
            ),
        ]),
    ])
    expect(actual).toEqual(expected)
})
