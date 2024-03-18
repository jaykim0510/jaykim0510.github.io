---
layout: post
title:  '[Backend Thoery] 에러 핸들링'
description: 
date:   2023-12-12 15:01:35 +0300
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

# Error Handling for REST API

클라이언트가 서버에 HTTP 요청을 보내면, 그리고 서버가 그 요청을 잘 받았다면, 서버는 반드시 클라이언트에게 그 요청이 성공적으로 처리됐는지 아닌지 알려주어야 한다


일반적으로 우리는 500 대 에러를 클라이언트에 보여주면 안됩니다. 500 에러는 요청을 처리하는데 서버에서 예상하지 못한 예외발생 같은 경우에 대한 신호이기 때문입니다. 그러므로, 서버 내부 에러는 클라이언트의 비지니스가 아닙니다.
대신에, 우리는 부지런히 내부에러를 처리하거나 캐치해서 400 대 에러를 내려주어야 합니다. 예를들어, 요청된 자원이 존재하지 않는다면 500 에러가 아닌 404 에러를 주어야 합니다.

컨트롤러에서 BookNotFoundException

잘 보면 이 기본 (Default) 에러 핸들러는 에러가 발생한 시간대(timestamp), HTTP 상태코드, 타이틀(error), 메세지(디폴트로는 빈 메세지), 에러가 발생한 URL 경로가 포함되어 있습니다.

Error가 발생하면 거의 대부분의 경우에는 사용자에게 추가적인 액션을 줘야한다고 생각합니다. 그렇지 않으면 사용자는 무작정 기다리다가 결국 '이거 왜이래. 별로네' 생각하고 서비스를 떠나버릴 것입니다.

개발자 입장에서는 Error 상황을 종료하는 방법이 정해져 있어야 사람이 바뀌거나 세월이 흘러도 항상 일관적인 Error 상황 종료를 할 수 있을 것입니다.

Error 발생원 중에서 가장 예측 가능한 발생원은 Network, API Error라고 생각합니다

Error 처리 방법에 따라서 전역적으로 처리하는게 좋은 경우가 있고 지역적으로 처리하는게 좋은 경우가 있을 것입니다. 이 기준이 세워져 있어야 세월이 흘러도 적절한 위치에서 Error가 처리 될 것입니다. 예를 들어서, HTTP 401 Error는 어떤 API였든간에 인증오류이기 때문에 전역적 처리 로직에서 처리하는게 좋습니다.

400 Bad Request: 요청이 유효하지 않아 서버가 요청을 이해할 수 없음을 의미
401 UnAuthorized: HTTP 표준에서는 UnAuthorized 라고 하지만, 의미상 UnAuthenticated임  로그인이 필요한 페이지에 대해 이 응답을 반환
403 Forbidden: 이게 UnAuthorized에 맞는 응답. 리소스에 필요한 권한을 가지고 있지 않음을 의미
404 Not Found:  서버에 존재하지 않는 API 또는 resource를 요청한 경우
422 Unprocessable Entity: 요청이 올바로 만들어 졌지만, validation이 실패한 경우
429 Too Many Requests: 사용자가 지정된 시간에 너무 많은 요청을 보낸 경우("rate limiting")

500 Internal Server Error: 서버에 문제가 있음을 의미 (보통 백엔드 코드나 데이터베이스에서 에러가 발생한 경우)


400  잘못된 바디, 잘못된 타입, 불필요한 값, 필수값 누락 등  요청을 다시 작성하도록 유도
401  jwt 토큰 누락, 유효하지 않은 jwt 토큰 등  로그인 하도록 유도
403  권한이 없는 경우  이 전 페이지로 돌아가도록 유도
404  존재하지 않는 API 또는 리소스를 요청한 경우  이 전 페이지로 돌아가도록 유도
422  데이터 검증에 실패한 경우  요청을 다시 작성하도록 유도

500  유저에게 지금은 이용할 수 없음을 알리고, 서버에는 로그를 남기고, 개발자에게 알림을 보낸다


# 참고

- [Error Handling(에러 핸들링) - (1) 고민 풀어보기, walkinpcm](https://blog.walkinpcm.com/21)
- [[번역] 자바스크립트 에러 핸들링 방법, jeongkoo](https://velog.io/@cookie004/%EB%B2%88%EC%97%AD-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%97%90%EB%9F%AC-%ED%95%B8%EB%93%A4%EB%A7%81-%EB%B0%A9%EB%B2%95-%EC%86%8C%EA%B0%9C)