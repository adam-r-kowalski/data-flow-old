export interface Scene {
  vertices: number[][]
  colors: number[][]
  triangles: number
}

export const addNode = (scene: Scene, { x, y }: { x: number, y: number }) => {
  const x2 = x + 200
  const y2 = y + 25
  const y3 = y2 + 1
  const y4 = y2 + 75
  const vertices = [
    x, y,
    x2, y,
    x2, y2,
    x, y,
    x, y2,
    x2, y2,

    x, y2,
    x2, y2,
    x2, y3,
    x, y2,
    x, y3,
    x2, y3,

    x, y3,
    x2, y3,
    x2, y4,
    x, y3,
    x, y4,
    x2, y4,
  ]
  scene.vertices.push(vertices)
  scene.colors.push([
    117, 117, 117,
    117, 117, 117,
    117, 117, 117,
    117, 117, 117,
    117, 117, 117,
    117, 117, 117,

    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,

    66, 66, 66,
    66, 66, 66,
    66, 66, 66,
    66, 66, 66,
    66, 66, 66,
    66, 66, 66,
  ])
  scene.triangles += vertices.length / 2
}
