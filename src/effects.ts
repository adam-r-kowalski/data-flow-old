import * as papa from "papaparse"

import { UUID } from "./model/graph"
import { Columns, Table } from "./model/table"
import { Row } from "./ui/row"

export type GenerateUUID = () => UUID

export type CurrentTime = () => number

export interface Effects {
    currentTime: CurrentTime
    generateUUID: GenerateUUID
    promptUserForTable: () => Promise<Table>
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

const generateUUID = () => crypto.randomUUID()
const currentTime = () => performance.now()

export const effects = { currentTime, generateUUID, promptUserForTable }
