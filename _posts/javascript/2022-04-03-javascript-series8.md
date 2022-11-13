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

```js
let lis = ['apple', 'banana',  'lemon'];

// splice는 임의의 위치에 값을 추가, 삭제
lis.splice(1, 1); // splice(startIndex, deleteCount)
lis.splice(1, 1, 'banana1', 'banana2'); // 한 개 삭제하고 두 개 추가
lis.splice(1, 0, 'banana1', 'banana2'); // 삭제 없이 추가만

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