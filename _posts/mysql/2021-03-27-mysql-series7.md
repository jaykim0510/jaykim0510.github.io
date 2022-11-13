---
layout: post
title:  'MySQL Command Series [Part7] TCL: COMMIT, ROLLBACK, SAVEPOINT'
description: 
date:   2021-03-27 15:01:35 +0300
image:  '/images/commit_logo.png'
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

- 트랜잭션은 Session 단위로 제어됨
- DDL 작업에 대해서는 ROLLBACK 적용 안됨 (DDL은 AutoCommit)

# 오토커밋 확인하기

- AutoCommit은 DML 실행문이 자동으로 커밋되는 것을 의미
- 해제해야 트랜잭션 처리 가능

```sql
SHOW VARIABLES LIKE '%commit%'
```

# 트랜잭션 기능 활성화

```sql
START TRANSACTION

SET AUTOCOMMIT = FALSE
```

# 트랜잭션 처리

```sql
-- DML 작업을 한 후
UPDATE <테이블> SET <컬럼명> = <값> WHERE <조건>

-- 커밋하고 싶은 경우
COMMIT

-- 롤백하고 싶은 경우
ROLLBACK
```

# 상태 저장

```sql
-- DML 작업을 한 후
UPDATE <테이블> SET <컬럼명> = <값> WHERE <조건>

-- 이전 까지의 상태를 x로 저장
SAVEPOINT x

-- x 상태로 롤백
ROLLBACK TO SAVEPOINT x
```