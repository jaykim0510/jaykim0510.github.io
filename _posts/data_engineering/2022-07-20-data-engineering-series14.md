---
layout: post
title:  'Data Engineering Series [Part12]: Database Internals 트랜잭션 처리와 복구'
description: 
date:   2022-07-20 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 트랜잭션 처리와 복구

트랜잭션을 수행하기 위해서는 데이터를 디스크에 저장하고 유지하는 자료구조 외에도 여러 컴포넌트가 필요하다.  

트랜잭션 매니저는 트랜잭션의 세부 단계를 제어, 관리 및 스케줄링하는 컴포넌트다.  

잠금 매니저는 리소스에 대한 동시 접근을 제어하고 데이터 무결성을 보장한다. 잠금이 해제되거나 트랜잭션이 완료되면 잠금매니저는 대기 중인 트랜잭션에 이 사실을 알린다  

페이지 캐시는 디스크와 스토리지 엔진 사이에서 중개자 역할을 한다. 메인 메모리의 변경 사항을 저장하고 영구 저장소와 동기화되지 않은 페이지를 캐시한다. 모든 데이터베이스 상태에 대한 변경 사항은 우선 페이지 캐시에 저장된다  

로그 매니저는 영구 저장소와 동기화되지 않은 페이지 캐시의 내용이 손실되지 않도록 로그(작업 히스토리)를 저장한다.  


## 버퍼 관리

대부분의 데이터베이스는 상대적으로 속도가 느린 디스크와 빠른 메인 메모리로 구성된 계층 구조이다. 따라서 영구 저장소 접근 횟수를 줄이기 위해 페이지를 메모리에 캐시하고 요청한 페이지가 캐시되어 있다면 디스크가 아닌 캐시에서 반환한다.  

다른 프로세스가 캐시된 페이지와 일치하는 디스크에 저장된 데이터를 변경하지 않았다면 메모리에 캐시된 페이지를 재사용할 수 있다. 이와 같은 방식을 페이지 캐시 또는 버퍼풀이라고 부른다. 이러한 방식은 요청된 페이지가 메모리에 없을 경우에만 물리적 저장소에 접근한다. 페이지 캐시는 디스크에서 읽은 페이지를 메모리에 캐시한다. 시스템 장애가 발생하거나 시스템이 비정상적으로 종료되면 캐시된 데이터는 사라진다.  

디스크에서 메모리로 복사하는 작업을 페이징이라고 한다. 그리고 디스크로 플러시되지 않은 변경된 페이지는 더티페이지라고 한다. 일반적으로 페이지 캐시의 메모리 영역은 전체 데이터셋보다 작기 때문에 결국 새로운 페이지를 추가하기 위해 기존 페이지를 만료시켜야 한다.  

페이지 캐시의 주요 기능은 다음과 같다.  

- 페이지 내용을 메모리에 캐시한다
- 디스크에 저장된 페이지에 대한 변경 사항을 버퍼링하고 캐시된 페이지에 반영한다
- 캐시되지 않은 데이터가 요청될 경우 추가할 공간이 있으면 페이징하고 캐시된 버전을 반환한다
- 추가할 공간이 없다면 일부 페이지를 만료시키고 디스크로 플러시한다
- 캐시된 데이터가 요청된 경우에는 그냥 메모리에서 반환하면 된다

### 캐싱

버퍼에 대한 변경 사항은 디스크에 쓰기 전까지 메모리에 남겨둔다. 어떤 프로세스도 원본 파일을 수정할 수 없기 때문에 동기화는 메모리에서 디스크로 플러시하는 단방향 작업이다. 데이터베이스는 페이지 캐시를 사용해 메모리를 관리하고 디스크 접근을 제어한다.  

스토리지 엔진이 특정 페이지를 요청하면 우선 캐시된 버전이 있는지 확인하고 있을 경우 반환한다. 없다면 논리적 페이지 주소 또는 페이지 번호를 물리적 주소로 변환해 해당 페이지를 메모리로 복사하고 반환한다. 이 떄 해당 페이지가 저장된 버퍼는 참조 상태라고 한다.  

페이지가 변경된 경우에는 페이지에 더티 플래그를 설정한다. 더티 플르개는 해당 페이지가 디스크와 동기화되지 않았고, 지속성을 위해 디스크로 플러시돼야 한다는 것을 의미한다.  

### 캐시 만료  

캐시된 데이터가 많을수록 더 많은 읽기 요청을 디스크에 접근하지 않고 처리할 수 있다. 또한 같은 페이지에 대한 변경사항을 더 많이 같이 버퍼할 수 있다. 하지만 페이지 캐시의 크기는 한정적이기 때문에, **새로운 페이지를 저장하기 위해 오래된 페이지는 제거해야 한다.** 페이지가 동기화됐고 고정 또는 참조 상태가 아니라면 바로 제거 될 수 있다. 더티 페이지는 제거되기 전에 먼저 플러시해야 한다. 참조 상태의 페이지는 사용이 끝나기 전까지는 제거될 수 없다.  

페이지를 제거할 때마다 디스크로 플러시한다면 성능을 저하시킬 수 있다. 따라서 별도의 백그라운드 프로세스가 제거될 가능성이 높은 **더티 페이지를 주기적으로 디스크로 플러시**한다. 또한 데이터베이스에 갑작스런 장애가 발생한 경우 플러시되지 않은 데이터는 사라질 수 있다. 이러한 데이터 손실을 방지하기 위해 체크포인트 프로세스가 플러시 시점을 제어한다. 체크포인트 프로세스는 선행 기록 로그(Write Ahead Log)와 페이지 캐시의 싱크가 맞도록 조정한다. (이 말은 선행 기록 로그가 디스크에 있는 데이터라는 말인가? 동기화는 메모리에서 디스크로 플러시하는 단방향 작업이라 했으니까 선행 기록 로그보다 페이지의 데이터가 더 최신? -> 그렇지. 캐시된 페이지에 제일 먼저 변화 생기고 -> 로그 버퍼에 리두 로그(WAL) 버퍼링 되고 버퍼된 리두 로그 디스크에 플러시 되고 -> 캐시된 페이지 플러시) 오직 플러시가 완료된 캐시된 페이지와 관련된 로그만 WAL에서 삭제될 수 있다. 이 과정이 완료될 때 끼지 더티 페이지는 제거될 수 없다.  

### 페이지 고정

B-트리의 상위 레벨 노드는 대부분의 읽기 작업에서 접근한다. 이러한 트리의 일부를 캐시하면 상당한 도움이 될 수 있다. 따라서 우선 상위 레벨 노드를 메모리에 고정시키고 나머지 노드는 요청 시 페이징해도 된다.  

### 페이지 교체  

저장 공간이 부족한 캐시에 새로운 페이지를 추가하려면 일부 페이지를 만료시켜야 한다. 캐시된 페이지는 만료 정책(페이지 교체 알고리즘)에 따라 캐시에서 제거된다. 만료 정책은 다시 요청될 확률이 낮은 페이지를 만료시키고 해당 위치에 새로운 페이지를 페이징한다. 이렇게 페이지를 만료시키고 새로운 페이지로 교체하는 알고리즘은 대표적으로 FIFO, LRU 등이 있다.  

FIFO는 First In First Out의 약자로 가장 먼저 큐에 들어온 페이지 ID가 가리키는 페이지를 만료시킨다. 이 방식은 간단하지만 페이지 접근 순서를 전혀 고려하지 않기 때문에 실용적이지 않다.  

LRU는 FIFO를 확장한 방식이다. FIFO와 마찬가지로 요청 순서대로 큐에 추가되다가 재요청 되면 다시 큐의 끝에 추가한다.  


## 복구

데이터베이스 개발자는 여러 장애 시나리오를 고려하고 약속된 데이터가 실제로 저장되게 해야 한다. 선행 기록 로그(WAL 또는 커밋 로그)는 장애 및 트랜잭션 복구를 위해 디스크에 저장하는 추가 전용(Append-only) 보조 자료 구조다. 페이지 캐시는 페이지에 대한 변경 사항을 메모리에 버퍼링한다. **캐시된 내용이 디스크로 플러시될 때 까지 관련 작업 이력의 유일한 디스크 복사본은 WAL**이다. MySQL, PostreSQL과 같은 많은 데이터베이스가 추가 전용 WAL을 사용한다.  

WAL의 주요 기능은 다음과 같다.  

- 캐시된 페이지가 디스크와 동기화 될 때 까지 작업 이력을 디스크에 저장한다. 데이터베이스의 상태를 변경하는 작업을 실제 페이지에 적용하기 전에 먼저 디스크에 로깅한다
- 장애 발생 시 로그를 기반으로 마지막 메모리 상태를 재구성한다
- WAL은 데이터가 디스크에 저장되도록 보장하고, 장애 발생시 데이터 상태를 되돌리기 위해 필요한 로그를 저장한다


WAL은 추가 전용 자료구조이며, 작성된 데이터는 불변하기 때문에 모든 쓰기 작업은 순차적이다.  

WAL은 여러 로그 레코드로 구성된다. 모든 레코드에는 단조 증가하는 고유 로그 시퀀스 번호(LSN, Log Sequence Number)가 있다. 로그 레코드의 크기는 디스크 블록의 크기보다 작을 수 있기 때문에, 로그 버퍼에 임시 저장하고 포스 작업시 디스크로 플러시한다. 포스 작업은 로그 버퍼가 가득 차면 수행되거나 트랜잭션 매니저 또는 페이지 캐시가 직접 요청할 수도 있다. 모든 로그 레코드는 LSN과 동일한 순서로 플러시돼야 한다.  

WAL는 작업 로그 레코드 외에도 트랜잭션 완료 여부를 나타내는 레코드를 저장한다. 트랜잭션의 커밋 레코드의 LSN까지 플러시되기 전까지는 해당 트랜잭션은 커밋된 것으로 간주 할 수 없다. 일부 시스템은 트랜잭션 롤백 또는 복구 중 장애가 발생해도 시스템이 계속해서 정상 작동할 수 있도록 보상 로그 레코드를 로그에 저장하고 언두 작업 시 사용한다.  

일반적으로 WAL은 체크포인트에 도달하면 이전 로그를 정리하는 인터페이스를 통해 기본 저장소와 동기화한다. 로깅은 데이터베이스의 정확성 측면에서 매우 중요한 작업이다. 로그 정리 작업과 데이터를 기본 스토리지에 저장하는 작업이 조금이라도 어긋나면 데이터는 손실될 수 있다.  

모든 데이터는 한 번에 디스크로 플러시하면 체크포인트 작업이 완료될 때 까지 다른 작업을 모두 중지해야 하기 떄문에 비효율적이다. 이 문제를 해결하기 위해 대부분의 데이터베이스 시스템은 퍼지(fuzzy) 체크포인트를 사용한다.  

마지막으로 성공한 체크포인트 작업에 대한 정보는 로그 헤더에 저장된 last_checkpoint 포인터에 저장한다. 퍼지 체크포인트는 begin_checkpoint라는 특별한 로그 레코드로 시작해 더티 페이지에 대한 정보와 트랜잭션 테이블의 내용을 저장한 end_checkpoint라는 로그 레코드로 끝난다. 이 로그 레코드에 명시된 모든 페이지가 플러시될 때 까지 해당 체크포인트는 미완료 상태다. 페이지는 비동기적으로 플러시되며, 이 작업이 끝나면 last_checkpoint 레코드를 begin_checkpoint의 LSN으로 업데이트 한다. 장애가 발생할 경우, 복구 프로세스는 해당 LSN에서부터 시작한다.  

### 리두로그 언두로그

데이터베이스 시스템은 데이터의 지속성과 트랜잭션의 원자성을 보장하는 쓰기 시 복사(Copy-on-write) 방식의 섀도 페이징 기법을 사용한다. 새로운 데이터를 우선 내부 섀도 페이지에 쓴 다음, 이전 버전의 페이지를 가리키는 포인터를 섀도 페이지를 가리키도록 변경해 업데이트된 내용을 반영한다.  

모든 상태 변화는 이전 상태와 이후 상태의 조합으로 나타낼 수 있다. 또는 그에 대응되는 리두 작업과 언두 작업으로 나타낼 수 있다. 이전 상태에 리두 작업을 수행하면 이후 상태가 된다. 반대로 이후 상태에 언두 작업을 수행하면 이전 상태가 된다.  


장애 발생 후 데이터베이스 시스템을 재시작하면 복구는 다음 3단계로 진행된다  

1. 분석 단계: 페이지 캐시에 저장된 더티 페이지와 장애 발생 당시 수행 중이던 트랜잭션을 파악한다. 더티 페이지에 대한 정보를 기반으로 리두 단계의 시작 지점을 결정한다. 트랜잭션 목록은 언두 단계에서 미완료된 트랜잭션을 롤백하는 데 사용한다.  

2. 리두 단계: 장애가 발생하기 전까지의 작업을 재수행하고 데이터베이스를 이전 상태로 복원한다. 불완전한 트랜잭션, 커밋됐지만 디스크로 플러시되지 않은 트랜잭션을 롤백하기 위한 준비 단계다

3. 언두 단계: 불완전한 트랜잭션을 롤백하고 데이터베이스를 마지막 일관된 상태로 복원한다. 모든 작업은 실제 수행 순어의 역순으로 롤백된다. 복구 중에도 장애가 발생할 수 있기 때문에 언두 작업도 로그에 기록해야 된다