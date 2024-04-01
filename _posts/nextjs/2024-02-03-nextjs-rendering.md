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

## Next.js에서의 서버 렌더링

- Static Rendering
  - 빌드 타임에
  - (데이터 변경되면 백그라운드에서)
- Dynamic Rendering
  - 쿠키나 쿼리 파라미터 같은 요청을 받을 때 알 수 있는 데이터를 가지고 있는 라우트의 경우
  - 요청 때 받은 데이터를 캐시해두면 다음부터는 다시 자동으로 Static Rendering으로 전환됨
  - Dynamic Redering하기 위해 뭘 할 필요는 없다. 그냥 필요하면 알아서 한다
  - As a developer, you do not need to choose between static and dynamic rendering as Next.js will automatically choose the best rendering strategy for each route based on the features and APIs used. Instead, you choose when to cache or revalidate specific data, and you may choose to stream parts of your UI.
- Streaming
  - 점진적으로 렌더링
  - loading.js 또는 서스펜스를 사용하는 것이 Streaming의 일종



# 서버 컴포넌트

- React Server Components allow you to write UI that can be rendered and optionally cached on the server
- Next.js는 디폴트로 서버 컴포넌트를 사용한다






여기서 RSC의 가장 큰 장점이 나옵니다. 클라이언트로 내려보내는 JavaScript 번들 크기를 줄일 수 있게 되는 것이죠. 뿐만아니라 데이터베이스와 보다 가까운 곳에서 데이터를 조회하기 때문에 속도도 더 빨라질 수 있습니다



# 클라이언트 컴포넌트

- Client Components allow you to write interactive UI that is prerendered on the server and can use client JavaScript to run in the browser
- `'use client'`
- 클라이언트 컴포넌트 안에 임포트된 다른 모듈은 모두 클라이언트 모듈로 간주된다

- full page load (애플리케이션 초기 방문 또는 새로고침)인지 subsequent navigation 인지에 따라 클라이언트 컴포넌트의 렌더링 방식이 달라진다
- full page load의 경우 클라이언트 컴포넌트는 서버에서 HTML로 만들어진다
- HTML은 즉시 클라이언트에 전달되고, 이 후 JS instruction은 클라이언트 컴포넌트를 hydration 하고, UI를 인터랙티브 하게 만들어준다
- On subsequent navigations, Client Components are rendered entirely on the client, without the server-rendered HTML.




# Server Components

- React Server Components allow you to write UI that can be rendered and optionally cached on the server. In Next.js, the rendering work is further split by route segments to enable streaming and partial rendering, and there are three different server rendering strategies:
  - Static Rendering
  - Dynamic Rendering
  - Streaming
- Next.js는 디폴트로 서버 렌더링을 사용한다



## 서버렌더링의 장점


## 서버 컴포넌트는 어떻게 렌더링 되는가

- 렌더링은 라우트 세그먼트와 서스펜스 바운더리에 의해 구분된 조각 단위로 작업이 이루어진다


잠깐, RSC는 서버 사이드 렌더링(SSR)과 동일하지 않나요?
아니요, 그렇지 않습니다. RSC와 SSR 둘 다 이름에 "서버"라는 단어가 들어가 있지만 비슷한 부분은 이 뿐입니다.

서버 사이드 렌더링(SSR)에서는, 서버에서 날것의 HTML을 클라이언트로 보내고, 그런 다음 모든 클라이언트 사이드 자바스크립트가 다운로드됩니다. React는 HTML을 상호작용 가능한 React 컴포넌트로 변환하기 위해 하이드레이션(hydration) 프로세스를 시작합니다. SSR에서 컴포넌트는 서버에 머무르지 않습니다.

지금까지 React 서버 컴포넌트를 통해 컴포넌트가 서버에 남아 있고 네트워크 왕복을 거치지 않고 서버 인프라에 액세스할 수 있음을 알게 되었습니다.

SSR은 애플리케이션의 초기 페이지를 더 빠르게 로드하는 데 유용합니다. 앞으로 SSR과 RSC를 문제없이 함께 사용할 수 있습니다.

# Hydration



# 참고

- [Rendering, Next.js](https://nextjs.org/docs/app/building-your-application/rendering)
- [React 서버 컴포넌트를 사용해야 하는 이유와 방법, freeCodeCamp](https://www.freecodecamp.org/korean/news/how-to-use-react-server-components/)