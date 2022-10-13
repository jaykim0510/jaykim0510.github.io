---
layout: post
title:  'Data Engineering Series [Part4]: 데이터베이스간 주요 특징 비교'
description: 
date:   2022-04-05 15:01:35 +0300
image:  '/images/database_logo.jpeg'
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

# 데이터베이스 주요 특성

## 데이터베이스 모델

### RDBMS

- 엄격한 기준(데이터 타입, 스키마, 업데이트/삭제 정책 등)의 데이터베이스 설계 요구
- 잘 설계된 RDBMS에 저장된 데이터는 높은 품질의 데이터 제공
- 데이터 분석, 머신러닝 활용 등 데이터 웨어하우스에서 많이 이용
- ex. MySQL, PostgreSQL, Apache Hive, AWS Redshift

### Document Store

- Schema free한 DBMS와 비슷한 느낌 (NoSQL 중에서 가장 RDBMS와 비슷)
- 데이터가 완전히 Structured 되어 있지 않지만, 최대한 DBMS와 비슷하게 사용하고 싶은 경우
- 데이터 하나는 JSON과 같은 객체
- SQL과 같은 언어로 데이터를 필터링하는 느낌으로 데이터를 읽음
- 쿼리의 성능을 조금 포기하는 대신 범용적인 데이터 수집을 가능하게 함
- ex. MongoDB, Elasticsearch 등

### Wide Column Store

- 데이터를 key-value 형태로 저장하지만, key가 nested하게 확장될 수 있음 -> 저장은 쉽지만, 활용은 비교적 까다로운 편
- 컬럼(key)별로 서버에 분산 저장 가능 -> Scale-Out
- key-value 형태로 데이터를 읽어오기 때문에 쿼리가 빠름
- 컬럼간의 관계는 컬럼 패밀리로 정의
- Wide-column Store의 장점은 확장성, 빠른 쿼리, 데이터 유연성
- ex. Apache Cassandra, Apache HBase
![](/images/wide_column_1.png)


### Key-Value Store

- 해시테이블과 같은 자료구조를 데이터베이스화 한 것
- Key를 통해 value를 가져올 수 있다
- Key는 유니크해야 한다
- Value는 어떤것이든 될 수 있다(숫자, 텍스트, JSON, URI, 이미지 등)
- Value의 일부만 읽는 것은 불가능 (이 점이 wide-column과의 차이)
- Value를 SQL과 같은 언어가 아니라 key값으로 가져옴 -> 굉장히 빠르다
- Wide-column store와 비교해 데이터의 유연성은 낮지만, 쿼리 속도는 더 빠름
- Key-value store + In-memory => Redis => Redis가 캐싱 DB 서버로 많이 사용되는 이유
- ex. Redis, AWS DynamoDB, Apache HBase


## 쿼리 지원

- 쿼리를 지원하지 않는 DB: Redis, Apache HBase 등
- 쿼리를 지원하는 DB: MySQL, PostgreSQL, AWS Redshift, Google Bigquery, Elasticsearch 등

## In-memory 지원

- 인메모리 데이터베이스는 데이터를 메모리에 우선적으로 저장함
- 디스크 기반 데이터베이스에서 안전성을 조금 포기하고, 더 빠른 처리 속도를 얻음
- 디스크 기반 데이터베이스가 속도를 위해 메모리를 함께 사용하듯, 인메모리 기반 데이터베이스도 안전성을 위해 디스크 사용
- 빠른 응답속도를 필요로 하는 게임, 실시간 분석에 많이 사용
- ex. Redis, AWS ElastiCache, Microsoft SQL Server
- (MySQL, MongoDB와 같은 DB도 메모리 캐시를 지원하지만 주요 저장장치는 디스크이기 때문에 In-memory가 아님)

## 전문검색 지원

- Elasticsearch

## Scale-Up, Scale-Out

- RDBMS가 Scale-Out이 가능한지에 관한 답은 CAP 이론을 공부해야함
- 관계형 데이터베이스는 테이블간의 조인, 외래키와 같은 특성 때문에 단일 서버에서 동작하도록 설계됨
- (참고로 Redshift는 Columnar database라서 scale-out이 쉽게 가능)
- (Columnar databases are like NoSQL databases, in the fact that they are designed to scale “out” using distributed clusters of low-cost hardware to increase throughput)
- 오늘날에는 관계형 데이터베이스도 Scale-Out이 가능하도록 많이 진화함
- 하지만 Scale-Out을 위해 관계형 데이터베이스를 구축하면, 성능이 전에 비해 떨어지게 되고, Scale-down은 거의 불가능
- 반면 NoSQL은 대부분 Scale-Out이 가능하도록 설계되었으며, 성능이 크게 다르지 않음
- NoSQL은 Scale-Out을 통해 단일 지점 장애 문제 해결과, 비용 효율적으로 대용량 데이터를 저장할 수 있음


## Row Based vs Columnar

- Row Based DB
  - OLTP에 적합
  - 이 방식은 여러 필드의 값을 고유 식별 키로 구분할 수 있는 레코드 형식에 적합하다
  - 일반적으로 특정 사용자의 필드는 여러 개가 함께 요청되는 경우가 많다
  - 로우형 DBMS는 한 개의 로우씩 접근하는 경우 적합하다
  - 한 블록에 모든 컬럼의 값이 들어가게 된다
  - 특정 사용자의 모든 정보를 읽어올 때는 효율적, 모든 사용자의 특정 필드를 읽어올 때는 비효율적이다
  - record단위로 데이터가 발생할 때 이를 하나의 메모리 블럭에 저장 -> 빠른 쓰기 작업
  - 단점은 특정 컬럼값이 모두 필요한 경우 모든 메모리 블럭에 접근해야함 -> 느린 분석
  - ex. MySQL, PostgreSQL, Oracle 등
- Columnar DB
  - OLAP에 적합
  - 컬럼끼리 디스크에 연속해 저장하는 방식이다
  - 컬럼형 DBMS는 데이터의 추세와 평균 등을 계산하는 집계 분석 작업에 적합하다
  - 다시 레코드 형태로 재구성하기 위해 컬럼 사이의 관계를 정의하는 메타데이터가 필요하다 (각 값마다 키값을 중복저장해야 한다)
  - 최근 몇 년 동안 대용량 데이터에 대한 복잡한 분석 쿼리 사용이 늘어나고 있다
  - 결과적으로 파케이(Parquet), ORC와 같은 컬럼 기반 파일 포맷과 쿠두(Kude)와 같은 컬럼형 DBMS가 각광받고 있다  
  - 분석은 특정 컬럼에 있는 모든 값을 이용하는 경우 많음
  - 같은 컬럼에 있는 값을 하나의 메모리 블럭에 저장하면 Random I/O을 줄일 수 있음
  - 또 하나의 메모리 블럭에 같은 타입의 값만 저장하면 DB는 그 타입에 맞는 특별한 압축 방식을 제공해 줄 수 있음
  - 단점은 record단위로 발생하는 데이터를 컬럼별로 따로 저장하기 위해 쓰기 작업시 컬럼 개수만큼 더 많은 I/O 작업 발생
  - ex. AWS Redshift, Google Big Query, Apache HBase 등

- 웹 서비스에 붙어있는 DB로는 OLTP를 위한 Row based DB가 적합하고, 이 데이터를 분석팀에게 제공할 때는 Columnar DB에 저장해서 전달해 주는 것이 좋다.
- Columnar는 Scale-Out을 쉽게 만들어준다.
- 대부분의 데이터베이스는 열과 행으로 구성된 테이블에 레코드를 저장한다. 데이터를 디스크에 저장하는 방식에 따라 데이터베이스를 분류할 수 있다. 컬럼 저장 방식은 테이블을 수직 분할하고, 로우 저장 방식은 수평 분할한다.  
- MySQL, PostreSQL 등 대부분의 전통적인 관계형 데이터베이스는 로우형 DBMS이다. MonetDB, C-Store는 컬럼형 오픈소스 데이터베이스이다.  
- 같은 컬럼의 여러 값을 한 번에 읽으면 캐시 활용도와 처리 효율성이 높아진다. 같은 자료형끼리 저장하게 되면 압축률도 증가한다. 컬럼형과 로우형 DBMS 중 어떤 것을 사용할지 선택하려면 액세스 패턴을 파악해야 한다. 데이터를 레코드 단위로 접근하고 일반 쿼리와 범위 스캔 요청이 많다면 로우형 DBMS, 여러 로우를 스캔하거나 일부 컬럼에 대한 집계 작업이 많다면 컬럼형 DBMS가 더 적합할 수 있다.  
- HBase와 같은 와이드 컬럼 스토어는 같은 자료형을 가지는 컬럼을 단위로 로우 형식으로 저장한다. 이 방식은 키 단위 액세스 패턴에 적합하다.  

# 주요 데이터베이스 분류

![](/images/data_engineering_5.png)

![](/images/data_engineering_6.png)

# 참고

- [DB Engine 비교](https://db-engines.com/en/systems){:target="_blank"}
- [AWS, What Is an In-Memory Database?](https://aws.amazon.com/ko/nosql/in-memory/){:target="_blank"}
- [SCYLLA, Wide-column Database](https://www.scylladb.com/glossary/wide-column-database/){:target="_blank"}
- [stackoverflow, What exactly is a wide column store?](https://stackoverflow.com/questions/62010368/what-exactly-is-a-wide-column-store){:target="_blank"}
- [stackoverflow, Can relational database scale horizontally](https://stackoverflow.com/questions/27157227/can-relational-database-scale-horizontally){:target="_blank"}
- [What Keeps Relational Databases From Horizontal Scaling?](https://stackoverflow.com/questions/48825977/what-keeps-relational-databases-from-horizontal-scaling){:target="_blank"}
- [MATT ALLEN, Relational Databases Are Not Designed For Scale](https://www.marklogic.com/blog/relational-databases-scale/){:target="_blank"}
- [JBee, Scale Up, Scale Out, Sharding](https://asfirstalways.tistory.com/66)
- [HEAVIY.AI, Columnar Database](heavy.ai/technical-glossary/columnar-database){:target="_blank"}
- [indicative, What Is A Columnar Database?](https://www.indicative.com/resource/columnar-database/){:target="_blank"}
- [sentinelone, Understanding Row- vs Column-Oriented Databases](https://www.sentinelone.com/blog/understanding-row-vs-column-oriented-databases/){:target="_blank"}
- [Youtube: Tech Dummies Narendra L, How row oriented and column oriented db works?](https://www.youtube.com/watch?v=uMkVi4SDLbM&t=180s){:target="_blank"}
- [Youtube: Tech Dummies Narendra L, In Memory databases internals for system design interviews](https://www.youtube.com/watch?v=zkACt4NYkU4){:target="_blank"}
- [Youtube: Tech Dummies Narendra L, Learn System design : Distributed datastores, RDBMS scaling problems, CAP theorem](https://www.youtube.com/watch?v=l9JSK9OBzA4){:target="_blank"}
- [Youtube: Tech Dummies Narendra L, Learn System design : How distributed datastore works(basics)?](https://www.youtube.com/watch?v=ZbyYvTfBlE0&t=832s){:target="_blank"}
- [IBM, CAP Theorem](https://www.ibm.com/cz-en/cloud/learn/cap-theorem){:target="_blank"}