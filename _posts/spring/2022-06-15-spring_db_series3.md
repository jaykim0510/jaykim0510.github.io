---
layout: post
title:  'Spring Database Series [Part3]: JPA(1) 기본 개념'
description: 
date:   2022-06-15 15:01:35 +0300
image:  '/images/jpa_logo.png'
logo_image:  '/images/jpa_logo.png'
categories:   web_development
tags: Spring
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# JPA

- Java Persistence API 의 약자
- (자바 객체의 영속성(DB에 저장)을 도와주는 API)
- 자바 진영에서 ORM(Object-Relational Mapping) 기술 표준 인터페이스
- (구현된 클래스와 매핑을 해주기 위해 사용되는 프레임워크)
- JPA의 인터페이스를 구현한 구현체로는 대표적으로 Hibernate, EclipseLink 등
    ![](/images/jpa_implementations.png)

- 정리하면 JPA는 객체의 DB 저장을 위해 ORM (객체를 RDBMS의 데이터와 매핑) 기능을 정의한 인터페이스 모음
- 쉽게 얘기하면 JPA를 이용하면 객체를 저장하기 위해 우리가 SQL 언어를 직접 작성하지 않고, 마치 **원래 객체를 컬렉션에 저장하듯 사용**하면, JPA의 구현체인 Hibernate 가 **SQL 언어로 변환**해주고, SQL 언어를 JDBC API가 DB에 전달한다

![](/images/jpa_3.png)

![](/images/jpa_4.png)

# JPA가 좋은 이유

- 객체는 객체대로 설계, DB는 DB대로 설계할 수 있도록 함
- 메서드를 사용하듯 개발하면 JPA가 알아서 SQL 언어로 매핑/변환
- DB 종류마다 SQL 문법이 약간씩 다른데 이런 문제도 `org.hirbernate.dialect` 라는 속성값만 바꿔주면 해결
  ![](/images/jpa_5.png)
- 객체를 SQL 언어로 조작할 수 있도록 JPQL 언어 지원
- (DB의 테이블이 아닌 객체가 대상 -> 객체지향 SQL)
- (ex. SELECT 객체 FROM 클래스)

# JPA의 내부 동작 원리

![](/images/jpa_6.png)

## 영속성 컨텍스트

- 엔티티를 영구 저장하는 논리적인 환경
- 엔티티를 DB에 저장하기 전에 1차적으로 영속성 컨텍스트라는 곳에 저장하고 있음
- 엔티티 매니저를 통해 영속성 컨텍스트에 접근
- 트랜잭션 요청이 들어올 때마다 엔티티 매니저 팩토리에서 엔티티 매니저를 생성하고, 엔티티 매니저가 트랜잭션 요청안에 포함된 엔티티의 영속성 컨텍스트내에서의 생명주기를 관리함
  ![](/images/jpa_7.png)

**영속성 컨텍스트의 이점**  

- 1차 캐시 
- 동일성(identity) 보장
- 트랜잭션을 지원하는 쓰기 지연(transactional write-behind)
- 변경 감지(Dirty Checking) 
- 지연 로딩(Lazy Loading)

## 플러시

- 영속성 컨텍스트의 변경내용을 데이터베이스에 반영 (동기화)
- (영속성 컨텍스트를 비우지 않음)
- (플러시는 커밋전에만 수행되면됨)

![](/images/jpa_8.png)

# 참고

- [인프런 김영한, 자바 ORM 표준 JPA 프로그래밍](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard){:target="_blank"}
- [adam2, JPA는 도대체 뭘까? (orm, 영속성, hibernate, spring-data-jpa)](https://velog.io/@adam2/JPA%EB%8A%94-%EB%8F%84%EB%8D%B0%EC%B2%B4-%EB%AD%98%EA%B9%8C-orm-%EC%98%81%EC%86%8D%EC%84%B1-hibernate-spring-data-jpa){:target="_blank"}
- [dbjh, [Spring JPA] JPA 란?](https://dbjh.tistory.com/77){:target="_blank"}