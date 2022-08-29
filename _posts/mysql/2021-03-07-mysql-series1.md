---
layout: post
title:  'MySQL Series [Part1] 데이터 조회 및 분석(1): SQL소개와 MySQL 문법 정리'
description: 데이터베이스를 체계적으로 작동할 수 있도록 돕는 소프트웨어가 나오게 되었으며 이를 DBMS라고 한다
date:   2021-03-07 15:01:35 +0300
image:  '/images/mysql_1.png'
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

# DBMS  
빅 데이터 시대에서 데이터 저장은 가장 중요한 부분 중 하나입니다. 힘들게 얻은 데이터를 저장하지 않는다면 큰 자원 낭비겠죠. 하지만 중요한 것은 단순히 저장에 그치는 것이 아니라, **어떤 식으로 저장해 그 후 데이터를 추가, 갱신, 삭제 할 때 문제(NULL, 중복 등)가 생기지 않도록 할 것인지에 대한 고민**도 이루어져야 한다는 것 입니다. 이번 MySQL 시리즈에서 이런 문제들을 어떻게 해결할 것인지에 대해 공부해보도록 하겠습니다.  

## Database
데이터베이스는 **데이터의 집합** 또는 **데이터 저장소**라고 정의할 수 있습니다.  

## DBMS
데이터베이스를 보통 직접적으로 접근하지는 않습니다. 사용자들이 데이터베이스를 그냥 접근한다면 데이터의 일관성도 떨어질 것이고, 관리도 쉽지 않을 것 입니다. 이러한 이유로 **데이터베이스를 체계적으로 작동할 수 있도록 돕는 소프트웨어가 나오게 되었으며 이를 DBMS(DataBase Management System)**이라고 합니다.  

DBMS는 데이터베이스를 구축하는 틀을 제공하고, 효율적으로 데이터를 검색하고 저장하는 기능을 제공합니다. 또한 응용 프로그램들이 데이터베이스에 접근할 수 있는 인터페이스를 제공하고, 장애에 대한 복구 기능, 사용자 권한에 따른 보안성 유지 기능 등을 제공합니다.  

## SQL
DBMS를 이용해 데이터베이스를 사용하게 됩니다. 그렇다면 저희는 DBMS와 소통하는 방법을 알아야 합니다. 여기서 DBMS와 소통하기 위한 언어를 SQL(Structured Query Language)라고 합니다. SQL을 이용하면 데이터베이스 조작에 필요한 모든 명령어를 DBMS에 전달함으로써 수행할 수 있습니다.  

## MySQL  
처음 SQL이라는 언어는 IBM이라고 하는 회사에서 System/R이라는 DBMS와, 이것을 사용하기 위해 필요한 언어인 SEQUEL을 만들면서 처음 등장했습니다. 그런데 SEQUEL(Structured English Query Language)은 그 단어가 이미 다른 곳에서 사용되고 있다는 문제(상표권 문제) 때문에 그 이름이 SQL(Structured Query Language)로 변경되었습니다. 그러다가 1987년, 국제 표준화 기구(ISO)에서 SQL에 관한 국제 표준(ISO 9075:1987)이 제정되었습니다.  

하지만 우리가 실제로 사용하는 SQL은 이 국제 표준에 완벽히 부합하지는 않습니다. Oracle, Microsoft SQL Server, MySQL 등의 DBMS에서 지원되는 SQL이 표준을 완벽히 준수하지는 않는다는 뜻입니다. 그 이유는 다양하지만 일단 많은 DBMS 회사들이 성능 향상과 더 다양한 기능 제공을 위해서, 차라리 표준을 일부 벗어나는 것을 택하는 경우가 많기 때문입니다.  

MySQL은 가장 처음 MySQL AB라고 하는 스웨덴 회사에서 개발되었습니다. 현재는 인수 과정을 거쳐 Oracle의 소유입니다. 이로 인해 지금 Oracle에는 Oracle(회사명과 같은 DBMS)과 MySQL이라는 서비스를 함께 제공하고 있습니다.  

두 DBMS의 시장에서의 쓰임새를 보면 약간의 차이가 있습니다. 은행, 거래소 등과 같이 데이터 처리의 정확성, 운영의 안정성 등이 엄격하게 요구되는 분야에서는 오라클이 주로 사용되고 있고, 우리가 흔히 쓰는 앱, 웹 사이트 같은 서비스를 만들 때는 MySQL을 쓰는 경우가 많습니다.  

## DBMS의 종류  
위와 같이 많은 회사에서 성능 향상과 목적에 맞게 SQL이라는 언어를 조금씩 변형, 개선하여 새로운 DBMS로 개발해왔습니다. 이러한 이유로 MySQL과 같이 ~SQL이라는 용어도 사실상은 그 언어를 지원하는 DBMS 자체를 의미하게 되었습니다. 그래서 약간 헷갈리지만 관계형 데이터를 위한 DBMS의 경우 RDBMS, 비 관계형 데이터를 위한 DBMS의 경우 NoSQL이라고 하게 되었습니다.  

**RDBMS**: MySQL, Oracle, MariaDB(MySQL 개발자들이 만든 오픈소스), PostgreSQL 등  
**NoSQL**: MongoDB, ElasticSearch, Cassandra 등

## DBMS의 구조  

![](/images/mysql_1.png)  

- **client(클라이언트 프로그램)**: 유저의 데이터베이스 관련 작업을 위해, SQL을 입력할 수 있는 화면 등을 제공하는 프로그램  
- **server(서버 프로그램)**: client로부터 SQL 문 등을 전달받아 데이터베이스 관련 작업을 직접 처리하는 프로그램

MySQL에서 서버 프로그램의 이름은 `mysqld`, 클라이언트 프로그램 이름은 `mysql`입니다. mysql은 보통 CLI 환경에서 사용하는 프로그램입니다. CLI 환경이 아니라 GUI 환경에서 mysql을 사용하려면 mysql을 GUI 환경에서 사용할 수 있도록 해주는 프로그램을 사용하면 됩니다. 대표적으로 Oracle이 공식적으로 제공하는 `MySQL Workbench`라는 프로그램이 있습니다. 

# SQL의 분류

## DCL

- 데이터베이스 접근 권한과 관련한 명령어
- GRANT, REVOKE, DENY

## DDL

- 테이블과 같은 데이터 구조를 정의하는데 사용되는 명령어
- CREATE, ALTER, RENAME, DROP, TRUNCATE

## DML

- 데이터 조회/삽입/수정/삭제와 관련한 명령어
- SELECT, INSERT, UPDATE, DELETE

## TCL

- 데이터를 트랜잭션 단위로 처리하는데 필요한 명령어
- COMMIT, ROLLBACK, SAVEPOINT

# SELECT문  
MySQL에서 데이터를 **조회하거나 분석**할 때 필요한 **SELECT문**에 대해서 간단히 정리해 보겠습니다.  

## SELECT  
- 특정 컬럼이나 컬럼의 연산 결과를 지정  

```
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

```
FROM customers
FROM orders

# 예시
SELECT name FROM customers;
```

## WHERE
- 컬럼에 조건을 지정  

```
WHERE age = 20
WHERE gender != 'm'
WHERE age >= 27
WHERE age NOT BETWEEN 20 AND 30 # 20~30
WHERE age IN (20, 30) # 20 or 30
WHERE address LIKE '서울%'
WHERE address LIKE '%고양시%'
WHERE address LIKE BINARY '%Kim%' # Kim 매칭, kim 매칭 x
WHERE email LIKE '__@%' # _는 임의의 문자 1개

# 예시
SELECT * 
FROM customers 
WHERE age > 25;
```  

## ORDER BY
- 정렬 기준을 지정  

```
ORDER BY height ASC
ORDER BY height DESC

# 예시
SELECT name, age, height 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6) 
ORDER BY height ASC;
```

## LIMIT 
- 보고자 하는 결과의 개수를 지정  

```
LIMIT 5 # 5개
LIMIT 10, 5 # 10번째부터 5개

# 예시
SELECT name, age, height 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6) 
ORDER BY height ASC
LIMIT 3;
```

## GROUP BY
- 특정 컬럼의 값을 기준으로 그루핑
- 그루핑 하고나면 모든 함수연산 또한 그룹 단위로 실행

```
GROUP BY gender
GROUP BY country
GROUP BY country, gender
GROUP BY SUBSTRING(address, 1, 2)

# 예시
SELECT gender
FROM customers
GROUP BY gender;

SELECT gender, MAX(age)
FROM customers
GROUP BY gender;
GROUP BY SUBSTRING(address, 1, 2), gender WITH ROLLUP

# 예시
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

```
HAVING region = '서울'

# 예시
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
```
SELECT 
FROM
WHERE
GROUP BY
HAVING 
ORDER BY
LIMIT 
```  

**실행 순서**  
```
FROM
WHERE 
GROUP BY
HAVING 
SELECT
ORDER BY
LIMIT 
```  

## SQL에서 제공하는 함수  

```
# 모든 데이터 타입
COUNT(*)
DISTINCT(gender)

# 문자열 데이터 타입
SUBSTRING(address, 1, 2) # address의 첫번째 문자에서 2개
LENGTH(address)
UPPER(address)
LOWER(address)
LPAD(address)
RPAD(address)

# 숫자 데이터 타입
# 집계(aggregation) 함수
MAX(height)
MIN(weight)
AVG(weight)

# 산술(mathematical) 함수
ABS(balance)
CEIL(height)
FLOOR(height)
ROUND(height)


# 날짜 및 시간 데이터 타입
YEAR(birthday)
MONTH(birthday)
DAYOFMONTH(birthday)
DATEDIFF(birthday, '2002-01-01')

# 예시
SELECT * 
FROM customers 
WHERE MONTH(birthday) IN (4, 5, 6);
```

## NULL 데이터 다루는 방법

```
WHERE address IS NULL
WHERE address IS NOT NULL

# COALESCE(a, b, c) 함수는 a, b, c 중 가장 먼저 NULL아닌 값 리턴
COALESCE(height, "키 정보 없음")
COALESCE(height, weight * 2.5, "키 정보 없음")

# IFNULL(a, b) 함수는 a가 NULL 아니면 a, NULL이면 b 리턴
IFNULL(height, "키 정보 없음")

# IF(condition, a, b) 함수는 condition이 True이면 a, False이면 b리턴
IF(address IS NOT NULL, address, "N/A")

# CASE 함수
CASE
    WHEN address IS NOT NULL THEN address
    ELSE N/A
END

# 예시
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

# 마치며  
여기까지 테이블 한 개에 대해서 데이터를 조회하고 분석하는 방법에 대해 살펴보았습니다. 다음 포스트에서는 테이블이 여러 개인 경우에 대해 데이터를 조회하고 분석할 때 필요한 문법에 대해 알아보겠습니다.  


# 참고  

- [MySQL 실습 제공 사이트](https://www.w3schools.com/mysql/trymysql.asp?filename=trysql_select_all){:target="_blank"}

- [MySQL공식문서: Functions and Operators](https://dev.mysql.com/doc/refman/8.0/en/functions.html){:target="_blank"}