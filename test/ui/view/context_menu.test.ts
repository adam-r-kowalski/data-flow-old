import { column, container, row, text } from "../../../src/ui"
import { MainAxisAlignment } from "../../../src/ui/alignment"
import { contextMenu } from "../../../src/ui/view/context_menu"

test("context menu", () => {
    enum AppEvent { A, B }
    const actual = contextMenu({
        items: [
            {
                name: 'First',
                shortcut: 'a',
                onClick: AppEvent.A
            },
            {
                name: 'Second',
                shortcut: 'b',
                onClick: AppEvent.B
            }
        ],
        backgroundColor: { red: 255, green: 0, blue: 255, alpha: 255 }
    })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container({ padding: 4, color: { red: 255, green: 0, blue: 255, alpha: 255 } },
                column([
                    container({
                        padding: 10,
                        onClick: AppEvent.A
                    }, text({ size: 18 }, '(a) First')),
                    container({
                        padding: 10,
                        onClick: AppEvent.B
                    }, text({ size: 18 }, '(b) Second'))
                ]
                ))
        ])
    ])
    expect(actual).toEqual(expected)
})