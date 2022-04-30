export default {
  title: "Rectangle",
}

export const Primary = () => {
  const gl_canvas: HTMLCanvasElement = document.createElement('canvas')
  gl_canvas.style.width = '100%'
  gl_canvas.style.height = '100%'
  gl_canvas.style.position = 'absolute'
  const gl = gl_canvas.getContext('webgl2')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  return gl_canvas
}

