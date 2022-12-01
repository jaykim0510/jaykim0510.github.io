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

- 자바스크립트의 모든 것이 객체다


```js

let x = {
    name: 'mike',
    'birth-day': '1999-09-09',
    'home location': 'busan',
    age: 22,
    live: true,
    previous: null,
    family: {
        mother: 'yoon',
        father: 'kim'
    }
};

let y = 'live';

console.log(x.family.father);
console.log(x['birth-day']);
console.log(x[y]);
```

```js
x['age'] = 25;
console.log(x.age);
```

```js
delete x.age;
console.log(x.age);
-----------------------
// undefined
```

```js
console.log('live' in x);
-------------------------
// true
```

- 메서드

```js
let x = {
    name: 'mike',
    sayHello: function(na) {
        console.log(`Hello ${na}!!`)
    }

};

x.sayHello(x.name);
```

- for in 반복문

```js
let x = {
    name: 'mike',
    age: 22,
    sayHello: function(na) {
        console.log(`Hello ${na}!!`)
    }

};


for (prop in x) {
    console.log(`${prop}`);
}
----------------------------
// name
// age
// sayHello
```

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