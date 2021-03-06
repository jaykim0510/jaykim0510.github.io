---
layout: post
title:  'Javascript Series [Part3]: Javascript 표현식과 문'
description: 이 시리즈는 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용입니다.
date:   2022-02-06 15:01:35 +0300
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

![](../../images/js_1.jpeg){: width="50%"}  

# 값
값은 표현식이 평가되어 생성된 결과를 말한다. 평가란 식을 해석해서 값을 생성하거나 참조하는 것을 의미한다.  

```js
10 + 20;
x - 1;
```

# 리터럴

리터럴은 사람이 이해할 수 있는 문자 또는 약속된 기호를 사용해 값을 생성하는 표기법을 말한다.  

|**리터럴**|**예시**|
|정수|100|
|부동소수점|0.4|
|2진수|0b010001|
|문자열|'Hello'|
|불리언|true, false|
|null|null|
|undefined|undefined|
|객체|{ name: 'Lee', address: 'Seoul' }|
|배열|[1, 2, 3]|
|함수|function() {}|
|정규 표현식|/[A-Z]+/g|


# 표현식
표현식(expression)은 값으로 평가될 수 있는 문이다. 위에서 살펴본 리터럴은 값으로 평가될 수 있기 때문에 리터럴도 표현식이라 할 수 있다.  

```js
10
'Hello'

person.name
arr[1]

10 + 20
sum = 10
sum !== 10

square()
person.getName()

x + 3
```  

# 문
문(statement)은 프로그램을 구성하는 기본 단위이자 최소 실행 단위다. 문은 여러 토큰으로 구성된다. 토큰이란 문법적인 의미를 가지며, 문법적으로 더 이상 나눌 수 없는 코드의 기본 요소를 의미한다. 예를 들어, 키워드, 식별자, 연산자, 리터럴, 세미콜론, 마침표 등의 특수기호는 모두 토큰이다.  

문은 선언문, 할당문, 조건문, 반복문 등으로 구분할 수 있다.  

```js
// 선언문
var x;

// 할당문
x = 5;

// 함수 선언문
funciton foo() {}

// 제어문
if (x > 1) { console.log(x); }

// 반복문
for (var i = 0; i < 2; i++) { console.log(i); }
```
# 세미콜론 자동 삽입
세미콜론(;)은 문의 종료를 나타낸다. 즉 자바슼립트 엔진은 세미콜론으로 문이 종료한 위치를 파악하고 순차적으로 하나씩 문을 실행한다. 단 괄호로 묶은 코드 블록 뒤에는 세미콜론을 붙이지 않는다. 블록은 문의 종료를 의미하는 자체 종결성을 갖기 때문이다.  

세미콜론은 생략 가능하다. 이는 자바스크립트 엔진이 소스코드를 해석할 때 문의 끝이라고 예측되는 지점에 세미콜론을 자동으로 붙여주는 세미콜론 자동 삽입 기능(ASI:Automatic Semicolon Insertion)이 암묵적으로 수행되기 때문이다.  

하지만 개발자의 의도와 일치하지 않는 경우도 생기기 때문에 자바스크립트 커뮤니티에서는 세미콜론의 사용을 권장한다.  

# 표현식인 문과 표현식이 아닌 문
값으로 평가될 수 있으면 표현식인 문이고, 그렇지 않으면 표현식이 아닌 문이다.  

```js
// 표현식이 아닌 문
var x;

// 표현식인 문
x = 1 + 2;
```