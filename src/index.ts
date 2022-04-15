import { initRenderer, render } from './webgl2_renderer'
import { scene } from './simple'

const renderer = initRenderer()
render(renderer, scene)
