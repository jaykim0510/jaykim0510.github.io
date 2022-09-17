---
layout: post
title:  'MySQL Series [Part16] MySQL 성능 점검/튜닝하기'
description: 
date:   2022-07-02 15:01:35 +0300
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

```
# 점검 대상이 되는 것

- 연결(Connection)
- 쿼리
- 인덱스
- 스토리지 엔진
- 메모리
- MySQL 서버

```

# 쿼리 분석

- 내가 실행한 쿼리에 대한 분석
- 쿼리, 인덱스 튜닝에 대한 힌트를 제공
- (쿼리 튜닝 방법은 이전 포스트 참고)

```sql
EXPLAIN
SELECT
...
```

```sql
EXPLAIN ANALYZE
SELECT
...
```

```sql
# 슬로우 로그 조회하기
SELECT * FROM mysql.slow_log;
# 또는
SELECT start_time, user_host, query_time, lock_time, rows_sent, rows_examined, db, CONVERT(sql_text USING utf8 ) sql_text
FROM mysql.slow_log;
```

# 시스템 분석

- 시스템/서버 설정에 대한 분석
- 그라파나와 같은 모니터링 툴을 이용해 상황에 맞게 설정해야함

# 참고

- [islove8587, MySQL 대용량 테이블의 성능에 영향을 줄 수 있는 10가지 방법](https://m.blog.naver.com/islove8587/221976843118){:target="_blank"}
- [islove8587, MySQL 시스템 관련 튜닝](https://m.blog.naver.com/islove8587/221977641268){:target="_blank"}
- [cloudrain21, MySQL InnoDB 성능 튜닝 기본](http://cloudrain21.com/mysql-innodb-basic-performance-tunning){:target="_blank"}
- [MyInfraBox, [MySQL] MySQL Tuning(튜닝) 그리고 Optimization(최적화)](https://myinfrabox.tistory.com/249){:target="_blank"}
- [happist, MySql 최적화로 빨라질 사이트 DB 튜닝 방법](https://happist.com/577204/db-%ED%8A%9C%EB%8B%9D%EC%9C%BC%EB%A1%9C-mysql-%EC%B5%9C%EC%A0%81%ED%99%94){:target="_blank"}
- [OGG, MySQL Tuning point](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=ksf1990&logNo=221569426999){:target="_blank"}
- [MySQL Performance Tuning pdf](https://rockplace.co.kr/edm/201412/download/Session%203.%20MySQL%20Performance%20and%20Tuning_full_notes.pdf){:target="_blank"}