import * as papa from "papaparse"

import { update } from "./update"
import { run } from "./run"
import { view } from "./view"
import { Document } from "./ui/dom"
import { Columns, Value } from "./model/table"
import { EventKind } from "./event"
import { makeEffects } from "./effects"
import { emptyModel } from "./model/empty"

type Row = { [name: string]: Value }

const doc = document as Document
const effects = makeEffects(doc)

const dispatch = run({
    model: emptyModel({ width: window.innerWidth, height: window.innerHeight }),
    view,
    update: (model, event, dispatch) => update(effects, model, event, dispatch),
    window,
    document: doc,
    requestAnimationFrame,
    pointerDown: (dispatch, pointer) => {
        dispatch({
            kind: EventKind.POINTER_DOWN,
            pointer,
        })
    },
    pointerMove: (dispatch, pointer) => {
        dispatch({
            kind: EventKind.POINTER_MOVE,
            pointer,
        })
    },
    pointerUp: (dispatch, pointer) => {
        dispatch({
            kind: EventKind.POINTER_UP,
            pointer,
        })
    },
    supportsCoalesced:
        typeof PointerEvent.prototype.getCoalescedEvents === "function",
})

dispatch({ kind: EventKind.LOAD_DEMO_MODEL })

document.addEventListener(
    "wheel",
    (e) => {
        e.preventDefault()
        if (e.ctrlKey) {
            dispatch({
                kind: EventKind.WHEEL_ZOOM,
                position: { x: e.clientX, y: e.clientY },
                delta: e.deltaY,
            })
        } else {
            dispatch({
                kind: EventKind.WHEEL_PAN,
                deltaX: e.deltaX,
                deltaY: e.deltaY,
            })
        }
    },
    { passive: false }
)

document.addEventListener("contextmenu", (e) => {
    e.preventDefault()
})

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case "h":
            case "j":
            case "k":
                e.preventDefault()
                break
            case "l":
                return
            default:
                break
        }
    }
    dispatch({
        kind: EventKind.KEYDOWN,
        key: e.ctrlKey ? `<c-${e.key}>` : e.key,
    })
})

document.addEventListener("keyup", (e) => {
    dispatch({
        kind: EventKind.KEYUP,
        key: e.ctrlKey ? `<c-${e.key}>` : e.key,
    })
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(
        new URL("service_worker.ts", import.meta.url),
        { type: "module" }
    )
}

document.addEventListener("dragover", (e) => {
    e.preventDefault()
})

document.addEventListener("drop", async (e) => {
    e.preventDefault()
    if (!e.dataTransfer) {
        return
    }
    if (e.dataTransfer.items.length !== 1) {
        return
    }
    const file = e.dataTransfer.files[0]
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
                    for (const [name, value] of Object.entries(row as Row)) {
                        columns[name].push(value ?? undefined)
                    }
                }
            })
            dispatch({
                kind: EventKind.UPLOAD_TABLE,
                table: {
                    name: file.name,
                    columns,
                },
                position: {
                    x: e.clientX,
                    y: e.clientY,
                },
            })
        },
    })
})
