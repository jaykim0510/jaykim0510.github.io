---
layout: post
title:  'Network Series [Part8]: 네트워크 활용편(2) REST API'
description: 
date:   2022-07-14 15:01:35 +0300
image:  '/images/rest_logo.png'
logo_image: '/images/cs_logo.jpeg'
categories: CS
tags: Network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---  

# HTTP API? REST API?
HTTP API와 REST API는 사실 거의 같은 의미로 사용됩니다. 그런데 디테일하게 들어가면 차이가 있습니다. HTTP API는 HTTP를 사용해서 서로 정해둔 스펙으로 데이터를 주고 받으며 통신하는 것으로 이해하시면 됩니다. 그래서 상당히 넓은 의미로 사용됩니다. 반면에 REST API는 HTTP API에 여러가지 **제약 조건이 추가**됩니다.  

REST는 다음 4가지 제약조건을 만족해야 합니다.  

- 자원의 식별
- 메시지를 통한 리소스 조작
- 자기서술적 메서지
- 애플리케이션의 상태에 대한 엔진으로서 하이퍼미디어

여러가지가 있지만 대표적으로 구현하기 어려운 부분이 마지막에 있는 부분인데요. 이것은 HTML처럼 하이퍼링크가 추가되어서 다음에 어떤 API를 호출해야 하는지를 해당 링크를 통해서 받을 수 있어야 합니다.  

그리고 이런 부분을 완벽하게 지키면서 개발하는 것을 RESTful API라고 하는데요. 실무에서 이런 방법으로 개발하는 것은 현실적으로 어렵고, 또 추가 개발 비용대비 효과가 있는 것도 아닙니다.  

그런데 이미 많은 사람들이 해당 조건을 지키지 않아도 REST API라고 하기 때문에, HTTP API나 REST API를 거의 같은 의미로 사용하고 있습니다. 하지만 앞서 말씀드린 것 처럼 엄격하게 위의 내용들을 모두 지켜야 REST API라고 할 수 있습니다.(하지만 다들 HTTP API를 REST API라고 이미 하고 있기 때문에, 누군가 REST API라고 하면 그냥 아~ HTTP API를 이야기 하는구나 라고 생각하고 들으시면 됩니다. 물론 엄격하게는 다릅니다.)  

<iframe width="560" height="315" src="https://www.youtube.com/embed/RP_f5dMoHFc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# REST API

- **REpresentational State Transfer**
- 프론트엔드에서 백엔드의 데이터를 가져올 때 가장 많이 사용하는 자원 식별/처리 방식
- URI로 자원을 요청하여 특정 형태로 표현
- HTTP API를 활용해 행동을 표현
- REST API의 요청에 대한 응답은 대체로 JSON으로 표현

- REST API는 무상태(Stateless)환경에서 동작하는 것을 전제로 함
- 따라서 보안 및 인증에 대해서는 JWT(JSON Web Token), OAuth와 같은 토큰 인증이 사용
- 상태 유지를 위한 세션(Sessions)은 사용하지 않음
- 자주 사용하는 자원에 대해서는 ETag, Last-Modified 헤더를 통한 캐싱도 가능

# RESTful

- URI로 자원을 표현하고, HTTP Method로 행동을 표현

## URI 규칙

|**규칙**|**좋은 예**|**나쁜 예**|
|마지막이 /로 끝나면 안된다|http://api.test.com/users|http://api.test.com/users/|
|_대신 -를 사용한다|http://api.test.com/tag/rest-api|http://api.test.com/tag/rest_api|
|소문자로 구성한다|http://api.test.com/tag/rest-api|http://api.test.com/tag/REST-api|
|동사 URI로 포함시키지 않는다|http://api.test.com/user/1|http://api.test.com/delete-user/1|
|파일 확장자는 표시하지 않는다|http://api.test.com/users/1/profile|http://api.test.com/users/1/profile.png|

## HTTP Method 활용

- 행위에 대한 표현은 URI에서 하지 않고 HTTP Method를 이용하도록 한다
- 가장 많이 사용하는 메서드는 GET, POST, PUT, DELETE 이다

![](/images/rest_1.png)

|상태코드|설명|
|200 OK|요청이 올바르게 수행되었음(GET, PUT)|
|201 Created|서버가 새로운 리소스를 생성했음(POST)|
|204 No Content|응답할 데이터가 없음(HTTP Body가 없음) (DELETE, PUT)|
|400 Bad Request|요청이 잘못되었음|
|401 Unauthorized|인증(로그인)이 필요함|
|403 Forbidden|로그인 되었으나 해당 자원에 대한 권한이 없음|
|404 Not Found|존재하지 않는 자원에 대해 요청했음 (URI가 잘못된 경우?)|
|405 Method Not Allowed|자원이 지원하지 않는 메소드임 (Method가 잘못된 경우?)|
|409 Confilct|비지니스 로직상 요청을 처리하지 못한 경우|
|429 Too Many Requests|요청을 너무 많이한 경우|

# 참고

- [이영한님의 HTTP API와 REST API의 차이에 관한 질문에 대한 답변](https://www.inflearn.com/questions/126743){:target="_blank"}
- [REST 논문을 정리한 자료](https://restfulapi.net/){:target="_blank"}
- [정상우, REST를 보다 RESTful 하게 API 만들기](https://pronist.dev/146){:target="_blank"}
- [위키백과 REST](https://ko.wikipedia.org/wiki/REST){:target="_blank"}