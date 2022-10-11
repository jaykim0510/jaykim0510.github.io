---
layout: post
title:  'Tech Interview Series [Part5]: Database'
description: 
date:   2022-09-01 15:01:35 +0300
image:  '/images/tech_interview_logo.png'
logo_image:  '/images/tech_interview_logo.png'
categories:   CS
tags: tech_interview
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 트랜잭션
## 트랜잭션의 4가지 특성: ACID

- 트랜잭션: 여러 데이터의 변경 사항을 하나의 논리적인 작업 단위로 묶은 것
- 트랜잭션의 4가지 특성: ACID
- Atomicity
  - 트랜잭션으로 묶인 데이터의 변경 사항은 모두 반영되거나 하나도 반영되지 않아야 한다 (All or Nothing)
  - 만약 Commit 하기로 했다면 모든 변경 사항에 대한 리두로그가 플러시 되거나, 더티 페이지가 플러시 되어야 한다
  - 만약 Rollback 하기로 했다면 언두 로그 파일 데이터를 이용해 다시 DB를 롤백해야 한다
- Isolation
  - 하나의 트랜잭션 처리가 다른 트랜잭션에 영향을 주거나 받아서는 안된다
  - 실무에서는 격리 수준에 따라 정도가 달라진다
- Durability
  - 커밋된 데이터는 장애가 발생하더라도 DB에 반영되어야 한다
  - InnoDB 버퍼 풀에 데이터를 커밋했으면 다른 트랜잭션에서는 커밋된 데이터를 읽어갈 것
  - 디스크에 플러시 되기 전에 장애가 나더라도 리두 로그를 미리 플러시 해둠으로써 복구 가능하도록

## MySQL 스토리지 엔진

- InnoDB Buffer Pool
  - 데이터의 변경사항을 메모리에 캐시하는 공간
  - 데이터를 디스크에 플러시하기 전에 버퍼하는 역할
- Change Buffer
  - 세컨더리 인덱스 페이지의 변경사항을 버퍼하는 공간
  - 나중에 InnoDB 버퍼 풀에 인덱스 페이지 생기면 병합
  - 쓰기 작업 많은 환경에 도움
- Log Buffer
  - 데이터 변경사항으로 발생한 로그를 버퍼해 두는 공간
  - 트랜잭션 처리 vs 성능 간의 트레이드 오프를 조절
  - (`innodb_log_buffer_size`, `innodb_flush_log_at_trx_commit`)
- Redo Log
  - 데이터의 변경사항을 기록하는 디스크 기반 자료구조
  - 커밋된 후 장애가 발생하더라도 Redo Log를 바탕으로 복구 가능
- Undo Log
  - 데이터의 변경 이전의 데이터를 기록해두는 디스크 기반 자료구조
  - 롤백될 경우 Undo Log를 바탕으로 데이터를 되돌린다
  - 트랜잭션간의 Isolation을 위해 Undo Log에 기록된 변경 이전의 데이터를 보여준다

```
Durability는 InnoDB Buffer Pool, Log Buffer와 같은 버퍼가 어떤 주기로 플러시 되느냐에 따라 달라진다
```

## 스틸과 포스정책

- Log Buffer가 아닌 **InnoDB Buffer Pool 의 플러시 주기**는 어떻게 결정될까? => 스틸과 포스 정책
- Log Buffer가 다 차기 전에 InnoDB Buffer Pool이 먼저 다 찰 수도 있다
- (Log Buffer는 변경 사항에 대한 로깅만 하면 되지만, InnoDB Buffer Pool은 페이지 단위로 메모리에 올린다)
- (그래서 하나의 트랜잭션이 변경 사항은 적은데 여러 페이지에서 발생하는 문제로 페이지를 많이 가져와야 할 수도 있다)
- 대부분의 RDBMS는 **스틸과 노-포스 정책**을 취한다
- 스틸 정책
  - 트랜잭션이 완료되기 전이라도 언제든 더티 페이지를 플러시 할 수 있다 (-> 롤백을 대비해 반드시 Undo Log 있어야함)
- 노-포스 정책
  - 트랜잭션이 커밋된다고 해도 더티 페이지를 무조건 플러시할 필요는 없다 (무조건 플러시하도록 하면 성능이 떨어진다)
- **트랜잭션 완료 전에도 필요하면 InnoDB Buffer Pool에 있는 더티 페이지를 플러시할 수 있지만,**
- **그렇다고 트랜잭션이 완료됐다고 반드시 플러시할 필요는 없다**

## 잠금과 격리수준

- 잠금과 격리수준은 트랜잭션의 **Isolation**과 깊은 관련이 있다
- **잠금은 레코드 쓰기와 관련**된 Isolation, **격리수준은 레코드 읽기와 관련**된 Isolation이다
- 잠금
  - 하나의 레코드를 여러 커넥션에서 동시에 변경하지 못하게 한다
  - 스토리지 엔진 종류마다 테이블 잠금, 레코드 잠금, 인덱스 잠금 등이 있다
  - **InnoDB는 인덱스 잠금을 사용**한다
  - 다른 커넥션에서 같은 레코드여도 해당 인덱스를 쓸 일이 없으면 접근 가능 => 다른 잠금보다 훨씬 성능이 좋다
  - 만약 인덱스가 없으면 모든 레코드를 스캔해야 하므로 전체 레코드 잠금이 걸리게 된다 => 인덱스 설계가 중요하다ㅓ
- 격리수준
  - 서로 다른 트랜잭션간의 읽기를 어떻게 제공할지에 관한 설정이다
  -  오라클 DB는 READ COMMITTED, MySQL은 REATABLE READ를 주로 사용

![](/images/mvcc.png)

# 인덱스

- 인덱스는 DB의 쿼리 성능과 관련해서 빼놓을 수 없는 부분
- 인덱스는 탐색해야 하는 레코드의 건수를 줄여준다
- 인덱스의 자료구조적 특성은 **B-Tree 형태**로 데이터가 **정렬**되어 있다는 점이다
- -> 장점은 빠른 읽기, 단점은 느린 쓰기이다
- (해시 인덱스는 컬럼에 대한 해시값을 인덱스로 활용하는데 주로 메모리 기반 DB에서 사용한다)

## 인덱스 적용 기준

- WHERE, JOIN, ORDER BY절에 많이 사용되는 컬럼
- 카디널리티가 높은 컬럼
- 테이블 규모가 크지만 읽어오는 데이터는 많지 않은 쿼리
- MML 입장에서 인덱스는 성능은 떨어트리지만, 동시성 제어에서 잠금 측면에선 도움이 된다

## 인덱스의 데이터 탐색 방식

- 인덱스 레인지 스캔
- 인덱스 풀 스캔
- 인덱스 루스 스캔

# 성능 개선

- 성능은 크게 **쿼리 최적화**, **서버 설정**을 통해 개선할 수 있다

## 쿼리 최적화

- 쿼리 최적화의 핵심은 옵티마이저가 인덱스를 쓰고 싶을 때, 가장 최적의 인덱스를 사용하도록 설계하는 것이다
- 쿼리 실행을 보고 싶을 때는 `EXPLAIN (SELECT ...)`, 인덱스 정보는 `SHOW INDEX ...` 사용한다
- 쿼리 실행은
  - SQL 파서가 SQL을 트리 형태로 파싱
  - 옵티마이저가 통계 정보를 이용해 실행 계획을 수립
  - 스토리지 엔진이 실행 계획대로 레코드를 읽고 쓴다

## 서버 설정

# 데이터베이스 모델링

- 비즈니스 모델링: 비즈니스 룰을 정의한다 (ex. 유저는 하나의 주문에 하나의 리뷰만 달 수 있다)
- 논리적 모델링: 어떤 것을 테이블로 하고, 어떤 것을 컬럼으로 하고 테이블끼리의 관계를 어떻게 정의할지 정의한다
- 정규화: 논리적 모델링을 보수 공사한다
- 물리적 모델링: 테이블명, 컬럼명, 데이터 타입, 제약조건을 정의한다 (Schema, Table, Index 정의)


# 데이터베이스 일문일답

- 데이터베이스를 사용하는 이유
- 데이터베이스 성능
- 복제
- 파티셔닝
- 샤딩
- ORM

## Index

- Index 란 무엇인가
- Index 의 자료구조
- Primary index vs Secondary index
- Composite index
- Index 의 성능과 고려해야할 사항


## 정규화에 대해서

- 정규화란 무엇인가
- 정규화의 종류
- 정규화의 장단점


## Transaction

- 트랜잭션(Transaction)이란 무엇인가?
- 트랜잭션과 Lock
- 트랜잭션의 특성
- 트랜잭션을 사용할 때 주의할 점
- 트랜잭션 격리 수준


## 교착상태

- 교착상태란 무엇인가
- 교착상태의 예(MySQL)
- 교착 상태의 빈도를 낮추는 방법


## SQL

- JOIN
- Sargable
- Optimizer
- Statement vs PreparedStatement
- SQL Injection


## NoSQL

- 정의
- CAP 이론: 일관성, 가용성, 네트워크 분할 허용성
- 저장방식에 따른 분류: Key-value, Document, Column





# 참고
- [JaeYeopHan/Interview_Question_for_Beginner](https://github.com/JaeYeopHan/Interview_Question_for_Beginner){:target="_blank"}
- [WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview){:target="_blank"}
- [gyoogle, Tech Interview 준비](https://gyoogle.dev/blog/guide/%EB%A9%B4%EC%A0%91%20%EC%A4%80%EB%B9%84.html){:target="_blank"}
- [배진오, 신입 개발자 기술면접 준비하기](https://blex.me/@baealex/%EC%B7%A8%EC%A4%80%EC%83%9D%EC%9D%B4-%EC%83%9D%EA%B0%81%ED%95%98%EB%8A%94-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EA%B8%B0%EC%88%A0%EB%A9%B4%EC%A0%91-%EC%A4%80%EB%B9%84){:target="_blank"}
- [[PYTHON] Python 면접 예제 2편](https://dingrr.com/blog/post/python-python-%EB%A9%B4%EC%A0%91-%EC%98%88%EC%A0%9C-2%ED%8E%B8){:target="_blank"}
- [exp_blog, 데이터베이스 직무 면접 질문](https://syujisu.tistory.com/entry/%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%A7%81%EB%AC%B4-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B8?category=871132){:target="_blank"}
- [망나니 개발자 CS 준비](https://mangkyu.tistory.com/88){:target="_blank"}
