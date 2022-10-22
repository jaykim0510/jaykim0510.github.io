---
layout: post
title:  'Spring Database Series [Part4]: JPA(2) 매핑'
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

# 엔티티 매핑

## 객체와 테이블 매핑
- `@Entity`
  - `@Entity`를 붙여주면 JPA의 관리 대상이 된다
  - name이라는 속성을 통해 엔티티의 이름을 바꿀 수 있다 (기본값은 클래스 이름)
- `@Table`
  - 객체와 매핑할 테이블에 관한 정보를 명시하거나 설정할 수 있다

## 필드와 컬럼 매핑
- `@Id`
  - 프라이머리키가 되는 필드에 붙여준다
- `@Column`
  - 특정 컬럼과 매핑할 필드에 붙여준다
  - (뭔가 설정할 것이 있을 때 붙여주고, 없으면 안붙여줘도 된다)
  - `name`, `insertable`, `updatable`, `nullable`, `unique`, `columnDefinition`, `length` 등의 옵션이 있다
- `@Temporal`
  - 날짜 타입의 컬럼과 매핑할 필드에 붙여준다
- `@Enumerated`
  - ENUM 타입의 컬럼과 매핑할 필드에 붙여준다
- `@Lob`
  - 데이터베이스 BLOB, CLOB 타입의 컬럼과 매핑할 필드에 붙여준다
  - 매핑하는 필드 타입이 문자면 CLOB, 나머지는 BLOB
- `@Transient`
  - 매핑을 원치않는 필드에 붙여준다
  - (DB에서 사용 안하고, 애플리케이션의 메모리에서만 사용할 필드)

# 연관관계 매핑

- 테이블에서는 연관관계를 외래키 조인으로 정의
- 객체간의 연관관계는 참조를 통해 정의
- A객체에서 B객체로만 접근하는 경우는 단방향, A객체에서 B객체, B객체에서 A객체로 모두 접근하는 경우는 양방향 연관관계
- (양방향 연관관계에서는 하나의 객체에서만 수정/삭제가 이뤄져야함 -> 주인을 정해야함)
- (보통 다대일에서 '다'에 해당하는 객체의 참조 객체를 주인으로 한다)
- (더 쉽게 생각하면 DB에서 외래키와 일치하는 참조 객체를 주인으로 한다)
- A객체 한 개가 여러개의 B객체를 가지면 일대다(1:N), 반대는 다대일(N:1), 그밖에 일대일(1:1), 다대다(N:M)이 있음

## 연관관계 매핑 어노테이션

- `@OneToOne`, `@ManyToOne`, `@OneToMany`, `@ManyToMany`
- `@JoinColumn`

![](/images/jpa_9.png)

- 단방향 양방향 상관없이 외래키에 해당하는 참조 객체에 `@JoinColumn`을 붙여준다
  ```java
  @Entity
  public class Member {
    ...

    @ManyToOne
    @JoinColumn(name = "TEAM_ID")
    private Team team;
  }
  ```

- 양방향인 경우 주인이 아닌 참조 객체에 `mappedBy` 옵션을 지정해준다
  ```java
  @Entity
  public class Team {
    ...

    @OneToMany(mappedBy = "team")
    List<Member> members = new ArrayList<Member>();
  }
  ```

# 참고

- [인프런 김영한, 자바 ORM 표준 JPA 프로그래밍](https://www.inflearn.com/course/ORM-JPA-Basic/dashboard){:target="_blank"}
- [adam2, JPA는 도대체 뭘까? (orm, 영속성, hibernate, spring-data-jpa)](https://velog.io/@adam2/JPA%EB%8A%94-%EB%8F%84%EB%8D%B0%EC%B2%B4-%EB%AD%98%EA%B9%8C-orm-%EC%98%81%EC%86%8D%EC%84%B1-hibernate-spring-data-jpa){:target="_blank"}
- [dbjh, [Spring JPA] JPA 란?](https://dbjh.tistory.com/77){:target="_blank"}