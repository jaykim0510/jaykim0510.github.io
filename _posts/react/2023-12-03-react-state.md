---
layout: post
title:  '[React]: 리렌더링 (with State)'
description: 상태 변화에 따른 리렌더링을 통해 웹 페이지를 동적으로 만드는 방법에 대해 배운다
date:   2023-12-03 15:01:35 +0300
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

# 동적인 웹페이지

- 요즘 웹페이지는 대부분 동적이다
- 동적인 요소는 시간에 따라 변하는 것도 있고, 유저의 이벤트에 따라 변하는 것도 있다
- 예를 들어 검색창에 입력한 텍스트가 UI에 반영되는 것, 구매할 상품의 개수를 +,- 버튼으로 누를 때마다 숫자가 변하는 것, 다크모드/라이트모드에 따라 화면 색깔이 바뀌는 것 등이 동적인 요소라고 할 수 있다

<br>

- 리액트에서는 이렇게 **변하는 데이터를 상태(state)**라고 한다
- 상태가 변할 때마다 상태를 포함하고 있는 **컴포넌트가 업데이트되는 것을 리렌더링(re-rendering)**이라고 한다

# State

- 상태는 현재 값을 저장해둔 변수와 비슷하며 리액트 컴포넌트가 기억하고 있는 값이라고 할 수 있다
- 일반 변수는 값이 변경돼도 화면이 업데이트 되지 않지만, 리액트의 상태는 변경되면 화면이 업데이트 된다
- 리액트 컴포넌트가 상태의 현재 값을 저장해뒀다가 상태 값이 현재 값과 비교해 변경된 경우, 리액트는 이러한 변화를 업데이트해 화면에 반영한다

## useState

- 리액트에서 상태는 `useState` 라는 훅을 이용해 정의할 수 있다
- `useState`를 호출하는 것은 리액트 컴포넌트에게 무언가를 기억하라고 하는 것과 같다
- `useState` 함수는 인자로 상태의 초기 값을 받고, **[state, setState]** 쌍을 반환한다
- 리액트에서는 상태(state)가 변화할 때마다 화면에 결과를 반영한다
- 리액트는 상태가 세터 함수(setState)에 의해 변경될 때만 화면에 결과를 반영한다

```js
const [count, setCount] = useState(0)
```

## State의 특성

- State is isolated and private
  - State is not tied to a particular function call or a place in the code, but it’s “local” to the specific place on the screen
  - What if you wanted both galleries to keep their states in sync? The right way to do it in React is to remove state from child components and add it to their closest shared parent

# Re-rendering

- The component’s (or one of its ancestors’) state has been updated
- Updating your component’s state automatically queues a render
- “Rendering” is React calling your components.
  - On initial render, React will call the root component.
  - For subsequent renders, React will call the function component whose state update triggered the render
- After rendering (calling) your components, React will modify the DOM.

  - For the initial render, React will use the appendChild() DOM API to put all the DOM nodes it has created on screen.
  - For re-renders, React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
- React only changes the DOM nodes if there’s a difference between renders. For example, here is a component that re-renders with different props passed from its parent every second. Notice how you can add some text into the `<input>`, updating its value, but the text doesn’t disappear when the component re-renders:
- After rendering is done and React updated the DOM, the browser will repaint the screen. Although this process is known as “browser rendering”, we’ll refer to it as “painting”

## State as a snapshot 

- Setting state requests a new re-render, but does not change it in the already running code
- “Rendering” means that React is calling your component, which is a function. The JSX you return from that function is like a snapshot of the UI in time. Its props, event handlers, and local variables were all calculated using its state at the time of the render.

![](/images/react_state_1.png)

- State actually “lives” in React itself—as if on a shelf!—outside of your function. When React calls your component, it gives you a snapshot of the state for that particular render. Your component returns a snapshot of the UI with a fresh set of props and event handlers in its JSX, all calculated using the state values from that render!

![](/images/react_state_2.png)

- 아래 코드를 보자

![](/images/react_state_3.png)

- 버튼 클릭 한 번에 `setNumber` 함수가 세 번 호출된다. 하지만 클릭 하면 숫자는 `1` 밖에 증가하지 않는다
- 왜냐하면 setter 함수는 상태(state)를 코드 실행 중에 바꾸는 것이 아니라, 컴포넌트가 반환되는 시점에 바꾸기 때문이다
- 그래서 함수가 세 번 호출되는 동안 `number`는 계속 `0`이다
- 다시 말해 상태 변수는 렌더링중에는 고정되어 있다

- Setting state requests a new render.
- React stores state outside of your component, as if on a shelf.
- When you call useState, React gives you a snapshot of the state for that render.
- Variables and event handlers don’t “survive” re-renders. Every render has its own event handlers.
- Every render (and functions inside it) will always “see” the snapshot of the state that - React gave to that render.
- You can mentally substitute state in event handlers, similarly to how you think about the rendered JSX.
- Event handlers created in the past have the state values from the render in which they were created.

## Queueing a series of state updates 

- 여러 번의 setter 함수 호출을 다음 렌더링 하나에 반영하고 싶을 때, React 배치 상태 업데이트를 알면 도움이 된다
- 리액트는 이벤트 핸들러 안에 있는 모든 코드를 실행한 후에 상태 변수를 업데이트 한다

<br>

- 만약 다음 렌더링 전까지 여러 번에 걸쳐 상태 값이 바뀌길 원하면, setter 함수 안에 화살표 함수 형태로 인자를 주면 된다. setter 함수 안에 있는 화살표 함수는 상태 값의 이전 값을 바탕으로 값을 변경한다

![](/images/react_state_4.png)

- `n => n + 1` 과 같은 함수를 updater 함수라고 한다
- updater 함수를 사용해서 setter 함수를 작성한 경우 이벤트 핸들러 코드는 다음과 같이 동작한다
  - updater 함수를 큐에 담아두고 먼저 이벤트 핸들러 안에 있는 다른 코드를 모두 실행한다
  - 리액트는 큐에 있는 모든 updater 함수를 지나며 상태를 업데이트 하고 최종 상태를 반환한다
- updater 함수뿐만 아니라 그냥 replace 값도 큐에 저장됨
![](/images/react_state_5.png)

- Setting state does not change the variable in the existing render, but it requests a new render.
- React processes state updates after event handlers have finished running. This is called batching.
- To update some state multiple times in one event, you can use setNumber(n => n + 1) updater function.

## Updating objects in state

- Treat all state in React as immutable.
- When you store objects in state, mutating them will not trigger renders and will change the state in previous render “snapshots”.
- Instead of mutating an object, create a new version of it, and trigger a re-render by setting state to it.
- You can use the {...obj, something: 'newValue'} object spread syntax to create copies of objects.
- Spread syntax is shallow: it only copies one level deep.
- To update a nested object, you need to create copies all the way up from the place you’re updating.
- To reduce repetitive copying code, use Immer.

# 참고

- [Adding Interactivity, react.dev](https://react.dev/learn/adding-interactivity)
- [React re-renders guide: everything, all at once, Developer Way](https://www.developerway.com/posts/react-re-renders-guide#part2)
- [Re-rendering Components in ReactJS, Geeksforgeeks](https://www.geeksforgeeks.org/re-rendering-components-in-reactjs/)
- [How and when to force a React component to re-render, LogRocket](https://blog.logrocket.com/how-when-to-force-react-component-re-render/)