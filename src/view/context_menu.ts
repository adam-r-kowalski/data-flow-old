import { row, column, container, Color, text, OnClick } from "../ui"
import { MainAxisAlignment } from "../ui/alignment"

export interface ContextMenuItem {
    name: string
    shortcut: string
    onClick: OnClick
}

interface Properties {
    items: ContextMenuItem[]
    backgroundColor: Color
}

export const contextMenu = ({ items, backgroundColor }: Properties) =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container(
                { padding: 4, color: backgroundColor },
                column(
                    items.map(({ name, shortcut, onClick }) =>
                        container(
                            {
                                padding: 10,
                                onClick,
                            },
                            text({ size: 18 }, `(${shortcut}) ${name}`)
                        )
                    )
                )
            ),
        ]),
    ])
