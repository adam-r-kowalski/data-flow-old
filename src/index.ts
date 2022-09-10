import '@tensorflow/tfjs-backend-cpu'
import * as papa from 'papaparse'

import { EventKind, update } from "./update"
import { run, transformPointer } from "./ui/run"
import { view } from './view'
import { demoModel } from "./model/demo"
import { Document } from './ui/dom'
import { ProgramKind } from "./ui/webgl2"
import { Columns, Table, Value } from './model/table'

const generateUUID = () => crypto.randomUUID()
const currentTime = () => performance.now()

type Row = { [name: string]: Value }

const promptUserForTable = (): Promise<Table> =>
    new Promise<File>(resolve => {
        const element = document.createElement('input')
        element.type = 'file'
        element.accept = '.csv'
        element.addEventListener('change', (event) => {
            const file = (event.target! as HTMLInputElement).files![0]
            resolve(file)
        })
        element.click()
    }).then(file => new Promise<Table>(resolve => {
        papa.parse(file, {
            worker: true,
            header: true,
            dynamicTyping: true,
            complete: async results => {
                const columns: Columns = {}
                for (const name of results.meta.fields!) {
                    columns[name] = []
                }
                const errorRows = results.errors.map(e => e.row)
                results.data.forEach((row, i) => {
                    if (!errorRows.includes(i)) {
                        for (const [name, value] of Object.entries(row as Row)) {
                            columns[name].push(value ?? undefined)
                        }
                    }
                })
                resolve({
                    name: file.name,
                    columns
                })
            }
        })
    }))

const effects = { currentTime, generateUUID, promptUserForTable }

const success_or_error = run({
    model: demoModel({ width: window.innerWidth, height: window.innerHeight }, effects),
    view,
    update,
    window,
    document: document as Document,
    requestAnimationFrame,
    setTimeout,
    pointerDown: (dispatch, pointer) => {
        dispatch({
            kind: EventKind.POINTER_DOWN,
            pointer
        })
    },
    effects,
})

if (success_or_error.kind == ProgramKind.ERROR) {
    throw success_or_error
}

const dispatch = success_or_error.dispatch

if (typeof PointerEvent.prototype.getCoalescedEvents === 'function') {
    document.addEventListener('pointermove', (e) => {
        e.getCoalescedEvents().forEach(p => {
            dispatch({
                kind: EventKind.POINTER_MOVE,
                pointer: transformPointer(p)
            })
        })
    })
} else {
    document.addEventListener('pointermove', p =>
        dispatch({
            kind: EventKind.POINTER_MOVE,
            pointer: transformPointer(p)
        })
    )
}

document.addEventListener("pointerup", p => {
    dispatch({
        kind: EventKind.POINTER_UP,
        pointer: transformPointer(p)
    })
})

document.addEventListener('wheel', e => {
    e.preventDefault()
    dispatch({
        kind: EventKind.WHEEL,
        position: { x: e.clientX, y: e.clientY },
        deltaY: e.deltaY,
    })
}, { passive: false })

document.addEventListener('contextmenu', e => {
    e.preventDefault()
})

document.addEventListener('keydown', e => {
    if (e.ctrlKey) {
        switch (e.key) {
            case 'h':
            case 'j':
            case 'k':
                e.preventDefault()
                break
            case 'l':
                return
            default:
                break
        }
    }
    dispatch({
        kind: EventKind.KEYDOWN,
        key: e.key,
        ctrl: e.ctrlKey
    })
})

document.addEventListener('keyup', e => {
    dispatch({
        kind: EventKind.KEYUP,
        key: e.key,
        ctrl: e.ctrlKey
    })
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
        new URL('service_worker.ts', import.meta.url),
        { type: 'module' }
    )
}


document.addEventListener('dragover', e => {
    e.preventDefault()
})

document.addEventListener('drop', async e => {
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
        complete: async results => {
            const columns: Columns = {}
            for (const name of results.meta.fields!) {
                columns[name] = []
            }
            const errorRows = results.errors.map(e => e.row)
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
                    columns
                },
                position: {
                    x: e.clientX,
                    y: e.clientY,
                }
            })
        }
    })
})