---
layout: post
title:  '[React]: Intro'
description: 리액트에 대한 소개와, 리액트의 특징에 대해 배운다
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

# 리액트

- 리액트는 2013년 페이스북에서 공개한 프론트엔드 라이브러리이다
- 컴포넌트 기반으로 유저 인터페이스(UI)를 만들도록 해준다

# 리액트의 특징

## Virtual DOM

- Virtual DOM은 메모리에 구현해놓은 가상 DOM을 말한다
- 기존의 Virtual DOM과 컴포넌트 함수 재실행으로 변경된 Virtual DOM을 비교해, 변경된 부분을 React DOM에 알린다
- React DOM은 Real DOM과 비교해 변경된 부분만 Real DOM에 업데이트 하여 재렌더링 한다
- Virtual DOM은 다수의 변경을 그룹화 하여 한 번에 처리해주기 때문에 렌더링 성능을 개선해준다
- 개발자는 직접 Real DOM을 조작하는 명령형 코드가 아닌, 원하는 상태를 기술하는 선언형 코드를 통해 DOM 조작을 프레임워크에 위임한다

![](/images/react_frontend_2.png)

## 선언형 UI

- 직접 UI가 어떻게 변경되어야 하는지에 관해 명령형으로 코드를 작성하지 않고, 원하는 UI의 상태에 관해 선언적으로 코드를 작성한다
- 프레임워크가 선언된 UI 상태와 일치하도록 알아서 렌더링한다
- 선언형 UI는 코드의 유지보수성을 높여준다

## 컴포넌트 기반

- SPA의 등장으로, 렌더링 단위가 페이지 단위에서 컴포넌트 단위로 변화함에 따라 컴포넌트 기반으로 UI를 개발하는게 선호되었다
- 컴포넌트 기반 개발은 코드의 재사용성이 더 높인다

![](/images/react_frontend_3.png)


## 단방향 데이터 전달

- 컴포넌트간의 데이터 전달을 양방향이 아닌 단방향으로 한정함으로써 상태 관리를 좀 더 쉽게 할 수 있게 되었다
- (양방향은 상태 변화의 흐름을 추적하기 어려워, 문제가 발생했을 때 문제의 원인을 찾기 힘들게 만들었다)
- (Angular, Vue는 양방향을 사용한다)
- 부모 컴포넌트에서 자식 컴포넌트로만 데이터를 전달할 수 있다


# JSX

- **J**ava**S**cript **X**ML 
- 자바스크립트 코드 안에 HTML 코드를 작성하기 위해 만든 문법이다
- 리액트에서 **컴포넌트를 만들기 위해 사용하는 문법**이다


```jsx
function App() {
    return (
        <div>
            <h1>Hello React!</h1>
        </div>
    )
}
```

<div class="fan-para">
    <div class="fan-bar">
      <i class="fa-solid fa-fan"></i>
      JSX 등장 배경
    </div>
    <div class="fan-content">
      <p>예전에는 HTML, CSS, JS를 모두 분리해서 작성했다. 하지만 컴포넌트를 지향하는 모던 프론트엔드에 오면서 JS 컴포넌트 파일 하나에 HTML, CSS를 같이 관리하는 방법이 선호되게 되었다. JSX는 HTML 코드를 JS 코드 안에서 작성하도록 해준다</p>
    </div>
</div>


# 렌더링

- HTML 코드가 사용자의 화면에 나타나기 까지의 과정을 렌더링이라 한다
- Ajax와 SPA의 등장으로 페이지 단위 렌더링에서 컴포넌트 단위의 렌더링이 가능하게 됐다
- 리액트에서는 크게 두 가지 렌더링이 있다: 초기 렌더링(initial-rendering), 리렌더링(re-rendering)

## 초기 렌더링

- 사용자가 처음 사이트에 접속할 때, 리액트는 root라는 진입점을 만들어 그 밑에 우리가 만든 컴포넌트로 묶인 DOM 트리를 연결한다

![](/images/react_intro_3.png)

- `root.render(<App/>)` 로 초기 렌더링을 실행한다

![](/images/react_intro_2.png)

## 리렌더링

- 컴포넌트 안에 있는 데이터가 변경되면 리액트는 이것을 감지해 해당 컴포넌트를 리렌더링 한다
- 리액트는 감지할 데이터를 상태(state)라고 한다
- 즉, 상태에 변경이 감지되면 리액트는 컴포넌트를 업데이트 하기위해 해당 상태를 포함하는 컴포넌트를 리렌더링 한다

![](/images/react_intro_4.png)

# 리액트 훅

- 리액트에서는 상태 관리, 요소 참조와 같은 여러 기능들을 쉽게 사용할 수 있도록 훅(hook)으로 제공한다
- React 16.8 버전에 새로 추가된 기능으로, 함수형 컴포넌트 안에서만 사용할 수 있다
- 자주 사용하는 훅으로는 `useState()`, `useEffect()`, `useRef()`, `useMemo()` 등이 있다


# 참고

- [Render and Commit, react.dev](https://react.dev/learn/render-and-commit)
- [리액트란?, 코딩젤리](https://life-with-coding.tistory.com/505)
- [[React] - What is a Root Element in React?, She Codes](https://www.shecodes.io/athena/10150-what-is-a-root-element-in-react)
