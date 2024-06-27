---
layout: post
title:  '[Next.js]: 렌더링'
description: Next.js의 렌더링 방법에 대해 배운다
date:   2024-02-03 15:01:35 +0300
image:  '/images/next_logo.png'
logo_image: '/images/next_logo.png'
category: frontend
tag: nextjs
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 렌더링

- 렌더링은 코드를 UI로 전환하는 과정을 의미한다
- 렌더링은 HTML, CSS, JS 코드를 파싱하여 브라우저에 시각적으로 출력하는 것을 말한다


- 리액트와 Next.js에서는 코드를 조각으로 나누어 일부는 서버에서, 일부는 클라이언트에서 렌더링할 수 있도록 한다


## 클라이언트 렌더링

### 리액트 등장 이전의 클라이언트 렌더링

![](/images/nextjs_rendering_1.png)

- 클라이언트가 서버에게 HTML, CSS, JS 코드를 요청한다
- (정확히는 index.html과 같은 HTML 페이지를 먼저 요청하고, HTML을 파싱하는 도중에 CSS 파일을 로드하는 link 태그, JS 파일을 로드하는 script 태그를 만나면 HTML의 파싱을 중단하고 해당 리소스 파일을 서버로 요청한다)
- 클라이언트는 서버로부터 응답된 HTML과 CSS를 파싱하여 DOM과 CSSDOM을 생성하고 이들을 결합해 렌더 트리를 생성한다
- 렌더 트리를 기반으로 HTML 요소의 레이아웃을 계산하고 브라우저 화면에 HTML 요소를 페인팅 한다

### 리액트 등장 이후의 클라이언트 렌더링

- 리액트 등장한 이후로 변했다
- 이제는 JS 코드를 읽으면서 DOM과 CSSDOM을 만들어 빈 HTML 코드의 루트 노드에 DOM을 붙이고 렌더링한다
- 그래서 HTML 파일이 사실상 텅 비어있다 보니 이로 인한 단점이 있다
  - SEO 성능이 떨어진다
  - 초기 접속시 생기는 로딩이 길다

## 서버 렌더링

- 랜딩 페이지 또는 검색엔진에 노출되었으면 하는 데이터를 포함하는 페이지 정도는 처음부터 HTML이 꽉채워져 있었으면 좋겠다
- 이러한 페이지들은 서버에서 미리 JS 코드를 실행해서 HTML 코드를 미리 만들어 놓는다


### 리액트v18 에서의 서버 렌더링

- 리액트 18 버전부터 서버 렌더링은 조금 다르다
- 리액트에서는 'SPA의 컴포넌트 단위 렌더링이 가능하다'는 장점을 활용하기 위해 페이지 내에서 일부 컴포넌트는 서버 렌더링, 일부 컴포넌트는 클라이언트 렌더링 이런식으로 최적화하려고 한다
- 그래서 서버 렌더링이라고 해서 서버에서 HTML을 만들어서 리턴하는 것이 아니라,
- 서버 컴포넌트에서는 RSC Payload라는 것을 리턴하도록 해서, 클라이언트 컴포넌트에서는 JS 인스트럭션과 결합해 DOM을 만든다

- 서버 컴포넌트에서는 DOM 만들기 직전까지의 과정을 서버에서 실행하고,
- 클라이언트 컴포넌트는 DOM 만들기 직전까지의 과정을 클라이언트에서 실행하고,
- 마지막에 DOM을 실제로 화면에 페인팅 하는 과정은 브라우저(클라이언트)에서 한다



# Next.js에서의 렌더링

- Next.js에서는 렌더링 되는 요소를 크게 서버 컴포넌트와 클라이언트 컴포넌트로 나눈다

## 서버 컴포넌트

- 서버 컴포넌트는 서버에서 렌더링 되는 요소를 말한다
- Next.js에서는 기본적으로 서버 컴포넌트를 사용한다

### 서버 컴포넌트의 장점

- 서버 컴포넌트는 렌더링이 서버에서 일어나기 때문에, 데이터가 모두 담겨있는 HTML 을 반환한다
- 검색 엔진에 비어있는 무의미한 HTML이 아닌, 데이터가 채워진 유의미한 HTML이 노출되게 되고, 결과적으로 SEO 성능이 높아진다
- 데이터가 이미 모두 담겨진 HTML이기 때문에, 추가로 다운로드, 파싱, 실행과 같은 과정 없이 초기에 빠른 페이지 로딩이 가능하다

### 서버 렌더링 방식

- 서버 컴포넌트는 쿠키나 쿼리 파라미터 같은, 요청이 들어올 때 알 수 있는 데이터를 가지고 있는지에 따라 렌더링 방식이 달라진다

#### Static Rendering

- 쿠키나 쿼리 파라미터가 없다면, 빌드 타임에 이미 완성된 HTML 을 렌더링 해놓을 수 있는데 이를 Static Rendering이라고 한다

#### Dynamic Rendering

- 있다면, 런타임에 요청이 들어왔을 때, 서버에서 데이터를 패칭 & 렌더링 해서 완성된 HTML을 반환하는데 이를 Dynamic Rendering이라고 한다
- 이렇게 반환한 완성된 HTML을 캐시해두면, 다음에는 런타임에 패칭 & 렌더링 작업을 생략할 수 있게 되고 결국 Static Rendering으로 자동 전환된다
- Dynamic Rendering 할지, Static Rendering 할지 선택하기 위해 개발자가 추가로 설정할 요소는 없다. Next.js에서 알아서 최적화 한다


## 클라이언트 컴포넌트

- 클라이언트 컴포넌트는 보통 `useQuery`, `useState`, `useEffect` 등과 같은 훅을 사용하는 경우에 해당한다
- 또, `onClick`, `onChange` 같은 인터랙티브한 요소가 포함된 경우 클라이언트 컴포넌트가 된다
- `'use client'` 를 컴포넌트 최상단에 표기해야 한다
- 서버 컴포넌트가 항상 서버에서 렌더링 되었으니, 클라이언트 컴포넌트는 항상 클라이언트에서 렌더링 되겠지? 라고 생각하면 안된다
- full page load (애플리케이션 초기 방문 또는 새로고침)인지 subsequent navigation 인지에 따라 클라이언트 컴포넌트의 렌더링 방식이 달라진다
- full page load의 경우 클라이언트 컴포넌트는 서버에서 HTML로 만들어진다
- HTML은 이후 클라이언트에 전달되고, 이 후 JS instruction은 클라이언트 컴포넌트를 hydration 하고, UI를 인터랙티브 하게 만들어준다
- full page load가 아닌 경우에는, 모든 렌더링이 클라이언트에서 이루어진다


# 참고

- [Rendering, Next.js](https://nextjs.org/docs/app/building-your-application/rendering)
- [React 서버 컴포넌트를 사용해야 하는 이유와 방법, freeCodeCamp](https://www.freecodecamp.org/korean/news/how-to-use-react-server-components/)