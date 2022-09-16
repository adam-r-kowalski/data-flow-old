import * as alphabeticVirtualKeyboard from "../src/alphabetic_virtual_keyboard"
import { Color, column, container, row } from "../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../src/ui/alignment"
import * as virtualKeys from "../src/virtual_keys"

const color: Color = { red: 255, green: 255, blue: 255, alpha: 255 }

test("lowercase", () => {
    const actual = alphabeticVirtualKeyboard.view({ color, uppercase: false })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
            container(
                { padding: 4, color },
                column([
                    virtualKeys.view(["1", "2", "3", "4", "5"]),
                    virtualKeys.view(["q", "w", "e", "r", "t"]),
                    virtualKeys.view(["a", "s", "d", "f", "g"]),
                    virtualKeys.view(["z", "x", "c", "v"]),
                    virtualKeys.view(["sft", { display: "space", event: " " }]),
                ])
            ),
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view(["6", "7", "8", "9", "0"]),
                    virtualKeys.view(["y", "u", "i", "o", "p"]),
                    virtualKeys.view(["h", "j", "k", "l"]),
                    virtualKeys.view([
                        "b",
                        "n",
                        "m",
                        { display: "del", event: "Backspace" },
                    ]),
                    virtualKeys.view([
                        { display: "space", event: " " },
                        { display: "ret", event: "Enter" },
                    ]),
                ])
            ),
        ]),
    ])
    expect(actual).toEqual(expected)
})

test("uppercase", () => {
    const actual = alphabeticVirtualKeyboard.view({ color, uppercase: true })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
            container(
                { padding: 4, color },
                column([
                    virtualKeys.view(["!", "@", "#", "$", "%"]),
                    virtualKeys.view(["Q", "W", "E", "R", "T"]),
                    virtualKeys.view(["A", "S", "D", "F", "G"]),
                    virtualKeys.view(["Z", "X", "C", "V"]),
                    virtualKeys.view(["sft", { display: "space", event: " " }]),
                ])
            ),
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view(["^", "&", "*", "(", ")"]),
                    virtualKeys.view(["Y", "U", "I", "O", "P"]),
                    virtualKeys.view(["H", "J", "K", "L"]),
                    virtualKeys.view([
                        "B",
                        "N",
                        "M",
                        { display: "del", event: "Backspace" },
                    ]),
                    virtualKeys.view([
                        { display: "space", event: " " },
                        { display: "ret", event: "Enter" },
                    ]),
                ])
            ),
        ]),
    ])
    expect(actual).toEqual(expected)
})
