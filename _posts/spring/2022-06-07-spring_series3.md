---
layout: post
title:  'Spring Series [Part3]: 스프링 MVC(1): 서블릿'
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

# Servlet

- 스프링 부트는 서블릿을 자동 등록해서 사용할 수 있도록`@ServletComponentScan`을 지원
- 스프링 부트는 톰캣 서버를 내장하고 있음 -> 톰캣 서버 설치 없이 편리하게 서블릿 코드 실행 가능

```java
package hello.servlet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@ServletComponentScan // 서블릿 자동 등록
@SpringBootApplication
public class ServletApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServletApplication.class, args);
	}
}
```

- 서블릿 생성

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        System.out.println("request = " + request);
        System.out.println("response = " + response);

        String user = request.getParameter("user");

        response.setContentType("text/plain");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write("hello " + user);
    }
}
```

![](/images/servlet_2.png)


## HttpServletRequest

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        System.out.println("request.getMethod() = " + request.getMethod());
        System.out.println("request.getProtocol() = " + request.getProtocol());
        System.out.println("request.getScheme() = " + request.getScheme());
        System.out.println("request.getRequestURL() = " + request.getRequestURL());
        System.out.println("request.getQueryString() = " + request.getQueryString());
        System.out.println("request.isSecure() = " + request.isSecure());

        System.out.println("request.getHeaderNames() = " + request.getHeaderNames());
        System.out.println("request.getServerName() = " + request.getServerName());
        System.out.println("request.getServerPort() = " + request.getServerPort());

        System.out.println("request.getParameterNames() = " + request.getParameterNames());
        System.out.println("request.getParameter(\"user\") = " + request.getParameter("user"));

    }
}
-----------------------------------------------------------------------------
request.getMethod() = GET
request.getProtocol() = HTTP/1.1
request.getScheme() = http
request.getRequestURL() = http://localhost:8080/hello
request.getQueryString() = user=kim
request.isSecure() = false
request.getHeaderNames() = org.apache.tomcat.util.http.NamesEnumerator@3d8b6f83
request.getServerName() = localhost
request.getServerPort() = 8080
request.getParameterNames() = java.util.Collections$3@7e5ec420
request.getParameter("user") = kim
```

## HttpServletResponse

```java
@WebServlet(name = "helloServlet", urlPatterns = "/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        response.setContentType("text/html");
        response.setCharacterEncoding("utf-8");

        PrintWriter writer = response.getWriter();
        writer.println("<html>");
        writer.println("<body>");
        writer.println("    <div>안녕?</div>");
        writer.println("</body>");
        writer.println("</html>");
    }
}
--------------------------------------------------------------------------------------------------------------
```

![](/images/servlet_3.png)

![](/images/servlet_4.png)