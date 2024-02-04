---
layout: post
title:  '[Javscript] 표현식과 문'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-16 15:01:35 +0300
image:  '/images/js_logo.png'
logo_image: '/images/js_logo.png'
category: language
tag: javascript
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 표현식과 문

## 문

- 문(statement)은 프로그램을 구성하는 기본 단위이자 최소 실행 단위(묶음)다
- 문은 선언문, 할당문, 조건문, 반복문 등으로 구분된다

## 표현식

- 표현식(expression)은 값으로 평가될 수 있는 문(statement)이다
- 문의 실행 결과가 값이면 표현식이라고 할 수 있다
- 표현식에는 리터럴, 식별자(변수, 함수 등의 이름), 연산자, 함수 호출 등으로 이루어질 수 있다

## 값

- 자바스크립트에는 간단히 값이라 생각이 바로 드는 것들도 있지만, 값처럼 평가되지 않을 것 같지만 의외로 값으로 평가되는 것들도 있다

### 리터럴

- **정수 리터럴**: ex. `10`
- **소수점 리터럴** ex. `10.5`
- **문자열 리터럴** ex. `'apple'`
- **불리언 리터럴** ex. `true`
- **null 리터럴** ex. `null`
- **undefined 리터럴** ex. `undefined`
- **객체 리터럴**: ex. `{ name: 'Lee', address: 'Seoul' }`
- **배열 리터럴**: ex. `[1, 2, 3]`
- **함수 리터럴**: ex. `function() {}`
- **정규 표현식 리터럴**: ex. `/[A-Z]+/g`

### 표현식이 평가되어 생성된 결과

- **리터럴 표현식**: ex. `10`
- **식별자 표현식**: ex. `result`, `person.name`, `arr[1]`
- **연산자 표현식**: ex. `10 + 20`, `sum = 10`, `sum !== 10`
- **함수/메서드 호출 표현식**: ex. `square()`, `perseon.getName()`

- 변수 선언문은 표현식이 아니다. 그래서 값으로 평가되지 않는다
```js
var foo = var x;
-> Syntax Error
```

- 할당문은 표현식이다. 그래서 값으로 평가할 수 있다

```js
var foo = x = 100;
-> foo는 100으로 평가된다
```