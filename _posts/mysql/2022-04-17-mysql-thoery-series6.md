---
layout: post
title:  'MySQL Thoery Series [Part6] MySQL 파티션'
description: 
date:   2022-04-17 15:01:35 +0300
image:  '/images/mysql_logo.png'
logo_image: '/images/mysql_logo.png'
category: data_engineering
tag: [mysql]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 파티션이란

- 파티션은 테이블을 논리적으로는 하나의 테이블, 물리적으로는 여러 개의 테이블로 분리해 관리하도록 도와주는 기능
- 파티션 기능을 대용량 테이블에 사용한다고 해서 무조건 성능이 빨라지는 것은 아님 -> 쿼리에 따라 다름
- 파티션은 실무에서 MySQL의 부하를 줄이기 위해서(성능 향상) 사용할 것을 적극 권장

# 이용 사례

- 대표적으로 테이블이 너무 커서 인덱스의 크기가 물리적인 메모리보다 훨씬 클 때
- 데이터 특성상 주기적인 삭제 작업이 필요할 때

# 파티션의 종류

- **Range**: 범위(날짜 등)를 기반으로 파티션을 나눈다. // 가장 흔히 사용
- **List**: 코드나 카테고리 등 특정 값을 기반으로 파티션을 나눈다. 
- **Hash**: 설정한 HASH 함수를 기반으로 파티션을 나눈다. // Range, List 사용이 애매할 때 사용
- **Key**: MD5() 함수를 이용한 HASH 값을 기반으로 파티션을 나눈다. // HASH보다 균등

```sql
-- Range 사용 예시
CREATE DATABASE testDB;
USE testDB;

CREATE TABLE userTable (
    userID CHAR(12) NOT NULL
    birthYear INT NOT NULL )
    
PARTITION BY RANGE(birthYear) (
PARTITION part1 VALUE LESS THAN (1970),
PARTITION part2 VALUE LESS THAN (1980),
PARTITION part3 VALUE LESS THAN (1990),
PARTITION part4 VALUE LESS THAN MAXVALUE
);
```

위와 같이 `birthYear`을 조건절의 컬럼으로 사용해 쿼리할 때, 파티셔닝을 잘한 경우 일부 파티션만 가져올 수 있도록 해준다.  

# 사용시 주의 사항

- 파티션을 많이 나누는 경우에는 시스템 변수 `open_file_limit`(동시에 열 수 있는 파일 수의 Max)를 높게 수정
- 파티션 키는 유니크 인덱스(프라이머리 키 포함) -> 유니크 키 값이 주어졌을 때, 해당 레코드의 파티션이 무엇인지 알 수 있어야함

# 참고
- [Real MySQL 8.0 (2권) 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791158392727&orderClick=JGJ){:target="_blank"}
- [Jae Honey, MySQL - 파티션(Partition), 테이블 분할](https://jaehoney.tistory.com/62){:target="_blank"}