import { ECS, Entity } from '../ecs'
import * as components from '../components'

const computeX = (parentRect: components.Rectangle, entity: Entity, width: number): number => {
  const left = entity.get(components.Left)
  if (left) return parentRect.x + left.pixels
  const right = entity.get(components.Right)!.pixels
  return parentRect.x + parentRect.width - width - right
}

const computeY = (parentRect: components.Rectangle, entity: Entity, height: number): number => {
  const top = entity.get(components.Top)
  if (top) return parentRect.y + top.pixels
  const bottom = entity.get(components.Bottom)!.pixels
  return parentRect.y + parentRect.height - height - bottom
}

const explicitWidthAndHeight = (parentRect: components.Rectangle, entity: Entity, width: number): components.Rectangle => {
  const height = entity.get(components.Height)!.pixels
  const x = computeX(parentRect, entity, width)
  const y = computeY(parentRect, entity, height)
  return { x, y, width, height }
}

const implicitWidth = (parentRect: components.Rectangle, entity: Entity, height: number): components.Rectangle => {
  const y = computeY(parentRect, entity, height)
  const right = entity.get(components.Right)!.pixels
  const left = entity.get(components.Left)!.pixels
  const width = parentRect.width - right - left
  const x = left + parentRect.x
  return { x, y, width, height }
}

const implicitHeight = (layers: components.Layers, parentRect: components.Rectangle, entity: Entity, width: number, z: number): components.Rectangle => {
  const x = computeX(parentRect, entity, width)
  const bottom = entity.get(components.Bottom)
  const top = entity.get(components.Top)
  if (bottom && top) {
    const y = top.pixels + parentRect.y
    const height = parentRect.height - bottom.pixels - top.pixels
    return { x, y, width, height }
  }
  entity.set(new components.VerticalStackAnalyzed())
  const y = top ?
    top.pixels + parentRect.y :
    parentRect.y + parentRect.height - bottom!.pixels
  const children = entity.get(components.VerticalStack)!.entities
  let entityHeight = 0
  for (const child of children) {
    const height = child.get(components.Height)!.pixels
    const rect = {
      x,
      y: y + entityHeight,
      width,
      height
    }
    child.set(new components.ComputedRectangle(rect))
    layers.push(z, child)
    entityHeight += height
  }
  if (top) return { x, y, width, height: entityHeight }
  for (const child of children) {
    child.update(components.ComputedRectangle, rect => rect.y -= entityHeight)
  }
  return { x, y: y - entityHeight, width, height: entityHeight }
}

const implicitWidthAndHeight = (layers: components.Layers, parentRect: components.Rectangle, entity: Entity, z: number): components.Rectangle => {
  const top = entity.get(components.Top)!.pixels
  const left = entity.get(components.Left)!.pixels
  const x = left + parentRect.x
  const y = top + parentRect.y
  const right = entity.get(components.Right)
  const bottom = entity.get(components.Bottom)
  if (right && bottom) {
    const height = parentRect.height - bottom.pixels - top
    const width = parentRect.width - right.pixels - left
    return { x, y, width, height }
  }
  entity.set(new components.VerticalStackAnalyzed())
  const children = entity.get(components.VerticalStack)!.entities
  let entityHeight = 0
  let entityWidth = 0
  const needsWidth: Entity[] = []
  for (const child of children) {
    const height = child.get(components.Height)!.pixels
    const width = child.get(components.Width)
    const rect = new components.ComputedRectangle({
      x,
      y: y + entityHeight,
      width: -1,
      height
    })
    entityHeight += height
    if (width) {
      entityWidth = Math.max(entityWidth, width.pixels)
      rect.width = width.pixels
    } else {
      needsWidth.push(child)
    }
    child.set(rect)
    layers.push(z, child)
  }
  for (const child of needsWidth) {
    child.update(components.ComputedRectangle, rect => rect.width = entityWidth)
  }
  return { x, y, width: entityWidth, height: entityHeight }
}

const computeChildrenSize = (layers: components.Layers, parentRect: components.Rectangle, entity: Entity, z: number): void => {
  const children = entity.get(components.Children)
  if (!children) return
  const nextZ = z + 1
  for (const child of children.entities) {
    const width = child.get(components.Width)
    const height = child.get(components.Height)
    const rect = (() => {
      if (!width && !height) return implicitWidthAndHeight(layers, parentRect, child, nextZ)
      if (!width) return implicitWidth(parentRect, child, height!.pixels)
      if (!height) return implicitHeight(layers, parentRect, child, width.pixels, nextZ)
      return explicitWidthAndHeight(parentRect, child, width.pixels)
    })()
    child.set(new components.ComputedRectangle(rect))
    layers.push(z, child)
    computeChildrenSize(layers, rect, child, nextZ)
    computeVerticalStackSize(layers, rect, child, nextZ)
  }
}

const computeVerticalStackSize = (layers: components.Layers, parentRect: components.Rectangle, entity: Entity, z: number): void => {
  if (entity.get(components.VerticalStackAnalyzed)) return
  const children = entity.get(components.VerticalStack)
  if (!children) return
  let offset = 0
  for (const child of children.entities) {
    const height = child.get(components.Height)!.pixels
    const rect = {
      x: parentRect.x,
      y: parentRect.y + offset,
      width: parentRect.width,
      height
    }
    offset += height
    child.set(new components.ComputedRectangle(rect))
    layers.push(z, child)
  }
}

export const computeSize = (ecs: ECS): void => {
  const { width, height } = ecs.get(components.Renderer)!.getSize()
  const parentRect = { x: 0, y: 0, width, height }
  const layers = new components.Layers()
  const ui = ecs.get(components.UI)!.entity
  ui.set(new components.ComputedRectangle(parentRect))
  layers.push(0, ui)
  computeChildrenSize(layers, parentRect, ui, 1)
  computeVerticalStackSize(layers, parentRect, ui, 1)
  ecs.set(layers)
  ecs.unsetAll(components.VerticalStackAnalyzed)
}
