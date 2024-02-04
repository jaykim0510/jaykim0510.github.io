---
layout: post
title:  '[Javascript]: 연산자'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-18 15:01:35 +0300
image:  '/images/js_logo.png'
logo_image: '/images/js_logo.png'
category: language
tag: [javascript]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 연산자

## 산술 연산자

- `+`(덧셈), `-`(뺼셈), `*`(곱하기), `/`(몫), `%`(나머지), `++`(증가), `--`(감소)
- 숫자 타입이 아닌 다른 타입 앞에 `+`를 붙이면 숫자 타입으로 변환하여 반환한다
  - 원래 값은 바꾸지 않는다
  - 정확한 값을 반환하기 어려운 경우는 `NaN`을 반환한다

  ```js
  const x = '1';
  const numberX = +x; // 문자열 타입 '1'은 + 연산자에 의해 숫자 타입 1로 변환된다

  const x = 'true';
  const numberX = +x; // 불린 타입도 +연산자에 의해 숫자 타입으로 변환된다

  const x = 'Hello';
  const numberX = +x; // 문자열 타입 'Hello'는 + 연산자에 의해 숫자 타입으로 변환되지만, 특수한 경우인 NaN을 반환한다
  ```
- `+`연산자를 쓸 때, 두 개의 피연산자중에 문자열이 있으면 `+`연산자는 문자열 연결 연산자로 동작한다


## 비교 연산자

- `>`, `<`, `<=`, `>=`, `==`, `===`, `!=`, `!==`
- (`==`와 `!=`는 먼저 암묵적 타입 변환을 통해 타입을 일치시킨 후 값이 같은지 비교한다)
- (`===`와 `!==`는 값뿐만 아니라 타입도 같은지 비교한다)


## 삼항 연산자

- `if ...else`문과 비슷한 역할을 한다
- `<조건식> ? <조건식이 truthy할 경우 실행할 문> : <조건식이 falsy일 경우 실행할 문>`
- 조건에 따라 변수에 다른 값을 할당하고 싶을 때 많이 사용한다
- `if ...else`문과 다르게 값으로 평가된다

```js
const x = 90

x > 50 ? console.log('통과입니다') : console.log('탈락입니다')
-> '통과입니다'

const number = 1
const gender = number === 1 ? 'male' : 'female' // gender에 'male' 할당됨
```

## 논리 연산자

- AND 연산자(`&&`), OR 연산자(`||`) 표현식의 결과는 2개의 피연산자중 한쪽으로 평가된다

```js
1 && false // false
1 || false // 1
'Cat' && 'Dog' // 'Dog'
```

## typeof 연산자

- `typeof` 연산자는 피연산자의 데이터 타입을 문자열로 반환한다
- 다음 7가지 문자열중 하나를 반환한다: `'string'`, `'number'`, `'boolean'`, `'undefined'`, `'symbol'`, `'object'`, `'function'`
- (`null`, `[]`, `{}`, `new Date()`는 `'object'`)
- `null`이 `'object'`를 반환하는 것은 자바스크립트 초기 버전의 버그다
- 따라서 `null` 여부는 타입이 아니라 값 자체를 비교해야 한다

## 그 외의 연산자

- `?.`: 옵셔널 체이닝 연산자 (앞의 객체가 `null` 또는 `undefined`인지 확인한다. 아니면 뒤의 프로퍼티를 읽는다)
- `??`: `null` 병합 연산자 (앞의 값이 `null` 또는 `undefined`인지 확인한다. 아니면 앞의 값 반환 맞으면 뒤의 값을 반환)
- `delete`: 프로퍼티 삭제
- `new`: 생성자 함수를 호출할 때 사용하여 인스턴스를 생성
- `instanceof`: 좌변의 객체가 우변의 생성자 함수와 연결된 인스턴스인지 판별
- `in`: 프로퍼티 존재 확인

```js
const person = null

person.name // TypeError: Cannot read properties of null (reading 'name')
person?.name // undefined


const x = null
const y = 0

x ?? 100 // 100
y ?? 100 // 0
```