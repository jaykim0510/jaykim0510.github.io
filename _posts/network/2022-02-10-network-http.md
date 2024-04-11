---
layout: post
title:  'Network Series [Part4]: 네트워크 프로토콜(1) HTTP'
description: 
date:   2022-02-10 15:01:35 +0300
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

# HTTP

**HTTP(HyperText Transfer Protocol)는 응용 계층(Application layer)에서 압도적으로 많이 사용되는 프로토콜**입니다. 요즘에는 모든 데이터(텍스트, 이미지, 음성, 영상, 파일, JSON 등)를 HTTP 메시지에 담아서 전송합니다.  

HTTP가 하는 역할은 무엇일까요? 저희는 응용 계층에서 데이터를 주고받기 위해(크롬, 사파리와 같은 웹 브라우저에서 뉴스, 사진, 동영상을 보고 물건을 주문하는 것과 같은 행위) 클라이언트는 요청(request), 서버는 응답(response)하는 방식을 사용합니다.  이 때 응용 계층에 있는 단말기(우리의 핸드폰, 노트북 그리고 구글이 가지고 있는 웹 서버와 같은 것들)들이 서로 일관된 방법으로 데이터를 주고받기 위해 규약이 필요했는데 이때 생긴 규약이 바로 HTTP입니다.  

이 때 클라이언트는 **HTTP 메세지를 작성하기 위해 두 가지를 사용**합니다. 바로 **URL**과 **HTTP 메소드**입니다. 

## HTTP 버전 차이

- HTTP/1.1: 1997년에 등장해서 현재까지 가장 많이 사용하는 버전
- HTTP/2:
- HTTP/3: UDP기반으로 개발됨 

## HTTP의 특징

- 클라이언트/서버 구조로 동작 
  - 클라이언트가 request를 보내면 서버가 response를 돌려주는 구조 -> 단방향 통신
- 무상태(Stateless) 프로토콜
  - 서버가 클라이언트의 상태를 보존하지 않음 (그래서 클라이언트가 알아서 자신의 상태를 잘 업데이트해서 서버에 전달하게 됨)
  - 장점: 서버 확장성 높음(서버가 중간에 바뀌어도 된다. 어차피 클라이언트가 부담하게 되므로)
  - 장점: 특정 서버에 의존하지 않게 되므로 서버 장애에 강인하다
  - 단점: 클라이언트가 추가 데이터 전송해야함
  - 로그인이 필요한 서비스의 경우 로그인 상태를 서버에 유지해야하므로 이 때는 브라우저의 쿠키와 서버의 세션을 조합해서 보완해야함
- 비연결성
  - 서버와 클라이언트가 계속 연결을 유지하게 된다면 클라이언트가 늘어날때마다 서버의 리소스 부담 계속 커지게 됨
  - 클라이언트가 request를 보내고 서버가 response를 보낸 후 요청을 끊는다 -> 서버는 최소한의 자원만 사용하게 됨
  - HTTP는 기본적으로 연결을 유지하지 않는 모델
  - 연결하는데 시간이 별로 소요되지 않나? -> TCP/IP 연결 새로 맺어야함 -> 3-way handshake 시간이 추가된다
  - 그리고 네이버 검색을 예로 들때, 우리가 HTTP 메세지를 보내고 response를 돌려줄 때 검색 결과만 돌려주는게 아니라 그안에 포함된 HTML, CSS, 이미지 등을 함께 돌려줘야 한다 -> 이런 문제를 HTTP Persistent Connection으로 해결
  - Persistent Connection은 내부 메커니즘에 의해 보통 하나의 웹 페이지를 띄울 동안 연결을 계속 지속시킨다
  - HTTP/2, HTTP/3 오면서는 HTTP Persistent Connection이 더욱 발전됨
    ![](/images/network_30.png)
- HTTP 메시지

# URL

![](/images/network_34.png)

URL은 Uniform Resource Locator의 약자입니다. URL은 URI(Uniform Resource Identifier)를 표현하기 위한 방법 중 하나입니다. URL말고도 URN이라는 것이 있지만 지금은 거의 URL만 사용하기 때문에 URN은 생략하도록 하겠습니다.  

인터넷에서 어떤 **자원(회원 정보, 주문서, 사진, 동영상 등)을 유일하게 표현하기 위해 URI라는 개념이 등장**했고 이를 위한 방법으로 URL을 사용하는 것입니다. **URL은 이러한 자원들에게 부여된 고유한 주소**를 말합니다.  

```
인터넷에서는 모든 자원에 URL이라는 고유한 주소를 부여해 이들을 식별한다
```

URL의 예시를 보겠습니다.  

```
https://google.co.kr/search?q=hello&hl=ko

https://order.kyobobook.co.kr/order/orderStepOne
```

URL 문법은 아래와 같습니다.  

```sh
# URL 문법
scheme://[userinfo@]host[:port][/path][?query][#fragment]

예: https://www.google.com/search?q=hello&hl=ko


# scheme
예: https
- 주로 프로토콜이 사용됩니다.
- 프로토콜: 어떤 방식으로 자원에 접근할 것인가 하는 약속 규칙 (https, http, ftp)
- 포트가 생략되어 있을 때 https가 사용되면 443포트, http가 사용되면 80포트가 디폴트
- https는 http에 보안 추가 (HTTP Secure)

# host
예: www.google.com
- 도메인명 또는 IP주소

# port
예: 8888
- 접속 포트

# path
예: /search
- 리소스 경로 (계층적 구조)
- 디렉토리명/파일명

# query
예: ?q=hello&hl=ko
- key=value 형태
- ?로 시작, &로 추가 가능
- query parameter 또는 query string으로 보통 불림

# fragment
예: #getting-started-introducing-spring-boot
- html 내부 북마크 등에 사용
- 서버에 전송하는 정보는 아님
```

URL에서 유의할 점은 **URL은 자원을 식별하는 용도로만 써야 한다**는 것입니다. 예를 들어 어떤 물건을 주문할 때는 주문(order)만을 URL로 표현해야지 주문 확인(order-check), 주문 취소(order-cancel) 이런 **행위까지를 포함시키면 안됩니다**.

# HTTP Method
이러한 **행위를 나타내기 위해 사용하는 것이 바로 HTTP 메소드**입니다.

![](/images/network_28.png)

인터넷에서 발생하는 행위는 크게 CRUD(Create-Read-Update-Delete)로 나눌 수 있습니다. CRUD를 HTTP에서 제공하는 메소드로 구현할 수 있습니다.   

|**HTTP Method**|**설명**|
|GET|읽기(리소스 조회)|
|POST|쓰기(리소스 등록)|
|PUT|업데이트(리소스 완전 대체)|
|PATCH|부분 업데이트(리소스 부분 대체)|
|DELETE|삭제(리소스 삭제)|

![](/images/network_29.png)


# HTTP 헤더

- 용도
  - HTTP 전송에 필요한 모든 부가정보
  - 메세지 바디의 내용, 메세지 바디의 크기, 압축, 클라이언트 정보, ..
- 표현(Representation) 헤더
  - 요청/응답 공통 항목
  - **Content-Type**: 표현 데이터의 형식 
    - 리소스를 어떤 형식으로 표현할 것인가
    - ex. `text/html; charset=utf-8`, `application/json`, `image/png`
  - **Content-Encoding**: 표현 데이터의 압축 방식
    - 표현 데이터를 압축하기 위해 사용
    - 데이터를 전달하는 곳에서 압축 후 인코딩 헤더 추가
    - 데이터를 읽는 곳에서 헤더 정보를 보고 압축 해제
    - ex. `gzip`, `deflate`, `identity`
  - **Content-Language**: 표현 데이터의 자연 언어
    - ex. ko, en, en-US
  - **Content-length**: 표현 데이터의 길이
    - 바이트 단위
  - **Last-Modified**: 리소스를 마지막으로 갱신한 일시
  - **Location**: 페이지 리다이렉션(redirect)
    - 리소스가 리다이렉트(redirect)된 때에 이동된 주소, 또는 새로 생성된 리소스 주소
    - 3xx 응답이나 201 Created 응답일 때 어느 페이지로 이동할지를 알려주는 헤더
    - 201: 요청에 의해 생성된 리소스 URL
    - 3xx: 요청을 자동으로 리다이렉션하기 위한 대상 리소스 URL

- 요청(Request) 헤더
  - **Host**: 요청하는 호스트에 대한 호스트명 및 포트번호 (필수값)
    - 하나의 서버가 여러 도메인을 처리해야 할 때
    - 하나의 IP 주소에 여러 도메인이 적용되어 있을 때
      ![](/images/http_header_1.png)
  - **User-Agent**: 클라이언트의 웹/애플리케이션 정보
    - 어떤 종류의 브라우저에서 장애가 발생하는지 파악 가능
  - **Referer**: 현재 요청된 페이지의 이전 페이지 주소
    - 이를 이용해 유입 경로 분석 가능
  - **Authorization**: 클라이언트 인증 정보를 서버에 전달
    - 인증 토큰(JWT/Bearer 토큰)을 서버로 보낼 때 사용하는 헤더
    - 토큰의 종류(Basic, Bearer 등) + 실제 토큰 문자를 전송
  - **Cookie**: 쿠키에서 사용할 데이터
    - 클라이언트가 서버에서 받은 쿠키를 저장하고, HTTP 요청시 서버로 전달
    - 서버에 의해 Set-Cookie로 클라이언트에게 설정된 쿠키 정보
  - **If-Modified-Since**: 캐시 데이터의 유효성을 검증하기 위한 헤더
    - 이 값보다 더 큰 값을 가지는 데이터만 서버로부터 받아옴
    - 이 값과 같으면 서버 데이터가 캐시와 비교해 업데이트 되지 않았으므로 캐시 데이터 사용
  - **If-None-Match**: ETag 값을 전달해 캐시 데이터를 사용할지, 서버로 부터 새로 받아올지 결정

- 응답(Response) 헤더
  - **Server**: 요청을 처리하는 Origin 서버의 소프트웨어 정보
    - 캐시, 프록시 서버 아닌 Origin 서버
  - **Set-Cookie**: 서버에서 클라이언트로 쿠키 전달
    - 서버측에서 클라이언트에게 세션 쿠키 정보를 설정
    - `max-age`, `expires`와 같은 옵션 있음
  - **Age**: 캐시 응답. `max-age` 시간 내에서 얼마나 흘렀는지 알려줌(초 단위)
  - **ETag**: 리소스에 붙은 고유한 태그
    - 이를 이용해 캐시 데이터의 유효성을 검사할 수 있음


# HTTP 상태코드

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


# 쿠키, 캐시, 프록시, 세션

## 쿠키

- HTTP는 무상태 프로토콜
- 클라이언트와 서버가 요청과 응답을 주고 받고나면 연결이 끊어짐
- 클라이언트가 다시 요청하면 서버는 이전 요청을 기억하지 못함
- 클라이언트와 서버는 서로 상태를 유지하지 않음
- 상태가 유지되지 않으면, 매번 페이지를 이동할 때마다 로그인을 다시 하거나, 상품을 선택했는데 구매 페이지에서 선택한 상품의 정보가 없거나 하는 등의 일이 발생할 수 있음
- 이 때 사용하는 것이 쿠키
- 쿠키는 사용자 로그인 세션 관리, 광고 정보 트래킹과 같은 곳에 많이 사용
- 쿠키는 웹 브라우저가 차지하는 클라이언트의 로컬에 저장
- 쿠키 생명 주기는 `Set-Cookie`의 `expires` 또는 `max-age` 옵션으로 관리

![](/images/cookie_1.png)

## 캐시

- 캐시가 없다면, 같은 데이터를 요청하더라도 매번 서버에서 데이터를 응답 받아야 하기 때문에 네트워크 비용이 아깝게 느껴짐
- 이러한 네트워크 비용을 줄이고자 캐시가 등장
- 웹 페이지의 HTML, CSS, 이미지, 문서 파일 등 렌더링에 필요한 요소들을 서버단에 있는 캐시 서버에 저장 
- 응답 메세지의 `cache-control`의 `max-age` 옵션으로 캐시 생명주기 관리 -> `max-age` 초과시 캐시만료
- (캐시만료는 캐시가 삭제되었다는 뜻이 아니라, 캐시된 데이터가 더 이상 유효하지 않다는 의미)
- 캐시가 만료되면 다시 전체 데이터를 서버에서 받을 수도 있지만, 데이터에 변경 사항이 있는 경우에만 서버에서 받는 최적화 가능
- -> 검증 헤더와 조건부 요청 -> 캐시 데이터와 서버 데이터의 최종 수정일이 같은지
- 요청 메세지 보낼 때, 헤더에 `if-modified-since`의 값으로, 캐시에 저장할 때 서버가 보낸 `Last-Modified` 값을 사용해,
- 서버에 `Last-Modified` 값 이후로 데이터가 수정된 적이 있는지 물어봄
  - 변경된 적 없다면(304 Not Modified) -> 응답 메세지에 헤더만 있고 메세지 바디는 x -> 네트워크 비용 감소
  - 데이터가 변경되었다면(200 OK) -> 모든 데이터 전송
- `Last-Modified`와 `if-modified-since` 조합의 한계점: A->B->A로 변경되도 변경된 데이터로 인식
- `ETag`와 `If-None-Match` 조합 사용
  - 데이터마다 고유한 `ETag` 부여해서 캐시에 저장
  - 클라이언트가 요청한 데이터가 캐시 만료된 경우 데이터의 `ETag` 값을 헤더에 담아 전송 (If-None-Match: "ETag값")
  - 만약 매칭되는 경우, 캐시에서 데이터 가져옴 (캐시만료는 캐시에서 삭제되었다는 의미 아님. 데이터 유효성 검증이 필요하다는 의미)
  - 매칭되는 `ETag` 값이 없으면 서버는 `ETag` 값 말고 메세지의 시작 라인의 URL에 기반해 데이터를 클라이언트에 전달

```
Cache-Control 옵션
- max-age: 캐시 유효 시간. 초단위
- no-cache: 캐시를 사용하지만, 그 전에 항상 Origin 서버에 검증하고 사용 (ETag, Last-Modified 이런 것들 써서)
- no-store: 메모리에서만 사용하고 삭제
```

- 클라이언트가 보낸 요청 메세지는 보통 프록시 캐시 서버로 먼저 전달되고 없으면 Origin 서버로 전달

![](/images/cache_1.png)

## 쿠키와 세션

* HTTP 프로토콜의 특징
  * 비연결 지향(Connectionless)
      * 클라이언트가 request를 서버에 보내고, 서버가 클라이언트에 요청에 맞는 response를 보내면 바로 연결을 끊는다.
  * 상태정보 유지 안 함(Stateless)
      * 연결을 끊는 순간 클라이언트와 서버의 통신은 끝나며 상태 정보를 유지하지 않는다.
* 쿠키와 세션의 필요성
    * HTTP 프로토콜은 위와 같은 특징으로 모든 요청 간 의존관계가 없다.
    * 즉, 현재 접속한 사용자가 이전에 접속했던 사용자와 같은 사용자인지 아닌지 알 수 있는 방법이 없다.
    * 계속해서 연결을 유지하지 않기 때문에 리소스 낭비가 줄어드는 것이 큰 장점이지만, 통신할 때마다 새로 연결하기 때문에 클라이언트는 매 요청마다 인증을 해야 한다는 단점이 있다.
    * 이전 요청과 현재 요청이 같은 사용자의 요청인지 알기 위해서는 상태를 유지해야 한다.
    * HTTP 프로토콜에서 **상태를 유지하기 위한 기술로 쿠키와 세션**이 있다.
* 쿠키(Cookie)란?
  * 개념
      * 클라이언트 로컬에 저장되는 키와 값이 들어있는 파일이다.
      * 이름, 값, 유효 시간, 경로 등을 포함하고 있다.
      * 클라이언트의 상태 정보를 브라우저에 저장하여 참조한다.
  * 구성 요소
      * 쿠키의 이름(name)
      * 쿠키의 값(value)
      * 쿠키의 만료시간(Expires)
      * 쿠키를 전송할 도메인 이름(Domain)
      * 쿠키를 전송할 경로(Path)
      * 보안 연결 여부(Secure)
      * HttpOnly 여부(HttpOnly)
  * 동작 방식  
      ![](/images/cookie-process.png)
      1. 웹브라우저가 서버에 요청
      2. 상태를 유지하고 싶은 값을 쿠키(cookie)로 생성
      3. 서버가 응답할 때 HTTP 헤더(Set-Cookie)에 쿠키를 포함해서 전송
          ```java
          Set−Cookie: id=doy
          ```
      4. 전달받은 쿠키는 웹브라우저에서 관리하고 있다가, 다음 요청 때 쿠키를 HTTP 헤더에 넣어서 전송
          ```java
          cookie: id=doy
          ```
      5. 서버에서는 쿠키 정보를 읽어 이전 상태 정보를 확인한 후 응답
  * 쿠키 사용 예
      * 아이디, 비밀번호 저장
      * 쇼핑몰 장바구니
* 세션(Session)이란?
  * 개념
      * 일정 시간 동안 같은 브라우저로부터 들어오는 요청을 하나의 상태로 보고 그 상태를 유지하는 기술이다.
      * 즉, 웹 브라우저를 통해 서버에 접속한 이후부터 브라우저를 종료할 때까지 유지되는 상태이다.
      
  * 동작 방식  
      ![](/images/session-process.png)
      1. 웹브라우저가 서버에 요청
      2. 서버가 해당 웹브라우저(클라이언트)에 유일한 ID(Session ID)를 부여함
      3. 서버가 응답할 때 HTTP 헤더(Set-Cookie)에 Session ID를 포함해서 전송  
      쿠키에 Session ID를 JSESSIONID 라는 이름으로 저장
          ```java
          Set−Cookie: JSESSIONID=xslei13f
          ```
      1. 웹브라우저는 이후 웹브라우저를 닫기까지 다음 요청 때 부여된 Session ID가 담겨있는 쿠키를 HTTP 헤더에 넣어서 전송
          ```java
          Cookie: JSESSIONID=xslei13f
          ```
      2. 서버는 세션 ID를 확인하고, 해당 세션에 관련된 정보를 확인한 후 응답
  * 세션 사용 예
    * 로그인

> 세션도 쿠키를 사용하여 값을 주고받으며 클라이언트의 상태 정보를 유지한다.  

> 즉, 상태 정보를 유지하는 수단은 **쿠키** 이다.

* 쿠키와 세션의 차이점
  * 저장 위치
      * 쿠키 : 클라이언트
      * 세션 : 서버
  * 보안
      * 쿠키 : 클라이언트에 저장되므로 보안에 취약하다.
      * 세션 : 쿠키를 이용해 Session ID만 저장하고 이 값으로 구분해서 서버에서 처리하므로 비교적 보안성이 좋다.
  * 라이프사이클
      * 쿠키 : 만료시간에 따라 브라우저를 종료해도 계속해서 남아 있을 수 있다.
      * 세션 : 만료시간을 정할 수 있지만 브라우저가 종료되면 만료시간에 상관없이 삭제된다.
  * 속도
      * 쿠키 : 클라이언트에 저장되어서 서버에 요청 시 빠르다.
      * 세션 : 실제 저장된 정보가 서버에 있으므로 서버의 처리가 필요해 쿠키보다 느리다.

# 웹 브라우저의 동작원리
우리가 웹 브라우저(크롬, 사파리 등)에서 뉴스 보기를 클릭하거나 유튜브 비디오를 시청할 때 내부적으로 어떤 일들이 일어나는지 한 번 알아보겠습니다.  

## HTTP 리퀘스트 작성
- 보통 웹 브라우저에서 URL을 입력하거나 어떤 버튼을 클릭하는 식으로 웹 서버와 상호작용 
- **웹 브라우저는 내부에서 HTTP 리퀘스트라는 것을 웹 서버에 전송**

### URL 입력

```
https://www.google.com/search?q=hello&hl=ko
```


### HTTP 리퀘스트 작성
- URL을 입력하고 나면 웹 브라우저는 URL을 바탕으로 HTTP 리퀘스트 메시지를 작성  
- HTTP 리퀘스트 메시지의 형태
  ![](../../images/network_1.jpeg)  


## DNS 서버에 웹 서버의 IP주소 조회
- 메시지를 전송하기 전에 먼저 **도메인 네임을 IP 주소로 변환**
- 이를 **네임 레졸루션(name resolution)**이라고 함

### DNS Resolver를 이용해 DNS 서버 조회
- 네임 레졸루션을 시행하는 것이 **DNS 리졸버(DNS Resolver)**

![](/images/dns-resolver_1.webp)

## 웹 서버와 TCP 연결 시도

- 3way-handshaking

## 클라이언트가 서버에게 요청
- HTTP Request Message = Request Header + 빈 줄 + Request Body
- Request Header
  - 요청 메소드 + 요청 URI + HTTP 프로토콜 버전
  - GET /background.png HTTP/1.0 POST / HTTP 1.1
  - Header 정보(key-value 구조)
- 빈 줄
  - 요청에 대한 모든 메타 정보가 전송되었음을 알리는 용도
- Request Body
  - GET, HEAD, DELETE, OPTIONS처럼 리소스를 가져오는 요청은 바디 미포함
  - 데이터 업데이트 요청과 관련된 내용 (HTML 폼 콘텐츠 등)

## 서버가 클라이언트에게 데이터 응답
- HTTP Response Message = Response Header + 빈 줄 + Response Body
- Response Header
  - HTTP 프로토콜 버전 + 응답 코드 + 응답 메시지
  - ex. HTTP/1.1 404 Not Found.
  - Header 정보(key-value 구조)
- 빈 줄
  - 요청에 대한 모든 메타 정보가 전송되었음을 알리는 용도
- Response Body
  - 응답 리소스 데이터
  - 201, 204 상태 코드는 바디 미포함

## 서버 클라이언트 간 연결 종료
- 4way-handshaking

## 웹 브라우저가 웹 문서 출력


# HTTPS

- SSL(Secure Socket Layer)

![](/images/https_1.png)

## HTTPS 프로토콜 
- 개념 
    - HyperText Transfer Protocol over Secure Socket Layer
        - 또는 HTTP over TLS, HTTP over SSL, HTTP Secure
    - 웹 통신 프로토콜인 HTTP의 보안이 강화된 버전의 프로토콜
- 특징 
    - HTTPS의 기본 TCP/IP 포트로 **443번 포트**를 사용한다.
    - HTTPS는 소켓 통신에서 일반 텍스트를 이용하는 대신에, 웹 상에서 정보를 암호화하는 SSL이나 TLS 프로토콜을 통해 세션 데이터를 암호화한다. 
        - TLS(Transport Layer Security) 프로토콜은 SSL(Secure Socket Layer) 프로토콜에서 발전한 것이다.
        - 두 프로토콜의 주요 목표는 기밀성(사생활 보호), 데이터 무결성, ID 및 디지털 인증서를 사용한 인증을 제공하는 것이다.
    - 따라서 데이터의 적절한 보호를 보장한다. 
        - 보호의 수준은 웹 브라우저에서의 구현 정확도와 서버 소프트웨어, 지원하는 암호화 알고리즘에 달려있다.
    - 금융 정보나 메일 등 중요한 정보를 주고받는 것은 HTTPS를, 아무나 봐도 상관 없는 페이지는 HTTP를 사용한다.

## HTTPS가 필요한 이유?
- 클라이언트인 웹브라우저가 서버에 HTTP를 통해 웹 페이지나 이미지 정보를 요청하면 서버는 이 요청에 응답하여 요구하는 정보를 제공하게 된다.
- 웹 페이지(HTML)는 텍스트이고, HTTP를 통해 이런 텍스트 정보를 교환하는 것이다.
- 이때 주고받는 텍스트 정보에 주민등록번호나 비밀번호와 같이 민감한 정보가 포함된 상태에서 네트워크 상에서 중간에 제3자가 정보를 가로챈다면 보안상 큰 문제가 발생한다.
- 즉, 중간에서 정보를 볼 수 없도록 주고받는 정보를 암호화하는 방법인 HTTPS를 사용하는 것이다.

## HTTPS의 원리 
- **[공개키 알고리즘 방식](https://github.com/WeareSoft/tech-interview/blob/master/contents/security.md#대칭키와-비대칭키-차이)**
- 암호화, 복호화시킬 수 있는 서로 다른 키(공개키, 개인키)를 이용한 암호화 방법 
    - 공개키: 모두에게 공개. 공캐키 저장소에 등록 
    - 개인키(비공개키): 개인에게만 공개. 클라이언트-서버 구조에서는 서버가 가지고 있는 비공개키 
- 클라이언트 -> 서버 
    - 사용자의 데이터를 **공개키로 암호화** (공개키를 얻은 인증된 사용자)
    - 서버로 전송 (데이터를 가로채도 개인키가 없으므로 **복호화할 수 없음**)
    - 서버의 **개인키를 통해 복호화**하여 요청 처리 

## HTTPS의 장단점
- 장점 
    - 네트워크 상에서 열람, 수정이 불가능하므로 안전하다.
- 단점 
    - 암호화를 하는 과정이 웹 서버에 부하를 준다.
    - HTTPS는 설치 및 인증서를 유지하는데 추가 비용이 발생한다.
    - HTTP에 비해 느리다. 
    - 인터넷 연결이 끊긴 경우 재인증 시간이 소요된다.
        - HTTP는 비연결형으로 웹 페이지를 보는 중 인터넷 연결이 끊겼다가 다시 연결되어도 페이지를 계속 볼 수 있다.
        - 그러나 HTTPS의 경우에는 소켓(데이터를 주고 받는 경로) 자체에서 인증을 하기 때문에 인터넷 연결이 끊기면 소켓도 끊어져서 다시 HTTPS 인증이 필요하다.
       
## HTTPS(SSL) 동작 과정
* 공개키 암호화 방식과 대칭키 암호화 방식의 장점을 활용해 하이브리드 사용
  * 데이터를 대칭키 방식으로 암복호화하고, 공개키 방식으로 대칭키 전달
1. **클라이언트가 서버 접속하여 Handshaking 과정에서 서로 탐색**
    
    1.1. **Client Hello**
      * 클라이언트가 서버에게 전송할 데이터
        * 클라이언트 측에서 생성한 **랜덤 데이터**
        * 클-서 암호화 방식 통일을 위해 **클라이언트가 사용할 수 있는 암호화 방식**
        * 이전에 이미 Handshaking 기록이 있다면 자원 절약을 위해 기존 세션을 재활용하기 위한 **세션 아이디**

    1.2. **Server Hello**
      * Client Hello에 대한 응답으로 전송할 데이터
        * 서버 측에서 생성한 **랜덤 데이터**
        * **서버가 선택한 클라이언트의 암호화 방식**
        * **SSL 인증서**

    1.3. **Client 인증 확인**
      * 서버로부터 받은 인증서가 CA에 의해 발급되었는지 본인이 가지고 있는 목록에서 확인하고, 목록에 있다면 CA 공개키로 인증서 복호화
      * 클-서 각각의 랜덤 데이터를 조합하여 pre master secret 값 생성(데이터 송수신 시 대칭키 암호화에 사용할 키)
      * pre master secret 값을 공개키 방식으로 서버 전달(공개키는 서버로부터 받은 인증서에 포함)
      * 일련의 과정을 거쳐 session key 생성

    1.4. **Server 인증 확인**
      * 서버는 비공개키로 복호화하여 pre master secret 값 취득(대칭키 공유 완료)
      * 일련의 과정을 거쳐 session key 생성

    1.5. **Handshaking 종료**
2. **데이터 전송**
    * 서버와 클라이언트는 session key를 활용해 데이터를 암복호화하여 데이터 송수신
3. **연결 종료 및 session key 폐기**


# 참고
- [인프런에서 제공하는 이영한님의 모든 개발자를 위한 HTTP 웹 기본 지식 강의](https://www.inflearn.com/course/http-웹-네트워크/dashboard){:target="_blank"}
- [JaeYeopHan/Interview_Question_for_Beginner](https://github.com/JaeYeopHan/Interview_Question_for_Beginner){:target="_blank"}
- [WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview){:target="_blank"}
