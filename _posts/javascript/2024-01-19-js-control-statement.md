---
layout: post
title:  '[Javascript]: 제어문'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-19 15:01:35 +0300
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

# 제어문

- 제어문은 조건문이나 반복문을 일컫는다
- 지나친 제어문은 코드의 흐름을 혼란스럽게 한다
- `forEach`, `map`, , `filter`, `reduce` 와 같은 고차함수를 사용한 함수형 프로그래밍은 이러한 문제를 해결하려고 노력한다


## 조건문

- 특정 조건을 만족할 때 코드를 실행시키는 역할을 한다
- `if`문, 삼항연산자, `switch`문을 통해 구현할 수 있다

```js
if (조건식) { 실행할 문 } // 기본적인 조건문 형태


if (조건식) 실행할 문 // 실행할 문이 1개면 중괄호 생략 가능


if (조건식1) {
  실행할 문 // 조건식1을 만족하는 경우
} else if (조건식2) {
  실행할 문 2 // 조건식1은 만족하지 않지만 조건식2는 만족하는 경우
} else {
  실행할 문 3 // 조건식1과 조건식2를 모두 만족하지 않는 경우
}
```

```js
(조건식) ? truthy일 경우 실행할 문 : falsy일 경우 실행할 문 // 삼항 연산자

const score = 70;

score > 50 ? console.log('합격') : console.log('탈락');

// if문과 다르게 값으로 평가된다 -> 조건에 따라 동적으로 변수에 값을 할당하는 코드를 간결하게 구현할 수 있다
const dinner = score > 50 : '고기반찬' : '삼각김밥'; 
```

```js
switch (표현식) { // switch문은 표현식이 문자열이나 숫자값인 경우가 많다
  case 표현식1:
      실행할 문
      break // break 없으면 아래 문이 실행된다 -> break 걸어줘야 한다
  case 표현식2:
      실행할 문
      break
  default:
      일치하는 case문 없을 때 실행할 문
}

```

## 반복문

- 코드를 반복 실행시키는 역할을 한다
- `for`문, `while`문 `do..while`문, `forEach`, `map`과 같은 고차함수를 이용해 구현한다
- `break`는 실행을 중단하고 반복문을 빠져나오는 역할, `continue`는 실행을 중단하고 반복문의 증감식으로 실행 흐름을 이동하는 역할을 한다

```js
for (변수 할당문; 조건식; 증감식) {
  실행할 문
}

for (let i = 0; i < 10; i++) {
  console.log(i)
}

// 이터러블의 원소들을 순회할 때
const arr = [1, 2, 3, 4, 5]

for (let num of arr) {
  console.log(num) // 1, 2, 3, 4, 5
}


// 객체의 프로퍼티들을 순회할 때
const person = {
  name: 'Kim'
  address: 'Seoul'
}

for (let k in person) {
  console.log(k) // name, address
}
```


```js
while (조건식) {
  실행할 문
}


// do..while은 먼저 실행할 문을 한 번 실행한 후에 조건에 따라 반복 실행할지를 결정한다
do {
  실행할 문
} while (조건식)
```