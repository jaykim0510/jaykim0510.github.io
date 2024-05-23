---
layout: post
title:  '[Javascript]: 데이터 타입'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-17 15:01:35 +0300
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

# 데이터 타입

- 원시 타입(Primitive): 숫자, 문자열, 불리언, undefined, null, Symbol
- 객체 타입(Object): 객체, 함수, 배열 등 원시 타입이 아닌 모든 타입

## 숫자 타입

- ECMAScript 사양에 따르면 숫자 타입의 값은 64비트 부동소수점 형식을 따른다
- 즉 모든 수를 실수로 처리하며, 정수만 표현하기 위한 데이터 타입이 별도로 존재하지 않는다
- 숫자 타입은 추가적으로 세 가지 특별한 값도 표현할 수 있다 (`Infinity`, `-Infinity`, `NaN`)

### Number 생성자 함수

- `Number`는 표준 빌트인 객체 중 하나로, 원시 타입인 숫자를 다룰 때 유용한 프로퍼티와 메서드를 제공한다
- `Number` 객체는 생성자 함수 객체다. 따라서 `new` 연산자와 함께 호출하여 `Number` 인스턴스를 생성할 수 있다

```js
// Number 래퍼 객체 생성
const numObj = new Number() // Number {[[PrimitiveValue]]: 0}
const numObj = new Number(10) // Number {[[PrimitiveValue]]: 10}

// new 연산자 없이 호출하면, 리터럴 숫자 생성
Number(0) // 0
Number(-1) // -1
Number('10.5') // 10.5
```

### Number 프로퍼티

```js
Number.EPSILON
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN
```

### Number 메서드

#### Number.isFinite

#### Number.isInteger

#### Number.isNaN

#### Number.prototype.toExponential

#### Number.prototype.toFixed

#### Number.prototype.toPrecision

#### Number.prototype.toString

### Math 프로퍼티

```js
Math.PI
```

### Math 메서드

#### Math.abs

#### Math.round

#### Math.ceil

#### Math.floor

#### Math.sqrt

#### Math.random

#### Math.pow

#### Math.max

#### Math.min

## 문자열 타입

- 일반 문자열: 쌍따옴표(") 또는 작은 따옴표(') 사용
- 템플릿 문자열: 백틱(`) 사용

- 템플릿 문자열을 사용하면, 여러 줄에 걸쳐서 나오는 문자열을 있는 그대로 저장할 수 있다 (탭, 줄바꿈 등 모두 반영된다)
- 또 템플릿 문자열을 사용하면 표현식을 삽입할 수 있다
- 일반 문자열은 탭, 줄바꿈 등을 표현하려면 이스케이프 시퀀스를 사용해야 한다
- (백슬래쉬 하나인데, 하나만 하면 Jekyll Search가 안되서 두 개로 표기)
  - `\\0`: Null
  - `\\b`: 백스페이스
  - `\\t`: 탭
  - `\\'`: 작은 따옴표
  - ...


### String 생성자 함수

### length 프로퍼티

### String 메서드

#### String.prototype.indexOf

#### String.prototype.search

#### String.prototype.includes

#### String.prototype.startsWith

#### String.prototype.endsWith

#### String.prototype.charAt

#### String.prototype.substring

#### String.prototype.slice

#### String.prototype.toUppserCase

#### String.prototype.toLowerCase

#### String.prototype.trim

#### String.prototype.repeat

#### String.prototype.replace

#### String.prototype.split

## 배열

### 자바스크립트 배열

### 배열 생성

### 배열 요소의 참조/추가/수정/삭제

### 배열 메서드

#### isArray

#### indexOf

#### push

#### pop

#### unshift

#### shift

#### concat

#### splice

#### slice

#### join

#### reverse

#### fill

#### includes

#### flat

#### sort

#### forEach

#### map

#### filter

#### reduce

#### some

#### every

#### find

#### findIndex

#### flatMap


## 날짜

### Date 생성자 함수

### Date 메서드

#### Date.now

#### Date.parse

#### Date.prototype.getFullYear

#### Date.prototype.setFullYear

#### Date.prototype.getMonth

#### Date.prototype.setMonth

#### Date.prototype.getDate

#### Date.prototype.setDate

#### Date.prototype.getDay

#### Date.prototype.getHours

#### Date.prototype.setHours

#### Date.prototype.getMinutes

#### Date.prototype.setMinutes

#### Date.prototype.getSeconds

#### Date.prototype.setSeconds

#### Date.prototype.getMilliseconds

#### Date.prototype.setMilliseconds

#### Date.prototype.getTime

#### Date.prototype.setTime

#### Date.prototype.getTimezoneOffset

#### Date.prototype.toDateString

#### Date.prototype.toTimeString

#### Date.prototype.toISOString

#### Date.prototype.toLocaleString

#### Date.prototype.toLocaleTimeString
