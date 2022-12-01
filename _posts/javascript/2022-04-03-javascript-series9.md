---
layout: post
title:  'Javascript Series [Part9]: Javascript'
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

# 모던 자바스크립트

- 현시점에 사용하기 적합한 범위 내에서 최신 버전의 표준을 준수하는 자바스크립트
- (너무 최신은 아니고, 대부분의 브라우저에서 지원하는 자바스크립트 버전)


# 논리 연산

```js
// AND 연산자
//앞이 True이면 뒤에 나오는 값에 따라 True/False가 결정된다 -> 뒤에 나오는 값 출력
console.log('Modern' && 'Javascript'); // Javascript
console.log('0' && Nan); // Nan

// 앞이 False이면 뒤에 나오는 값은 True/False 여부에 상관 없다 -> 앞에 나오는 값 출력
console.log(null && undefined); // null


// OR 연산자
// 앞이 True이면 뒤에 나오는 값 상관 없다 -> 앞에 나오는 값 출력
console.log({} || 15); // {}

// 앞이 False 이면 -> 뒤에 나오는 값 출력
console.log(0 || true); // true

// OR 연산자는 이렇게 디폴트값을 설정하는 상황에 많이 사용된다
function myNumber(value) {
    const num = value || 0;
    return num
}

const myNum = myNumber(5); // 5
const myNum = myNumber(); // 0


// null 병합 연산자
// OR 연산자랑 비슷하지만, False의 범위가 null과 undefined 만으로 제한된다
// 왼쪽 값이 null 또는 undefined 면 오른쪽값 출력
// 왼쪽 값이 그 밖의 다른 경우에는 왼쪽값 출력
console.log(0 || 123); // 123
console.log(0 ?? 123); // 0
console.log(null ?? 123); // 123
```

# 변수 선언

```js
console.log(val); // undefined
var val = 5;
console.log(val); // 5

// let이나 const로 선언한 변수는 호이스팅 안됨 -> 변수가 선언되기 전에 사용한 코드의 오류를 잡을 수 있음
console.log(letval); // ReferenceError
let letval = 5;
```

```js
var val = 'I';
var val = 'You';

// let이나 const는 중복 선언을 막아준다
let val = 'I'; // SnytaxError
let val = 'You'; // SnytaxError

// 중복 할당은 가능하다
let val = 'I';
val = 'You';
```

```js
// var은 함수 스코프
// let, const는 블록 스코프 (함수를 포함한 모든 {} 블록)

// x: 전역변수
// y: 전역변수
// z: 함수 스코프 지역 변수
var x = 3;
{
    var y = 4;
}
function myFunc() {
    var z = 5;
    console.log(x); // 3
    console.log(y); // 4
    console.log(z); // 5
}
myFunc()

console.log(x); // 3
console.log(y); // 4
console.log(z); // ReferenceError



// x: 전역변수
// y: 블록 스코프 지역 변수
// z: 블록 스코프 지역 변수
let x = 3;
{
    let y = 4;
}
function myFunc() {
    let z = 5;
    console.log(x); // 3
    console.log(y); // ReferenceError
    console.log(z); // 5
}
myFunc()

console.log(x); // 3
console.log(y); // ReferenceError
console.log(z); // ReferenceError
```

# 함수 표현식

- 함수를 값처럼 사용하는 방식
- 함수 선언식과의 차이: 
  - 함수 선언식은 호이스팅 된다
  - 함수 선언식은 함수 스코프다 (함수가 아닌 블록에 정의된 함수 선언식은 전역적으로 사용된다)

```js
// 변수(myFunc)에 할당
const myFunc = function (value) {
    console.log(value)
}
myFunc(5);


const myBtn = document.querySelector('#myBtn');
// 함수의 인자로 전달
myBtn.addEventListener('click', function () {
    console.log('my button is clicked');
})
```

```js
// 함수 내부에서 함수를 재귀 호출하고 싶을 때는 함수에 이름을 붙여주는 것이 좋다
// Named Function Expression
const myFunc = function factorial(value) {
    if (value === 1) {
        return 1
    }
    else {
        return value * factorial(value - 1)
    }
}

myFunc(5);
console.log(myFunc.name); // factorial
factorial(5); // ReferenceError (함수 표현식의 함수명은 함수 내부에서만 사용 가능)
```

# 즉시 실행 함수

```js
(function () {
    console.log('Initializing System');
})();

// 재사용 불가하다
(function myFunc() {
    console.log('Initializing System');
})();

myFunc(); // ReferenceError
```

```js
// 이렇게 초기화 기능에 사용하거나,
(function () {
    console.log('Initializing System');
})();

// 1회성으로 필요한 함수 결과값을 사용할 때 주로 쓴다
const factorial5 = (function factorial(value) {
    if (value === 1) {
        return 1
    }
    else {
        return value * factorial(value - 1)
    }
})(5);

console.log(factorial5)
```