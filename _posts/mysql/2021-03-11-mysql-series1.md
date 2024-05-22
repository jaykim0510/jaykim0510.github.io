---
layout: post
title:  '[MySQL] DML(1): SELECT 기초'
description: 
date:   2021-03-11 15:01:35 +0300
image:  '/images/mysql_practical_logo.png'
logo_image: '/images/mysql_practical_logo.png'
category: data_engineering
tag: mysql
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# SELECT Statement

MySQL에서 데이터를 **조회하거나 분석**할 때 필요한 **SELECT문**에 대해서 간단히 정리해 보겠습니다.  

## SELECT  
- 특정 컬럼이나 컬럼의 연산 결과를 지정  

```sql
SELECT *
SELECT address
SELECT height / weight
SELECT MAX(age)
SELECT MAX(age) AS max_age
SELECT 
    (CASE 
        WHEN age IS NOT NULL THEN age 
        ELSE "N/A" 
    END) AS age
```

## FROM  
- 기준이 되는 테이블 지정  

```sql
FROM customers
FROM orders

-- 예시
SELECT name FROM customers;
```

## WHERE
- 조회할 데이터를 필터링 하기 위해, 컬럼에 조건을 지정  

```sql
WHERE age = 20
WHERE gender != 'm'
WHERE age >= 27
WHERE age NOT BETWEEN 20 AND 30 -- 20~30
WHERE age IN (20, 30) -- 20 or 30
WHERE address LIKE '서울%'
WHERE address LIKE '%고양시%'
WHERE address LIKE BINARY '%Kim%' -- Kim 매칭, kim 매칭 x
WHERE email LIKE '__@%' -- _는 임의의 문자 1개

-- 예시
SELECT * 
FROM customers 
WHERE age > 25;
```  

## ORDER BY
- 정렬 기준을 지정  

```sql
ORDER BY height ASC
ORDER BY height DESC

-- 예시
SELECT name, age, height 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6) 
ORDER BY height ASC;
```

## LIMIT 
- 보고자 하는 결과의 개수를 지정  

```sql
LIMIT 5 -- 5개
LIMIT 10, 5 -- 10번째부터 5개

-- 예시
SELECT name, age, height 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6) 
ORDER BY height ASC
LIMIT 3;
```

## GROUP BY
- 특정 컬럼의 값을 기준으로 그루핑
- 그루핑 하고나면 모든 함수연산 또한 그룹 단위로 실행

```sql
GROUP BY gender
GROUP BY country
GROUP BY country, gender
GROUP BY SUBSTRING(address, 1, 2)

-- 예시
SELECT gender
FROM customers
GROUP BY gender;

SELECT gender, MAX(age)
FROM customers
GROUP BY gender;
GROUP BY SUBSTRING(address, 1, 2), gender WITH ROLLUP

-- 예시
SELECT
    SUBSTRING(address, 1, 2) as region
    COUNT(*)
FROM customers
GROUP BY SUBSTRING(address, 1, 2)
HAVING region = '서울';

SELECT SUBSTRING(address, 1, 2) as region, gender, COUNT(*)
FROM member
GROUP BY SUBSTRING(address, 1, 2), gender WITH ROLLUP
HAVING region IS NOT NULL
ORDER BY region ASC, gender DESC;
```

## HAVING 
- 그루핑된 결과에 조건을 지정  

```sql
HAVING region = '서울'

-- 예시
SELECT
    SUBSTRING(address, 1, 2) as region
    COUNT(*)
FROM customers
GROUP BY SUBSTRING(address, 1, 2)
HAVING region = '서울'
```

🦊 **WHERE과 HAVING의 차이점**  
**WHERE**: 주어진 테이블의 전체 row에서 필터링을 하는 용도  
**HAVING**: GROUP BY 되고 난 후 row에서 필터링 하는 용도  

## SELECT문의 작성순서와 실행순서

**작성 순서**  
```sql
SELECT 
FROM
WHERE
GROUP BY
HAVING 
ORDER BY
LIMIT 
```  

**실행 순서**  
```sql
FROM
WHERE 
GROUP BY
HAVING 
SELECT
ORDER BY
LIMIT 
```  

**JOIN 문이 있을 때 실행 순서**  

```sql
FROM
ON
JOIN
WHERE
GROUP BY
HAVING
SELECT
ORDER BY
LIMIT
```

## SQL에서 제공하는 함수  

```sql
-- 모든 데이터 타입
COUNT(*)
DISTINCT(gender)

-- 문자열 데이터 타입
SUBSTRING(address, 1, 2) -- address의 첫번째 문자에서 2개
LENGTH(address)
UPPER(address)
LOWER(address)
LPAD(address)
RPAD(address)

-- 숫자 데이터 타입
-- 집계(aggregation) 함수
MAX(height)
MIN(weight)
AVG(weight)

-- 산술(mathematical) 함수
ABS(balance)
CEIL(height)
FLOOR(height)
ROUND(height)


-- 날짜 및 시간 데이터 타입
YEAR(birthday)
MONTH(birthday)
DAYOFMONTH(birthday)
DATEDIFF(birthday, '2002-01-01')

-- 예시
SELECT * 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6);
```

## NULL 데이터 다루는 방법

```sql
WHERE address IS NULL
WHERE address IS NOT NULL

-- COALESCE(a, b, c) 함수는 a, b, c 중 가장 먼저 NULL아닌 값 리턴
COALESCE(height, "키 정보 없음")
COALESCE(height, weight * 2.5, "키 정보 없음")

-- IFNULL(a, b) 함수는 a가 NULL 아니면 a, NULL이면 b 리턴
IFNULL(height, "키 정보 없음")

-- IF(condition, a, b) 함수는 condition이 True이면 a, False이면 b리턴
IF(address IS NOT NULL, address, "N/A")

-- CASE 함수
CASE
    WHEN address IS NOT NULL THEN address
    ELSE N/A
END

-- 예시
SELECT address
FROM customers
WHERE address IS NOT NULL;

SELECT COALESCE(height, "키 정보 없음"), COALESCE(gender, "성별 정보 없음")
FROM customers;

SELECT IF(address IS NOT NULL, address, "N/A")
FROM customers;

SELECT
    CASE
        WHEN address IS NOT NULL THEN address
        ELSE N/A
    END
FROM customers;
```  

# 참고  

- [MySQL 실습 제공 사이트](https://www.w3schools.com/mysql/trymysql.asp?filename=trysql_select_all){:target="_blank"}

- [MySQL공식문서: Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/functions.html){:target="_blank"}