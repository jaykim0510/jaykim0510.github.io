---
layout: post
title:  '[Network] CORS'
description: 
date:   2022-02-15 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# Same Origin Policy

- **브라우저가 리소스를 로드할 때, URL에 표기된 오리진과 동일한 오리진의 리소스만 허용한다는 의미**이다
- 자바스크립트의 **fetch API는 same origin 만 허용**하는 정책을 가진다
- (반면에 `<img>`, `<script>`, `<link>` 태그는 cross origin을 허용하는 정책을 기본적으로 지원한다)

## Origin

- `프로토콜 + 도메인 + 포트` 을 오리진(origin)이라고 한다 (ex. `http://www.example.com:3000`)
- 프로토콜, 도메인, 포트 중 하나라도 다르면 다른 오리진이다 (cross origin)


## Cross Origin

- 브라우저를 통해 접속한 우리의 서비스의 URL이 `http://www.example.com:3000`인데, 요청한 리소스가 위치한 오리진이 `http://api-example.com:8080` 이라면 이는 cross-origin 환경이다
- fetch API는 same origin만 허용하기 때문에, 이를 위해서는 **특정 cross-origin을 허용하도록 해야한다**
- 그렇지 않으면 서버가 응답을 하더라도, **브라우저에서 이를 차단한다**


# CORS

- **C**ross-**O**rigin **R**esource **S**haring
- 다른 오리진에 있는 리소스의 로드를 허용하는 것을 말한다
- 쉽게 말해, 프론트엔드가 서빙된 서버에서 백엔드 서버에 있는 데이터를 가져올 수 있도록 하는 것을 말한다

## CORS는 백엔드에서 설정

- CORS는 허용된 오리진을 표기하는 것이다
- HTTP 응답의 `Access-Control-Allow-Origin` 헤더에 표기한다

## CORS 기본 동작

~~나는 CORS가 프론트에서 검증된 백엔드 서버의 데이터만 가져오는 것을 허용하기 위함이라고 생각했었다. 그래서 브라우저가 나쁜 백엔드로부터 착한 프론트를 지키기 위한 용도라고 생각했었다. 근데 CORS 설정을 백엔드에서 한다고 생각하니 갑자기 혼란스러워졌다. 다시 생각해보니 완전 그 반대인 것 같다. 이 부분에 대해 구글링을 해봤는데, 여러 답변이 있는데 위처럼 정반대인 답변들이 많다. 그래서 나도 정확히 뭐가 정답이라고 확답을 하기는 어렵지만, 아래에서 설명하는 시나리오가 가장 합리적인 것 같아 나는 아래와 같이 이해하고 있다~~

- CORS는 브라우저가 나쁜 프론트를 막기 위함이다

1. 유저가 `http://www.angel.com`에 로그인 했다
2. 로그인 하면서 쿠키에 백엔드 서버(`http://api-angel:8000`)에서 제공해준 `sessionId`를 저장해뒀다
3. 이 후 뜻하지 않게 유저가 `http://www.devil.com` 이라는 피싱사이트에 접속했다
4. 피싱사이트 코드에서 쿠키에 저장해뒀던 `sessionId`를 이용해 `http://api-angel:8000`에 나의 소즁한 데이터를 탈취하기 위해 `fetch(http://api-angel:8000/get-user-private-data)` API를 실행하려고 시도한다
5. 하지만 이 때 브라우저는 자동적으로 `Origin: http://www.devil.com` 헤더도 요청 메세지와 함께 보내며, 이는 의도적으로 변경할 수 없다
6. 백엔드 서버는 응답을 보내지만, `Access-Control-Allow-Origin: http://www.angel.com` 라는 응답 헤더가 있다
7. 브라우저는 요청 헤더에 있던 `Origin: http://www.devil.com` 헤더를 보고,  "요청의 오리진인 http://www.devil.com 은 허용된 오리진이 아닌데?" 라는 판단을 내리고 응답으로 CORS 에러를 반환한다

## credentials 옵션

- 사실 쿠키나 Authorization 헤더의 값은 다른 오리진에 대해서는 요청에 기본적으로 포함되지 않는다
- 다른 오리진일 때, 쿠키 값을 요청에 같이 보내려면 `credentials: true` 라는 옵션을 붙여줘야 한다
- 그리고 이 때, 브라우저가 서버의 응답을 성공적으로 반환하기 위해서는 응답 헤더에도 `Access-Control-Allow-Credentials: true` 가 있어야 한다
- 정리하면, 다른 오리진에 요청을 보낼 때 쿠키값이나 Authorization 헤더 값을 사용하고 싶으면 요청 API 에서도 `credentials: true` 옵션을 붙여야 하고, 이 때 반환되는 응답의 헤더에도 `Access-Control-Allow-Credentials: true` 가 있어야 한다
- (그리고 이 때 응답 헤더에 `Access-Control-Allow-Origin: *` 이렇게 와일드 카드를 표기할 수 없다)
- (`Access-Control-Allow-Credentials: true` 했는데 `Access-Control-Allow-Origin: *`이 가능해지면 정말 최악의 상황이 발생한다. 피싱 사이트가 나의 쿠키 값을 이용해 요청을 보냈는데, 서버가 모든 오리진을 허용하는 바람에 브라우저가 서버를 제지하지 못하고 피싱 사이트에 응답을 반환해 버리게 된다)


## 프록시 서버를 사용할 수도 있다




# 참고

- [Cross-Origin Resource Sharing (CORS), mdn](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [악명 높은 CORS 개념 & 해결법 - 정리 끝판왕, Inpa Dev](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-CORS-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95-%F0%9F%91%8F#%F0%9F%94%8D_%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98_cors_%EA%B8%B0%EB%B3%B8_%EB%8F%99%EC%9E%91_%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0)
- [What is CORS and why is it so annoying, reddit](https://www.reddit.com/r/reactjs/comments/11cyejn/what_is_cors_and_why_is_it_so_annoying/)