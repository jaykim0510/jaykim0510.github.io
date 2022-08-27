---
layout: post
title:  'MySQL Series [Part11] 옵티마이저를 이용한 실행 최적화'
description: 
date:   2022-04-15 15:01:35 +0300
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

# 옵티마이저

옵티마이저: 쿼리를 최적으로 실행하기 위해 각 테이블의 데이터가 어떤 분포로 저장돼 있는지 통계 정보를 참조하여 최적의 실행 계획을 수립  


**쿼리 실행 절차**  

1. MySQL 엔진의 SQL파서에서 SQL을 트리 형태로 파싱한다
2. MySQL 엔진의 옵티마이저에서 파싱 정보를 확인하면서 통계 정보를 활용해 어떤 인덱스를 이용해 테이블을 읽을지 선택한다
3. 2 단계가 완료되면 실행 계획이 만들어진다
4. 스토리지 엔진에 실행 계획대로 레코드를 읽어오도록 요청한다
5. MySQL 엔진의 SQL 실행기가 스토리지 엔진으로부터 받아온 레코드를 조인하거나 정렬하는 작업을 수행한다


## ORDER BY 처리

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

## GROUP BY 처리

- GROUP BY에 사용된 HAVING절은 인덱스를 사용해서 처리될 수 없으므로 굳이 튜닝하려고 할 필요 없다
- GROUP BY 처리는 인덱스를 사용할 수 있는 경우와 그렇지 못한 경우가 있음
- 인덱스가 있으면 인덱스를 차례대로 읽으면서 그루핑 작업을 수행

## DISTINCT 처리

- DISTINCT는 SELECT하는 레코드를 유니크하게 SELECT 하는 것이지, 특정 컬럼만 유니크하게 조회하는 것이 아님
- ```SELECT DISTINCT(first_name), last_name FROM employees;```
  - DISTINCT는 함수가 아니라서 위처럼 괄호를 해놓아도 그냥 무시함
  - 그래서 결론적으로 first_name과 last_name의 조합이 유니크한 레코드를 가져오게 됨
- 집합 함수(COUNT(), MIN(), MAX()) 같은 집합 함수 내에서 DISTINCT 키워드가 사용된 경우는 함수의 인자로 전달된 컬럼값이 유니크한 것들을 가져온다

# 실행 계획

실행 계획을 이해하고 실행 계획의 불합리한 부분을 찾아내고, 더 최적화된 방법으로 실행 계획을 수립하도록 유도하는 법을 배우자  

옵티마이저가 사용자의 개입 없이 항상 좋은 실행 계획을 만들어낼 수 있는 것은 아니다  

사용자가 보완할 수 있도록 EXPLAIN 명령으로 옵티마이저가 수립한 실행 계획을 확인할 수 있게 해준다.  

```
실행 계획 출력
EXPLAIN
SELECT문
```

```
쿼리의 실행 계획과 단계별 소요된 시간 정보 출력
EXPLAIN ANALYZE
SELECT문
```

실행 계획에 가장 큰 영향을 미치는 것은 통계 정보  

**통계 정보**  

- 테이블의 전체 레코드 수
- 인덱스된 컬럼이 가지는 유니크한 값의 개수
- 각 컬럼의 데이터 분포도(히스토그램)

## 실행 계획 분석

```
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

- id 컬럼
  - SELECT 쿼리별로 부여되는 식별자 값
  - SELECT 문장은 하나인데, 여러 개의 테이블이 조인되는 경우에는 id값이 증가하지 않고 같은 id 값이 부여된다
  - 테이블 접근 순서와 무관
- select_type 컬럼
  - 각 단위 SELECT 쿼리가 어떤 타입의 쿼리인지 표시되는 컬럼
  - 표시될 수 있는 값은 SIMPLE, PRIMARY, UNION, DEPENDENT UNION, SUBQUERY 등

# 참고

- [Real MySQL 8.0 (1권) 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158392703&orderClick=LAG&Kc=){:target="_blank"}