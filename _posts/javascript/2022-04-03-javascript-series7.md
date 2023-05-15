---
layout: post
title:  'Javascript Series [Part7]: Javascript 객체'
description: 이 시리즈는 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용입니다.
date:   2022-04-03 15:01:35 +0300
image:  '/images/js_logo.jpg'
logo_image:  '/images/javascript_logo.png'
categories: programming_language
tags: Javascript
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- 객체 리터럴(10장), 원시 값과 객체의 비교(11장), 프로퍼티 어트리뷰트(16장), 생성자 함수에 의한 객체 생성(17장), 함수와 일급 객체 (18장), 프로토타입(19장), 빌트인 객체(21장), 클래스(25장)
- 자바스크립트의 모든 것이 객체다


# 객체

- 자바스크립틑 객체 기반의 프로그래밍 언어이며, 자바스크립트에서 원시 값을 제외한 나머지 값은 모두 객체다 (함수, 배열, 정규 표현식 등)
- 객체는 다양한 타입을 하나의 단위로 구성한 자료구조
- 객체는 값을 변경하기 위해 재할당이 필요 없다 (mutable value)
- 객체는 크게 프로퍼티와 메서드로 이루어진다

## 객체 생성 방법

- 자바스크립트는 프로토타입 기반 객체지향 언어이다 -> 다양한 객체 생성 방법을 지원한다
- 객체 리터럴, Object 생성자 함수, 생성자 함수, Object.create 메서드
- 클래스(ES6)

### 객체 리터럴

- 가장 일반적이고 간단한 방법이다
- 변수에 할당되는 시점에 자바스크립트 엔진이 객체 리터럴을 해석하고 객체를 생성한다
- 중괄호를 이용해 정의한다 (뒤에 세미콜론 붙여야 된다. 단순 코드 블록은 뒤에 세미콜론 안 붙인다)

```js
const person = {
    name: 'Lee',
    sayHello: function () {
        console.log(`Hi My name is ${this.name}`);
    }
};

console.log(typeof person); // object
console.log(person); // {name: "Lee", sayHello: f}
```

### 프로퍼티

- 프로퍼티를 나열할 때는 쉼표로 구분한다
- 키(key)값은 네이밍 규칙을 준수하면 따옴표로 감싸지 않아도 된다 (위의 코드에서 `name`을 보면 따옴표로 감싸지 않았다)
- 네이밍 규칙을 따르지 않으면 따옴표로 감싸야 한다 (ex. `'last-name'`, `'last name'`)
- 객체에 존재하지 않는 프로퍼티에 접근하면 `undefined`를 반환한다 (`ReferenceError`가 발생하지 않는다)

```js
const person = {
    name: "Jay Kim",
    "last-name": "Kim",
    'first name': "Jay"
};

console.log(person.name); // Jay Kim
console.log(person["last-name"]); // Kim
console.log(person["first name"]); //Jay
console.log(person.age); //undefiend


person.age = 24;
console.log(person.age); // 24

delete person.age;
console.log(person.age) // undefined
```

### ES6에 추가된 기능

- 프로퍼티 축약 표현

```js
// 프로퍼티 키와 사용할 변수의 이름이 같으면 프로퍼티 키를 생략해도 자동 생성된다
const x = 1, y = 2;
const obj = {x, y};
console.log(obj) // { x: 1, y: 2 }


// 문자열로 평가되는 표현식을 사용하면 프로퍼티 키를 동적으로 생성할 수 있다
const prefix = 'prop';
let i = 0;

const obj = {
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i,
};

console.log(obj); // { 'prop-1': 1, 'prop-2': 2, 'prop-3': 3 }


// 메서드를 정의할 때 function 키워드를 생략한 축약 표현을 쓸 수 있다
const obj = {
    name: 'Lee',
    sayHi() {
        console.log('Hi');
    }
};

obj.sayHi();
```


# 원시 값과 객체의 비교





# Date 객체

```js
let now = new Date();
let date_1 = new Date('2021-01-04');
let date_2 = new Date('2022-04-05T14:25:42');


console.log(now);
console.log(date_1);
console.log(date_2);

console.log(now.getFullYear()); // 년
console.log(now.getMonth()); // 월 0: 1월
console.log(now.getDate()); // 일
console.log(now.getDay()); // 요일 0: 일요일, 1: 월요일, ...
```

# Math 객체

```js
console.log(Math.abs(-10)); // 10
console.log(Math.max(2, -1, 4, 5, 0)); // 5
console.log(Math.pow(2, 3)); // 8
console.log(Math.sqrt(49)); // 7
console.log(Math.round(2.3)); // 2
console.log(Math.floor(2.8)); // 2
console.log(Math.ceil(2.4)); // 3
console.log(Math.random()); // 0과 1미만의 랜덤값
```