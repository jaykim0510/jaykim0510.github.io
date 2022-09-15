---
layout: post
title:  'Spring Series [Part2]: 백엔드 구성요소'
description: 
date:   2022-06-07 15:01:35 +0300
image:  '/images/spring_logo.png'
logo_image:  '/images/spring_logo.png'
categories:   web_development
tags: Spring
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Web Server

- HTTP 기반으로 동작
- 정적 리소스(HTML, CSS, JS, 이미지, 동영상 등)을 주고받기 위한 용도
- ex. Nginx, Apache 등

# Web Application Server(WAS)

- HTTP 기반으로 동작
- 웹 서버 기능 포함하기도 함
- 프로그래밍을 통해 애플리케이션 로직을 수행할 수 있음
  - 동적 HTML 생성
  - HTTP API 제공
  - 서블릿, JSP, 스프링 MVC가 WAS에서 동작함
- ex. Tomcat, Undertow 등

## 웹 서버와 WAS

- 최근에는 두 서버의 경계가 모호해짐
- 가장 큰 차이점은 WAS는 애플리케이션 코드를 실행하는데 특화되어 있다는 점
- 보통 서블릿 컨테이너 기능을 제공하는 서버를 WAS라고 함
- WAS 하나로 서버 구축 가능 -> 하지만 WAS는 코드 오류로 장애가 잘 나기 때문에 분리하는게 좋음
- 정적 리소스는 웹 서버가 처리하다가, 애플리케이션 로직같은 동적인 처리가 필요하면 WAS에 요청을 넘김
- 요청에 맞게 웹 서버 또는 WAS를 독립적으로 증설 가능
- 만약 WAS 또는 DB에 장애가 나더라도 서버는 응답(오류 상태)을 해줘야함 -> 웹 서버가 오류화면 HTML 리턴

![](/images/was_1.png)

# Servlet

- 자바를 사용하여 웹페이지를 동적으로 생성하는 서버측 프로그램(자바 클래스)
- HTTP 메세지를 알아서 읽고 해석한 다음, HTTP 응답 메세지도 알아서 생성해줌
- 개발자는 애플리케이션 로직을 개발하는데에만 집중할 수 있음

```java
@WebServlet(name='helloServlet', urlPatterns='/hello')
public class HelloServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) {
        //애플리케이션 로직 작성
    }
}
```

- `request`를 이용해 요청 메세지의 정보를 쉽게 활용할 수 있음
- `response`에 우리가 원하는 데이터를 쉽게 넣어줄 수 있음
- 서블릿 객체는 서블릿 컨테이너가 알아서 관리해줌
- 서블릿 객체는 싱글톤 -> 모든 요청은 하나의 서블릿 객체에 접근
- `request` 객체와 `response` 객체만 고객 요청마다 새로 생성

![](/images/servlet_1.png)

- 서블릿은 멀티 스레드 처리도 지원

# Rendering

## 서버 사이드 렌더링

- SSR: Server Side Rendering
- HTML을 서버에서 만들어서 웹 브라우저에 전달
- 주로 정적인 화면에 사용, 백엔드 개발자가 간단하게 렌더링 하고 싶을 때 많이 사용
- 스프링을 주로 사용하는 백엔드 개발자들은 **뷰(View) 템플릿으로 주로 타임리프를 많이 사용**
- ex. JSP, 타임리프

![](/images/ssr_1.png)

## 클라이언트 사이드 렌더링 

- CSR: Client Side Rendering
- 서버에서 웹 브라우저로 자바 스크립트를 전달 -> 웹 브라우저에서 동적으로 HTML 생성
- 주로 동적인 화면에 사용
- ex. React, Vue.js

![](/images/csr_1.png)