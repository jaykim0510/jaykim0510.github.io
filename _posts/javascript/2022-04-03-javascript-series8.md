---
layout: post
title:  'Javascript Series [Part8]: Javascript 배열'
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

# 배열

```js
let lis = ['apple', 'banana',  'lemon'];

// splice는 임의의 위치에 값을 추가, 삭제
lis.splice(1, 1); // splice(startIndex, deleteCount)
lis.splice(1, 1, 'banana1', 'banana2'); // 한 개 삭제하고 두 개 추가
lis.splice(1, 0, 'banana1', 'banana2'); // 삭제 없이 추가만

let lis2 = lis; // 서로 영향을 미치는 형태로 배열 복사
let lis3 = lis.slice(); // 서로 독립적인 형태로 배열 복사

lis.shift(); // 배열의 첫 요소 삭제
lis.pop(); // 배열의 마지막 요소 삭제
lis.unshift('fruit') // 배열의 첫 요소로 값 추가
lis.push('fruit') // 배열의 마지막 요소로 값 추가
```

- 배열을 다루는 for문 for-of

```js
for (let voc of lis) {
    console.log(voc);
}
```


# 숫자형

```js
let num = 10000;
let num = 1e4;

let num = -0.095;
let num = -9.5e-2;
```

```js
let num = 0.3591;

num.toFixed(3); // 0.359
num.toFixed(7); // 0.3591000
typeof num.toFixed(7); // string

Number(num.toFixed(3)); // 0.359
typeof Number(num.toFixed(3)); // number
typeof +num.toFixed(3); // number
```

```js
let num = 255;

num.toString(2) // 11111111
num.toString(8) // 377
num.toString(16) // ff

typeof num.toString(2) // string

// 리터럴 숫자 앞에 . 은 소수점으로 인식 -> .. 이렇게 두 개 붙여줘야함
255..toString(2) // 11111111
```

# 문자열

```js
let str = 'Hi Jai';

str.length; // 6

str[3]; // J
str.charAt(3); // J

str.indexOf('J'); // 3 
str.lastIndexOf('J'); // 2
str.indexOf('k'); // -1

str.toLowerCase(); // 'hi jai'
str.toUpperCase(); // 'HI JAI'

str.trim(); // 양쪽 공백 문자열 지워진 문자열 리턴

str.slice(0, 2); // Hi
str.slice(3); // Jai
str.slice(); // Hi Jai
```

# 참조형 데이터 복사하기

```js
// 기본형 데이터 복사
let num = 3;
let num2 = num;

let str = 'hi';
let str2 = str;

// 배열 타입 복사
let lis = [1, 2, 3];
let lis2 = lis.slice();

// Object 타입 복사
let obj = {'name': 'jay'};
let obj2 = Object.assign({}, obj); // 임시로 빈 객체 {} 에 obj 속성 복사
```