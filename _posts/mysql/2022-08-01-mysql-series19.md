---
layout: post
title:  'MySQL Series [Part19] DML(4): INSERT, UPDATE, DELETE'
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

# 데이터 추가
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

# 데이터 갱신
```sql
-- 데이터 갱신
UPDATE <테이블명>
   SET col1 = <갱신 데이터> WHERE <조건>; 

-- 기존 값을 기준으로 갱신
UPDATE <테이블명>
   SET col1 = <col1 + 3> WHERE <조건>; 
```

# 데이터 삭제

```sql
-- 테이블을 사용했던 흔적이 남는다 
-- (AUTO_INCREMENT된 프라이머리키가 15에서 모두 삭제돼도 다음 삽입되는 프라이머리 키가 1이 아니라 16이 됨)
DELETE FROM <테이블명>
      WHERE <조건>

-- 테이블을 사용했던 흔적을 아예 없앤다
TRUNCATE <테이블명>
   WHERE <조건>
```