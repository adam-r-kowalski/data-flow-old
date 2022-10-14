import * as papa from "papaparse"

import { UUID } from "./model/graph"
import { Columns, Table } from "./model/table"
import { Document } from "./ui/dom"
import { Row } from "./ui/row"

export type GenerateUUID = () => UUID
export type CurrentTime = () => number
export type ShowCursor = (show: boolean) => void
export type SetTimeout = (callback: () => void, ms: number) => void

export interface Effects {
    currentTime: CurrentTime
    generateUUID: GenerateUUID
    promptUserForTable: () => Promise<Table>
    showCursor: ShowCursor
    setTimeout: SetTimeout
}

const promptUserForTable = (): Promise<Table> =>
    new Promise<File>((resolve) => {
        const element = document.createElement("input")
        element.type = "file"
        element.accept = ".csv"
        element.addEventListener("change", (event) => {
            const file = (event.target! as HTMLInputElement).files![0]
            resolve(file)
        })
        element.click()
    }).then(
        (file) =>
            new Promise<Table>((resolve) => {
                papa.parse(file, {
                    worker: true,
                    header: true,
                    dynamicTyping: true,
                    complete: async (results) => {
                        const columns: Columns = {}
                        for (const name of results.meta.fields!) {
                            columns[name] = []
                        }
                        const errorRows = results.errors.map((e) => e.row)
                        results.data.forEach((row, i) => {
                            if (!errorRows.includes(i)) {
                                for (const [name, value] of Object.entries(
                                    row as Row
                                )) {
                                    columns[name].push(value ?? undefined)
                                }
                            }
                        })
                        resolve({
                            name: file.name,
                            columns,
                        })
                    },
                })
            })
    )

const uuidv4 = (): string => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    )
}

const generateUUID =
    typeof crypto.randomUUID === "function" ? crypto.randomUUID : uuidv4

const currentTime = () => performance.now()
export const showCursor = (document: Document, show: boolean) =>
    (document.body.style.cursor = show ? "auto" : "none")

export const makeEffects = (document: Document): Effects => ({
    currentTime,
    generateUUID,
    promptUserForTable,
    showCursor: (show: boolean) => showCursor(document, show),
    setTimeout: (callback: () => void, ms: number) => setTimeout(callback, ms),
})
