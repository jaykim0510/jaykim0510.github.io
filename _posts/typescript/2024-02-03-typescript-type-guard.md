---
layout: post
title:  '[Typescript] 타입 가드'
description: 타입 가드를 이용해 타입을 제한하는 방법을 배운다
date:   2024-02-03 15:01:35 +0300
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

# 타입 가드

- 올 수 있는 타입이 여러 가지가 될 수 있는 상황에서 **타입을 제한시키는 것**을 의미한다
- (정확히 한 가지로 제한할 수도 있고, 예를 들어 '`flying` 속성을 가지는 객체 타입'처럼 몇가지로 축약 제한할 수도 있다)




## typeof

- 타입스크립트에서 `typeof` 연산자는 다음중 하나로 타입을 제한할 수 있다
- `string`, `number`, `bigint`, `boolean`, `symbol`, `undefined`, `object`, `function`

```ts
// 배열 string[] 을 typeof 연산자 결과는 object 이다 (배열도 객체이므로)
const myFunc = (x: string | string[]) => {
    if (typeof x === 'string') {
        console.log(x.length)
    } else if (typeof x === 'object') {
        console.log(x.join(', '))
    }
}
```

- `typeof` 연산자를 이용한 타입 가드에는 한계점이 있다. 객체는 모두 `object` 타입으로 간주하기 때문에 객체간의 구분이 불가능하다

```ts
class MyObject {
    message: string

    constructor(message: string) {
        this.message = message
    }
}

// MyObject, string[] 둘 다 typeof 연산자의 결과가 object이기 때문에 구분이 안된다
const myFunc = (x: MyObject | string[]) => {
    if (typeof x === 'object') {
        console.log(x.message)
    }
}
```

- 이럴 때는 `instanceof` 를 사용하면 된다

## instanceof

- `instanceof` 연산자는 좌변의 타입을 좌변 객체의 프로토타입 체인이 우변의 프로토타입을 포함하는 타입으로 제한할 수 있다
- `object` 타입간에도 구분이 가능해진다
- `instanceof` 체크는 런타임에 일어난다. 그래서 우변의 값이 자바스크립트로 변환된 후에도 살아있어야 한다 (`type` 연산자로 정의하면 런타임에 사라진다)

```ts
class MyObject {
    message: string

    constructor(message: string) {
        this.message = message
    }
}

// 이렇게 정의하면 에러남. instanceof 연산자는 런타임에 체크하기 때문에
// type MyObject = {
//     message: string
// }

const myFunc = (x: MyObject | string[]) => {
    if (x instanceof MyObject) {
        console.log(x.message)
    } else {
        console.log(x.length)
    }
}

```

- 클래스(`class`) 말고 타입(`type`)을 쓰고 싶다면 `in` 연산자를 사용하면 된다

```ts
type MyObject = {
    message: string
}

const myFunc = (x: MyObject | string[]) => {
    if ('message' in x) {
        console.log(x.message)
    }
}
```

## in

- 어떤 타입의 객체 또는 그 프로토타입 체인이 특정 속성을 가지는 타입으로 제한한다

```ts
type MyObject = {
    message: string
}

const myFunc = (x: MyObject | string[]) => {
    if ('message' in x) {
        console.log(x.message)
    }
}
```

## 동등 연산자

- `===`, `!==`, `==`, `!=` 연산자를 이용해 타입을 제한한다
- 자바스크립트에서 `typeof null`은 `'object'`이다. 그래서 `null`을 구분할 때도 유용하다

```ts
type Hyundai = {
    brand: 'Hyundai'
    hyundaiVelocity: number
}

type Tesla = {
    brand: 'Tesla'
    teslaVelocity: number
}


const myFunc = (car: Hyundai | Tesla) => {
    if (car.brand == 'Hyundai') {
        console.log(car.hyundaiVelocity)
    } else if (car.brand == 'Tesla') {
        console.log(car.teslaVelocity)
    }
}

const myCar: Hyundai = { brand: 'Hyundai', hyundaiVelocity: 100 }
myFunc(myCar)
```


## 사용자 정의 타입 가드

- 커스텀 타입, 인터페이스 등의 복잡한 타입은 `typeof`, `instanceof` 등을 활용하기 어렵다
- 이때 사용자 정의 타입 가드를 사용하면 좋다


```ts
// 사용자 정의 타입 가드
const isTesla = (car: Hyundai | Tesla): car is Tesla => {
    return car.brand == 'Tesla'
}

const myFunc = (car: Hyundai | Tesla) => {
    if ( isTesla(car) ) {
        console.log(car.teslaVelocity)
    } else {
        console.log(car.hyundaiVelocity)
    }
}
```


# 참고

- [Typescript Deep Dive](https://radlohead.gitbook.io/typescript-deep-dive/type-system/typeguard#null-undefined-strictnullchecks)
- [[TypeScript] 타입 가드 (Type Guard), SO's CODE](https://seokzin.tistory.com/entry/TypeScript-%ED%83%80%EC%9E%85-%EA%B0%80%EB%93%9C-Type-Guard#--%--%EC%--%AC%EC%-A%A-%EC%-E%--%--%EC%A-%--%EC%-D%--%--%ED%--%--%EC%-E%--%--%EA%B-%--%EB%--%-C)