---
layout: post
title:  '[Javascript]: 객체 리터럴'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-20 15:01:35 +0300
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

# 객체 리터럴

- 객체 타입은 다양한 타입의 값을 하나의 단위로 구성한 복합적인 자료구조이다
- 객체는 프로퍼티와 메서드로 구성된 집합체이다
- 객체는 변경 가능한 자료구조이다

```js
const person = {
    name: 'Lee',
    sayHello: function() {
        console.log('Hi')
    }
};
```

## 프로퍼티

- 프로퍼티 키가 네이밍 규칙을 따르지 않으면 따옴표로 감싸줘야 한다
- 프로퍼티 키로 숫자 리터럴을 사용하면 따옴표는 붙지 않지만 내부적으로 문자열로 변환된다
- 존재하지 않는 프로퍼티에 접근하면 `undefined`를 반환한다


## 메서드

- 메서드 내부에서 사용한 `this` 키워드는 객체 자신을 가리키는 참조변수다
- ES6에서는 메서드를 정의할 때, 메서드 축약표현을 사용할 수 있다
  ```js
  const person = {
    name: 'Lee',
    sayHello() {
        console.log('Hi')
    }
  };
  ```
