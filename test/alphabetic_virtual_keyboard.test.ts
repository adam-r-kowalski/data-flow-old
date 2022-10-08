import * as alphabeticVirtualKeyboard from "../src/alphabetic_virtual_keyboard"
import { Color, column, container, row } from "../src/ui"
import { CrossAxisAlignment, MainAxisAlignment } from "../src/ui/alignment"
import * as virtualKeys from "../src/virtual_keys"
import "./toEqualData"

const color: Color = { red: 255, green: 255, blue: 255, alpha: 255 }

test("lowercase", () => {
    const onClick = () => {}
    const actual = alphabeticVirtualKeyboard.view({
        color,
        uppercase: false,
        onClick,
    })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
            container(
                { padding: 4, color },
                column([
                    virtualKeys.view(["1", "2", "3", "4", "5"], onClick),
                    virtualKeys.view(["q", "w", "e", "r", "t"], onClick),
                    virtualKeys.view(["a", "s", "d", "f", "g"], onClick),
                    virtualKeys.view(["z", "x", "c", "v"], onClick),
                    virtualKeys.view(["sft", "space"], onClick),
                ])
            ),
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view(["6", "7", "8", "9", "0"], onClick),
                    virtualKeys.view(["y", "u", "i", "o", "p"], onClick),
                    virtualKeys.view(["h", "j", "k", "l"], onClick),
                    virtualKeys.view(["b", "n", "m", "del"], onClick),
                    virtualKeys.view(["space", "ret"], onClick),
                ])
            ),
        ]),
    ])
    expect(actual).toEqualData(expected)
})

test("uppercase", () => {
    const onClick = () => {}
    const actual = alphabeticVirtualKeyboard.view({
        color,
        uppercase: true,
        onClick,
    })
    const expected = column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.SPACE_BETWEEN }, [
            container(
                { padding: 4, color },
                column([
                    virtualKeys.view(["!", "@", "#", "$", "%"], onClick),
                    virtualKeys.view(["Q", "W", "E", "R", "T"], onClick),
                    virtualKeys.view(["A", "S", "D", "F", "G"], onClick),
                    virtualKeys.view(["Z", "X", "C", "V"], onClick),
                    virtualKeys.view(["sft", "space"], onClick),
                ])
            ),
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view(["^", "&", "*", "(", ")"], onClick),
                    virtualKeys.view(["Y", "U", "I", "O", "P"], onClick),
                    virtualKeys.view(["H", "J", "K", "L"], onClick),
                    virtualKeys.view(["B", "N", "M", "del"], onClick),
                    virtualKeys.view(["space", "ret"], onClick),
                ])
            ),
        ]),
    ])
    expect(actual).toEqualData(expected)
})
