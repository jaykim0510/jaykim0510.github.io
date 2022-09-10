---
layout: post
title:  'MySQL Series [Part15] MySQL 쿼리 튜닝/최적화하기'
description: 
date:   2022-07-29 15:01:35 +0300
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

# Query Optimization
- MySQL Query Processing
- Understanding the Query Plan
- Using EXPLAIN
- Improving Query Performance
- Indexing

# Optimization Overview

Database performance depends on several factors at the database level, such as tables, queries, and configuration settings. These software constructs result in CPU and I/O operations at the hardware level, which you must minimize and make as efficient as possible. 

# Things to Consider for Optimization

- Are the tables structured properly? In particular, do the columns have the right data types, and does each table have the appropriate columns for the type of work? For example, applications that perform frequent updates often have many tables with few columns, while applications that analyze large amounts of data often have few tables with many columns.

- Are the right indexes in place to make queries efficient?

- Are you using the appropriate storage engine for each table, and taking advantage of the strengths and features of each storage engine you use? In particular, the choice of a transactional storage engine such as InnoDB or a nontransactional one such as MyISAM can be very important for performance and scalability.

- Does each table use an appropriate row format? This choice also depends on the storage engine used for the table. In particular, compressed tables use less disk space and so require less disk I/O to read and write the data. Compression is available for all kinds of workloads with InnoDB tables, and for read-only MyISAM tables.

- Does the application use an appropriate locking strategy? For example, by allowing shared access when possible so that database operations can run concurrently, and requesting exclusive access when appropriate so that critical operations get top priority. Again, the choice of storage engine is significant. The InnoDB storage engine handles most locking issues without involvement from you, allowing for better concurrency in the database and reducing the amount of experimentation and tuning for your code.

- Are all memory areas used for caching sized correctly? That is, large enough to hold frequently accessed data, but not so large that they overload physical memory and cause paging. The main memory areas to configure are the InnoDB buffer pool and the MyISAM key cache.

# SELECT문 최적화

## SELECT

- Avoid using *
- Avoid using DISTINCT -> 중복 데이터 제거를 위해 테이블 풀 스캔 해야함

## WHERE

- Use Indexes Where Appropriate
- Avoid % Wildcard in a Predicate
- Avoid using a function in the predicate of a query
- BETWEEN, IN, <, >

## GROUP BY
- GROUP BY 작업은 크게 인덱스를 사용하는 경우와 사용할 수 없는 경우(임시 테이블을 사용)
- 인덱스를 사용할 수 없는 경우, 전체 테이블을 스캔하여 각 그룹의 모든 행이 연속되는 새 임시 테이블을 만든 다음 이 임시 테이블을 사용하여 그룹을 검색하고 집계 함수를 적용하는 것
  - 이렇게 인덱스를 사용할 수 없을 때 할 수 있는 최선의 방법은 WHERE절을 이용해 GROUP BY 하기 전에 데이터량을 줄이는 것
- 인덱스를 잘 설정한다면 임시 테이블을 생성하지 않고 빠르게 데이터를 가져올 수 있다
  - 인덱스를 최대로 활용하기 위해서는 GROUP BY 컬럼과, 인덱스되어 있는 컬럼간의 순서가 중요함
  - SELECT절에 사용되는 집계함수의 경우 MIN(), MAX()는 인덱스의 성능을 최대로 활용할 수 있도록 함

- 참고로 MySQL 8.0부터는 GROUP BY를 한다고 해서 암묵적으로 정렬이 이루어지지 않음 -> 정렬 필요하면 명시적으로 ORDER BY 써야함

- 루스 인덱스 스캔을 사용할 수 있는 경우
  - 루스 인덱스 스캔은 레코드를 건너뛰면서 필요한 부분만 가져오는 스캔 방식
  - EXPLAIN을 통헤 실행 계획을 확인해보면 Extra 컬럼에 'Using index for group-by' 라고 표기됨
  - MIN(), MAX() 이외의 함수가 SELECT 절에 사용되면 루스 인덱스 스캔을 사용할 수 없음
  - 인덱스가 (col1 col2, col3) 일 때 , GROUP BY col1, col2 과 같아야 함 (GROUP BY col2, col3은 안됨)
  - SELECT 절과 GROUP BY 절의 컬럼이 일치해야 함. SELECT col1, col2, MAX(col3) GROUP BY col1, col2 과 같아야 함
- 타이트 인덱스 스캔을 사용하는 경우
  - SELECT 절과 GROUP BY 절의 컬럼이 일치하지 않지만, 조건절을 이용해 범위 스캔이 가능한 경우
    - SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3; 
    - SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;

## JOIN

- INNER joins, order doesn't matter
- OUTER joins, the order matters
- 여러 조인을 포함하는 LOOP JOIN 에서는 드라이빙 테이블(Driving Table)이 행들을 최소한으로 리턴하도록 해야됨
- JOIN 되는 컬럼의 한쪽에만 INDEX가 있는 경우는 INDEX가 지정된 TABLE이 DRIVING TABLE이 된다
- JOIN 시 자주 사용하는 칼럼은 인덱스로 등록한다

인덱스 레인지 스캔은 인덱스를 탐색(Index Seek)하는 단계와 인덱스를 스캔(Index Scan)하는 과정으로 구분해 볼 수 있다. 일반적으로 인덱스를 이용해서 쿼리하는 작업에서는 가져오는 레코드의 건수가 소량(전체 데이터 크기의 20% 이내)이기 때문에 인덱스 스캔 작업은 부하가 작고, 특정 인덱스 키를 찾는 인덱스 탐색 작업이 부하가 높은 편이다.  

JOIN 작업에서 드라이빙 테이블을 읽을 때는 인덱스 탐색 작업을 단 한 번만 수행하고, 그 이후부터는 스캔만 실행하면 된다.  

하지만 드리븐 테이블에서는 인덱스 탐색 작업과 스캔 작업을 드라이빙 테이블에서 읽은 레코드 건수만큼 반복한다.  

드라이빙 테이블과 드리븐 테이블이 1:1 조인되더라도 **드리븐 테이블을 읽는 것이 훨씬 더 큰 부하를 차지**한다.  

그래서 옵티마이저는 항상 드라이빙 테이블이 아니라 드리븐 테이블을 최적으로 읽을 수 있게 실행 계획을 수립한다.  

```sql
SELECT *
FROM employees e, dept_emp de
WHERE e.emp_no=de.emp_no
```
여기서 각 테이블의 emp_no 컬럼에 인덱스가 있을 때와 없을 때 조인 순서가 어떻게 달라지는 한 번 살펴보자.  

- 두 컬럼 모두 인덱스가 있는 경우
  - 어느 테이블을 드라이빙으로 선택하든 인덱스를 이용해 드리븐 테이블의 검색 작업을 빠르게 처리할 수 있다
  - 보통의 경우 어느 쪽 테이블이 드라이빙 테이블이 되든 옵티마이저가 선택하는 방법이 최적일 때가 많다
- employees 테이블에만 인덱스가 있는경우
  - 이 때는 employees 테이블을 드리븐 테이블로 선택한다
  - 드리븐 테이블을 읽는 것이 훨씬 더 큰 부하를 차지하기 때문에 드리븐 테이블에서 인덱스를 활용하는 것이 중요한다


INNER JOIN은 조인 대상 테이블 모두에 해당하는 레코드만 반환한다. 이같은 특성 때문에 OUTER JOIN으로만 조인을 실행하는 쿼리들도 자주 보인다. 하지만 대개의 경우 OUTER JOIN은 대상 테이블들의 데이터가 일관되지 않은 경우에만 필요하다.  

MySQL 옵티마이저는 OUTER JOIN시 조인 되는 테이블(FROM A LEFT JOIN B에서 B)을 드라이빙 테이블로 선택하지 못하기 때문에 무조건 앞에 등장하는 테이블을 드라이빙 테이블로 선택한다. 그 결과 인덱스 유무에 따라 조인 순서를 변경함으로써 얻게 되는 최적화의 이점을 얻지 못하기 때문에 쿼리 성능이 나빠질 수 있다. 그래서 꼭 필요한 경우가 아니라면 INNER JOIN을 사용하는 것이 쿼리의 성능에 도움이 된다.  

 JOIN의 순서  

 - INNER JOIN인 경우
   - 어차피 A and B and C 이기 때문에 A JOIN B JOIN C이든 B JOIN A JOIN C이든 같다.
 - LEFT JOIN의 경우 결과도 성능도 달라진다. 
   - 일단 가장 먼저 등장하는 테이블이 드라이빙 테이블이 된다 -> 이 말은 뒤에 따라오는 테이블은 드리븐 테이블이 된다는 말이다 -> 드리븐 테이블은 인덱스가 없으면 성능이 떨어진다 -> 뒤에 조인되는 테이블의 인덱스 유무에 따라 쿼리 성능이 달라진다
   - 결과 자체도 맨 앞에 등장하는 테이블의 모든 레코드가 기준이 되기 때문에 순서에 따라 달라진다
 - INNER JOIN과 OUTER JOIN이 결합되는 경우
   - 가능하다면 INNER JOIN이 앞에 오도록 하는 것이 좋다


## Subquery

- Avoid correlated sub queries as it searches row by row, impacting the speed of SQL query processing
- JOIN으로 해결되면 서브쿼리 대신 JOIN을 사용하자
- 서브쿼리 안에 where절과 group by를 통해 불러오는 데이터양을 감소시킬 수 있습니다
- 서브쿼리는 인덱스 또는 제약 정보를 가지지 않기 때문에 최적화되지 못한다
- 윈도우 함수를 고려해보자


## Temporary Table

- Use a temporary table to handle bulk data
- Temporary table vs Using index access

## ORDER BY

- 대부분의 SELECT 쿼리에서 정렬은 필수적
- 정렬을 처리하는 방법은 **인덱스를 이용하는 방법**과 **Filesort**라는 별도의 처리를 이용하는 방법

|방법|장점|단점|
|인덱스 이용|SELECT 문을 실행할 때 이미 인덱스가 정렬돼 있어 순서대로 읽기만 하면 되므로 매우 빠르다|INSERT, UPDATE, DELETE 작업시 부가적인 인덱스 추가/삭제 작업이 필요하므로 느리다|
|Filesort 이용|인덱스 이용과 반대로 INSERT, UPDATE, DELETE 작업이 빠르다|정렬 작업이 쿼리 실행 시 처리되어 쿼리의 응답 속도가 느려진다|

**Filesort를 사용해야 하는 경우**  

- 정렬 기준이 너무 많아서 모든 인덱스를 생성하는 것이 불가능한 경우
- 어떤 처리의 결과를 정렬해야 하는 경우
- 랜덤하게 결과 레코드를 가져와야 하는 경우

**소트 버퍼**  

- MySQL은 정렬을 수행하기 위해 별도의 메모리 공간을 할당받아서 사용하는데 이 메모리 공간을 소트 버퍼라고 한다
- 정렬해야 할 레코드의 건수가 소트 버퍼의 크기보다 크다면 어떻게 해야 할까?
  - 정렬해야 할 레코드를 여러 조각으로 나눠서 처리하게 됨. 이 과정에서 임시 저장을 위해 디스크를 사용
  - 일부를 처리하고 디스크에 저장하기를 반복 수행함

**정렬 알고리즘**  

- 정렬 대상 컬럼과 프라이머리 키만 가져와서 정렬하는 방식
  - 정렬 대상 컬럼과 프라이머리 키 값만 소트 버퍼에 담아 정렬을 수행
  - 그리고 다시 정렬 순서대로 프라이머리 키로 테이블을 읽어서 SELECT할 컬럼을 가져옴
  - 가져오는 컬럼이 두 개 뿐이라 소트 버퍼에 많은 레코드를 한 번에 읽어올 수 있음
  - 단점은 테이블을 두 번 읽어야 함
- 정렬 대상 컬럼과 SELECT문으로 요청한 컬럼을 모두 가져와서 정렬하는 방식
  - 최신 버전의 MySQL에서 일반적으로 사용하는 방식
  - SELECT 문에서 요청한 컬럼의 개수가 많아지면 계속 분할해서 소트 버퍼에 읽어와야함
  - 레코드의 크기나 건수가 작은 경우 성능이 좋음

### 정렬 처리 방법

- 인덱스를 사용한 정렬
  - 인덱스를 이용해 정렬을 하기 위해서는 반드시 ORDER BY의 순서대로 생성된 인덱스가 있어야 함
  - 인덱스를 이용해 정렬이 가능한 이유는 B-Tree 인덱스가 키 값으로 정렬되어 있기 때문

- Filesort를 사용한 정렬
  - 인덱스를 사용할 수 없는 경우, WHERE 조건에 일치하는 레코드를 검색해 정렬 버퍼에 저장하면서 정렬을 처리(FIlesort)함

# INSERT, UPDATE, DELETE문

# 참고

- [MySQL 공식문서: Optimizing SELECT Statements](https://dev.mysql.com/doc/refman/8.0/en/select-optimization.html){:target="_blank"}  
- [MySQL Performance Tuning and Optimization Tips](https://phoenixnap.com/kb/improve-mysql-performance-tuning-optimization){:target="_blank"}  
- [ETL 성능 향상을 위한 몇 가지 팁들](https://danbi-ncsoft.github.io/works/2021/11/05/etl-performace-tips.html){:target="_blank"}  
- [전지적 송윤섭시점 TIL, GROUP BY 최적화](https://til.songyunseop.com/mysql/group-by-optimization.html){:target="_blank"}  
- [SQL 성능을 위한 25가지 규칙](https://otsteam.tistory.com/136){:target="_blank"}  
- [패스트캠퍼스 SQL튜닝캠프 4일차 - 조인의 기본 원리와 활용](https://jojoldu.tistory.com/173?category=761883){:target="_blank"} 
- [취미는 공부 특기는 기록, Nested Loop Join, Driving Table](https://brightestbulb.tistory.com/147){:target="_blank"} 
- [stackoverflow, Does the join order matter in SQL?](https://stackoverflow.com/questions/9614922/does-the-join-order-matter-in-sql){:target="_blank"} 
- [코딩팩토리, [DB] 데이터베이스 NESTED LOOPS JOIN (중첩 루프 조인)에 대하여](https://coding-factory.tistory.com/756){:target="_blank"} 
- [고동의 데이터 분석, [SQL] "성능 관점"에서 보는 결합(Join)](https://schatz37.tistory.com/2){:target="_blank"} 
- [고동의 데이터 분석, [SQL] 성능 관점에서의 서브쿼리(Subquery)](https://schatz37.tistory.com/3?category=878798){:target="_blank"} 