---
layout: post
title:  'ElasticSearch Series [Part3]: Elasticsearch 기본 구성 요소'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/elasticsearch_logo.png'
logo_image:  '/images/elastic_logo.png'
categories: DE
tags: Elastic
---

---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Document

- 여러 개의 필드로 구성된 하나의 데이터
- Index에 JSON 형태로 저장
- RDBMS의 Row 또는 Record와 유사한 개념

# Index

- 인덱스는 도큐먼트를 저장하는 논리적 단위
- 실제로 존재하지 않으며, 역색인 자료구조와도 관련 없음
- 도큐먼트를 논리적으로 구분하는 것이 목적
- 엘라스틱 서치에서 Index는 여러 곳에서 혼용되고 있음
  - Index: 도큐먼트의 논리적인 집합
  - 인덱싱: 도큐먼트를 인덱스에 저장
  - 색인: 도큐먼트가 분석기에 의해 토큰들로 변환되어 Inverted Index에 저장되는 과정

# Inverted Index

- 도큐먼트를 인덱싱(삽입) 했을 때 분석기(Analyzer)에 의해 만들어진 용어(term)들이 색인되는 자료구조
- 엘라스틱서치의 검색 속도를 빠르게 해주는 자료구조
- Inverted Index를 구현하는 자료구조에는 B-Tree, Hash 인덱스 등이 있음

# Mapping

- 데이터 모델링
- RDBMS의 스키마와 비슷한 개념
- NoSQL의 유연한 스키마 특성을 위해 자동으로 매핑해주는 것을 다이나믹 매핑이라고함
- 데이터 타입, 분석기 종류 등을 명시하여 성능 최적화와 데이터의 정확성을 지키는 방법을 명시적인 매핑이라고함
- 인덱스 매핑이 정해지면 새로운 필드를 추가할 수 있으나, 이미 정의된 필드를 수정하거나 삭제할 수는 없다
- 필드 이름을 변경하거나 데이터 타입을 변경하기 위해서는 새로운 인덱스를 만들거나 reindex API를 이용해야 한다
- 매핑에는 properties, analyzer, format 과 같은 파라미터가 있다
- 매핑 파라미터, 데이터 타입
- 멀티필드: 하나의 필드를 여러 용도로 사용할 수 있게 해준다
- (ex. match query를 하고 싶을 때는 text타입, 집계나 정렬, term query를 하고 싶을 때는 keyword 타입)


# Template

- 동일한 복수의 인덱스를 만들 때 사용
- 관리 편의성, 성능 등을 위해 인덱스를 파티셔닝하는 일이 많은데 이 때 파티셔닝되는 인덱스들은 설정이 같아야함
- 템플릿에서 사용하는 파라미터는 index_patterns, priority, template 이 대표적
- template 안에는 settings, mappings 파라미터가 대표적
- 템플릿을 만들기 전에 이미 존재하던 인덱스는 템플릿 패턴과 일치하더라도 템플릿이 적용되지 않음
- 7.8버전 이후로는 우선순위가 높은 템플릿만 적용됨

# Analyzer

- 전문 검색에서 양질의 결과를 얻기 위해서는 문자열을 나누는 기준이 중요
- 엘라스틱서치는 text 타입의 문자열을 분석기를 이용해 용어(term) 형태로 인덱스에 저장한다
- (검색에 사용되는 단위가 바로 용어(term)이다)
- 분석기는 캐릭터 필터, 토크나이저, 토큰 필터로 구성 (토크나이저만 필수 요소, 나머지는 선택 요소)
- 캐릭터 필터: 입력받은 문자열을 변경하거나 불필요한 문자들 제거 (html 태그 등)
- 토크나이저: 문자열을 토큰으로 분리. 분리할 때 토큰의 순서나 시작, 끝 위치도 기록
- 토큰 필터: 분리된 토큰에 대해 필터링 작업. 대소문자 구분, 형태소 분석 등의 작업. 토큰 필터를 거친 후의 토큰이 인덱스에 저장되면 이를 용어(term)라고 한다
- 분석기 종류에는 대표적으로 standard, simple, whitespace, stop 등이 있다
- 분석기 대신 토크나이저만 적용해도 되고, 토크나이저에 각종 필터를 추가할 수도 있다

# Query DSL

- 엘라스틱서치의 가장 큰 특징은 검색 엔진
- 검색을 위한 SQL Like 언어 (RDBMS의 SELECT 쿼리문과 같은 역할)

# Shard

- 분산 처리/복제를 위한 단위
- Primary 샤드와 Replica 샤드가 있음

```
- 샤딩은 Document와 Inverted Index를 함께 샤딩하는 것 같다
- 어디서는 Inverted Index라고 얘기하고, 어디서는 Document라고 한다
- 정확히 둘 다 샤딩한다고 얘기하는 곳은 못봤다
```

![](/images/es_index_1.png)

![](/images/es_shard_1.png)

![](/images/es_shard_2.png)

# 참고

- [elastic 공식문서, Data in: documents and indices](https://www.elastic.co/guide/en/elasticsearch/reference/current/documents-indices.html)
- [elastic 공식문서, Scalability and resilience](https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html)
- [instaclustr, A Comprehensive Guide to OpenSearch and Elasticsearch™ Architecture](https://www.instaclustr.com/blog/opensearch-and-elasticsearch-architecture/)
- [Shivanshu Goyal, Elasticsearch and its internals working](https://medium.com/geekculture/elasticsearch-internals-4c4c9ec077fa)
- [stackoverflow, Understanding Segments in Elasticsearch](https://stackoverflow.com/questions/15426441/understanding-segments-in-elasticsearch)
- [stackoverflow, Elasticsearch, when document is stored does it get split up into different shards?](https://stackoverflow.com/questions/59064364/elasticsearch-when-document-is-stored-does-it-get-split-up-into-different-shard)
- [trackit, Accelerate your metadata search from 60 seconds to 4 seconds by adding Elasticsearch to your architecture](https://trackit.io/trackit-whitepapers/accelerate-your-metadata-search-from-60-seconds-to-4-seconds-by-adding-elasticsearch-to-your-architecture/)