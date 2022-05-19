import { Entity } from './ecs'

export class UI { constructor(public entity: Entity) { } }

export class Width { constructor(public pixels: number) { } }
export class Height { constructor(public pixels: number) { } }

export class Top { constructor(public pixels: number) { } }
export class Right { constructor(public pixels: number) { } }
export class Bottom { constructor(public pixels: number) { } }
export class Left { constructor(public pixels: number) { } }

export interface Hsla {
  h: number
  s: number
  l: number
  a: number
}

export class BackgroundColor {
  h: number
  s: number
  l: number
  a: number

  constructor({ h, s, l, a }: Hsla) {
    this.h = h
    this.s = s
    this.l = l
    this.a = a
  }
}

export class Children { constructor(public entities: Entity[]) { } }
export class VerticalStack { constructor(public entities: Entity[]) { } }
export class VerticalStackAnalyzed { }
export class HorizontalStack { constructor(public entities: Entity[]) { } }
export class HorizontalStackAnalyzed { }

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export class ComputedRectangle {
  x: number
  y: number
  width: number
  height: number

  constructor({ x, y, width, height }: Rectangle) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

export class Layers {
  stack: Entity[][]

  constructor() {
    this.stack = []
  }

  push = (layer: number, entity: Entity): void => {
    const needed_layers = layer + 1 - this.stack.length
    for (let i = 0; i < needed_layers; ++i) {
      this.stack.push([])
    }
    this.stack[layer].push(entity)
  }
}

export interface Size {
  width: number
  height: number
}

interface RendererInterface {
  getSize: () => Size
  setSize: (Size) => void
  clear: () => void
  drawRectangle: (Rectangle, Hsla) => void
  flush: () => void
}

export class Renderer {
  constructor(public renderer: RendererInterface) { }

  getSize = () => this.renderer.getSize()

  setSize = (size: Size) => this.renderer.setSize(size)

  clear = (): void => { this.renderer.clear() }

  drawRectangle = (rect: Rectangle, color: Hsla): void => {
    this.renderer.drawRectangle(rect, color)
  }

  flush = (): void => { this.renderer.flush() }
}
