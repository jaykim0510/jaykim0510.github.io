---
layout: post
title:  '[Typescript] 제네릭 타입'
description: 제네릭 타입을 배우고 타입에 따른 동적인 컴포넌트를 만들 수 있다
date:   2024-02-04 15:01:35 +0300
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

# 제네릭

- **타입을 변수처럼 동적으로 정하는 방법을 의미한다**
- 타입을 변수화하면 어떤 컴포넌트가 하나의 타입에만 잘 동작하는 것이 아니라, **타입이 동적으로 변할 때 그에 맞게 동작하는 재사용성 높은 컴포넌트를 만들 수 있다**

# 간단한 제네릭 만들어보기

- 타입을 변수화 한다
- 타입을 `T`로 변수화 해보자 (T는 x처럼 흔한 표기법중 하나일 뿐 꼭 T로 써야할 필요는 없다)
- 하나의 값을 받아 배열로 만들어 리턴하는 함수를 만든다고 해보자

```ts
function arraify<T> (x: T): T[] {
    return [x]
}

arraify<number>(5) // [5]
arraify<string>('apple') // ['apple']
```

# 제네릭 제약

- 위에서 우리는 `T`에 `number` 타입도 할당 가능했고, `string` 타입도 할당 가능했다
- 하지만 함수 안에서 `x.length`와 같이 특정 타입일 때만 가지는 속성을 이용한다면, `T`에 할당할 수 있는 타입도 그에 맞게 제약을 해줘야 한다

```ts
function returnLengthFn<T> (x: T): number {
    return x.length // 'T' 형식에 'length' 속성이 없습니다
}
```

- 제네릭 타입 `T`를 `length` 속성을 가지는 타입으로 제약해보자

```ts
interface Lengthwise {
    length: number;
  }

function returnLengthFn<T extends Lengthwise> (x: T): number {
    return x.length
}

returnLengthFn<string>('apple')

returnLengthFn<number>(5) // 'number' 형식이 'Lengthwise' 제약 조건을 만족하지 않습니다
```

# 제네릭 타입의 특징

- 콤마(,)로 구분해 여러 개의 제네릭 타입을 사용할 수도 있다
- `keyof`와 같은 연산자를 이용할 수도 있다
- 사용할 때 꼭 타입을 명시하지 않아도 되며, 이 때는 컴파일러가 타입을 추론해 준다
- 사용할 때 타입을 명시하지 않은 경우, 디폴트를 할당하도록 해줄 수도 있다

```ts
interface SmartPhonePicker {
    a: 'Apple';
    s: 'Samsung';
    m: 'Shaomi';
    n: 'Sony';
  }

function pickSmartPhone<T extends SmartPhonePicker, K extends keyof T>(picker: T, key: K) {
    return picker[key]
}

const picker: SmartPhonePicker = { a: 'Apple', s: 'Samsung', m: 'Shaomi', n: 'Sony' };

pickSmartPhone(picker, 'a')
pickSmartPhone(picker, 'x') // '"x"' 형식의 인수는 'keyof SmartPhonePicker' 형식의 매개 변수에 할당될 수 없습니다
```
