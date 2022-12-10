---
layout: post
title: "Javascript Series [Part11]: Javascript 웹개발(2) 비동기 실행"
description:
date: 2022-04-03 15:01:35 +0300
image: "/images/js_logo.jpg"
logo_image: "/images/javascript_logo.png"
categories: programming_language
tags: Javascript
---

---

**Table of Contents**
{: #toc }

- TOC
  {:toc}

---

```js
// 실행하면 Start -> End -> result 순으로 출력됨
// then은 콜백함수를 등록까지만 함
// 실제 콜백함수가 실행되는 시점은 response를 받았을 때
// 실행 흐름이 바로 다음 코드로 넘어가고, 나중에 콜백이 실행되는 것을 '비동기 실행'이라고 합니다.
// 보통 '비동기 실행'이 '동기 실행'에 비해, 동일한 작업을 더 빠른 시간 내에 처리

console.log("Start");
fetch("https://www.naver.com")
  .then((response) => response.text())
  .then((result) => {
    console.log(result);
  });
console.log("End");
```

```js
// 다양한 비동기 실행 함수들

// 설정한 밀리세컨즈만큼의 시간이 경과했을 때 실행
setTimeout(() => {
  console.log("b");
}, 2000);

// 특정 콜백을 일정한 시간 간격으로 실행
setInterval(() => {
  console.log("b");
}, 2000);

// 사용자가 웹 페이지에서 어떤 버튼 등을 클릭했을 때
btn.addEventListener("click", (e) => {
  console.log("Hello Codeit!");
});

// fetch 함수는 콜백을 파라미터로 바로 전달받는 게 아니라, fetch 함수가 리턴하는 어떤 객체의 then 메소드를 사용해서 콜백을 등록
// fetch 함수는, 좀 더 새로운 방식으로 비동기 실행을 지원하는 자바스크립트 문법과 연관이 있다
// fetch 함수는 Promise 객체라는 것을 리턴하고, 이 Promise 객체는 비동기 실행을 지원하는 또 다른 종류의 문법에 해당
fetch("https://www.google.com")
  .then((response) => response.text()) // fetch 함수가 리턴하는 객체의 then 메소드를 사용해서 콜백을 등록
  .then((result) => {
    console.log(result);
  });
```

# 프로미스 객체

- 작업에 관한 '상태정보'를 가지고 있는 객체
- 상태
  - `pending`: 진행중 -> response 받으면 `fulfilled`, 못 받으면 `rejected` 됨
  - `fulfilled`: 성공 -> 작업 성공 결과 추가로 가지게 됨 (이 때 콜백함수가 실행됨)
  - `rejected`: 실패 -> 작업 실패 결과 추가로 가지게 됨

```
then
    - 프로미스 객체의 상태정보가 fulfilled가 되었을 때, 실행할 콜백함수를 등록하는 메서드
    - 프로미스 객체를 다시 리턴 => 체이닝 가능 (Promise Chaining) => 비동기 작업을 순차적으로 처리하기 위함
    - text 메소드와 json 메소드는 Promise 객체를 리턴하는 메소드
```

```js
fetch("https://www.google.com")
  // rejected 상태가 되면 실행할 콜백 함수
  .then(
    (response) => response.text(),
    (error) => {
      console.log(error);
    }
  )
  .then((result) => {
    console.log(result);
  });

fetch("https://www.google.com")
  .then((response) => response.text())
  .then((result) => {
    console.log(result);
  })
  // catch를 사용할 수도 있음 (catch 메서드는 보통 마지막에 써준다)
  .catch((error) => {
    console.log(error);
  });
```

# 비동기 실행

```js
// 비동기 함수
async function fetchAndPrint() {
  // await: 프로미스 객체를 기다림(pending이 fulfilled 또는 rejected 상태가 될 때 까지)
  // 작업 성공 결과 또는 실패를 추출해 넘겨줌. 그리고 다음 코드 실행
  // 근데 기다리는 동안 프로그램 전체가 멈춰있는 것은 아님 => 그동안 async 밖에 있는 코드가 실행됨
  // ==> await 은 프로미스 객체가 리턴될 때 까지 async 내부의 코드를 실행하지 않고 기다리며, 그동안 async 밖의 코드들을 비동기적으로 실행한다
  // await 키워드는 async 함수 안에서만 사용 가능
  const response = await fetch("https://www.google.com");
  const result = await response.text();
  console.log(result);
}

fetchAndPrint();
```

```js
async function fetchAndPrint() {
  try {
    const response = await fetch("https://www.google.com");
    const result = await response.text();
  } catch (error) {
    console.log(error);
  } finally {
    console.log("end");
  }
}

fetchAndPrint();
```

```js
// async 함수는 항상 프로미스 객체를 리턴
// PromiseState: fulfilled
// PromiseResult: 3
async function fetchAndPrint() {
  return 3;
}
```
