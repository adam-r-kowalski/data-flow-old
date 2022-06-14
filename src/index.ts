import { Camera, Children, Color, Connections } from './components'
import { Mat3 } from './linear_algebra'
import * as Studio from './studio'
import { Entity } from './studio'
import { clickInput, clickOutput, drag } from './systems'
const { ECS, Renderer } = Studio
const { UIRoot, Alignment, Transform } = Studio.components
const { text, column, row, container, scene, stack } = Studio.ui
const { render, init } = Studio.systems

const ecs = new ECS()
const renderer = new Renderer(window.innerWidth, window.innerHeight)
renderer.canvas.style.width = '100%'
renderer.canvas.style.height = '100%'


const graph = scene(ecs)


const root = stack(ecs, [
    container(ecs, { color: new Color(71, 52, 129, 255) }),
    graph
])

const inputs = (n: number): Entity =>
    column(ecs, Array.from({ length: n }, (_, i) =>
        row(ecs, [
            container(ecs, { width: 18, height: 18, color: new Color(101, 215, 249, 255), onClick: clickInput(graph) }),
            container(ecs, { width: 5, height: 0 }),
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, `in ${i}`)),
        ]),
    ))


const outputs = (n: number): Entity =>
    column(ecs, { crossAxisAlignment: Alignment.END }, Array.from({ length: n }, (_, i) =>
        row(ecs, [
            container(ecs, { padding: 2 }, text(ecs, { fontSize: 18 }, `out ${i}`)),
            container(ecs, { width: 5, height: 0 }),
            container(ecs, { width: 18, height: 18, color: new Color(101, 215, 249, 255), onClick: clickOutput(graph) })
        ]),
    ))


const source = container(ecs, { color: new Color(0, 0, 0, 50), padding: 10, x: 25, y: 200, onDrag: drag },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Source")),
        container(ecs, { width: 0, height: 10 }),
        row(ecs, [
            inputs(3),
            container(ecs, { width: 30, height: 0 }),
            outputs(2),
        ]),
    ])
)

const transform = container(ecs, { color: new Color(0, 0, 0, 50), padding: 10, x: 300, y: 100, onDrag: drag },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Transform")),
        container(ecs, { width: 0, height: 10 }),
        row(ecs, [
            inputs(2),
            container(ecs, { width: 30, height: 0 }),
            outputs(4),
        ])
    ])
)

const sink = container(ecs, { color: new Color(0, 0, 0, 50), padding: 10, x: 550, y: 250, onDrag: drag },
    column(ecs, { crossAxisAlignment: Alignment.CENTER }, [
        container(ecs, { padding: 5 }, text(ecs, "Sink")),
        container(ecs, { width: 0, height: 10 }),
        row(ecs, [
            inputs(3),
            container(ecs, { width: 30, height: 0 }),
            outputs(3)
        ])
    ])
)

graph.update(Children, children => children.entities.push(source, transform, sink))

const camera = ecs.entity(new Transform(Mat3.identity()))

ecs.set(renderer, new UIRoot(root), new Camera(camera))

init(ecs)

requestAnimationFrame(() => render(ecs))

document.body.appendChild(renderer.canvas)