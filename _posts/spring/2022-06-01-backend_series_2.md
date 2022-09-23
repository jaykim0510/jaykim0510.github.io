---
layout: post
title:  'Backend Series [Part2]: 객체지향을 활용한 디자인 패턴'
description: 
date:   2022-06-01 15:01:35 +0300
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

# Object Oriented Programming

# Design Pattern

- 객체 지향 프로그래밍을 실제 소프트웨어 개발에 적용하는 방법(패턴)
- 코드의 재사용성을 높여준다
- 개발자들간의 협업이 쉬워진다
- 본격적으로 개발에 들어가기 전에 머릿속으로 구조적으로 구상할 수 있다

A design pattern provides a general reusable solution for the common problems that occur in software design. The pattern typically shows relationships and interactions between classes or objects. The idea is to speed up the development process by providing well-tested, proven development/design paradigms. Design patterns are programming language independent strategies for solving a common problem. That means a design pattern represents an idea, not a particular implementation. By using design patterns, you can make your code more flexible, reusable, and maintainable.  

It’s not mandatory to always implement design patterns in your project. Design patterns are not meant for project development. Design patterns are meant for common problem-solving. Whenever there is a need, you have to implement a suitable pattern to avoid such problems in the future. To find out which pattern to use, you just have to try to understand the design patterns and their purposes. Only by doing that, you will be able to pick the right one.   

## What Are the Benefits of Design Patterns?
Design patterns have two major benefits. First, they provide you with a way to solve issues related to software development using a proven solution. The solution facilitates the development of highly cohesive modules with minimal coupling. They isolate the variability that may exist in the system requirements, making the overall system easier to understand and maintain. Second, design patterns make communication between designers more efficient. Software professionals can immediately picture the high-level design in their heads when they refer to the name of the pattern used to solve a particular issue when discussing system design.

# Strategy Pattern

- 뭔가를 실행할 때 옵션마다 다르게 실행되면 좋겠어 (특정 메서드를 모드에 따라 다르게 실행하고 싶을 때)
- 예를 들어, 검색에 옵션 [뉴스, 이미지, 동영상, 사전] 선택하면 옵션에 맞게 검색 결과를 돌려줘야함
- 이 때 검색 버튼에 옵션마다 다르게 실행하도록 하는 코드를 작성하는 것은 객체 지향적이지 않음 -> 검색 기능을 인터페이스해 놓고 옵션마다 다른 구현체가 리턴되도록

# Singleton Pattern

- 서버에 객체가 하나만 있으면 좋겠어
- 예를 들어, 다크 모드-밝은 모드를 관리하는 객체는 한 개만 -> 페이지 옮겨가더라도 계속 유지
- static 사용 -> 하나의 프로세스에 하나의 객체만 컴파일 단계에 생성
- 싱글턴 패턴으로 디자인 할 때에는 멀티 스레드 환경에서 오류가 나지 않도록 유의해야함

# State Pattern

- 같은 버튼이지만 상황에 따라 다르게 동작하면 좋겠어 (특정 메서드를 상황에 따라 실행하는 모드가 달라지도록 하고 싶을 때)
- 예를 들어, 전원 버튼은 전원이 켜진 상태에서는 끄는 역할을, 꺼진 상태에서는 키는 역할을 함

# Adapter Pattern

- 개떡같이 말해도 찰떡같이 알아들어주면 좋겠어 (과거에 사용했던 기능을 현재 프로젝트의 변경없이 사용하고 싶을 때)
- 예를 들어 작년에 만든 프로젝트에서 '제과 만들기'라는 기능을 현재 진행중인 프로젝트에서 '요리 하기' 기능에 잘 녹아들게 하고 싶다
- 기존과 같이 '요리 하기' 버튼을 누르면 빵일 떄는 알아서 '제과 기능'이 호출되도록 만들면 됨

# Observer Pattern

- 이벤트가 발생했을 때, 이 이벤트를 다른 클래스에 전달해주면 좋겠어

# Proxy Pattern

- '메일 보내기'를 호출하면 '부장님'이 아니라 '비서'가 그 일을 처리해주면 좋겠어
- 예를 들어, 유튜브의 썸네일 객체는 두 가지 역할을 해야함 (제목 보여주기, 프리뷰 재생하기) -> 제목은 프록시 객체가, 프리뷰는 실제 객체가

![](/images/backend_2.png)

# 참고

- [GeeksforGeeks, Design Patterns (Introduction)](https://www.geeksforgeeks.org/design-patterns-set-1-introduction/){:target="_blank"}
- [한빛 출판 네트워크, [Design pattern] 많이 쓰는 14가지 핵심 GoF 디자인 패턴의 종류](https://www.hanbit.co.kr/channel/category/category_view.html?cms_code=CMS8616098823){:target="_blank"}
- [준비된 개발자, [생성 패턴] 싱글톤(Singleton) 패턴을 구현하는 6가지 방법](https://readystory.tistory.com/116?category=822867){:target="_blank"}
- [얄팍한 코딩사전 유튜브, 객체지향 디자인패턴 1](https://www.youtube.com/watch?v=lJES5TQTTWE){:target="_blank"}