import { Connections, Hsla, OnClick, OnDrag, Translate } from './components'
import { Mat3, Vec3 } from './linear_algebra'
import * as Studio from './studio'
import { Entity } from './studio'
const { ECS, Renderer } = Studio
const { UIRoot, Alignment, Transform } = Studio.components
const { text, column, row, container, scene, connection } = Studio.ui
const { render, rayCast } = Studio.systems

const ecs = new ECS()
const renderer = new Renderer(window.innerWidth, window.innerHeight)
renderer.canvas.style.width = '100%'
renderer.canvas.style.height = '100%'

const dragSelf = (entity: Entity, x: number, y: number) =>
    entity.update(Translate, translate => {
        translate.x += x
        translate.y += y
    })


let connectionFrom: Entity | null = null


const clickOutput = (entity: Entity) => connectionFrom = entity

const clickInput = (entity: Entity) => {
    if (!connectionFrom) return
    const con = connection(ecs, { from: connectionFrom, to: entity })
    root.update(Connections, connections =>
        connections.entities.push(con)
    )
    connectionFrom = null
    requestAnimationFrame(() => render(ecs))
}


const inputs = (n: number, color: Hsla): Entity =>
    column(ecs, Array.from({ length: n }, (_, i) =>
        row(ecs, [
            container(ecs, { width: 18, height: 18, color, onClick: clickInput }),
            container(ecs, { width: 5 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, `in ${i}`)),
        ]),
    ))


const outputs = (n: number, color: Hsla): Entity =>
    column(ecs, { crossAxisAlignment: Alignment.END }, Array.from({ length: n }, (_, i) =>
        row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, `out ${i}`)),
            container(ecs, { width: 5 }),
            container(ecs, { width: 18, height: 18, color, onClick: clickOutput })
        ]),
    ))


const source = container(ecs, { color: { h: 110, s: 1, l: 0.3, a: 1 }, padding: 10, x: 25, y: 200, onDrag: dragSelf },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Source")),
        container(ecs, { height: 10 }),
        row(ecs, [
            inputs(3, { h: 70, s: 1, l: 0.7, a: 1 }),
            container(ecs, { width: 30 }),
            outputs(2, { h: 70, s: 1, l: 0.7, a: 1 }),
        ])
    ])
)

const transform = container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 10, x: 300, y: 100, onDrag: dragSelf },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Transform")),
        container(ecs, { height: 10 }),
        row(ecs, [
            inputs(2, { h: 170, s: 1, l: 0.7, a: 1 }),
            container(ecs, { width: 30 }),
            outputs(4, { h: 170, s: 1, l: 0.7, a: 1 }),
        ])
    ])
)

const sink = container(ecs, { color: { h: 310, s: 1, l: 0.3, a: 1 }, padding: 10, x: 550, y: 250, onDrag: dragSelf },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Sink")),
        container(ecs, { height: 10 }),
        row(ecs, [
            inputs(3, { h: 270, s: 1, l: 0.7, a: 1 }),
            container(ecs, { width: 30 }),
            outputs(3, { h: 270, s: 1, l: 0.7, a: 1 })
        ])
    ])
)

const camera = ecs.entity(new Transform(Mat3.identity()),)

const root = scene(ecs, {
    camera,
    children: [source, transform, sink],
    connections: []
})

ecs.set(renderer, new UIRoot(root))

requestAnimationFrame(() => render(ecs))

const pointers: PointerEvent[] = []
let dragging = false
let pointerDistance = 0

document.addEventListener('pointerdown', (e) => {
    pointers.push(e)
    if (pointers.length != 1) return
    const cameraMatrix = camera.get(Transform)!.matrix
    const mouse = new Vec3([e.clientX, e.clientY, 1])
    for (const entity of rayCast(ecs, cameraMatrix, mouse)) {
        const onClick = entity.get(OnClick)
        if (onClick) {
            onClick.callback(entity)
            requestAnimationFrame(() => render(ecs))
            return
        }
    }
    dragging = true
})


let draggedEntity: Entity | null = null

document.addEventListener('pointermove', (e) => {
    pointers[pointers.findIndex(p => p.pointerId == e.pointerId)] = e
    if (dragging && pointers.length == 1) {
        if (draggedEntity) {
            const onDrag = draggedEntity.get(OnDrag)!.callback
            onDrag(draggedEntity, e.movementX, e.movementY)
            requestAnimationFrame(() => render(ecs))
            return
        }
        const cameraMatrix = camera.get(Transform)!.matrix
        const mouse = new Vec3([e.clientX, e.clientY, 1])
        for (const entity of rayCast(ecs, cameraMatrix, mouse)) {
            const onDrag = entity.get(OnDrag)
            if (onDrag) {
                draggedEntity = entity
                onDrag.callback(entity, e.movementX, e.movementY)
                requestAnimationFrame(() => render(ecs))
                return
            }
        }
        camera.update(Transform, transform => {
            const translate = Mat3.translation(-e.movementX, -e.movementY)
            transform.matrix = transform.matrix.matMul(translate)
        })
        requestAnimationFrame(() => render(ecs))
    } else if (pointers.length == 2) {
        const [x1, y1] = [pointers[0].clientX, pointers[0].clientY]
        const [x2, y2] = [pointers[1].clientX, pointers[1].clientY]
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        if (pointerDistance > 0) {
            const move = Mat3.translation(e.clientX, e.clientY)
            const zoom = Math.pow(2, (pointerDistance - distance) * 0.01)
            const scale = Mat3.scaling(zoom, zoom)
            const moveBack = Mat3.translation(-e.clientX, -e.clientY)
            const result = move.matMul(scale).matMul(moveBack)
            camera.update(Transform, transform =>
                transform.matrix = transform.matrix.matMul(result)
            )
        }
        pointerDistance = distance
        requestAnimationFrame(() => render(ecs))
    }
})

document.addEventListener('pointerup', (e) => {
    pointers.splice(pointers.findIndex(p => p.pointerId == e.pointerId), 1)
    if (pointers.length == 0) {
        dragging = false
        pointerDistance = 0
        draggedEntity = null
    }
})

window.addEventListener('resize', () => {
    renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight)
    requestAnimationFrame(() => render(ecs))
})

document.body.appendChild(renderer.canvas)

document.addEventListener('touchend', () => {
    renderer.canvas.requestFullscreen()
})

document.addEventListener('wheel', (e) => {
    e.preventDefault()
    camera.update(Transform, transform => {
        const move = Mat3.translation(e.clientX, e.clientY)
        const zoom = Math.pow(2, e.deltaY * 0.01)
        const scale = Mat3.scaling(zoom, zoom)
        const moveBack = Mat3.translation(-e.clientX, -e.clientY)
        const result = move.matMul(scale).matMul(moveBack)
        transform.matrix = transform.matrix.matMul(result)
    })
    requestAnimationFrame(() => render(ecs))
}, { passive: false })

//document.addEventListener('keydown', (e) => e.preventDefault())