---
layout: post
title:  'Network Series [Part8]: 네트워크 활용편(2) REST API'
description: 
date:   2022-07-14 15:01:35 +0300
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

# HTTP API? REST API?
- HTTP API와 REST API는 사실 거의 같은 의미 
- HTTP API는 HTTP를 사용해서 서로 정해둔 스펙으로 데이터를 주고 받으며 통신하는 것
- REST API는 HTTP API에 여러가지 **제약 조건이 추가**  

REST는 다음 4가지 제약조건을 만족해야 한다.  

- 자원의 식별
- 메시지를 통한 리소스 조작
- 자기 서술적 메세지
- 애플리케이션 상태에 대한 엔진으로서 하이퍼미디어 (대표적으로 구현하기 어려운 부분)

여러가지가 있지만 대표적으로 구현하기 어려운 부분이 마지막에 있는 부분인데요. 이것은 HTML처럼 하이퍼링크가 추가되어서 다음에 어떤 API를 호출해야 하는지를 해당 링크를 통해서 받을 수 있어야 합니다.  

그리고 이런 부분을 완벽하게 지키면서 개발하는 것을 RESTful API라고 하는데요. 실무에서 이런 방법으로 개발하는 것은 현실적으로 어렵고, 또 추가 개발 비용대비 효과가 있는 것도 아닙니다.  

그런데 이미 많은 사람들이 해당 조건을 지키지 않아도 REST API라고 하기 때문에, HTTP API나 REST API를 거의 같은 의미로 사용하고 있습니다.  

<iframe width="560" height="315" src="https://www.youtube.com/embed/RP_f5dMoHFc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# REST API

- **REpresentational State Transfer**
- 프론트엔드에서 백엔드의 데이터를 가져올 때 가장 많이 사용하는 자원 식별/처리 방식
- 웹의 기존 기술과 HTTP 프로토콜을 그대로 활용하기 때문에 웹의 장점을 최대한 활용할 수 있는 아키텍처
- URI로 자원을 요청하여 특정 형태로 표현
- HTTP API를 활용해 행동을 표현
- 웹 사이트의 이미지, 텍스트, DB 내용 등의 모든 자원에 고유한 ID인 HTTP URI를 부여
- REST API의 요청에 대한 응답은 대체로 JSON으로 표현

- REST API는 무상태(Stateless)환경에서 동작하는 것을 전제로 함
- 따라서 보안 및 인증에 대해서는 JWT(JSON Web Token), OAuth와 같은 토큰 인증이 사용
- 상태 유지를 위한 세션(Sessions)은 사용하지 않음
- 자주 사용하는 자원에 대해서는 ETag, Last-Modified 헤더를 통한 캐싱도 가능

```
HTTP URI(Uniform Resource Identifier)를 통해 자원(Resource)을 명시하고, 
HTTP Method(Post, Get, Put, Delete)를 통해 해당 자원에 대한 CRUD Operation을 적용하는 것을 의미한다.
```

## REST 장단점

* 장점
  * 여러 가지 서비스 디자인에서 생길 수 있는 문제를 최소화해준다.
  * Hypermedia API의 기본을 충실히 지키면서 범용성을 보장한다.
  * HTTP 프로토콜의 표준을 최대한 활용하여 여러 추가적인 장점을 함께 가져갈 수 있게 해준다.
* 단점
  * 브라우저를 통해 테스트할 일이 많은 서비스라면 쉽게 고칠 수 있는 URL보다 Header 값이 왠지 더 어렵게 느껴진다.
  * 구형 브라우저가 아직 제대로 지원해주지 못하는 부분이 존재한다.
    * PUT, DELETE를 사용하지 못하는 점
    * pushState를 지원하지 않는 점

## REST 구성 요소
  1. 자원(Resource): URI
      * 모든 자원에 고유한 ID가 존재하고, 이 자원은 Server에 존재한다.
      * 자원을 구별하는 ID는 '/groups/:group_id'와 같은 HTTP **URI** 다.
      * Client는 URI를 이용해서 자원을 지정하고 해당 자원의 상태(정보)에 대한 조작을 Server에 요청한다.
  2. 행위(Verb): HTTP Method
      * HTTP 프로토콜의 Method를 사용한다.
      * HTTP 프로토콜은 **GET, POST, PUT, DELETE, HEAD** 와 같은 메서드를 제공한다.
  3. 표현(Representation of Resource)
      * Client가 자원의 상태(정보)에 대한 조작을 요청하면 Server는 이에 적절한 응답(Representation)을 보낸다.
      * REST에서 하나의 자원은 **JSON, XML, TEXT, RSS** 등 여러 형태의 Representation으로 나타내어 질 수 있다.
      * JSON 혹은 XML를 통해 데이터를 주고 받는 것이 일반적이다.

# RESTful

- URI로 자원을 표현하고, HTTP Method로 행동을 표현

## RESTful의 개념
- RESTful은 일반적으로 REST라는 아키텍처를 구현하는 웹 서비스를 나타내기 위해 사용되는 용어이다.
  - 즉, REST 원리를 따르는 시스템은 RESTful이란 용어로 지칭된다.
- RESTful은 REST를 REST답게 쓰기 위한 방법으로, 누군가가 공식적으로 발표한 것이 아니다.

## RESTful의 목적
- 이해하기 쉽고 사용하기 쉬운 REST API를 만드는 것
- RESTful API를 구현하는 근본적인 목적이 퍼포먼스 향상에 있는게 아니라, 일관적인 컨벤션을 통한 API의 이해도 및 호환성을 높이는게 주 동기이니, 퍼포먼스가 중요한 상황에서는 굳이 RESTful API를 구현하실 필요는 없습니다.

## RESTful 하지 못한 경우
- Ex1) CRUD 기능을 모두 POST로만 처리하는 API
- Ex2) route에 resource, id 외의 정보가 들어가는 경우(/students/updateName)

## URI 규칙

|**규칙**|**좋은 예**|**나쁜 예**|
|마지막이 /로 끝나면 안된다|http://api.test.com/users|http://api.test.com/users/|
|_대신 -를 사용한다|http://api.test.com/tag/rest-api|http://api.test.com/tag/rest_api|
|소문자로 구성한다|http://api.test.com/tag/rest-api|http://api.test.com/tag/REST-api|
|동사를 URI로 포함시키지 않는다|http://api.test.com/user/1|http://api.test.com/delete-user/1|
|파일 확장자는 표시하지 않는다|http://api.test.com/users/1/profile|http://api.test.com/users/1/profile.png|
|리소스 간에는 연관 관계가 있는 경우||http://api.test.com/users/{userid}/devices|

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
- [WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview/blob/master/contents/network.md#http%EC%99%80-https-%EB%8F%99%EC%9E%91-%EA%B3%BC%EC%A0%95){:target="_blank"}
- [REST 논문을 정리한 자료](https://restfulapi.net/){:target="_blank"}
- [정상우, REST를 보다 RESTful 하게 API 만들기](https://pronist.dev/146){:target="_blank"}
- [위키백과 REST](https://ko.wikipedia.org/wiki/REST){:target="_blank"}