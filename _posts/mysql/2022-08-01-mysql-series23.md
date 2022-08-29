---
layout: post
title:  'MySQL Series [Part23] 유틸리티(View, CTE, INDEX)'
description: 
date:   2022-08-01 15:01:35 +0300
image:  '/images/mysql_logo.webp'
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
- 뷰(view)는 데이터베이스에 존재하는 일종의 가상 테이블
- 실제로 데이터를 저장하고 있지는 않음
- 테이블은 실제 데이터를 저장, 뷰는 그저 SELECT문이 실행되고 난 후의 이미지 같은 느낌
- 때에 따라 서브쿼리가 이중 중첩, 삼중 중첩되는 경우 
- 이 때 생기는 SELECT문의 복잡성을 줄이고자 뷰를 사용
- 특정 역할을 하는 SELECT문들을 뷰로 저장  
- 코드 스니펫처럼 필요할 때마다 가져와서 사용 가능
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
- 쿼리가 실행중인 동안만큼은 데이터가 메모리에 올라와 있음
- 순차적으로 쿼리 작성 가능

## RECURSIVE CTE

- 스스로 추가적인 Record를 생성할 수 있음
- 그래서 반드시 UNION 사용해야함

![](/images/mysql_40.png)

```sql

```

## Table vs View

- Table: Table is a preliminary storage for storing data and information in RDBMS. A table is a collection of related data entries and it consists of columns and rows.

- View: A view is a virtual table whose contents are defined by a query. Unless indexed, a view does not exist as a stored set of data values in a database. Advantages over table are

We can combine columns/rows from multiple table or another view and have a consolidated view.
Views can be used as security mechanisms by letting users access data through the view, without granting the users permissions to directly access the underlying base tables of the view
It acts as abstract layer to downstream systems, so any change in schema is not exposed and hence the downstream systems doesn't get affected.  

## View vs CTE

- A view is an object in the database
- Views can be indexed
- A CTE only exists for the duration of a single query
- CTE can't be indexed

- **Ad-hoc queries**: For queries that are referenced occasionally (or just once), it’s usually better to use a CTE. If you need the query again, you can just copy the CTE and modify it if necessary.
- **Frequently used queries**: If you tend to reference the same query often, creating a corresponding view is a good idea. However, you’ll need create view permission in your database to create a view.
- **Access management**: A view might be used to restrict particular users’ database access while still allowing them to get the information they need. You can give users access to specific views that query the data they’re allowed to see without exposing the whole database. In such a case, a view provides an additional access layer.

## CTE vs Subquery

CTE is just syntax so in theory it is just a subquery. you may not get any performance difference while using CTE and Subquery.  

I think the biggest benefit for using CTEs is readability. It makes it much easier to see what queries are being used as subqueries, and then it's easy to join them into a query, much like a view.  

# 참고

- [stackoverflow, Difference between View and table in sql](https://stackoverflow.com/questions/6015175/difference-between-view-and-table-in-sql){:target="_blank"}
- [stackoverflow, CTE vs View Performance in SQL Server](https://stackoverflow.com/questions/6026842/cte-vs-view-performance-in-sql-server){:target="_blank"}
- [LearnSQL, What’s the Difference Between SQL CTEs and Views?](https://learnsql.com/blog/difference-between-sql-cte-and-view/){:target="_blank"}
- [stackoverflow, Is there any performance difference btw using CTE, view and subquery?](https://stackoverflow.com/questions/52771879/is-there-any-performance-difference-btw-using-cte-view-and-subquery){:target="_blank"}
- [인파, [MYSQL] 📚 WITH (임시 테이블 생성)](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-WITH-%EC%9E%84%EC%8B%9C-%ED%85%8C%EC%9D%B4%EB%B8%94?category=890808){:target="_blank"}
