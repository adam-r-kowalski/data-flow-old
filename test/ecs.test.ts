import { ECS, Entity } from '../src/ecs'

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
  expect(joe.get(Name)!.value).toEqual("Joe")
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
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(bob.get(Name)!.value).toEqual("Bob")
})

test("set and get component with constructor", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity(new Name("Joe"))
  expect(joe.get(Name)!.value).toEqual("Joe")
})

test("set component twice", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity(new Name("Joe"))
  expect(joe.get(Name)!.value).toEqual("Joe")
  joe.set(new Name("Joeseph"))
  expect(joe.get(Name)!.value).toEqual("Joeseph")
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
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(joe.get(Age)!.value).toEqual(25)
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
  expect([...ecs.query(Name)].map(entity => entity.id)).toEqual([0, 1])
  expect([...ecs.query(Name, Age)].map(entity => entity.id)).toEqual([1])
})

test("set and get resource", () => {
  class Score {
    constructor(public value: number) { }
  }

  const ecs = new ECS()
  expect(ecs.get(Score)).toEqual(undefined)
  ecs.set(new Score(10))
  expect(ecs.get(Score)!.value).toEqual(10)
  ecs.set(new Score(20))
  expect(ecs.get(Score)!.value).toEqual(20)
})

test("update component", () => {
  class Name {
    constructor(public value: string) { }
  }

  class Age {
    constructor(public value: number) { }
  }

  const ecs = new ECS()
  const joe = ecs.entity()
  joe.set(new Name("Joe"), new Age(20))
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(joe.get(Age)!.value).toEqual(20)
  joe.update(Age, age => age.value += 1)
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(joe.get(Age)!.value).toEqual(21)
})

test("on change", () => {
  class X {
    constructor(public value: number) { }
  }

  class X2 {
    constructor(public value: number) { }
  }

  const ecs = new ECS()
  const entity = ecs.entity()
  expect(entity.get(X)).toBeUndefined()
  expect(entity.get(X2)).toBeUndefined()
  ecs.onChange(X, entity => {
    const x = entity.get(X)!.value
    entity.set(new X2(x * x))
  })
  entity.set(new X(4))
  expect(entity.get(X2)!.value).toBe(16)
  entity.set(new X(5))
  expect(entity.get(X2)!.value).toBe(25)
  entity.update(X, x => x.value += 1)
  expect(entity.get(X2)!.value).toBe(36)
})

test("on change fires once when setting multiple components", () => {
  class X { constructor(public value: number) { } }
  class Y { constructor(public value: number) { } }
  class Z { constructor(public value: number) { } }
  const ecs = new ECS()
  const entity = ecs.entity()
  let count = 0
  const handler = () => count += 1
  ecs.onChange(X, handler)
  ecs.onChange(Y, handler)
  ecs.onChange(Z, handler)
  entity.set(new X(1), new Y(1), new Z(1))
  expect(count).toEqual(1)
})

test("on change fires once per update", () => {
  class X { constructor(public value: number) { } }
  class Y { constructor(public value: number) { } }
  class Z { constructor(public value: number) { } }
  const ecs = new ECS()
  const entity = ecs.entity()
  let count = 0
  const handler = () => count += 1
  entity.set(new X(1), new Y(1), new Z(1))
  ecs.onChange(X, handler)
  ecs.onChange(Y, handler)
  ecs.onChange(Z, handler)
  entity.update(X, x => x.value += 1)
  entity.update(Y, y => y.value += 1)
  entity.update(Z, z => z.value += 1)
  expect(count).toEqual(3)
})

test("on change fires once per bulk update", () => {
  class X { constructor(public value: number) { } }
  class Y { constructor(public value: number) { } }
  class Z { constructor(public value: number) { } }
  const ecs = new ECS()
  const entity = ecs.entity()
  let count = 0
  const handler = () => count += 1
  entity.set(new X(1), new Y(1), new Z(1))
  ecs.onChange(X, handler)
  ecs.onChange(Y, handler)
  ecs.onChange(Z, handler)
  entity.bulkUpdate(X, x => x.value += 1)
    .update(Y, y => y.value += 2)
    .update(Z, z => z.value += 3)
    .dispatch()
  expect(count).toEqual(1)
  expect(entity.get(X)!.value).toEqual(2)
  expect(entity.get(Y)!.value).toEqual(3)
  expect(entity.get(Z)!.value).toEqual(4)
})
