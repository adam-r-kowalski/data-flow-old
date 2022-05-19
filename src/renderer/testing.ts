import * as components from '../components'

export class Testing {
  size: components.Size

  constructor(size: components.Size) {
    this.size = size
  }

  getSize = (): components.Size => this.size

  setSize = (size: components.Size): void => { this.size = size }

  clear = (): void => { }

  drawRectangle = (rect: components.Rectangle, color: components.Hsla): void => { }

  flush = (): void => { }
}
