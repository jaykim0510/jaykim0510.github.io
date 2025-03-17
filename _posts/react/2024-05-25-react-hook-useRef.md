---
layout: post
title:  '[React Hook]: useRef'
description: 
date:   2024-05-25 15:01:35 +0300
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

# useRef 완벽 가이드

## 1. useRef란?

`useRef`는 React에서 DOM 요소에 접근하거나, 컴포넌트의 렌더링과 관계없이 값을 유지할 때 사용하는 훅(Hook)이다.

### 기본 문법

```jsx
import { useRef } from "react";

const ref = useRef(initialValue);
```

- `ref.current`를 통해 값을 읽거나 변경할 수 있다.
- 값이 변경되어도 컴포넌트가 리렌더링되지 않는다.

---

## 2. useRef의 기본적인 사용법

### 2.1 DOM 요소 접근하기

- `ref`를 `<input>` 요소에 연결하면, `useEffect`에서 `inputRef.current.focus()`를 호출하여 자동으로 포커스를 맞출 수 있다.

```jsx
import { useRef, useEffect } from "react";

const InputFocus = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="자동 포커스" />;
};
```

- `ref.current`는 DOM 요소를 가리킬 때 다양한 속성을 가질 수 있다

- `ref.current.style`을 통해 DOM 요소의 스타일을 직접 조작할 수 있다

```jsx
import { useRef, useEffect } from "react";

const ModifyStyle = () => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.backgroundColor = "lightblue";
      divRef.current.style.padding = "20px";
    }
  }, []);

  return <div ref={divRef}>스타일이 변경됩니다.</div>;
};
```

- `ref.current.value`를 통해 input 요소의 현재 값을 읽을 수 있다

```jsx
const InputValue = () => {
  const inputRef = useRef(null);

  const handleClick = () => {
    alert(`입력된 값: ${inputRef.current.value}`);
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="값을 입력하세요" />
      <button onClick={handleClick}>값 확인</button>
    </div>
  );
};
```

### 2.2 렌더링과 관계없는 값 저장하기

```jsx
import { useRef, useState } from "react";

const Counter = () => {
  const countRef = useRef(0);
  const [state, setState] = useState(0);

  const increaseCount = () => {
    countRef.current += 1;
    console.log("Ref count:", countRef.current);
  };

  return (
    <div>
      <p>State count: {state}</p>
      <button onClick={() => setState(state + 1)}>State 증가</button>
      <button onClick={increaseCount}>Ref 증가</button>
    </div>
  );
};
```

> `countRef.current` 값이 변경되어도 컴포넌트가 리렌더링되지 않는다.

---

## 3. useRef의 고급 활용법

### 3.1 이전 상태 값 저장하기

```jsx
import { useRef, useEffect, useState } from "react";

const PreviousValue = () => {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>현재 값: {count}</p>
      <p>이전 값: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
};
```

> `useRef`를 사용하여 이전 상태 값을 저장하고 비교할 수 있다.

### 3.2 useRef와 setTimeout/clearTimeout

```jsx
import { useRef } from "react";

const Timer = () => {
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      alert("타이머 종료!");
    }, 3000);
  };

  const stopTimer = () => {
    clearTimeout(timerRef.current);
  };

  return (
    <div>
      <button onClick={startTimer}>타이머 시작</button>
      <button onClick={stopTimer}>타이머 중지</button>
    </div>
  );
};
```

> `useRef`를 사용하여 `setTimeout` ID를 저장하고, `clearTimeout`으로 중지할 수 있다.

### 3.3 useRef를 활용한 debounce 처리

```jsx
import { useRef } from "react";

const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  return (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default useDebounce;
```

> `useRef`를 사용하여 불필요한 연산을 줄이는 `debounce` 함수를 만들 수 있다.

---

## 4. useRef vs useState vs useEffect 비교

| Hook    | 주요 목적 | 리렌더링 여부 | 사용 예시 |
|---------|------------|--------------|------------------|
| useState | 상태 관리 | ✅ 리렌더링 발생 | UI 업데이트 |
| useEffect | 부수 효과 처리 | ❌ 직접 상태 변경 없음 | API 호출, 구독 |
| useRef | 값 유지 및 DOM 접근 | ❌ 리렌더링 없음 | DOM 조작, 값 저장 |

---

## 5. 정리

- `useRef`는 **DOM 요소 접근**과 **렌더링과 무관한 값 저장**에 사용된다.
- `useRef.current` 값을 변경해도 **리렌더링이 발생하지 않는다**.
- 이전 값 저장, `setTimeout` 관리, `debounce` 처리 등 다양한 용도로 활용할 수 있다.
- 단순 상태 변경이 필요한 경우 `useState`, 부수 효과는 `useEffect`와 함께 사용하면 좋다.

