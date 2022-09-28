---
layout: post
title:  'Spring Series [Part4]: 스프링 MVC(2): MVC 패턴'
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

# Spring MVC

- 하나의 서블릿이나 JSP만으로 비즈니스 로직과 뷰 렌더링까지 모두 처리하게 되면, 나중에 유지보수가 어려워진다
- MVC 패턴은 이런 문제점을 해결하고자, 영역을 크게 컨트롤러(Controller)와 뷰(View)로 나누었다

```
- Model: 뷰에 출력할 데이터를 담아둔다
- Controller: HTTP 요청을 받아서 파라미터를 검증하고, 비즈니스 로직을 호출한다. 그리고 뷰에 전달할 데이터를 조회해서 모델에 담는다
- (비즈니스 로직은 서비스(Service)라는 클래스를 만들어 별도로 처리. 컨트롤러의 부담을 줄이고자)
- View: 모델에 담긴 데이터를 사용해서 화면을 렌더링한다 (HTML 생성)
```

![](/images/mvc_1.png)

# 프론트 컨트롤러 패턴 도입

![](/images/front_controller_1.png)

- 프론트 컨트롤러 서블릿 하나로 클라이언트의 요청을 받음
- 프론트 컨트롤러가 요청에 맞는 컨트롤러를 찾아서 호출
- 프론트 컨트롤러를 제외한 나머지 컨트롤러는 서블릿을 사용하지 않아도 됨
- 스프링 웹 MVC의 DispatcherServlet이 FrontController 패턴으로 구현되어 있음

# 매핑 정보

![](/images/mapping_1.png)

- 요청이 들어온 URL을 보고 어떤 컨트롤러를 호출해야 하는지 매핑 정보에 물어본다

```java
@WebServlet(name = "frontControllerServletV1", urlPatterns = "/front- controller/v1/*") 
public class FrontControllerServletV1 extends HttpServlet {
    private Map<String, ControllerV1> controllerMap = new HashMap<>(); 
    public FrontControllerServletV1() { 
                     controllerMap.put("/front-controller/v1/members/new-form", new MemberFormControllerV1()); 
                     controllerMap.put("/front-controller/v1/members/save", new MemberSaveControllerV1()); 
                    controllerMap.put("/front-controller/v1/members", new MemberListControllerV1()); 
          }

}
```

# 뷰 분리

![](/images/view_split.png)

- 모든 컨트롤러에서 뷰로 이동하는 부분에 중복이 있고, 깔끔하지 않다 
- 컨트롤러가 뷰를 반환 
- 이제 각 컨트롤러는 복잡한 `dispatcher.forward()` 를 직접 생성해서 호출하지 않아도 된다.
단순히 MyView 객체를 생성하고 거기에 뷰 이름만 넣고 반환하면 된다.
- 프론트 컨트롤러의 도입으로 MyView 객체의 `render()` 를 호출하는 부분을 모두 일관되게 처리할 수 있다. 각각의 컨트롤러는 MyView 객체를 생성만 해서 반환하면 된다. 

```java
// 각 컨트롤러
public MyView process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
    return new MyView("/WEB-INF/views/new-form.jsp");
} 
```

```java
// 프론트 컨트롤러
@Override 
protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { String requestURI = request.getRequestURI(); ControllerV2 controller = controllerMap.get(requestURI); if (controller == null) { response.setStatus(HttpServletResponse.SC_NOT_FOUND); return; } 
MyView view = controller.process(request, response); view.render(request, response); } 
```

- 컨트롤러는 뷰를 직접 리턴하지 않고, 필요한 뷰의 논리적인 이름만, 프론트 컨트롤러는 필요한 데이터를 그에 맞는 Model 이라는 딕셔너리로

![](/images/view_split_2.png)

# 어댑터 패턴

![](/images/adapter_pattern.png)

- 핸들러 어댑터: 중간에 어댑터 역할을 하는 어댑터가 추가되었는데 이름이 핸들러 어댑터이다. 여기서 어댑터 역할을 해주는 덕분에 다양한 종류의 컨트롤러를 호출할 수 있다.

- 핸들러: 컨트롤러의 이름을 더 넓은 범위인 핸들러로 변경했다. 그 이유는 이제 어댑터가 있기 때문에 꼭 컨트롤러의 개념 뿐만 아니라 어떠한 것이든 해당하는 종류의 어댑터만 있으면 다 처리할 수 있기 때문이다. 
- 컨트롤러(Controller) -> 핸들러(Handler) 이전에는 컨트롤러를 직접 매핑해서 사용했다. 그런데 이제는 어댑터를 사용하기 때문에, 컨트롤러 뿐만 아니라 어댑터가 지원하기만 하면, 어떤 것이라도 URL에 매핑해서 사용할 수 있다. 그래서 이름을 컨트롤러에서 더 넒은 범위의 핸들러로 변경했다
- 어댑터 패턴을 사용해서 프론트 컨트롤러가 다양한 방식의 컨트롤러를 처리할 수 있도록 변경해보자. 
- 이전에는 프론트 컨트롤러가 실제 컨트롤러를 호출했지만 이제는 이 어댑터를 통해서 실제 컨트롤러가 호출된다. 


# Spring MVC

![](/images/spring_mvc.png)

- 스프링 MVC도 프론트 컨트롤러 패턴으로 구현되어 있다.
- 스프링 MVC의 프론트 컨트롤러가 바로 디스패처 서블릿(`DispatcherServlet`)이다. 
- 그리고 이 디스패처 서블릿이 바로 스프링 MVC의 핵심이다. 
- 스프링 부트는 `DispacherServlet` 을 서블릿으로 자동으로 등록하면서 모든 경로(`urlPatterns="/"`)에 대해서 매핑한다.
- 서블릿이 호출되면 HttpServlet 이 제공하는 serivce() 가 호출된다.
- 스프링 MVC는 `DispatcherServlet` 의 부모인 `FrameworkServlet` 에서 `service()` 를 오버라이드 해두었다. 
- `FrameworkServlet.service()` 를 시작으로 여러 메서드가 호출되면서 `DispacherServlet.doDispatch()` 가 호출된다. 

## 스프링 MVC 동작순서

1. 핸들러 조회: 핸들러 매핑을 통해 요청 URL에 매핑된 핸들러(컨트롤러)를 조회한다. 
2. 핸들러 어댑터 조회: 핸들러를 실행할 수 있는 핸들러 어댑터를 조회한다. 
3. 핸들러 어댑터 실행: 핸들러 어댑터를 실행한다. 
4. 핸들러 실행: 핸들러 어댑터가 실제 핸들러를 실행한다. 
5. `ModelAndView` 반환: 핸들러 어댑터는 핸들러가 반환하는 정보를 `ModelAndView로` 변환해서 반환한다. 
6. `viewResolver` 호출: 뷰 리졸버를 찾고 실행한다. JSP의 경우: InternalResourceViewResolver` 가 자동 등록되고, 사용된다. 
7. View반환: 뷰리졸버는 뷰의 논리이름을 물리이름으로 바꾸고,렌더링 역할을 담당하는 뷰 객체를 반환한다. JSP의 경우 `InternalResourceView(JstlView)` 를 반환하는데, 내부에 `forward()` 로직이 있다. 
8. 뷰렌더링: 뷰를 통해서 뷰를 렌더링한다. 

## 인터페이스 살펴보기 

- 스프링 MVC의 큰 강점은 `DispatcherServlet` 코드의 변경 없이, 원하는 기능을 변경하거나 확장할 수 있다는 점이다. 
- 지금까지 설명한 대부분을 확장 가능할 수 있게 인터페이스로 제공한다.
- 이 인터페이스들만 구현해서 `DispatcherServlet` 에 등록하면 여러분만의 컨트롤러를 만들 수도 있다. 

## 주요 인터페이스 목록 

- 핸들러 매핑: org.springframework.web.servlet.HandlerMapping 
- 핸들러 어댑터: org.springframework.web.servlet.HandlerAdapter 
- 뷰 리졸버: org.springframework.web.servlet.ViewResolver
- 뷰: org.springframework.web.servlet.View 
