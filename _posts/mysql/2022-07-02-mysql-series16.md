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

## 연결(Connection)

- MySQL은 오픈 소스임에도 높은 성능을 제공해준다는 점에서 웹 서비스의 DB로 많이 사용됨
- 웹 서비스에서 사용되는 OLTP는 대용량 데이터 처리보다는 많은 사용자의 동시 접속을 제어하는 것이 중요한 요소임

### 모니터링을 위한 status

```sql
SHOW STATUS LIKE '%connect%';
SHOW STATUS LIKE '%client%';
```

- **Aborted_clients**: 클라이언트 프로그램이 비 정상적으로 종료된 수
- **Aborted_connects**: MySQL 서버에 접속이 실패된 수
- **Connections**: MySQL 서버에 대한 연결 시도 횟수
- **Max_used_connections**: 최대로 동시에 접속한 수
- **Threads_cached**: Thread Cache의 Thread 수
- **Threads_connected**: 현재 연결된 Thread 수
- **Threads_created**: 접속을 위해 생성된 Thread 수
- **Threads_running**: Sleeping 되어 있지 않은 Thread 수
- **Aborted_connects / Connections** -> 접속 실패율

### 튜닝을 위한 system variables

```sql
SHOW VARIABLES LIKE '%connection%'
```

- **wait_timeout**: 종료전까지 요청이 없이 기다리는 시간 ( TCP/IP 연결, Shell 상의 접속이 아닌 경우 )
- **thread_cache_size**: thread 재 사용을 위한 Thread Cache 수로써, Cache 에 있는 Thread 수보다 접속이 많으면 새롭게 Thread를 생성한다.
- **max_connections**: 최대 동시 접속 가능 수. 늘어나면 날수록 메모리가 고갈되고 스케줄링 오버헤드도 증가

## 스토리지 엔진

- **default_storage_engine**: 기본 스토리지 엔진

### MyISAM과 InnoDB 비교
- InnoDB 의 경우 INSERT 속도가 MyISAM에 비해 느리다

### InnoDB 관련 설정

- **innodb_log_group_home_dir**: 리두 로그 파일의 위치
- **innodb_log_files_in_group**: 리두 로그 파일의 수
- **innodb_log_file_size**: 리두 로그 파일의 크기
  - 지나치게 크면 복구 시간이 길어지면서 비효율적이 될 수 있음
  - innodb_buffer_pool_size의 25% 정도 할당
- **innodb_buffer_pool_size**: 버퍼 풀의 크기
  - 버퍼 풀의 크기가 클수록 성능에 유리 (다다익선)
- **innodb_buffer_pool_instances**: 버퍼 풀 인스턴스 수
  - 인스턴스 수를 늘리면 트랜잭션 간의 Lock 경합을 줄일 수 있다
  - CPU 코어 수가 많은 시스템일수록 인스턴스 수를 늘릴 수 있다고 보면 된다
- **innodb_flush_log_at_trx_commit**: 트랜잭션을 얼마나 엄격하게 지킬 것인지
  - default 1: 트랜잭션의 ACID 특성을 완전히 준수 -> 트랜잭션이 커밋될 때마다 로그 버퍼상의 로그를 디스크의 로그 파일로 바로 플러시
  - 0: 1초마다 로그 버퍼에 로그가 쓰여지고 플러시 된다. 트랜잭션을 수행했지만 그 사이에 충돌이 나서 로그를 쓰지 못하게 될 경우 데이터 손실이 발생할 수 있다
  - 2: 로그 버퍼에 로그를 쓰는 시점은 각 트랜잭션이 커밋된 후다. 버퍼에 쓰인 로그가 플러시 되는 주기는 0과 같이 1초다.
  - 어떤 모드를 선택하는가에 따라 안전한 트랜잭션 처리 vs 성능 간의 트레이드 오프가 있다
- **innodb_flush_method**: 데이터 플러쉬 방식
- **innodb_io_capacity**: 백그라운드에서 가능한 IOPS(I/O operations per second)의 수
  - 현재 사용하고 있는 디스크의 IOPS 와 유사한 값으로 설정
- **innodb_flush_log_at_timeout**: 메모리 상의 로그 버퍼를 디스크에 있는 로그 파일로 플러시하는 주기



## MySQL 서버

# 참고

- [happist, MySql 최적화로 빨라질 사이트 DB 튜닝 방법](https://happist.com/577204/db-%ED%8A%9C%EB%8B%9D%EC%9C%BC%EB%A1%9C-mysql-%EC%B5%9C%EC%A0%81%ED%99%94){:target="_blank"}
- [OGG, MySQL Tuning point](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=ksf1990&logNo=221569426999){:target="_blank"}
- [islove8587, [MySQL]시스템 관련 튜닝](https://m.blog.naver.com/islove8587/221977641268)
- [MySQL Performance Tuning pdf](https://rockplace.co.kr/edm/201412/download/Session%203.%20MySQL%20Performance%20and%20Tuning_full_notes.pdf){:target="_blank"}