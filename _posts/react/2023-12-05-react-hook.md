---
layout: post
title:  '[React]: 리액트 훅(hook)'
description: 리액트에서 제공하는 훅에 대해 배운다
date:   2023-12-05 15:01:35 +0300
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

# 훅(Hook)

- 훅은 리액트에서 제공하는 여러 특징들을 사용할 수 있도록 도와준다

# State Hooks

- 상태(state)는 컴포넌트가 어떤 값을 기억하도록 한다

## useState

- 상태(state) 변수를 선언할 때 `useState` 훅을 사용한다

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

# Context Hooks

- 컨텍스트(context)는 부모 컴포넌트가 멀리 떨어져 있는 자식 컴포넌트에게 값을 전달하도록 해준다

## useContext

- 정의한 컨텍스트를 읽고 구독할 때 `useContext` 훅을 쓴다

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

# Ref Hook

- 참조(ref)는 상태(state)처럼 어떤 값을 저장하는 목적으로 쓰인다
- 하지만 상태(state)와 다르게 참조(ref)가 바뀌어도 컴포넌트가 리렌더링 되지는 않는다
- (When you change the `ref.current` property, React does not re-render your component)

## useRef

- 참조(ref)를 정의할 때 `useRef` 훅을 쓴다
- 어떤 값도 저장할 수 있지만, 대부분의 경우 DOM 노드를 참조하는 목적으로 쓴다

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

# Effect Hook

- 효과(effect)는 컴포넌트를 다른 외부 시스템과 동기화되도록 연결시켜 준다
- 네트워크, 브라우저의 DOM, 애니메이션 등 non-React 코드를 다룰 때 사용한다

## useEffect

- 컴포넌트를 다른 외부 시스템과 연결할 때 `useEffect` 훅을 사용한다

```js
useEffect(setup, dependencies?)
```

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

- setup
  - optionally return a cleanup function
  - 컴포넌트가 처음 DOM에 추가될 때 setup 함수가 실행된다
  - dependencies 변화로 리렌더링 될 때마다 cleanup 함수 실행 with old props and state
  - 그리고 setup 함수 실행 with new props and state
  - 컴포넌트가 DOM 에서 제거될 때 cleanup 함수 실행
- dependencies
  - setup 함수 안에서 참조된 reactive values 를 목록으로 가지는 배열
  - (reactive values: props, state, variables, 컴포넌트 안에서 정의된 함수)
  - 리액트는 배열안의 값들을 하나씩 비교해서 변경된 경우 setup 함수 실행

- If some of your dependencies are objects or functions defined inside the component, there is a risk that they will cause the Effect to re-run more often than needed. To fix this, remove unnecessary object and function dependencies. You can also extract state updates and non-reactive logic outside of your Effect.
- Effects only run on the client. They don’t run during server rendering.

# Performance Hooks

- 리액트에서는 리렌더링을 최적화 하기 위해 캐시된 계산 결과를 재사용해서 불필요한 리렌더링을 방지한다

## useMemo

- `useMemo`는 어떤 계산 결과를 캐시하도록 해준다

## useCallback

- `useCallback` lets you cache a function definition before passing it down to an optimized component.


# 참고

- [Built-in React Hooks, react.dev](https://react.dev/reference/react/hooks)
- [Rules of Hooks, react.dev](https://legacy.reactjs.org/docs/hooks-rules.html)
- [React — Uncaught TypeError: destroy is not a function](https://medium.com/geekculture/react-uncaught-typeerror-destroy-is-not-a-function-192738a6e79b)