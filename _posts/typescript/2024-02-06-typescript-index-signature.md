---
layout: post
title:  '[Typescript] Index signature'
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


# 인덱스 시그니처란

- 객체타입의 프로퍼티에 가능한 타입을 나타내는것을 의미한다
- 정확한 프로퍼티의 이름을 미리 알 수 없는 경우 유용하다

# 인덱스 시그니처 사용하기

- 다음과 같이 `UserType`을 인덱스 시그니처를 이용해 정의하면, 키가 문자열, 값도 문자열로 하는 어떤 프로퍼티도 올 수 있다는 의미다

```ts
type UserType = {
    [key: string]: string
}

const user: UserType = {
    name: 'Mike',
    address: 'Seoul'
}

const userTwo: UserType = {
    name: 'Carl',
    address: 'LA',
    job: 'engineer'
}
```

- 값의 타입은 자유롭게 쓸 수 있다

```ts
type UserType = {
    [key: string]: string | number
}

const userThree: UserType = {
    name: 'Jack',
    address: 'New York',
    job: 'engineer',
    age: 25
}
```

- 인덱스 시그니처의 키 타입은 제한적이다
- `string`, `number`, `symbol`, template literal 그리고 이들의 유니언 타입만 가능하다
- template literal 쓸 때는 mapped types 방식을 써야 한다 (`in` 사용)

```ts
[key: string]: string // O
[key: string | number]: string // O

[key: 'name']: string // X
[key: in 'name']: string // O
[key: in 'name' | 'address']: string // O
```

# 인덱스 시그니처 사용 예시

```ts
const obj = {
    foo: "hello",
}
```

- 위의 `obj` 객체에서 `foo` 키의 타입은 `string`이 아니고 문자열 리터럴 `'foo'`이다
- 타입스크립트에서는 `string` 타입의 키를 이용한 객체 접근을 허용하지 않는다

```ts
const literalFoo = "foo"
const stringFoo: string = "foo"

console.log(obj[literalFoo]) // OK
console.log(obj[stringFoo]) // Error
```

- 다음과 같은 `for...of`문을 이용한 객체접근도 같은 이유로 컴파일 에러가 난다

```ts
for (let key of Object.keys(obj)) {
    console.log(obj[key]) // Error
}
```

- 이럴 때 인덱스 시그니처를 사용할 수 있다
- 인덱스 시그니처의 이름은 마음대로 표기해도 된다 (ex. index, idx, key 등)

```ts
type ObjType = {
    [idx: string]: string
    foo: string
    bar: string
}
  
const obj: ObjType = {
    foo: "hello",
    bar: "world",
}

for (let key of Object.keys(obj)) {
    console.log(obj[key]) // OK
}
```


# 참고

- [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- [Harry Park's Blog](https://soopdop.github.io/2020/12/01/index-signatures-in-typescript/)