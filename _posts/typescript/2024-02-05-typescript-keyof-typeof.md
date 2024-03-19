---
layout: post
title:  '[Typescript] keyof / typeof / indexed access type / mapped types'
description: 
date:   2024-02-05 15:01:35 +0300
image:  '/images/typescript_logo.png'
logo_image: '/images/typescript_logo.png'
category: language
tag: typescript
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# keyof

- 객체타입의 키(key)값으로 이루어진 유니언 타입을 반환한다

```ts
interface Car {
    brand: string
    color: string
}

type CarPropertiesType = keyof Car // 'brand' | 'color'

const brand: CarPropertiesType = 'brand'
const color: CarPropertiesType = 'color'
```


# typeof

- 피연산자의 타입을 반환한다

```ts
const car: Car = { brand: 'Tesla', color: 'red' }

typeof car // 'object'
```


# Indexed Access Type

- 다른 객체 타입의 프로퍼티의 타입을 타입화하는 것을 말한다

```ts
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"]; // number
type AgeOrName = Person["age"| "name"]; // number | string
type KeyofPerson = Person[keyof Person]; // number | string | boolean
```

# Mapped Types

- 다른 타입의 속성을 순회하여 새로운 타입을 만드는 것을 말한다
- 맵드 타입에서 `in`은 마치 자바스크립트의 `for in` 문법과 유사하게 동작한다

- 아래의 예제를 보면, `key`에는 제네릭 타입 `T`의 키를 순회하며 `name`, `age`, `address`가 하나씩 들어간다

```ts
type User = {
    name: string
    age: number
    address: string
}

type UpdateUser<T> = {
    [key in keyof T]?: T[key]
}

let updateBody: UpdateUser<User>

updateBody = {}
updateBody = { name: 'Park' }
```

- 위에서는 옵셔널 연산자(`?`)를 붙여줌으로써 새로운 `UpdateUser` 라는 새로운 타입을 정의했다
- 반대로 옵셔널 연산자를 제거할 수도 있다. `-`를 붙여주면 해당 연산자를 제거한다는 의미가 된다

```ts
type RequiredUser<T> = {
    [key in keyof T]-?: T[key]
}

let requiredUser: RequiredUser<UpdateUser<User>>

requiredUser = { name: 'Lee', age: 24, address: 'LA' }
```