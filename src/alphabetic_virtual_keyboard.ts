import { Color, column, container, row, UI } from "./ui"
import { CrossAxisAlignment, MainAxisAlignment } from "./ui/alignment"
import * as virtualKeys from "./virtual_keys"

export const lowercaseKeyboard = (color: Color) =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
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

export const uppercaseKeyboard = (color: Color) =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
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

interface Properties {
    color: Color
    uppercase: boolean
}

export const view = ({ color, uppercase }: Properties): UI =>
    uppercase ? uppercaseKeyboard(color) : lowercaseKeyboard(color)
