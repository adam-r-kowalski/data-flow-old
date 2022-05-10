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

type OnChange = (entity: Entity) => void

class BulkUpdate {
  constructor(
    public entity: Entity,
    public handlers: Map<Component<any>, (any) => void>
  ) { }

  update = <T>(Type: Component<T>, f: (T) => void): BulkUpdate => {
    this.handlers.set(Type, f)
    return this
  }

  dispatch = (): void => {
    const handlers = new Set<(Entity) => void>()
    for (const [Type, handler] of this.handlers) {
      const storage = this.entity.ecs.storages.get(Type)
      if (!storage) continue
      const component = storage.get(this.entity)
      if (!component) continue
      handler(component)
      const typeHandlers = this.entity.ecs.subscriptions.get(Type)
      if (!typeHandlers) continue
      for (const handler of typeHandlers) handlers.add(handler)
    }
    for (const handler of handlers) handler(this.entity)
  }
}

export class Entity {
  constructor(public id: number, public ecs: ECS) { }

  set = (...components: any): Entity => {
    const handlers = new Set<OnChange>()
    for (const component of components) {
      const Type = component.constructor
      const typeHandlers = this.ecs.subscriptions.get(Type)
      if (typeHandlers) {
        for (const handler of typeHandlers) {
          handlers.add(handler)
        }
      }
      let storage = this.ecs.storages.get(Type)
      if (!storage) {
        storage = new Storage()
        this.ecs.storages.set(Type, storage)
      }
      storage.set(this, component)
    }
    for (const handler of handlers) handler(this)
    return this
  }

  get = <T>(Type: Component<T>): Readonly<T> | undefined => {
    const storage = this.ecs.storages.get(Type)
    return storage ? storage.get(this) : undefined
  }

  update = <T>(Type: Component<T>, f: (c: T) => void): Entity => {
    const storage = this.ecs.storages.get(Type) as Storage<T>
    if (!storage) return this
    const component = storage.get(this)
    if (!component) return this
    f(component)
    const handlers = this.ecs.subscriptions.get(Type)
    if (!handlers) return this
    for (const handler of handlers) handler(this)
    return this
  }

  bulkUpdate = <T>(Type: Component<T>, f: (c: T) => void): BulkUpdate => {
    const handlers = new Map()
    handlers.set(Type, f)
    return new BulkUpdate(this, handlers)
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

  onChange = (Type: Component<any>, handler: OnChange): void => {
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
