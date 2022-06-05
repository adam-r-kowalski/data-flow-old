type Component<T> = { new(...args: any[]): T }

class Storage<T> {
  lookup: Map<number, number>
  data: T[]
  inverses: number[]

  constructor() {
    this.clear()
  }

  get = (entity: Entity): T | undefined => {
    const index = this.lookup.get(entity.id)
    return index != undefined ? this.data[index] : undefined
  }

  hasId = (id: number): boolean => {
    return this.lookup.has(id)
  }

  set = (entity: Entity, component: T): void => {
    const index = this.lookup.get(entity.id)
    if (index) {
      this.data[index] = component
      this.inverses[index] = entity.id
      return
    }
    this.lookup.set(entity.id, this.data.length)
    this.data.push(component)
    this.inverses.push(entity.id)
  }

  clear = (): void => {
    this.lookup = new Map()
    this.data = []
    this.inverses = []
  }
}

export class Entity {
  constructor(public id: number, public ecs: ECS) { }

  set = (...components: any): Entity => {
    for (const component of components) {
      const Type = component.constructor
      let storage = this.ecs.storages.get(Type)
      if (!storage) {
        storage = new Storage()
        this.ecs.storages.set(Type, storage)
      }
      storage.set(this, component)
    }
    return this
  }

  get = <T>(Type: Component<T>): Readonly<T> | undefined => {
    const storage = this.ecs.storages.get(Type)
    return storage ? storage.get(this) : undefined
  }

  update = <T>(Type: Component<T>, f: (_: T) => void): void => {
    const storage = this.ecs.storages.get(Type)
    if (!storage) return
    const component = storage.get(this)
    if (!component) return
    f(component)
  }
}

export class ECS {
  nextEntityId: number
  storages: Map<Component<any>, Storage<any>>
  resources: Map<Component<any>, any>

  constructor() {
    this.nextEntityId = 0
    this.storages = new Map()
    this.resources = new Map()
  }

  entity = (...components: any): Entity => {
    const entity = new Entity(this.nextEntityId, this)
    entity.set(...components)
    ++this.nextEntityId
    return entity
  }

  query = function* (...components: any): Generator<Entity> {
    const primary = this.storages.get(components[0])
    if (!primary) return
    const secondary = components.slice(1).map(s => this.storages.get(s))
    for (const id of primary.inverses) {
      if (secondary.every(storage => storage.hasId(id))) {
        yield new Entity(id, this)
      }
    }
  }

  set = <T>(...components: any): void => {
    for (const component of components) {
      const Type = component.constructor
      this.resources.set(Type, component)
    }
  }

  get = <T>(Type: Component<T>): T | undefined => {
    return this.resources.get(Type)
  }

  unsetAll = <T>(Type: Component<T>): void => {
    const storage = this.storages.get(Type)
    if (!storage) return
    storage.clear()
  }
}
