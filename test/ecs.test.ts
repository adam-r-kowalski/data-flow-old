import { ECS } from '../src/ecs'

test("create entity", () => {
  const ecs = new ECS()
  expect(ecs.entity().id).toEqual(0)
  expect(ecs.entity().id).toEqual(1)
})

test("set and get component", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity()
  joe.set(new Name("Joe"))
  expect(joe.get(Name).value).toEqual("Joe")
})

test("set and get component on two entities", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity()
  const bob = ecs.entity()
  joe.set(new Name("Joe"))
  bob.set(new Name("Bob"))
  expect(joe.get(Name).value).toEqual("Joe")
  expect(bob.get(Name).value).toEqual("Bob")
})

test("set and get component with constructor", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity(new Name("Joe"))
  expect(joe.get(Name).value).toEqual("Joe")
})

test("set component twice", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity(new Name("Joe"))
  expect(joe.get(Name).value).toEqual("Joe")
  joe.set(new Name("Joeseph"))
  expect(joe.get(Name).value).toEqual("Joeseph")
})

test("set two components", () => {
  class Name {
    constructor(public value: string) { }
  }

  class Age {
    constructor(public value: number) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity(new Name("Joe"), new Age(25))
  expect(joe.get(Name).value).toEqual("Joe")
  expect(joe.get(Age).value).toEqual(25)
})


test("query entities with component", () => {
  class Name {
    constructor(public value: string) { }
  }

  class Age {
    constructor(public value: number) { }
  }

  const ecs = new ECS()
  const entity0 = ecs.entity(new Name("Joe"))
  const entity1 = ecs.entity(new Name("Sally"), new Age(20))
  const entity2 = ecs.entity(new Age(22))
  expect(ecs.query(Name).map(entity => entity.id)).toEqual([0, 1])
  expect(ecs.query(Name, Age).map(entity => entity.id)).toEqual([1])
})
