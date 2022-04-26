type Entity = number


type Component<T> = { new(...args: any[]): T }

class Storage<T> {
  lookup: Map<Entity, number>
  data: T[]

  constructor() {
    this.lookup = new Map()
    this.data = []
  }

  get = (entity: Entity): T => {
    const index = this.lookup.get(entity)
    return this.data[index]
  }

  set = (entity: Entity, component: T): void => {
    const index = this.lookup.get(entity)
    this.data[index] = component
  }
}

export class ECS {
  nextEntity: Entity
  storages: Map<Component<any>, Storage<any>>

  constructor() {
    this.nextEntity = 0
    this.storages = new Map()
  }

  createEntity = (): Entity => {
    const entity = this.nextEntity
    ++this.nextEntity
    return entity
  }

  set = (entity: Entity, ...components: any): void => {
    for (const component of components) {
      const Type = component.constructor
      let storage = this.storages.get(Type)
      if (!storage) {
        storage = new Storage()
        this.storages.set(Type, storage)
      }
      storage.set(entity, component)
    }
  }

  get = <T>(entity: Entity, Type: Component<T>): T => {
    const storage = this.storages.get(Type) as Storage<T>
    return storage.get(entity)
  }
}
