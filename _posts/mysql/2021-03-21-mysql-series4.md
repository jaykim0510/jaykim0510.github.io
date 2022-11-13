---
layout: post
title:  'MySQL Command Series [Part4] DML(4): INSERT, UPDATE, DELETE'
description: 
date:   2021-03-21 15:01:35 +0300
image:  '/images/insert_logo.png'
logo_image: '/images/mysql_logo.webp'
categories: data_engineering
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

# INSERT

```sql
-- 데이터 추가
INSERT INTO <테이블명> (col1, col2, col3, ...)
     VALUES (val1, val2, val3, ...);

-- 특정 col에만 데이터 넣을 수도 있다
INSERT INTO <테이블명> (col1, col3)
     VALUES (val1, val3);

-- SET을 이용한 방법
INSERT INTO <테이블명> 
        SET col1=val1, col2=val2;
```

# UPDATE

```sql
-- 데이터 갱신
UPDATE <테이블명>
   SET col1 = <갱신 데이터> WHERE <조건>; 

-- 기존 값을 기준으로 갱신
UPDATE <테이블명>
   SET col1 = <col1 + 3> WHERE <조건>; 
```

# DELETE

```sql
-- 테이블을 사용했던 흔적이 남는다 
-- (AUTO_INCREMENT된 프라이머리키가 15에서 모두 삭제돼도 다음 삽입되는 프라이머리 키가 1이 아니라 16이 됨)
DELETE FROM <테이블명>
      WHERE <조건>

-- 테이블을 사용했던 흔적을 아예 없앤다
TRUNCATE <테이블명>
   WHERE <조건>
```


# SQL문 데이터 타입  

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
