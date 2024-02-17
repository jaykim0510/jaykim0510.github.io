---
layout: post
title:  '[Typescript] 유틸리티 타입'
description: 
date:   2024-02-06 15:01:35 +0300
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

# Utility Type

- 유틸리티 타입은 기존 타입을 변환하여 새로운 타입을 만드는데 유용한 기능을 제공한다

# Partial

- 파셜(Partial) 타입은 기존 타입의 모든 가능한 부분집합을 의미하는 타입이다
- 기존 타입의 모든 프로퍼티를 옵셔널(optional)로 만든다

```ts
type User = {
    name: string
    age: number
    address: string
}

type UpdateUser = Partial<User>


let updateBody: UpdateUser

updateBody = {} // OK
updateBody = { name: 'Kim' } // OK
updateBody = { name: 'Lee', age: 20, address: 'Seoul' } // OK
updateBody = { foo: 'bar' } // Error
```

# Pick

- 픽(Pick) 타입은 기존 타입의 특정 속성만 명시적으로 골라 정의한 새로운 타입이다

```ts
type User = {
    name: string
    age: number
    address: string
}

type UpdateUser = Pick<User, 'age' | 'address'>


let updateBody: UpdateUser

updateBody = {} // Error
updateBody = { name: 'Kim' } // Error
updateBody = { age: 20, address: 'Seoul' } // OK
```

# Omit

- 오밋(Omit) 타입은 기존 타입의 특정 속성만 명시적으로 제외한 타입이다

```ts
type User = {
    name: string
    age: number
    address: string
}

type UpdateUser = Omit<User, 'name'>


let updateBody: UpdateUser

updateBody = {} // Error
updateBody = { name: 'Kim' } // Error
updateBody = { age: 20, address: 'Seoul' } // OK
```

# Record

- 키와 값의 타입을 정의한 객체를 의미하는 타입이다

```ts
const user: Record<string, string> = { name: 'Kim', address: 'Seoul' }
```

```ts
type UserKey = 'name' | 'age' | 'address'
type UserValue = string | number

const user: Record<UserKey, UserValue> = { name: 'Kim', age: 19, address: 'Seoul' }
```

# Await