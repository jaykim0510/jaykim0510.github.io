---
layout: post
title:  '[React Hook]: useEffect'
description: 
date:   2024-05-15 15:01:35 +0300
image:  '/images/react_logo.png'
logo_image: '/images/react_logo.png'
category: frontend
tag: react
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# useEffect 완벽 가이드

## 1. useEffect란?

`useEffect`는 React의 함수형 컴포넌트에서 부작용(side effect)을 처리할 수 있도록 도와주는 훅(Hook)이다. 다음과 같은 작업을 수행할 때 사용한다:

- API 호출 (데이터 가져오기)
- DOM 업데이트
- 구독(subscription) 및 정리(cleanup)
- 타이머 설정

### 기본 문법

```jsx
import { useEffect } from "react";

useEffect(() => {
  // 실행할 코드
});
```

## 2. useEffect의 실행 타이밍

React 컴포넌트가 **렌더링(render)** 된 이후 `useEffect`가 실행된다. `useEffect`는 기본적으로 **비동기적으로 동작**하며, DOM 업데이트 후 실행된다.

## 3. 의존성 배열 (Dependency Array)

### 3.1 의존성 배열이 없는 경우

```jsx
useEffect(() => {
  console.log("컴포넌트가 렌더링될 때마다 실행됨");
});
```

- 이 경우 컴포넌트가 **매 렌더링마다 실행**된다.

### 3.2 빈 배열 (`[]`)을 사용할 경우

```jsx
useEffect(() => {
  console.log("컴포넌트가 마운트될 때만 실행됨");
}, []);
```

- **컴포넌트가 처음 마운트될 때만 실행**된다.
- 이후 상태(state)나 props가 변경되어도 실행되지 않는다.

### 3.3 특정 값이 변경될 때 실행하기

```jsx
useEffect(() => {
  console.log(`count가 ${count}로 변경됨`);
}, [count]);
```

- `count` 값이 변경될 때마다 실행된다.

## 4. 정리(cleanup) 함수

`useEffect`에서 return 문을 사용하면 **컴포넌트가 언마운트되거나 의존성이 변경될 때 실행되는 정리 함수**를 설정할 수 있다.

```jsx
useEffect(() => {
  console.log("구독 시작");

  return () => {
    console.log("구독 해제");
  };
}, []);
```

- 주로 이벤트 리스너 해제, 구독 취소, 타이머 정리 등에 사용된다.

## 5. useEffect에서 비동기 코드 실행하기

### 5.1 일반적인 비동기 코드 실행

```jsx
useEffect(() => {
  async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  }

  fetchData();
}, []);
```

- `useEffect` 내부에서 `async` 함수를 직접 사용할 수 없으므로 별도의 함수를 정의하여 실행한다.

### 5.2 Cleanup과 함께 사용하기

```jsx
useEffect(() => {
  let isMounted = true;

  async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    if (isMounted) {
      console.log(data);
    }
  }

  fetchData();

  return () => {
    isMounted = false;
  };
}, []);
```

- 컴포넌트가 언마운트되었을 때 불필요한 상태 업데이트를 방지할 수 있다.

## 6. useEffect의 고급 활용

### 6.1 여러 개의 useEffect 사용하기

```jsx
useEffect(() => {
  console.log("마운트될 때 실행");
}, []);

useEffect(() => {
  console.log("count 값이 변경됨");
}, [count]);
```

- `useEffect`를 여러 개 선언하면 각기 다른 효과를 독립적으로 관리할 수 있다.

### 6.2 `useEffect` 최적화하기

- **불필요한 실행 방지:**
  - 의존성 배열을 적절히 설정하여 불필요한 실행을 방지한다.
  - 값이 변하지 않으면 실행되지 않도록 `useMemo`, `useCallback`과 함께 사용한다.

- **의존성 배열이 큰 경우:**
  - 여러 개의 `useEffect`로 분리하여 관리한다.
  - `useReducer`와 함께 사용하여 상태 변경을 최소화한다.

## 7. 정리

- `useEffect`는 React 컴포넌트에서 부작용을 처리하는 중요한 훅이다.
- 의존성 배열을 설정하여 실행 시점을 조절할 수 있다.
- 정리(cleanup) 함수를 활용하면 메모리 누수를 방지할 수 있다.
- 비동기 코드 실행 시 `async` 함수 내부에서 호출해야 한다.
- 여러 개의 `useEffect`를 사용하여 코드를 유지보수하기 쉽게 만들 수 있다.

