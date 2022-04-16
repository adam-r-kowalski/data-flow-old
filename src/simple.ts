import Scene from './scene'
import { material } from './color'

const scene = new Scene()
scene.addNode({ x: 50, y: 100, color: material.red })
scene.addNode({ x: 300, y: 100, color: material.pink })
scene.addNode({ x: 550, y: 100, color: material.purple })
scene.addNode({ x: 800, y: 100, color: material.deepPurple })
scene.addNode({ x: 1050, y: 100, color: material.indigo })
scene.addNode({ x: 50, y: 250, color: material.blue })
scene.addNode({ x: 300, y: 250, color: material.lightBlue })
scene.addNode({ x: 550, y: 250, color: material.cyan })
scene.addNode({ x: 800, y: 250, color: material.teal })
scene.addNode({ x: 1050, y: 250, color: material.green })
scene.addNode({ x: 50, y: 400, color: material.brown })
scene.addNode({ x: 300, y: 400, color: material.grey })
scene.addNode({ x: 550, y: 400, color: material.blueGrey })

export default scene
