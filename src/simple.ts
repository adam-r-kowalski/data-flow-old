import { Scene, addNode } from './scene'

const initScene = (): Scene => {
  const scene: Scene = {
    vertices: [],
    colors: [],
    triangles: 0
  }
  addNode(scene, { x: 100, y: 100 })
  addNode(scene, { x: 200, y: 300 })
  return scene
}

export const scene: Scene = initScene()
