---
layout: post
title:  'MySQL Command Series [Part8] 유틸리티(View, CTE, Trigger, Function, Procedure, Cursor)'
description: 
date:   2021-03-28 15:01:35 +0300
image:  '/images/view_logo.png'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# View
- 뷰(view)는 데이터베이스에 존재하는 일종의 가상 테이블로, 실제로 데이터를 저장하고 있지는 않음
- 테이블은 실제 데이터를 저장, 뷰는 그저 SELECT문이 실행되고 난 후의 이미지 같은 느낌
- 때에 따라 서브쿼리가 이중 중첩, 삼중 중첩되는 경우, 이 때 생기는 SELECT문의 복잡성을 줄이고자 뷰를 사용
- 특정 역할을 하는 SELECT문들을 뷰로 저장해서, 코드 스니펫처럼 필요할 때마다 가져와서 사용
- 뷰는 백엔드 개발자들의 자산

## 장점
- 특정 사용자에게 테이블 전체가 아닌 필요한 필드만을 보여줄 수 있음
- 쿼리의 재사용성
- 이미 실행된 서브쿼리라는 점에서 더 빠르다고 할 수 있음

## 단점
- 뷰는 수정할 수 없는 경우가 많음
  - SUM, AVG와 같은 집계 함수가 있는 경우, UNION ALL, DISTINCT, GROUP BY가 포함된 경우
- 삽입, 삭제, 갱신 작업에 제한 사항이 많음

## 생성

```sql
CREATE VIEW <뷰 이름> AS
  SELECT 필드1, 필드2, ...
  FROM 테이블
  WHERE 조건
```

## 수정

```sql
ALTER VIEW <뷰 이름> AS
  SELECT 필드1, 필드2, ...
  FROM 테이블
```
## 삭제

```sql
DROP VIEW <뷰 이름>
```

## 정보 확인

```sql
SHOW TABLES
SHOW CREATE VIEW <뷰 이름>
DESC <뷰 이름>

SELECT * FROM information_schema.views
 WHERE table_schema = <DB>
```

# CTE(Common Table Expression)

- 메모리에 임시 결과로 올려놓고 재사용
- 쿼리가 실행중인 동안에만 데이터가 메모리에 올라와 있음
- 순차적으로 쿼리 작성 가능

```sql
-- CTE 한 개 생성
WITH <CTE 테이블명> AS 
(SELECT ...) 

-- CTE 여러 개 생성
WITH 
<CTE 테이블명1> AS (SELECT ...),
<CTE 테이블명2> AS (SELECT ...),
```


## RECURSIVE CTE

- 스스로 추가적인 Record를 생성할 수 있음
- 그래서 반드시 UNION 사용해야함

![](/images/mysql_40.png)

## Table vs View

- 테이블은 데이터와 RDBMS에 관한 정보를 영구적으로 저장하는 저장소
- 뷰는 어떤 쿼리에 의해 생성된 가상의 테이블. 인덱싱 해놓지 않으면 데이터베이스에 별도로 저장되지 않음

## View vs CTE

- 뷰는 데이터베이스에 존재하는 일종의 오브젝트(Object)
  - 다른 곳에서도 쓰일 일이 있는 쿼리라면 뷰
  - 다른 사용자들에게 데이터의 일부만 제공하고자 하는 경우 뷰
- CTE는 쿼리가 실행되는 동안에만 존재하는 임시 테이블
  - Ad-hoc하게 사용하려는 경우 CTE

## CTE vs Subquery

- CTE와 서브쿼리는 성능이나 결과적인 측면에서 다른 점이 없다
- 차이점은 CTE가 가독성이 더 좋다는 것, CTE는 재귀적으로 호출해 완전히 새로운 테이블을 만들 수 있다

# Trigger

# Stored Function

# Stored Procedure

# Cursor

# 참고

- [stackoverflow, Difference between View and table in sql](https://stackoverflow.com/questions/6015175/difference-between-view-and-table-in-sql){:target="_blank"}
- [stackoverflow, CTE vs View Performance in SQL Server](https://stackoverflow.com/questions/6026842/cte-vs-view-performance-in-sql-server){:target="_blank"}
- [LearnSQL, What’s the Difference Between SQL CTEs and Views?](https://learnsql.com/blog/difference-between-sql-cte-and-view/){:target="_blank"}
- [stackoverflow, Is there any performance difference btw using CTE, view and subquery?](https://stackoverflow.com/questions/52771879/is-there-any-performance-difference-btw-using-cte-view-and-subquery){:target="_blank"}
- [인파, [MYSQL] 📚 WITH (임시 테이블 생성)](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-WITH-%EC%9E%84%EC%8B%9C-%ED%85%8C%EC%9D%B4%EB%B8%94?category=890808){:target="_blank"}
