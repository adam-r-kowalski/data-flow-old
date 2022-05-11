type Component<T> = { new(...args: any[]): T }

class Storage<T> {
  lookup: Map<number, number>
  data: T[]
  inverses: number[]

  constructor() {
    this.lookup = new Map()
    this.data = []
    this.inverses = []
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
}
export class ComponentMap {
  components: Map<Component<any>, any>

  constructor() {
    this.components = new Map<Component<any>, any>()
  }

  set = <T>(Type: Component<T>, component: T): void => {
    this.components.set(Type, component)
  }

  get = <T>(Type: Component<T>): T | undefined =>
    this.components.get(Type)
}

export interface ChangeData {
  entity: Entity
  newValues: ComponentMap
  oldValues: ComponentMap
}

type OnChange = (data: ChangeData) => void

export class Entity {
  constructor(public id: number, public ecs: ECS) { }

  set = (...components: any): Entity => {
    const allHandlers = new Set<OnChange>()
    const oldValues = new ComponentMap()
    const newValues = new ComponentMap()
    for (const component of components) {
      const Type = component.constructor
      newValues.set(Type, component)
      let storage = this.ecs.storages.get(Type)
      if (storage) {
        const old = storage.get(this)
        if (old) oldValues.set(Type, old)
      }
      else {
        storage = new Storage()
        this.ecs.storages.set(Type, storage)
      }
      storage.set(this, component)
      const handlers = this.ecs.subscriptions.get(Type)
      if (handlers) for (const handler of handlers) allHandlers.add(handler)
    }
    for (const handler of allHandlers) {
      handler({ entity: this, newValues, oldValues })
    }
    return this
  }

  get = <T>(Type: Component<T>): Readonly<T> | undefined => {
    const storage = this.ecs.storages.get(Type)
    return storage ? storage.get(this) : undefined
  }
}

export class ECS {
  nextEntityId: number
  storages: Map<Component<any>, Storage<any>>
  resources: Map<Component<any>, any>
  subscriptions: Map<Component<any>, Set<OnChange>>

  constructor() {
    this.nextEntityId = 0
    this.storages = new Map()
    this.resources = new Map()
    this.subscriptions = new Map()
  }

  entity = (...components: any): Entity => {
    const entity = new Entity(this.nextEntityId, this)
    entity.set(...components)
    ++this.nextEntityId
    return entity
  }

  query = function*(...components: any): Generator<Entity> {
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

  onChange = <T>(Type: Component<T>, handler: OnChange): void => {
    const handlers = this.subscriptions.get(Type)
    if (handlers) handlers.add(handler)
    else this.subscriptions.set(Type, new Set([handler]))
  }

  onAnyChange = (Types: Component<any>[], handler: OnChange): void => {
    for (const Type of Types) {
      this.onChange(Type, handler)
    }
  }
}
