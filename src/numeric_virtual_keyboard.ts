import { Color, column, container, row, UI } from "./ui"
import { CrossAxisAlignment, MainAxisAlignment } from "./ui/alignment"
import * as virtualKeys from "./virtual_keys"

interface Properties {
    color: Color
    positive: boolean
    onClick: (key: string) => void
}

export const view = ({ color, positive, onClick }: Properties): UI =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container(
                { padding: 4, color },
                column({ crossAxisAlignment: CrossAxisAlignment.END }, [
                    virtualKeys.view(["1", "2", "3", "clr"], onClick),
                    virtualKeys.view(["4", "5", "6", "del"], onClick),
                    virtualKeys.view(["7", "8", "9", "   "], onClick),
                    virtualKeys.view(
                        [positive ? "-" : "+", "0", ".", "ret"],
                        onClick
                    ),
                ])
            ),
        ]),
    ])
