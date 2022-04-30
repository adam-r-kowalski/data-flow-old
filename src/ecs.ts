type Component<T> = { new(...args: any[]): T }

class Storage<T> {
  lookup: Map<number, number>
  data: T[]

  constructor() {
    this.lookup = new Map()
    this.data = []
  }

  get = (entity: Entity): T => {
    const index = this.lookup.get(entity.id)
    return this.data[index]
  }

  set = (entity: Entity, component: T): void => {
    const index = this.lookup.get(entity.id)
    if (index) {
      this.data[index] = component
      return
    }
    this.lookup.set(entity.id, this.data.length)
    this.data.push(component)
  }
}

export class Entity {
  id: number
  ecs: ECS

  constructor(id: number, ecs: ECS) {
    this.id = id
    this.ecs = ecs
  }

  set = (...components: any): void => {
    for (const component of components) {
      const Type = component.constructor
      let storage = this.ecs.storages.get(Type)
      if (!storage) {
        storage = new Storage()
        this.ecs.storages.set(Type, storage)
      }
      storage.set(this, component)
    }
  }

  get = <T>(Type: Component<T>): T => {
    const storage = this.ecs.storages.get(Type) as Storage<T>
    return storage.get(this)
  }
}

export class ECS {
  nextEntityId: number
  storages: Map<Component<any>, Storage<any>>

  constructor() {
    this.nextEntityId = 0
    this.storages = new Map()
  }

  entity = (...components: any): Entity => {
    const entity = new Entity(this.nextEntityId, this)
    entity.set(...components)
    ++this.nextEntityId
    return entity
  }
}
