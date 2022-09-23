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