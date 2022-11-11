---
layout: post
title:  'Django Series [Part3]: MVT 아키텍처'
description: 
date:   2022-01-09 15:01:35 +0300
image:  '/images/django_logo.png'
logo_image:  '/images/django_logo.png'
categories: web_development
tags: [Django]
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- Django는 Model, View, Template 아키텍처 패턴으로 웹 개발을 한다

![](/images/django_4.png)

- 클라이언트의 URL 요청은 View 모듈로 매핑된다
- View는 필요한 경우 Model 모듈에 데이터를 요청한다
- Model은 DB에서 데이터를 가져온다
- View는 데이터를 렌더링하기 위해 Template 모듈에 템플릿 언어로 작성된 html 파일을 요청한다
- View는 템플릿과 데이터를 하나로 잘 병합해 클라이언트에게 돌려준다

# View

- 클라이언트의 요청을 받아서 로직을 처리
- 클라이언트에 응답
- GET, POST와 같은 기능을 정의
- 함수 또는 클래스로 정의

# Model

- 데이터 구조 정의
- 데이터베이스와 소통

# Template

- 렌더링할 파일 정의
- Template language 로 작성