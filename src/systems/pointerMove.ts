import { Camera, DraggedEntity, Dragging, OnDrag, PointerDistance, Pointers, Transform } from "../components";
import { ECS } from "../ecs";
import { Mat3, Vec3 } from "../linear_algebra";
import { rayCast } from "./ray_cast";
import { render } from "./render";

const dragging = (ecs: ECS, e: PointerEvent, movementX: number, movementY: number) => {
    const camera = ecs.get(Camera)!.entity
    const draggedEntity = ecs.get(DraggedEntity)!.entity
    if (draggedEntity) {
        const onDrag = draggedEntity.get(OnDrag)!.callback
        const scaling = camera.get(Transform)!.matrix.vecMul(new Vec3([0, 1, 0])).length()
        onDrag(draggedEntity, movementX * scaling, movementY * scaling)
        requestAnimationFrame(() => render(ecs))
        return
    }
    const cameraMatrix = camera.get(Transform)!.matrix
    const mouse = new Vec3([e.clientX, e.clientY, 1])
    for (const entity of rayCast(ecs, cameraMatrix, mouse)) {
        const onDrag = entity.get(OnDrag)
        if (onDrag) {
            ecs.update(DraggedEntity, dragged => dragged.entity = entity)
            const scaling = camera.get(Transform)!.matrix.vecMul(new Vec3([0, 1, 0])).length()
            onDrag.callback(entity, movementX * scaling, movementY * scaling)
            requestAnimationFrame(() => render(ecs))
            return
        }
    }
    camera.update(Transform, transform => {
        const translate = Mat3.translation(-movementX, -movementY)
        transform.matrix = transform.matrix.matMul(translate)
    })
    requestAnimationFrame(() => render(ecs))
}

const zoomCamera = (ecs: ECS, pointers: PointerEvent[], e: PointerEvent) => {
    const [x1, y1] = [pointers[0].clientX, pointers[0].clientY]
    const [x2, y2] = [pointers[1].clientX, pointers[1].clientY]
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const pointerDistance = ecs.get(PointerDistance)!.value
    if (pointerDistance > 0) {
        const move = Mat3.translation(e.clientX, e.clientY)
        const zoom = Math.pow(2, (pointerDistance - distance) * 0.01)
        const scale = Mat3.scaling(zoom, zoom)
        const moveBack = Mat3.translation(-e.clientX, -e.clientY)
        const result = move.matMul(scale).matMul(moveBack)
        const camera = ecs.get(Camera)!.entity
        camera.update(Transform, transform =>
            transform.matrix = transform.matrix.matMul(result)
        )
    }
    ecs.update(PointerDistance, d => d.value = distance)
    requestAnimationFrame(() => render(ecs))
}

const onPointerMove = (ecs: ECS, e: PointerEvent) => {
    const pointers = ecs.get(Pointers)!.events
    const index = pointers.findIndex(p => p.pointerId == e.pointerId)
    if (index == -1) return
    const movementX = e.clientX - pointers[index].clientX
    const movementY = e.clientY - pointers[index].clientY
    pointers[index] = e
    if (ecs.get(Dragging)!.value && pointers.length == 1) {
        dragging(ecs, e, movementX, movementY)
    } else if (pointers.length == 2) {
        zoomCamera(ecs, pointers, e)
    }
}

export const pointerMove = (ecs: ECS) => {
    if (typeof PointerEvent.prototype.getCoalescedEvents === 'function') {
        document.addEventListener('pointermove', (e) =>
            e.getCoalescedEvents().forEach(p => onPointerMove(ecs, p))
        )
    } else {
        document.addEventListener('pointermove', (e) => onPointerMove(ecs, e))
    }
}