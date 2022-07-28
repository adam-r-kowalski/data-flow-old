import { UI, row, column, container, Color, text } from ".."
import { MainAxisAlignment } from "../alignment"

export interface ContextMenuItem<AppEvent> {
    name: string
    shortcut: string
    onClick: AppEvent
}

interface Properties<AppEvent> {
    items: ContextMenuItem<AppEvent>[]
    backgroundColor: Color
}

export const contextMenu = <AppEvent>({ items, backgroundColor }: Properties<AppEvent>): UI<AppEvent> =>
    column({ mainAxisAlignment: MainAxisAlignment.END }, [
        row({ mainAxisAlignment: MainAxisAlignment.END }, [
            container({ padding: 4, color: backgroundColor },
                column(items.map(({ name, shortcut, onClick }) =>
                    container({
                        padding: 10,
                        onClick
                    }, text({ size: 18 }, `(${shortcut}) ${name}`))
                )))
        ])
    ])