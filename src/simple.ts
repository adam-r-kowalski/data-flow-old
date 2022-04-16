import { Scene, addNode } from './scene'
import { material } from './color'

const initScene = (): Scene => {
  const scene: Scene = {
    positions: [],
    colors: [],
    triangles: 0
  }
  addNode(scene, { x: 50, y: 100, color: material.red })
  addNode(scene, { x: 300, y: 100, color: material.pink })
  addNode(scene, { x: 550, y: 100, color: material.purple })
  addNode(scene, { x: 800, y: 100, color: material.deepPurple })
  addNode(scene, { x: 1050, y: 100, color: material.indigo })
  addNode(scene, { x: 50, y: 250, color: material.blue })
  addNode(scene, { x: 300, y: 250, color: material.lightBlue })
  addNode(scene, { x: 550, y: 250, color: material.cyan })
  addNode(scene, { x: 800, y: 250, color: material.teal })
  addNode(scene, { x: 1050, y: 250, color: material.green })
  addNode(scene, { x: 50, y: 400, color: material.brown })
  addNode(scene, { x: 300, y: 400, color: material.grey })
  addNode(scene, { x: 550, y: 400, color: material.blueGrey })
  return scene
}

export const scene: Scene = initScene()
