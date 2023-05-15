---
layout: post
title:  'Javascript Series [Part5]: Javascript 제어문'
description: 이 시리즈는 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용입니다.
date:   2022-04-01 15:01:35 +0300
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

# 제어문

## 조건문

```js
let temp = 0;

if (temp < 0) {
    console.log('영하');
}
else if (temp < 10) {
    console.log('0도 이상 10도 이하');
}
else {
    console.log('10도 이상');
}
```

```js
let fruit = '사과';

switch(fruit) {
    case '바나나':
        console.log('바나나');
        break;
    
    case '사과':
        console.log('사과');
        break;
    default:
        console.log('사과도 바나나도 아님');
}
```

```js
// 삼항연산자
const SCORE = 80;

function passCheck(score) {
    return score > SCORE ? 'PASS' : 'FAIL'
}
console.log(passCheck(95));


function passCheck(score) {
    score > SCORE ? console.log('성공') : console.log('실패');
}
passCheck(95);
```


## 반복문

```js
for (let i = 1; i <= 10; i++) {
    console.log(`${i}`);
}
```

```js
// 객체의 키 값
for (prop in instance) {
    console.log(`${prop}`);
}
```

```js
// 배열의 요소
for (let voc of lis) {
    console.log(voc);
}
```

```js
let i = 30;

while (i % 7 !== 0) {
    console.log(`${i}`);
    i++;
}
```

```js
for (let i = 0; i < 100; i++) {
    if (i == 10) {
        console.log('finally 10!!');
        break;
    }
    if (i % 2 == 0) {
        continue;
    }
    console.log(`${i}`);
}
```

```js
// do-while문은 코드 블럭을 먼저 실행하고 조건식을 평가한다
// 따라서 코드 블록은 무조건 한 번 이상 실행된다

let count = 0;

do {
    console.log(count);
    count++;
} while (count < 0);

// 0
// 0 보다 작으면 출력하는 반복문이어도, 조건을 확인하기 전에 한 번은 실행한다
```

# 에러 처리