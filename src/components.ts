import { Entity } from './ecs'

export class UI { }

export class ActiveUI { constructor(public entity: Entity) { } }

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
