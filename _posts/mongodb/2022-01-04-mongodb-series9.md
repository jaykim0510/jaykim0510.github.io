---
layout: post
title:  'MongoDB Series [Part9]: MongoDB Sharded Cluster'
description: 
date:   2022-01-04 15:01:35 +0300
image:  '/images/mongodb_logo.png'
logo_image:  '/images/mongo_logo.png'
categories: data_engineering
tags: MongoDB
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Sharded Cluster

- 샤드 클러스터는 샤딩을 고려해 설계된 데이터베이스 배포 방식이다
- 샤딩은 데이터를 여러 서버에 분산해서 저장하고 처리할 수 있도록 하는 기술을 말한다
- 샤딩은 분산 처리를 위한 솔루션이다


## Sharded Cluster의 장단점

- 샤드 클러스터는 Scale-out 방식의 확장성을 가능하게 한다
- Scale-out은 클러스터의 데이터 처리 용량을 투자 비용에 선형적으로 늘릴 수 있다

- 다루는 데이터가 작으면, 분산 데이터를 결합하는 과정 때문에 오히려 성능이 떨어질 수 있다
- 샤딩을 고려해야 하기 때문에 개발 생산성이 떨어지고 관리가 복잡하다

## Sharded Cluster의 구조

- 샤드 클러스터는 컨피그(Config) 서버와 라우터(Router) 서버가 필요하다
  - 컨피그 서버: 샤드 위치 정보 등의 메타 정보를 저장
  - 라우터 서버: 컨피그 서버의 메타 정보를 참조해 필요한 데이터가 저장된 샤드로 클라이언트의 쿼리를 전달

![](/images/mongo_30.png)

- 라우터는 쿼리를 전달하고, 결과를 병합해서 다시 클라이언트에게 반환한다
- 쿼리를 전달할 때, 쿼리의 조건에 샤딩 키가 사용된 경우 특정 샤드에만 쿼리를 요청할 수 있다
- 특정 샤드로만 쿼리를 요청하는 형태를 **타겟 쿼리**, 모든 샤드 서버로 요청하는 경우를 **브로드캐스트 쿼리**라고 한다

# Sharding

- 하나의 컬렉션에 저장된 도큐먼트들을 샤딩/파티셔닝/청킹해서 각 샤드가 나눠 가진다
- 샤딩에서 중요한 것은 **샤드 키를 선정**하는 것과 **적절한 샤딩 알고리즘을 선택**하는 것이다
- 대용량 컬렉션은 샤딩을 하고, 데이터가 적은 컬렉션은 굳이 샤딩할 필요 없다

![](/images/mongo_31.png)

## Shard Key

- 데이터를 샤딩하는 기준
- 한 번 설정한 샤드 키는 변경할 수 없다

## Sharding Algorithm

### Range Sharding

- 샤드 키의 값을 기준으로 범위를 나누고, 사용자 데이터가 어느 청크에 포함될지 결정하는 샤딩 알고리즘이다
- 샤드 키 값이 별도의 변형 과정을 거치지 않고 그 자체로 정렬되서 각 청크의 범위가 결정된다
- 장점: 범위 쿼리를 타겟 쿼리로 실행할 수 있다
- 단점: 데이터가 균형 있게 분산되지 않을 가능성이 높다

### Hash Sharding

- 샤드 키 값을 MD5 해시 함수를 사용해 청크를 할당하는 샤딩 방식이다
- 해시값을 계산한 다음 해시값의 앞쪽 64bit만 잘라서 정수형으로 사용한다
- 해시 함수를 거친 샤드 키 값은 전체 범위에 대해서 골고루 분산되는 효과를 내게 된다

# 실습

## Sharding 활성화

## Sharded Cluster 구축


# Replca Set과 Sharded Cluster



# 참고

- [MongoDB – DATA ON-AIR - 데이터온에어](https://dataonair.or.kr/db-tech-reference/d-guide/data-practical/?mod=document&uid=391)