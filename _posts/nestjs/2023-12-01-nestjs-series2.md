---
layout: post
title:  '[NestJS] Intro'
description: 
date:   2023-12-01 15:01:35 +0300
image:  '/images/nest_logo.png'
logo_image: '/images/nest_logo.png'
category: backend
tag: NestJS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# NestJS란

- node.js 런타임 위에서 동작하는 백엔드 프레임워크
- HTTP 요청과 같은 기본적인 기능은 디폴트로 Express를 사용하고 있음 (Fastify로 교체 가능)

# Express와 비교

- Express를 래핑한 NestJS를 통해 얻게 되는 이점은 다음과 같다
  - 구조화되어 있는 아키텍처
  - Typescript 친화적
  - 강력한 CLI 제공
  - OOP 개발의 핵심 개념인 제어의 역전을 위해 필요한 의존성 주입 기능을 제공


# NestJS 시작하기

- Nest CLI 사용하면 쉽게 템플릿 코드 생성할 수 있음

- Nest CLI 설치

```
npm i -g @nestjs/cli
```

- 템플릿 코드 생성

```
nest new .
```

- 개발 서버 실행

```
npm run start:dev
```

# NestJS 코드 구조

- NestJS는 코드를 모듈화 함으로써 재사용성을 높임
- 시작점이 되는 루트 모듈과, 각각의 기능을 분리시켜 놓은 모듈로 이루어짐

![](/images/nest_2.png)

- NestJS는 크게 다음과 같은 요소들로 이루어짐
  - **Module**: 모듈화 하는 역할
  - **Controller**: 요청을 받고 응답을 돌려주는 역할
  - **Service**: 비즈니스 로직을 수행하는 역할
  - **Repository**: DB와 관련된 작업을 수행하는 역할
  - **DTO**: 데이터를 검증하고, 변환하는 역할
  - **Middleware**: 요청과 관련된 공통적으로 자주 사용되는 작업을 수행하는 역할 (NestJS에서는 Middleware보다는 Guard, Interceptor, Pipe 사용 권장)
  - **Guard**: 인증/인가와 관련된 작업을 수행하는 역할
  - **Interceptor**: Middleware와 역할이 비슷하지만, 다른 점은 Interceptor는 요청 뿐만 아니라, 응답에 대해서도 가능
  - **Pipe**: 데이터가 Controller에게 전달되기 전에 검증/변환하는 역할
  - **Filter**: 예외를 처리하는 역할

# NestJS Request Lifecycle

![](/images/nest_3.png)

- NestJS 백엔드 어플리케이션 안에서 요청(Request) 객체는 다음과 같은 순서로 순회한다
  - Middleware -> Guard -> Interceptor -> Pipe -> Controller -> Service
  - Guard, Interceptor, Pipe에 대해 글로벌, 컨트롤러, 핸들러 스코프 순서로 순회
- Service에서 반환한 응답(Response) 객체는 다음과 같은 순서를 순회하고 유저에게 반환된다
  - Service -> Controller -> Interceptor -> Filter
  - Interceptor, Filter에 대해 핸들러, 컨트롤러, 글로벌 스코프 순서로 순회
