import * as numericVirtualKeyboard from "../src/numeric_virtual_keyboard"
import { Color, column, container, row } from "../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../src/ui/alignment"
import * as virtualKeys from "../src/virtual_keys"

const color: Color = { red: 255, green: 255, blue: 255, alpha: 255 }

test("numeric virtual keyboard negative", () => {
    const actual = numericVirtualKeyboard.view({ color, positive: false })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view([
                        "1",
                        "2",
                        "3",
                        { display: "clr", event: "c" },
                    ]),
                    virtualKeys.view([
                        "4",
                        "5",
                        "6",
                        { display: "del", event: "Backspace" },
                    ]),
                    virtualKeys.view(["7", "8", "9", "   "]),
                    virtualKeys.view([
                        "-",
                        "0",
                        ".",
                        { display: "ret", event: "Enter" },
                    ]),
                ])
            ),
        ]),
    ])
    expect(actual).toEqual(expected)
})
