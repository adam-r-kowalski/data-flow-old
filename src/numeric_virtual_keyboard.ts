import { Color, column, container, row, UI } from "./ui"
import { CrossAxisAlignment, MainAxisAlignment } from "./ui/alignment"
import * as virtualKeys from "./virtual_keys"

export type Event = virtualKeys.Event

interface Options {
    color: Color
    positive: boolean
}

export const view = ({ color, positive }: Options): UI<Event> =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
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
                        positive ? "+" : "-",
                        "0",
                        ".",
                        { display: "ret", event: "Enter" },
                    ]),
                ])
            ),
        ]),
    ])
