---
layout: post
title:  'MySQL 트랜잭션과 잠금'
description: 
date:   2022-04-12 15:01:35 +0300
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

# 트랜잭션
DBMS에서 트랜잭션이란 **하나의 논리적 작업 단위**를 의미하며, **여러 작업(DB의 읽기, 쓰기)을 한 단계로 표현**하는 방법입니다.  

## ACID  

이러한 트랜잭션을 정의하기 위해서는 다음의 4가지 속성이 보장되어야 합니다.  

**원자성(Atomicity)**  
- 트랜잭션은 더 작은 단계로 나눌 수 없습니다. 트랜잭션과 관련된 작업은 모두 실행되거나 모두 실패해야 합니다.  
- All or Nothing
- ex) A에서 B로 계좌이체를 할 때, A가 출금이 되면 B도 반드시 입금이 되어야 한다.  

**일관성(Consistency)**  
- 트랜잭션이 일어나더라도 데이터베이스의 제약이나 규칙은 그대로 지켜져야 합니다. 
- 사용자가 제어할 수 있는 유일한 속성입니다.  
- ex) 고객 정보 DB에서 이름을 반드시 입력하도록 제약을 두었다면 트랜잭션 또한 이러한 제약을 가져야 한다.  
  
**격리성(Isolation)**  
- 하나의 트랜잭션은 다른 트랜잭션으로부터 간섭없이 독립적으로 수행되어야 합니다.    
- 동시에 여러 개의 트랜잭션들이 수행될 때, 각 트랜잭션은 연속으로 실행된 것과 동일한 결과를 나타내야 합니다.  
- ex) A가 만원이 있는 계좌에서 B에게 3천원을 송금하던 도중 자신의 잔액을 확인할 때는 여전히 만원이 있어야 한다.
- 많은 데이터베이스는 성능상의 이유로 정의에 비해 약한 격리 수준을 사용합니다. (동시성 제어의 격리 수준 참고)  

**지속성(Durability)**  
- 커밋된 데이터는 장애가 발생 하더라도 데이터베이스에 저장되어야 한다.  
- ex) A에서 B로 송금이 완료되어 커밋을 했다면 시스템 중단, 정전으로 장애가 발생해도 DB에 데이터가 그대로 유지되어야 한다  

## 트랜잭션 관련 실행 명령어  

- **Commit**: A commit ends the current transaction and makes permanent all changes performed in the transaction. The transaction is a sequence of SQL statements that the database treats as a single unit. A commit also erases all savepoints in the transaction and releases transaction locks. After your data is committed, it is visible to other users of the system.  

Commit means save the cache changes to the database  

A SQL statement that ends a transaction, making permanent any changes made by the transaction. It is the opposite of rollback, which undoes any changes made in the transaction.  

InnoDB uses an optimistic mechanism for commits, so that changes can be written to the data files before the commit actually occurs. This technique makes the commit itself faster, with the tradeoff that more work is required in case of a rollback.  

By default, MySQL uses the autocommit setting, which automatically issues a commit following each SQL statement.  

- **Save**: A save writes your changes to the database, however at this point these changes are only visible to you within your transaction scope. The database has also generated undo information which contains the old values of your transaction which can be used to rollback your modifications.

- **Flush**: flush() will synchronize your database with the current state of object/objects held in the memory but it does not commit the transaction. So, if you get any exception after flush() is called, then the transaction will be rolled back.  

To write changes to the database files, that had been buffered in a memory area or a temporary disk storage area. The InnoDB storage structures that are periodically flushed include the redo log, the undo log, and the buffer pool.

- **Rollback**: 

# 페이지 캐시  

대부분의 데이터베이스는 상대적으로 속도가 느린 영구 저장소(디스크)에 접근하는 회수를 줄이기 위해 페이지(읽고 쓰는 가장 작은 단위)를 메모리에 캐시합니다. 이를 페이지 캐시(page cache)라고 하며 이 때의 메모리 영역을 버퍼 풀(buffer pool)이라고 합니다. 메모리에 있는 페이지에 변경사항이 생겼을 때 아직 디스크로 플러시(flush)되지 않은 페이지를 더티(dirty) 페이지라고 합니다.  

정리하면 페이지 캐시의 주요 기능은 다음과 같습니다.  

- 페이지를 메모리에 **캐시함으로써 빠른 읽기**를 지원
- 쓰기 요청이 발생할때마다 디스크로 플러시하지 않고 **버퍼링 후 플러시** 할 수 있다

## 캐싱
스토리지 엔진이 특정 페이지를 요청하면 우선 캐시된 버전이 있는지 확인합니다. 페이지가 있다면 반환하고 없다면 페이지 번호를 물리적 주소로 변환해 해당 페이지를 메모리로 복사하고 반환합니다.  

이때 해당 페이지가 저장된 버퍼는 참조상태라고 표현합니다. 작업이 끝나면 스토리지 엔진은 참조 해제해야 합니다.  


## 캐시 만료
일반적으로 버퍼 풀은 데이터셋보다 크기가 작기 때문에 새로운 페이지를 추가하기 위해 기존 페이지를 만료시키는 작업도 필요하게 됩니다. 페이지가 동기화됐고 고정 또는 참조 상태가 아니라면 바로 제거할 수 있습니다. 페이지를 제거할 때에는 페이지와 관련된 로그도 WAL에서 삭제합니다.  

## 페이지 동기화
위에서 버퍼 풀의 메모리 용량을 관리하기 위해서는 캐시가 만료된 페이지는 제거해야 한다고 했습니다. 그리고 이때 페이지를 제거하기 위해서는 우선 페이지가 동기화되어야 한다고 했습니다. **페이지 동기화는 더티페이지를 디스크에 반영(flush)하는 것**입니다.  

이렇게 플러시하는 것은 언제 얼마나 자주하는 것이 좋을까요? 변경 사항이 생길 때마다 플러시하게 되면 데이터 손실 가능성을 줄일 수 있겠지만 결국 잦은 디스크 접근을 유발하기 때문에 트레이드 오프가 있습니다. 그래서 데이터베이스에서는 이러한 **플러시를 주기적으로 하게 되며 이 시점을 체크포인트(checkpoint)**라고 합니다. 



체크포인트 시점에 플러시가 일어나는데 이 때 플러시는 디스크에 있는 데이터베이스에 데이터가 저장되는 것을 의미하지는 않습니다. **플러시는 메모리에 있는 페이지에 요청된 작업 명령들을 디스크의 WAL(Write Ahead Log)에 남겨두고 페이지와 싱크를 맞추는 것**입니다. ~~(보통 커밋이 일어나면 플러시도 그 과정에 포함되어 플러시를 디스크에 저장하는 것으로 정의하기도 함. 애매하네)~~

정리하면  

- 캐시가 만료된 페이지를 삭제하려면 먼저 페이지를 동기화 해야 한다. 
- 동기화된 시점을 체크포인트라고 한다.
- 동기화는 플러시하는 것이며 플러시는 페이지의 변경시 요청된 작업 명령을 디스크의 WAL에 기록하는 것이다.


## 페이지 고정
가까운 시간 내에 요청될 확률이 높은 페이지는 캐시에 가둬 두는 것이 좋습니다. 이를 페이지 고정(pinning)이라고 합니다. 예를 들어 이진 트리 탐색에서 트리의 상위 노드는 접근될 확률이 높기 때문에 이러한 상위 노드는 고정해두면 성능 향상에 도움이 됩니다.  

## 페이지 교체 알고리즘
저장 공간이 부족한 캐시에 새로운 페이지를 추가하려면 일부 페이지를 만료시켜야 한다고 했습니다. 하지만 빈번하게 요청될 수 있는 페이지를 만료시키면 같은 페이지를 여러 차례 페이징하는 상황이 발생할 수 있습니다. 페이지 교체 알고리즘은 다시 요청될 확률이 가장 낮은 페이지를 만료시키고 해당 위치에 새로운 페이지를 페이징합니다.  

하지만 페이지의 요청 순서는 일반적으로 특정 패턴이 없기 때문에 어떤 페이지가 다시 요청될지 정확하게 예측하는 것은 불가능 합니다. 그래서 보통은 그 기준을 **최근에 요청**되었는지 여부, **요청된 빈도수** 등으로 합니다. 관련 알고리즘에는 FIFO(First In First Out), LRU(Least Recently Used), LFU(Least Frequently Used), CLOCK-sweep 알고리즘이 있습니다.  


# 복구
데이터베이스 시스템은 각자 다른 안정성과 신뢰성 문제를 내재한 하드웨어와 소프트웨어 계층으로 구성됩니다. 따라서 여러 지점에서 장애가 발생할 수 있고, 데이터베이스 개발자는 이러한 장애 시나리오를 고려해 데이터를 저장해야 합니다.  

## WAL
선행 기록 로그(WAL)는 장애 및 트랜잭션 복구를 위해 디스크에 저장하는 추가 자료 구조입니다. WAL은 페이지에 캐시된 데이터가 디스크로 커밋(~~책에서는 플러시라고 표기~~)될 때 까지 관련 작업 이력의 유일한 디스크 기반 복사본입니다.  

WAL에 있는 각각의 로그에는 단조 증가하는 고유 로그 시퀀스 번호(LSN: Log Sequence Number)가 있습니다.  

WAL의 주요 기능은 다음과 같습니다.  

- 장애 발생 시 WAL을 기반으로 마지막 메모리 상태를 재구성한다. (undo)
- WAL의 로그를 재수행해서 트랜잭션을 커밋한다. (redo)


## 언두(Undo) 로그와 리두(Redo) 로그
UNDO는 왜 필요할까?  

오퍼레이션 수행 중에 수정된 페이지들이 버퍼 관리자의 버퍼 교체 알고리즘에 따라서 디스크에 출력될 수 있다. 버퍼 교체는 전적으로 버퍼의 상태에 따라서 결정되며, 일관성 관점에서 봤을 때는 임의의 방식으로 일어나게 된다. 즉 아직 완료되지 않은 트랜잭션이 수정한 페이지들도 디스크에 출력될 수 있으므로, 만약 해당 트랜잭션이 어떤 이유든 정상적으로 종료될 수 없게 되면 트랜잭션이 변경한 페이지들은 원상 복구되어야 한다. 이러한 복구를 UNDO라고 한다. 만약 버퍼 관리자가 트랜잭션 종료 전에는 어떤 경우에도 수정된 페이지들을 디스크에 쓰지 않는다면, UNDO 오퍼레이션은 메모리 버퍼에 대해서만 이루어지면 되는 식으로 매우 간단해질 수 있다. 이 부분은 매력적이지만 이 정책은 매우 큰 크기의 메모리 버퍼가 필요하다는 문제점을 가지고 있다. 수정된 페이지를 디스크에 쓰는 시점을 기준으로 다음과 같은 두 개의 정책으로 나누어 볼 수 있다.  

- STEAL: 수정된 페이지를 언제든지 디스크에 쓸 수 있는 정책
- No-STEAL: 수정된 페이지들을 최소한 트랜잭션 종료 시점(EOT, End of Transaction)까지는 버퍼에 유지하는 정책
STEAL 정책은 수정된 페이지가 어떠한 시점에도 디스크에 써질 수 있기 때문에 필연적으로 UNDO 로깅과 복구를 수반하는데, 거의 모든 DBMS가 채택하는 버퍼 관리 정책이다.  

REDO는 왜 필요할까?  

이제는 UNDO 복구의 반대 개념인 REDO 복구에 대해서 알아볼 것인데, 앞서 설명한 바와 같이 커밋한 트랜잭션의 수정은 어떤 경우에도 유지(durability)되어야 한다. 이미 커밋한 트랜잭션의 수정을 재반영하는 복구 작업을 REDO 복구라고 하는데, REDO 복구 역시 UNDO 복구와 마찬가지로 버퍼 관리 정책에 영향을 받는다. 트랜잭션이 종료되는 시점에 해당 트랜잭션이 수정한 페이지들을 디스크에도 쓸 것인가 여부로 두 가지 정책이 구분된다.  

- FORCE: 수정했던 모든 페이지를 트랜잭션 커밋 시점에 디스크에 반영하는 정책
- No-FORCE: 수정했던 페이지를 트랜잭션 커밋 시점에 디스크에 반영하지 않는 정책  

여기서 주의 깊게 봐야 할 부분은 No-FORCE 정책이 수정했던 페이지(데이터)를 디스크에 반영하지 않는다는 점이지 커밋 시점에 어떠한 것도 쓰지 않는다는 것은 아니다. 어떤 일들을 했었다고 하는 로그는 기록하게 되는데 이 부분은 아래에서 자세히 설명한다.
FORCE 정책을 따르면 트랜잭션이 커밋되면 수정되었던 페이지들이 이미 디스크 상의 데이터베이스에 반영되었으므로 REDO 복구가 필요 없게 된다. 반면에 No-FORCE 정책을 따른다면 커밋한 트랜잭션의 내용이 디스크 상의 데이터베이스 상에 반영되어 있지 않을 수 있기 때문에 반드시 REDO 복구가 필요하게 된다. 사실 FORCE 정책을 따르더라도 데이터베이스 백업으로부터의 복구, 즉 미디어(media) 복구 시에는 REDO 복구가 요구된다. 거의 모든 DBMS가 채택하는 정책은 No-FORCE 정책이다.  

정리해보면 DBMS는 버퍼 관리 정책으로 STEAL과 No-FORCE 정책을 채택하고 있어, 이로 인해서 UNDO 복구와 REDO 복구가 모두 필요하게 된다.  

## 스틸(Steal)과 포스(Force) 정책
DBMS는 스틸/노스틸 정책과 포스/노포스 정책을 기반으로 메모리에 캐시된 변경 사항을 **디스크로 플러시하는 시점을 결정**합니다. 이러한 정책들은 **복구 알고리즘 선택에 큰 영향**을 미칩니다.  

**스틸(Steal)**  
트랜잭션이 완료되지 않은 상태에서 데이터를 디스크에 기록할 것인가?  

- **Steal**: 기록한다(Undo 필요)
- **No-Steal**: 기록하지 않는다

버퍼 관리자가 트랜잭션 종료 전에는 어떤 경우에도 수정된 페이지들을 디스크에 쓰지 않는다면, UNDO 오퍼레이션은 메모리 버퍼에 대해서만 이루어지면 되는 식으로 매우 간단해질 수 있다. 이 부분은 매력적이지만 이 정책은 매우 큰 크기의 메모리 버퍼가 필요하다는 문제점을 가지고 있다. 수정된 페이지를 디스크에 쓰는 시점을 기준으로 다음과 같은 두 개의 정책으로 나누어 볼 수 있다.
- STEAL: 수정된 페이지를 언제든지 디스크에 쓸 수 있는 정책
- No-STEAL: 수정된 페이지들을 최소한 트랜잭션 종료 시점(EOT, End of Transaction)까지는 버퍼에 유지하는 정책 

STEAL 정책은 수정된 페이지가 어떠한 시점에도 디스크에 써질 수 있기 때문에 필연적으로 UNDO 로깅과 복구를 수반하는데, 거의 모든 DBMS가 채택하는 버퍼 관리 정책이다.

**포스(Force)**  
트랜잭션이 완료된 후 바로 데이터를 디스크에 기록할 것인가?

- **Force**: 바로 기록한다
- **No-Force**: 바로 기록하지 않는다(Redo 필요)

성능상의 이유로 때로는 트랜잭션이 완료되기도 전에 디스크에 기록하기도 하고 완료되고 나서도 기록하지 않기도 합니다.  

스틸과 포스 정책은 트랜잭션 언두와 리두 작업과 관련되기 때문에 매우 중요합니다.  

# 동시성 제어

## 잠금

## 격리 수준

# 참고

- [Real MySQL 8.0 (1권) 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158392703&orderClick=LAG&Kc=){:target="_blank"}
- [데이터베이스 인터널스 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791161754963&orderClick=LEa&Kc=){:target="_blank"}
- [Naver D2: DBMS는 어떻게 트랜잭션을 관리할까?](https://d2.naver.com/helloworld/407507){:target="_blank"}
- [온달의 해피클라우드: ACID 이해하기](https://happycloud-lee.tistory.com/156){:target="_blank"}
- [노력 이기는 재능 없고 노력 외면하는 결과도 없다: [MySQL Internals] FLUSH](https://m.blog.naver.com/sory1008/220708909773#){:target="_blank"}
- [MySQL 공식문서: MySQL Glossary](https://dev.mysql.com/doc/refman/5.6/en/glossary.html#glos_flush){:target="_blank"}
- [stackoverflow: SQLAlchemy: What's the difference between flush() and commit()?](https://stackoverflow.com/questions/4201455/sqlalchemy-whats-the-difference-between-flush-and-commit){:target="_blank"}