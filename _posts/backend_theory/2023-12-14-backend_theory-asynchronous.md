---
layout: post
title:  '[Backend Thoery] 비동기 프로그래밍'
description: 
date:   2023-12-14 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 비동기란

- 비동기는 코드의 실행 순서와 실행에 대한 결과의 순서가 일치하는 것을 보장하지 않는 방식을 말한다
- 보통 코드 내에서 시간이 오래 걸리는 작업을 하나의 비동기 함수로 묶는다
- 비동기는 대부분 논블로킹(non-blocking)이기 때문에, 비동기 함수가 자신이 실행되는 동안 다른 코드의 실행을 막지 않는다
- 네트워크 비용이 있는 작업 또는 I/O 작업은 보통 시간이 오래 걸리기 때문에, 이러한 작업들을 비동기 함수로 만든다
- 참고로 비동기 함수 내부는 동기적으로 실행된다

# 백엔드에서 비동기가 필요한 때

- 비동기 프로그래밍은 시간이 오래 걸리는 작업을 백그라운드로 실행하고, 그동안 다른 작업을 계속 진행한다
- 그렇기 때문에 비동기 프로그래밍은 사용자 경험을 향상시키고, 서버를 효율적으로 실행하는데 중요한 역할을 한다


# 자바스크립트에서 비동기 구현 방식

- 자바스크립트에서는 비동기 프로그래밍을 지원 하기 위해 콜백함수, 프로미스, async/await 패턴을 사용한다

# 참고

- [동기 vs. 비동기 통신: 백엔드 시스템 설계의 핵심, onejaejae](https://velog.io/@onejaejae/%EB%B9%84%EB%8F%99%EA%B8%B0-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EB%B9%84%EB%8F%99%EA%B8%B0-IO-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%BB%A4%EB%AE%A4%EB%8B%88%EC%BC%80%EC%9D%B4%EC%85%98-%EB%B9%84%EB%8F%99%EA%B8%B0asynchronous)
- [백엔드 개발자들이 알아야할 동시성 2 — 블로킹과 논블로킹, 동기와 비동기, Choi Geonu](https://choi-geonu.medium.com/%EB%B0%B1%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%93%A4%EC%9D%B4-%EC%95%8C%EC%95%84%EC%95%BC%ED%95%A0-%EB%8F%99%EC%8B%9C%EC%84%B1-2-%EB%B8%94%EB%A1%9C%ED%82%B9%EA%B3%BC-%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9-%EB%8F%99%EA%B8%B0%EC%99%80-%EB%B9%84%EB%8F%99%EA%B8%B0-e11b3d01fdf8)
- [비동기 프로그래밍 - 간단한 고찰, 도림.로그](https://d0lim.com/blog/2023/07/async-programming-0/)
- [완벽히 이해하는 동기/비동기 & 블로킹/논블로킹, 인파](https://inpa.tistory.com/entry/%F0%9F%91%A9%E2%80%8D%F0%9F%92%BB-%EB%8F%99%EA%B8%B0%EB%B9%84%EB%8F%99%EA%B8%B0-%EB%B8%94%EB%A1%9C%ED%82%B9%EB%85%BC%EB%B8%94%EB%A1%9C%ED%82%B9-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC)