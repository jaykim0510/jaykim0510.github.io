---
layout: post
title:  'MySQL Series [Part4] 데이터 관리(1): CRUD를 이용해 데이터 관리하기'
description: 
date:   2021-03-21 15:01:35 +0300
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

앞에서 저희가 배웠던 SQL문들은 모두 **이미 테이블이 주어졌고 그 테이블에 데이터가 쌓여있는 상태에서 원하는 데이터를 조회**하는 방법에 관한 것들이었습니다.  

하지만 저희가 **직접 테이블을 생성하고 데이터를 쌓아야 하는 순간도 있을 것**입니다. 이번 포스트에서는 이러한 순간에 필요한 SQL문에 대해 배워 보겠습니다.  

# 테이블 생성 및 삭제

```sql
-- 데이터베이스 생성
CREATE DATABASE [생성할 데이터베이스 이름]
CREATE DATABASE IF NOT EXISTS [생성할 데이터베이스 이름]

-- 데이터베이스 지정
USE [생성한 데이터베이스 이름]
```

```sql
-- 테이블 생성
CREATE TABLE [데이터베이스 이름].[생성할 테이블 이름] (
    [컬럼1] INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    [컬럼2] VARCHAR(20) NULL,
    [컬럼3] VARCHAR(15) NULL,
    또는 PRIMARY KEY (['컬럼1'])
);

-- 테이블 삭제
DROP TABLE [테이블 이름]
```

## SQL문 데이터 타입  

|**종류**|**타입**|
|**정수형**|TINYINT, SMALLINT, MEDIUMINT, INT, BIGINT|
|**실수형**|DECIMAL, FLOAT, DOUBLE|
|**날짜 및 시간**|DATE, TIME, DATETIME, TIMESTAMP|
|**문자열**|CHAR, VARCHAR, TEXT|

- **TINYINT**  
signed: -128 ~ 127  
unsigned: 0 ~ 255   

- **INT**  
signed: -2147483648 ~ 2147483647  
unsigned: 0 ~ 4294967295  

- **DECIMAL**  
DECIMAL(M, D): M은 전체 숫자의 최대 자리수, D는 소수점 자리 숫자의 최대 자리수  
DECIMAL(5, 2): -999.99 ~ 999.99  
M은 최대 65까지 가능, D는 최대 30까지 가능  

- **FLOAT**  
-3.4 * 10^38 ~ 3.4 * 10^38  

- **DOUBLE**  
-1.7 * 10^308 ~ 1.7 * 10^308  
FLOAT와 비교해 범위도 더 넓고, 정밀도 또한 더 높음(더 많은 소수점 자리 수 지원)  

- **DATE**  
날짜를 저장하는 데이터 타입  
’2021-03-21’ 이런 형식의 연, 월, 일 순  

- **TIME**
시간을 저장하는 데이터 타입  
’09:27:31’ 이런 형식의 시, 분, 초  

- **DATETIME**  
날짜와 시간을 저장하는 데이터 타입  
’2021-03-21 09:30:27’ 이런 식으로 연, 월, 일, 시, 분, 초  

- **TIMESTAMP**  
DATETIME과 같다  
차이점은 TIMESTAMP는 타임 존 정보도 포함  

- **CHAR**
CHAR(30): 최대 30자의 문자열을 저장 (0~255까지 가능)  
차지하는 용량이 항상 숫자값에 고정됨  
데이터의 길이가 크게 변하지 않는 상황에 적합

- **VARCHAR**  
VARCHAR(30): 최대 30자의 문자열을 저장 (0~65536까지 가능)  
차지하는 용량이 가변적. 30이어도 그 이하의 길이면 용량도 적게 차지함  
해당 값의 사이즈를 나타내는 부분(1byte 또는 2byte)이 저장 용량에 추가
데이터 길이가 크게 들쑥날쑥해지는 경우에 적합  

- **TEXT**  
문자열이 아주 긴 상황에 적합  

# 데이터 CRUD 

## 데이터 추가
```sql
-- 데이터 추가
INSERT INTO [사용할 테이블 이름] (컬럼1, 컬럼2, 컬럼3, ...)
VALUES (컬럼1의 데이터, 컬럼2의 데이터, 컬럼3의 데이터, ...);

-- 특정 컬럼에만 데이터 넣을 수도 있다
INSERT INTO [사용할 테이블 이름] (컬럼1, 컬럼3)
VALUES (컬럼1의 데이터, 컬럼3의 데이터);
```

## 데이터 갱신
```sql
-- 데이터 갱신
UPDATE [사용할 테이블 이름]
    SET 컬럼1 = [갱신 데이터] WHERE [조건]; 

-- 기존 값을 기준으로 갱신
UPDATE [사용할 테이블 이름]
SET 컬럼1 = [컬럼1 + 3] WHERE [조건]; 
```

## 데이터 삭제

```sql
DELETE FROM [사용할 테이블 이름]
WHERE [조건]
```


