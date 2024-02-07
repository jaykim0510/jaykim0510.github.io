---
layout: post
title:  '[Typescript] 타입 기초편'
description: 타입스크립트에서 타입을 지정하는 방법에 대해 배운다
date:   2024-02-02 15:01:35 +0300
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
# 타입

- <span class='very__important'>타입의 범위는 좁힐수록 좋다</span>
- 타입스크립트 컴파일러는 <span class='very__important'>확실하게 타입을 알 수 있는 경우에는 자동으로 타입을 추론(Type Inference)한다</span>
- 타입은 **변수, 함수의 매개변수, 함수의 반환 값**에 지정한다
- `:`을 이용해 코드에 타입을 정의하는 방식을 타입 표기(Type Annotation)라고 한다

# 기초 타입

- 숫자는 `number`, 문자열은 `string`, 불린은 `boolean` 타입이다

> String, Number, Boolean와 같은 (대문자로 시작하는) 타입은 유효한 타입이지만, 코드상에서 이러한 특수 내장 타입을 사용하는 경우는 극히 드뭅니다. 항상 string, number, boolean 타입을 사용하세요.

## 숫자

- 숫자 타입은 `number`로 표기한다
- 잘 쓰진 않지만 더 구체적으로 표기하기 위해 `3`, `5` 처럼 리터럴로 표기할 수도 있다.

- 아래와 같이 변수 `x`에 `3`을 할당한다고 해보자

```ts
const x = 3;
```

- 여기에 타입을 지정할 필요가 없다. 컴파일러가 `x`의 타입은 `number`이며, 더 정확히는 리터럴 `3`이라는 것을 추론할 수 있기 때문이다

```ts
// 이렇게 표기해도 되지만, 어차피 컴파일러가 타입 추론을 하기 때문에 굳이 이렇게 적을 필요는 없다
const x: 3 = 3;

// 타입은 좁힐수록 좋다는 사실을 생각해보면, 이 방식은 잘못된 방식이다. 리터럴 3으로 추론할 수 있는데 굳이 범위를 number로 넓히는 것은 바람직 하지 않다
const x: number = 3;
```

- `let` 이라는 키워드로 재할당 가능한 변수를 만든 경우에는 타입을 어떻게 지정해야 할까?
- 여기서 자바스크립트에서는 오류가 안나지만, 타입스크립트에서는 오류가 발생하는 부분이 있다

```ts
let count = 0; // number로 추론

// 자바스크립트에서는 이렇게 해도 오류가 생기지 않지만 타입스크립트는 number에 string을 할당했기 때문에 에러가 난다
count = '1'
```

- 반면 아래는 자바스크립트, 타입스크립트에서 모두 오류가 안난다

```ts
let count; // any로 추론

count = 0;
count = '1';
```

- 하지만 이러한 코드는 문맥상으로도 결코 바람직하지 않다. 그래서 최종적으로 아래와 같은 방법으로 코드를 작성하는게 좋다

```ts
let count = 0;

count = 1;

// 또는

let count: number;

count = 0;
count = 1;
```

## 문자열

- 문자열 타입은 `string`으로 표기한다

```ts
const menu = 'chicken'; // 문자열 리터럴 'chicken'으로 타입 추론
let menu = 'chicken'; // 재할당 가능하기 때문에 string으로 타입 추론

let menu; // any로 타입 추론
let menu: string; // string으로 타입 추론
```

## 불린

- 불린 타입은 `boolean`으로 표기한다

```ts
const isGood = true; // 불린 리터럴 true로 타입 추론
let isGood = true; // 재할당 가능하기 때문에 boolean으로 타입 추론

let isGood; // any로 타입 추론
let isGood: boolean; // boolean으로 타입 추론
```

## 배열

- `Array<원소 타입>` (ex. `Array<number>`) 또는 `원소 타입[]` (ex. `number[]`)로 표기한다
- (`<>`는 제네릭 표기법이다)
- (자바스크립트에서 배열을 `typeof` 해도 `object`가 나오지만, 타입스크립트에서는 `object`가 아니다)

```ts
let arr: number[] = [];

arr = [1, 2, 3];
arr.push(4);

arr = ['1', '2', '3']; // 안됨
arr.push('4'); // 안됨
```

## 튜플

- 튜플은 길이가 고정되고 각 요소의 타입이 지정되어 있는 배열이다
- `[첫 번째 요소의 타입, 두 번째 요소의 타입, ...]`(ex. `[string, number]`) 이런식으로 표기한다

```ts
let arr: [string, number];

arr = ['hello', 3];

arr = ['hello']; // 안됨
arr = ['hello', 3, 'foo']; // 안됨
```

# 부가적인 타입

## any

- `any`는 타입 검사를 원하지 않는 경우에 사용한다
- 어떠한 타입의 값을 할당하더라도 에러가 발생하지 않는다
- 코드를 작성하면서 지금 당장 타입을 모르겠으나 당장의 컴파일러 에러를 면하고 싶은 경우, 아니면 정말 어떠한 타입이 와도 상관없는 경우에 사용한다
- 처음에 코드를 작성할 때 `any`로 모두 작성하고, 점진적으로 타입을 지정하는 식으로 개발하기도 한다

```ts
let myVariable: any = 1;

myVariable = 'chicken';

myVariable = true

myVariable = [1, 2, 3]

myVariable.foo() // 이런 잘못된 코드를 사전에 잡아내지 못한다
```

## unknown

- 지금은 타입을 알 수 없지만, 나중에 사용할 때는 반드시 타입을 지정하도록 하고 싶은 경우에 쓴다

```ts
let unknownVar: unknown;

unknownVar = 1; // 이렇게 1을 할당해도 여전히 컴파일러는 타입을 unknown으로 추론한다
unknownVar.toString() // unknown 타입이기 때문에 에러가 난다
```

- 아래와 같은 방법으로 타입을 명확하게 할 수 있다

```ts
let unknownVar: unknown;

unknownVar = 'abc' // 여전히 unknown 타입이다


// 이렇게 타입 가드 방식으로 타입을 명확하게 할 수 있다
if (typeof unknownVar === 'number') {
    unknownVar.toString()
} else if (typeof unknownVar === 'string') {
    unknownVar.length
}


// 또는 as 를 써서 타입을 명확하게 할 수도 있다 (이를 Type Assertion 이라고 함)
(unknownVar as string).length
```

## never

- `never`는 어떠한 값도 올 수 없는 영역으로 집합으로 치면 공집합과 같다
- `'apple'`은 `string` 이라는 영역에 속하고, `15`는 `number` 라는 영역에 속한다. 어떤 영역에도 속할 수 없으면 그 값은 논리적으로 `never` 영역에 속한다

```ts
// foo 함수는 인자로 string 또는 number만 받을 수 있다
// 근데 if 문으로 string을 받고, else if 문으로 number를 받고나면, else 문으로는 갈 수 있는 값이 없다
// 이러한 영역에 존재하는 값의 타입을 never라고 한다

function foo(param:string | number){
    if (typeof param==='string') {
        console.log("문자열입니다.");
    }
    else if (typeof param==='number') {
        console.log("숫자입니다.");
    }
    else {
        ...
    }
}
```

- `never`가 필요한 이유는 무엇일까?

- 어떤 값도 올 수 없게 막아놓는 역할을 할 수 있다

```ts
type Car = {
    runningVelocity: number
    flyingVelocity?: never // flyingVelocity 라는 값을 못 가지도록 막아놓는다
}

type Airplane = {
    flyingVelocity: number
    runningVelocity?: never // runningVelocity 라는 값을 못 가지도록 막아놓는다
}

let vehicle: Car | Airplane

vehicle = {
    runningVelocity: 250,
    // flyingVelocity: 300
}

vehicle = {
    // runningVelocity: 250,
    flyingVelocity: 300
}
```


- 어떤 값도 절대 반환할 수 없음을 의미하는 역할을 할 수 있다

```js
// 이 함수는 뭔가를 반환하기도 전에 에러를 던진다
// --> 뭔가를 절대 반환할 수 없다
// --> 이럴 때 리턴 타입으로 never를 쓸 수 있다
// (아래와 같이 표현식으로 나타내면 컴파일러가 알아서 never를 추론한다)
// (선언문으로 나타내면 컴파일러가 void로 추론한다 이럴 때는 명시적으로 never를 표기해주는게 좋다)
const returnErrorFunc = () => {
    throw new Error('error!')
}

// 이 함수는 뭔가를 반환하지 못하고 평생 반복문을 돈다
// 이런 함수의 리턴 타입도 never에 해당한다
const infiniteLoopFunc = () => {
    while (true) {
        const x = 1;
    }
}
```

## void

- 함수가 반환하는 값이 없음을 의미한다

```ts
// 아래의 두 함수는 모두 컴파일러가 리턴 타입으로 void를 추론한다
// 자바스크립트는 리턴 타입을 undefined로 간주한다
const returnVoidFunc = () => {
    return
}

const returnVoidFunc = () => {

}
```

# 집합 연산자를 통해 확장된 새로운 타입

## union

- 제시한 타입중 하나 이상의 타입을 만족하는 타입을 나타낸다
- 파이프(`|`) 기호를 이용해 표시한다 (ex. `const myFavoriteCar = Hyundai | BMW | Tesla`)

```ts
type Hyundai = {
    hyundaiThing: 'hyundai'
}

type Tesla = {
    teslaThing: 'tesla'
}

type BMW = {
    BMWThing: 'bmw'
}

type MyFavoriteCarType = Hyundai | Tesla | BMW;

let myFavoriteCar: MyFavoriteCarType
myFavoriteCar = { hyundaiThing: 'hyundai'} // OK
myFavoriteCar = { hyundaiThing: 'hyundai', teslaThing: 'tesla'} // OK
myFavoriteCar = { hyundaiThing: 'hyundai', teslaThing: 'tesla', BMWThing: 'bmw' } // OK
```

## intersection

- 제시한 모든 타입을 만족하는 타입을 나타낸다
- `&` 기호를 이용한다 (ex. `const myFavoriteCar = Hyundai & BMW & Tesla`)

```ts
type MyFavoriteCarType = Hyundai & Tesla & BMW;

let myFavoriteCar: MyFavoriteCarType
myFavoriteCar = { hyundaiThing: 'hyundai'} // X
myFavoriteCar = { hyundaiThing: 'hyundai', teslaThing: 'tesla'} // X
myFavoriteCar = { hyundaiThing: 'hyundai', teslaThing: 'tesla', BMWThing: 'bmw' } // OK
```

# null과 undefined

## null

## undefined



# 타입 지정할 때의 팁

- 우선 타입 추론할 수 있는지 확인하기 위해 그냥 자바스크립트로 코드를 쓴다
- 컴파일러가 알아서 추론했다면 마우스를 식별자 위에 올려 컴파일러가 어떻게 추론했는지 확인한다
- 더 좁히고 싶은 경우에는 별도로 타입을 지정해 타입을 좁힌다
- 컴파일러가 추론에 실패했으면 우리가 직접 타입을 지정해주면 된다



# 참고

- [타입스크립트의 Never 타입 완벽 가이드, TOAST UI](https://ui.toast.com/posts/ko_20220323)
- [TS 탐구생활 - TS의 never 타입, Witch-Work](https://witch.work/posts/typescript-never-type)
