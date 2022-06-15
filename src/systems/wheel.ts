import { Camera, Transform } from "../components"
import { Entity } from "../ecs"
import { Mat3 } from "../linear_algebra"
import { render } from "./render"

export const wheel = (graph: Entity) => {
    document.addEventListener('wheel', (e) => {
        const camera = graph.get(Camera)!.entity
        e.preventDefault()
        camera.update(Transform, transform => {
            const move = Mat3.translation(e.clientX, e.clientY)
            const zoom = Math.pow(2, e.deltaY * 0.01)
            const scale = Mat3.scaling(zoom, zoom)
            const moveBack = Mat3.translation(-e.clientX, -e.clientY)
            const result = move.matMul(scale).matMul(moveBack)
            transform.matrix = transform.matrix.matMul(result)
        })
        requestAnimationFrame(() => render(graph.ecs))
    }, { passive: false })
}