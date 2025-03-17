---
layout: post
title:  '[React Hook]: useState'
description: 
date:   2024-05-05 15:01:35 +0300
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

# useState 완벽 가이드

## 1. useState란?

`useState`는 React의 함수형 컴포넌트에서 상태(state)를 관리할 수 있도록 해주는 훅(Hook)이다. 기존 클래스형 컴포넌트의 `this.state`를 대체하는 기능을 제공한다.

### 기본 문법

```jsx
import { useState } from "react";

const [state, setState] = useState(initialValue);
```

- `state`: 현재 상태 값
- `setState`: 상태를 변경하는 함수
- `initialValue`: 상태의 초기값

## 2. useState 기본 사용법

### 2.1 문자열 상태 관리

```jsx
const [name, setName] = useState("React");

return (
  <div>
    <p>이름: {name}</p>
    <button onClick={() => setName("Next.js")}>이름 변경</button>
  </div>
);
```

### 2.2 숫자 상태 관리

```jsx
const [count, setCount] = useState(0);

return (
  <div>
    <p>카운트: {count}</p>
    <button onClick={() => setCount(count + 1)}>+1</button>
  </div>
);
```

### 2.3 객체 상태 관리

```jsx
const [user, setUser] = useState({ name: "John", age: 25 });

const updateAge = () => {
  setUser((prevUser) => ({ ...prevUser, age: prevUser.age + 1 }));
};

return (
  <div>
    <p>{user.name} - {user.age}세</p>
    <button onClick={updateAge}>나이 증가</button>
  </div>
);
```

## 3. 상태 변경 시 주의할 점

### 3.1 상태 변경은 비동기적으로 처리됨

React의 `setState`는 **비동기적으로 동작**하므로, 상태 변경 직후에 값을 읽으면 예상과 다를 수 있다.

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // 아직 변경되지 않은 이전 값이 출력됨
};
```

이 문제를 해결하려면 `setState`에 함수형 업데이트를 사용한다.

```jsx
setCount((prevCount) => prevCount + 1);
```

### 3.2 상태 변경은 기존 값을 대체한다

객체 상태를 변경할 때는 기존 값을 보존해야 한다.

```jsx
setUser({ name: "Alice" }); // age 값이 사라짐
```

올바른 방법:

```jsx
setUser((prevUser) => ({ ...prevUser, name: "Alice" }));
```

## 4. useState의 고급 사용법

### 4.1 초기 상태를 함수로 설정하기

`useState`의 초기값을 계산하는 비용이 크다면, **함수를 이용하여 초기값을 설정**할 수 있다.

```jsx
const [count, setCount] = useState(() => {
  console.log("초기값 계산");
  return 0;
});
```

이렇게 하면 `useState`가 처음 렌더링될 때만 초기값을 계산한다.

### 4.2 상태를 업데이트하는 함수 사용하기

```jsx
setCount((prevCount) => prevCount + 1);
```

이 방법은 여러 번 호출해도 최신 상태를 보장한다.

### 4.3 배열 상태 관리

```jsx
const [items, setItems] = useState([]);

const addItem = () => {
  setItems((prevItems) => [...prevItems, { id: prevItems.length, value: Math.random() }]);
};

return (
  <div>
    <button onClick={addItem}>아이템 추가</button>
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.value}</li>
      ))}
    </ul>
  </div>
);
```

### 4.4 useState와 useEffect 함께 사용하기

```jsx
const [data, setData] = useState(null);

useEffect(() => {
  fetch("https://api.example.com/data")
    .then((response) => response.json())
    .then((result) => setData(result));
}, []);
```

## 5. useState vs useReducer

- **useState**: 단순한 상태 변경 시 사용
- **useReducer**: 복잡한 로직이나 여러 상태를 관리할 때 사용

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
```

## 6. 정리

- `useState`는 React에서 가장 기본적인 상태 관리 훅이다.
- `setState`는 비동기적으로 실행되므로, 상태 변경 직후 값을 읽을 때 주의해야 한다.
- 객체 상태를 업데이트할 때는 기존 상태를 보존해야 한다.
- `useState`의 초기값은 함수로 설정하면 성능을 최적화할 수 있다.
- 복잡한 상태 관리가 필요하면 `useReducer`를 고려할 수 있다.

