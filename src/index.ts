import { Camera, Hsla } from './components'
import { Mat3 } from './linear_algebra'
import * as Studio from './studio'
import { Entity } from './studio'
import { clickInput, clickOutput, drag } from './systems'
const { ECS, Renderer } = Studio
const { UIRoot, Alignment, Transform } = Studio.components
const { text, column, row, container, scene } = Studio.ui
const { render, init } = Studio.systems

const ecs = new ECS()
const renderer = new Renderer(window.innerWidth, window.innerHeight)
renderer.canvas.style.width = '100%'
renderer.canvas.style.height = '100%'


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


const source = container(ecs, { color: { h: 110, s: 1, l: 0.3, a: 1 }, padding: 10, x: 25, y: 200, onDrag: drag },
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

const transform = container(ecs, { color: { h: 210, s: 1, l: 0.3, a: 1 }, padding: 10, x: 300, y: 100, onDrag: drag },
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

const sink = container(ecs, { color: { h: 310, s: 1, l: 0.3, a: 1 }, padding: 10, x: 550, y: 250, onDrag: drag },
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

const camera = ecs.entity(new Transform(Mat3.identity()))

const root = scene(ecs, {
    children: [source, transform, sink],
    connections: []
})

ecs.set(renderer, new UIRoot(root), new Camera(camera))

init(ecs)

requestAnimationFrame(() => render(ecs))

document.body.appendChild(renderer.canvas)