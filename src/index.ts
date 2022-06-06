import { Mat3 } from './linear_algebra'
import * as Studio from './studio'
const { ECS, Renderer } = Studio
const { UIRoot, Alignment, Transform } = Studio.components
const { text, column, row, container, scene, connection } = Studio.ui
const { render } = Studio.systems

const ecs = new ECS()
const renderer = new Renderer(window.innerWidth, window.innerHeight)
renderer.canvas.style.width = '100%'
renderer.canvas.style.height = '100%'

const sourceOut = container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } })
const source = container(ecs, { color: { h: 110, s: 1, l: 0.3, a: 1 }, padding: 10, x: 25, y: 200 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Source")),
        container(ecs, { height: 10 }),
        row(ecs, [
            column(ecs, [
                row(ecs, [
                    container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } }),
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
                ]),
                row(ecs, [
                    container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } }),
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
                ]),
            ]),
            container(ecs, { width: 30 }),
            column(ecs, { crossAxisAlignment: Alignment.END }, [
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
                    container(ecs, { width: 5 }),
                    sourceOut
                ]),
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
                    container(ecs, { width: 5 }),
                    container(ecs, { width: 18, height: 18, color: { h: 70, s: 1, l: 0.7, a: 1 } })
                ]),
            ])
        ])
    ])
)

const transformIn = container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
const transformOut = container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
const transform = container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 10, x: 300, y: 100 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Transform")),
        container(ecs, { height: 10 }),
        row(ecs, [
            column(ecs, [
                row(ecs, [
                    transformIn,
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
                ]),
                row(ecs, [
                    container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } }),
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
                ]),
            ]),
            container(ecs, { width: 30 }),
            column(ecs, { crossAxisAlignment: Alignment.END }, [
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
                    container(ecs, { width: 5 }),
                    container(ecs, { width: 18, height: 18, color: { h: 170, s: 1, l: 0.7, a: 1 } })
                ]),
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
                    container(ecs, { width: 5 }),
                    transformOut
                ]),
            ])
        ])
    ])
)

const sinkIn = container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
const sink = container(ecs, { color: { h: 310, s: 1, l: 0.3, a: 1 }, padding: 10, x: 550, y: 250 },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Sink")),
        container(ecs, { height: 10 }),
        row(ecs, [
            column(ecs, [
                row(ecs, [
                    container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } }),
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 0")),
                ]),
                row(ecs, [
                    sinkIn,
                    container(ecs, { width: 5 }),
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "in 1")),
                ]),
            ]),
            container(ecs, { width: 30 }),
            column(ecs, { crossAxisAlignment: Alignment.END }, [
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 0")),
                    container(ecs, { width: 5 }),
                    container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
                ]),
                row(ecs, [
                    container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, "out 1")),
                    container(ecs, { width: 5 }),
                    container(ecs, { width: 18, height: 18, color: { h: 270, s: 1, l: 0.7, a: 1 } })
                ]),
            ])
        ])
    ])
)

const camera = ecs.entity(new Transform(Mat3.identity()),)

const root = scene(ecs, {
    camera,
    children: [source, transform, sink],
    connections: [
        connection(ecs, { from: sourceOut, to: transformIn }),
        connection(ecs, { from: transformOut, to: sinkIn }),
    ]
})

ecs.set(renderer, new UIRoot(root))

requestAnimationFrame(() => render(ecs))

let dragging = false

document.addEventListener('pointerdown', () => dragging = true)

document.addEventListener('pointermove', (e) => {
    if (!dragging) return
    camera.update(Transform, transform => {
        const translate = Mat3.translation(-e.movementX, -e.movementY)
        transform.matrix = transform.matrix.matMul(translate)
    })
    requestAnimationFrame(() => render(ecs))
})
document.addEventListener('pointerup', () => dragging = false)

window.addEventListener('resize', () => {
    renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight)
    requestAnimationFrame(() => render(ecs))
})

document.body.appendChild(renderer.canvas)

let isFullscreen = false

document.addEventListener('touchend', () => {
    if (isFullscreen) return
    renderer.canvas.requestFullscreen()
    isFullscreen = true
})

document.addEventListener('wheel', (e) => {
    e.preventDefault()
    camera.update(Transform, transform => {
        const move = Mat3.translation(e.clientX, e.clientY)
        const scale = Math.pow(2, e.deltaY * 0.01)
        const zoom = Mat3.scaling(scale, scale)
        const moveBack = Mat3.translation(-e.clientX, -e.clientY)
        const result = move.matMul(zoom).matMul(moveBack)
        transform.matrix = transform.matrix.matMul(result)
    })
    requestAnimationFrame(() => render(ecs))
}, { passive: false })

document.addEventListener('keydown', (e) => e.preventDefault())