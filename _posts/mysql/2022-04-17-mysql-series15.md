---
layout: post
title:  'MySQL Series [Part15] MySQL 쿼리 튜닝/최적화하기'
description: 
date:   2022-04-17 15:01:35 +0300
image:  '/images/mysql_opt_logo.jpeg'
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

# Optimization Overview

- 데이터베이스의 성능은 테이블, 쿼리, 서버 설정과 같은 몇 가지 요소에 따라 달라짐
- 데이터베이스를 잘 설계함으로써 CPU, I/O 작업과 같은 하드웨어적인 요소들을 최적화 할 수 있음

# Things to Consider for Optimization

## 테이블

- 컬럼의 타입
- 컬럼 개수
- 제약조건
- 인덱스

```
applications that perform frequent updates often have many tables with few columns, while applications that analyze large amounts of data often have few tables with many columns
```

 ## 인덱스 설계

```
Are the right indexes in place to make queries efficient?
```

## 스토리지 엔진 선택

```
In particular, the choice of a transactional storage engine such as InnoDB or a nontransactional one such as MyISAM can be very important for performance and scalability
```

## DB서버 설정

```
Does the application use an appropriate locking strategy? For example, by allowing shared access when possible so that database operations can run concurrently, and requesting exclusive access when appropriate so that critical operations get top priority. Again, the choice of storage engine is significant. The InnoDB storage engine handles most locking issues without involvement from you, allowing for better concurrency in the database and reducing the amount of experimentation and tuning for your code

Are all memory areas used for caching sized correctly? That is, large enough to hold frequently accessed data, but not so large that they overload physical memory and cause paging. The main memory areas to configure are the InnoDB buffer pool and the MyISAM key cache
```


# Optimizer

- 쿼리를 최적으로 실행하기 위해 각 테이블의 데이터가 어떤 분포로 저장돼 있는지 통계 정보를 참조하여 최적의 실행 계획을 수립  


## 쿼리 실행 절차

1. MySQL 엔진의 SQL파서에서 SQL을 트리 형태로 파싱한다
2. MySQL 엔진의 옵티마이저에서 파싱 정보를 확인하면서 통계 정보를 활용해 어떤 인덱스를 이용해 테이블을 읽을지 선택한다
3. 2 단계가 완료되면 실행 계획이 만들어진다
4. 스토리지 엔진에 실행 계획대로 레코드를 읽어오도록 요청한다
5. MySQL 엔진의 SQL 실행기가 스토리지 엔진으로부터 받아온 레코드를 조인하거나 정렬하는 작업을 수행한다



# Query Optimization

## SELECT

- 컬럼을 선택할 때 * 사용을 피해라
- DISTINCT 사용을 피해라 -> 중복 데이터 제거를 위해 테이블 풀 스캔 해야함

## WHERE

- 인덱스를 잘 활용해라
- % 를 맨 앞에 쓰지마라
- 함수 사용을 피해라
- BETWEEN, IN, <, > 사용을 피해라

## GROUP BY
- HAVING절은 인덱스를 사용해서 처리될 수 없으므로 굳이 튜닝하려고 할 필요 없다
- GROUP BY 작업은 크게 인덱스를 사용하는 경우와 사용할 수 없는 경우(임시 테이블을 사용)
- 인덱스를 사용할 수 없는 경우, 전체 테이블을 스캔하여 각 그룹마다 새 임시 테이블을 만든 다음 이 임시 테이블을 사용하여 그룹을 검색하고 집계 함수를 적용하는 것
  - 이렇게 인덱스를 사용할 수 없을 때 할 수 있는 최선의 방법은 WHERE절을 이용해 GROUP BY 하기 전에 데이터량을 줄이는 것
- 인덱스를 잘 설정한다면 임시 테이블을 생성하지 않고 빠르게 데이터를 가져올 수 있다
  - 인덱스를 최대로 활용하기 위해서는 GROUP BY 컬럼과, 인덱스되어 있는 컬럼간의 순서가 중요함
  - SELECT절에 사용되는 집계함수의 경우 MIN(), MAX()는 인덱스의 성능을 최대로 활용할 수 있도록 함

- 참고로 MySQL 8.0부터는 GROUP BY를 한다고 해서 암묵적으로 정렬이 이루어지지 않음 -> 정렬 필요하면 명시적으로 ORDER BY 써야함

- 루스 인덱스 스캔을 사용할 수 있는 경우
  - 루스 인덱스 스캔은 레코드를 건너뛰면서 필요한 부분만 가져오는 스캔 방식
  - EXPLAIN을 통해 실행 계획을 확인해보면 Extra 컬럼에 'Using index for group-by' 라고 표기됨
  - MIN(), MAX() 이외의 함수가 SELECT 절에 사용되면 루스 인덱스 스캔을 사용할 수 없음
  - 인덱스와 GROUP BY의 컬럼 순서가 처음부터 일치해야함
    - ex. 인덱스가 (col1 col2, col3) 일 때 , GROUP BY col1, col2 과 같아야 함 (GROUP BY col2, col3은 안됨)
  - SELECT 절과 GROUP BY 절의 컬럼이 일치해야 함
    - ex. SELECT col1, col2, MAX(col3) GROUP BY col1, col2
- 타이트 인덱스 스캔을 사용하는 경우
  - SELECT 절과 GROUP BY 절의 컬럼이 일치하지 않지만, 조건절을 이용해 범위 스캔이 가능한 경우
    - ex. SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3; 
    - ex. SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;

## JOIN

- OUTER JOIN보다는 INNER JOIN이 낫다
- 드라이빙 테이블(Driving Table)은 레코드 수가 적은 것이 낫다
- 드리븐 테이블은 인덱스를 가지는 것이 중요하다
- JOIN의 조건절로 자주 사용하는 칼럼은 인덱스로 등록한다
- INNER JOIN은 순서를 신경쓰지 않고 편하게 사용 가능하다
- OUTER JOIN은 결과가 상관 없다면, 인덱스를 가지는 테이블이 드리븐 테이블로 오도록 하는 것이 중요하다


## ORDER BY

- 대부분의 SELECT 쿼리에서 정렬은 필수적
- 정렬을 처리하는 방법은 **인덱스를 이용하는 방법**과 **Filesort**라는 별도의 처리를 이용하는 방법


### 정렬 처리 방법

- 인덱스를 사용한 정렬
  - 인덱스를 이용해 정렬을 하기 위해서는 반드시 ORDER BY의 순서대로 생성된 인덱스가 있어야 함
  - 인덱스를 이용해 정렬이 가능한 이유는 B-Tree 인덱스가 키 값으로 정렬되어 있기 때문

- Filesort를 사용한 정렬
  - 인덱스를 사용할 수 없는 경우, WHERE 조건에 일치하는 레코드를 검색해 정렬 버퍼에 저장하면서 정렬을 처리(FIlesort)함


|**방법**|**장점**|**단점**|
|**인덱스 이용**|SELECT 문을 실행할 때 이미 인덱스가 정렬돼 있어 순서대로 읽기만 하면 되므로 매우 빠르다|INSERT, UPDATE, DELETE 작업시 부가적인 인덱스 추가/삭제 작업이 필요하므로 느리다|
|**Filesort 이용**|인덱스 이용과 반대로 INSERT, UPDATE, DELETE 작업이 빠르다|정렬 작업이 쿼리 실행 시 처리되어 쿼리의 응답 속도가 느려진다|

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

## DISTINCT 처리

- DISTINCT는 SELECT하는 레코드를 유니크하게 SELECT 하는 것이지, 특정 컬럼만 유니크하게 조회하는 것이 아님
- ```SELECT DISTINCT(first_name), last_name FROM employees;```
  - DISTINCT는 함수가 아니라서 위처럼 괄호를 해놓아도 그냥 무시함
  - 그래서 결론적으로 first_name과 last_name의 조합이 유니크한 레코드를 가져오게 됨
- 집합 함수(COUNT(), MIN(), MAX()) 같은 집합 함수 내에서 DISTINCT 키워드가 사용된 경우는 함수의 인자로 전달된 컬럼값이 유니크한 것들을 가져온다

## Subquery

- JOIN으로 해결되면 서브쿼리 대신 JOIN을 사용하자
- 서브쿼리 안에 where절과 group by를 통해 불러오는 데이터양을 감소시킬 수 있습니다
- 서브쿼리는 인덱스 또는 제약 정보를 가지지 않기 때문에 최적화되지 못한다
- 윈도우 함수를 고려해보자

## Temporary Table

- Use a temporary table to handle bulk data
- Temporary table vs Using index access

# INSERT, UPDATE, DELETE문


# 실행 계획

- 실행 계획을 통해 쿼리의 불합리한 부분을 찾아내고, 더 최적화된 방법을 모색해보자
- 옵티마이저가 마법처럼 가장 최적의 방법을 찾아내진 못한다 -> 개발자의 역량이 중요
- EXPLAIN 명령을 통해 실행 계획 확인

```sql
-- 실행 계획 출력
EXPLAIN
SELECT
...
```

```sql
-- 쿼리의 실행 계획과 단계별 소요된 시간 정보 출력
EXPLAIN ANALYZE
SELECT
...
```

## 통계정보

- 옵티마이저는 실행 계획을 세울 때 통계 정보를 가장 많이 활용
- 통계 정보는 다음과 같은 것들을 의미
  - 테이블의 전체 레코드 수
  - 인덱스된 컬럼이 가지는 유니크한 값의 개수
  - 각 컬럼의 데이터 분포도(히스토그램)

## 실행 계획 분석

```sql
EXPLAIN
SELECT *
FROM employees AS e
INNER JOIN salaries AS s
ON s.emp_no=e.emp_no
WHERE first_name='ABC'; 
```

|id|select_type|table|partitions|type|possible_keys|key|key_len|ref|rows|filtered|Extra|
|1|SIMPLE|e|NULL|ref|PRIMARY,ix_firstname|ix_firstname|58|const|1|100.00|NULL|
|1|SIMPLE|s|NULL|ref|PRIMARY|PRIMARY|4|employees.e.emp_no|10|100.00|NULL|

표의 각 라인은 쿼리 문장에서 사용된 테이블의 개수만큼 출력된다. 실행 순서는 위에서 아래로 순서대로 표시된다  

- id
  - SELECT 쿼리별로 부여되는 식별자 값
  - SELECT 문장은 하나인데, 여러 개의 테이블이 조인되는 경우에는 id값이 증가하지 않고 같은 id 값이 부여된다
  - 테이블 접근 순서와 무관
- select_type
  - 각 단위 SELECT 쿼리가 어떤 타입의 쿼리인지 표시되는 컬럼
  - 표시될 수 있는 값은 SIMPLE, PRIMARY, UNION, DEPENDENT UNION, SUBQUERY 등


# 참고

- [MySQL 공식문서: Optimizing SELECT Statements](https://dev.mysql.com/doc/refman/8.0/en/select-optimization.html){:target="_blank"}  
- [MySQL Performance Tuning and Optimization Tips](https://phoenixnap.com/kb/improve-mysql-performance-tuning-optimization){:target="_blank"} 
- [nomadlee, MySQL Explain 실행계획 사용법 및 분석](https://nomadlee.com/mysql-explain-sql/){:target="_blank"}
- [EXPLAIN 관련 블로그](https://mysqldba.tistory.com/162?category=537180){:target="_blank"} 
- [ETL 성능 향상을 위한 몇 가지 팁들](https://danbi-ncsoft.github.io/works/2021/11/05/etl-performace-tips.html){:target="_blank"}  
- [전지적 송윤섭시점 TIL, GROUP BY 최적화](https://til.songyunseop.com/mysql/group-by-optimization.html){:target="_blank"}  
- [SQL 성능을 위한 25가지 규칙](https://otsteam.tistory.com/136){:target="_blank"}  
- [패스트캠퍼스 SQL튜닝캠프 4일차 - 조인의 기본 원리와 활용](https://jojoldu.tistory.com/173?category=761883){:target="_blank"} 
- [취미는 공부 특기는 기록, Nested Loop Join, Driving Table](https://brightestbulb.tistory.com/147){:target="_blank"} 
- [stackoverflow, Does the join order matter in SQL?](https://stackoverflow.com/questions/9614922/does-the-join-order-matter-in-sql){:target="_blank"} 
- [코딩팩토리, [DB] 데이터베이스 NESTED LOOPS JOIN (중첩 루프 조인)에 대하여](https://coding-factory.tistory.com/756){:target="_blank"} 
- [고동의 데이터 분석, [SQL] "성능 관점"에서 보는 결합(Join)](https://schatz37.tistory.com/2){:target="_blank"} 
- [고동의 데이터 분석, [SQL] 성능 관점에서의 서브쿼리(Subquery)](https://schatz37.tistory.com/3?category=878798){:target="_blank"} 