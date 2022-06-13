import * as Studio from '../src/studio'

test("create entity", () => {
  const ecs = new Studio.ECS()
  expect(ecs.entity().id).toEqual(0)
  expect(ecs.entity().id).toEqual(1)
})

test("set and get component", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new Studio.ECS()
  const joe = ecs.entity()
  joe.set(new Name("Joe"))
  expect(joe.get(Name)!.value).toEqual("Joe")
})

test("set and get component on two entities", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new Studio.ECS()
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

  const ecs = new Studio.ECS()
  const joe = ecs.entity(new Name("Joe"))
  expect(joe.get(Name)!.value).toEqual("Joe")
})

test("set component twice", () => {
  class Name {
    constructor(public value: string) { }
  }

  const ecs = new Studio.ECS()
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

  const ecs = new Studio.ECS()
  const joe = ecs.entity(new Name("Joe"), new Age(25))
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(joe.get(Age)!.value).toEqual(25)
})

test("update components", () => {
  class Age {
    constructor(public value: number) { }
  }

  const ecs = new Studio.ECS()
  const joe = ecs.entity(new Age(25))
  expect(joe.get(Age)!.value).toEqual(25)
  joe.update(Age, age => age.value += 1)
  expect(joe.get(Age)!.value).toEqual(26)
})

test("unset all components", () => {
  class Name {
    constructor(public value: string) { }
  }

  class Age {
    constructor(public value: number) { }
  }

  const ecs = new Studio.ECS()
  const joe = ecs.entity(new Name("Joe"), new Age(25))
  const betty = ecs.entity(new Name("Betty"), new Age(23))
  ecs.unsetAll(Age)
  expect(joe.get(Name)!.value).toEqual("Joe")
  expect(joe.get(Age)).toBeUndefined()
  expect(betty.get(Name)!.value).toEqual("Betty")
  expect(betty.get(Age)).toBeUndefined()
})

test("set and get resource", () => {
  class Score {
    constructor(public value: number) { }
  }

  const ecs = new Studio.ECS()
  expect(ecs.get(Score)).toEqual(undefined)
  ecs.set(new Score(10))
  expect(ecs.get(Score)!.value).toEqual(10)
  ecs.set(new Score(20))
  expect(ecs.get(Score)!.value).toEqual(20)
})
