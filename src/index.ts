import * as Studio from './studio'

const ecs = new Studio.ECS()

let viewport = { x: 0, y: 0, width: 500, height: 500 }


const renderer = new Studio.renderer.WebGL2(viewport)
renderer.element.style.width = '100%'
renderer.element.style.height = '100%'
document.body.appendChild(renderer.element)

const camera = ecs.entity()
ecs.set(new Studio.ActiveCamera(camera))

const [near, far] = [500, -500]

const onResize = () => {
  viewport.width = renderer.element.clientWidth
  viewport.height = renderer.element.clientHeight
  camera.set(Studio.orthographicProjection({ ...viewport, near, far }))
  renderer.viewport(viewport)
}
onResize()
window.addEventListener('resize', onResize)

const addPlane = (x, y, h) =>
  ecs.entity(
    Studio.planeGeometry(),
    new Studio.Translate({ x, y, z: 0 }),
    new Studio.Rotate({ x: 0, y: 0, z: 0 }),
    new Studio.Scale({ x: 10, y: 10, z: 1 }),
    new Studio.Fill({ h, s: 1, l: 0.7, a: 1 }),
    new Studio.Root(),
  )
const plane = addPlane(viewport.width / 2, viewport.height / 2, 279)

let mouseHeld = false

document.addEventListener('mousedown', e => {
  mouseHeld = true
  addPlane(e.x, e.y, Math.floor(Math.random() * 360))
  renderer.render(ecs)
})

document.addEventListener('mouseup', () => mouseHeld = false)
let lastTime = 0
const update = (currentTime: number) => {
  requestAnimationFrame(update)
  for (const entity of ecs.query(Studio.Rotate)) {
    entity.get(Studio.Rotate)!.x += (currentTime - lastTime) / 1000
  }
  lastTime = currentTime
  renderer.render(ecs)
}

document.addEventListener('pointermove', e => {
  plane.set(new Studio.Translate({ x: e.x, y: e.y, z: 0 }))
  if (mouseHeld) {
    for (const c of e.getCoalescedEvents()) {
      addPlane(c.x, c.y, Math.floor(Math.random() * 360))
    }
  }
  renderer.render(ecs)
})

requestAnimationFrame(update)
