---
layout: post
title:  'ElasticSearch Series [Part1]: What is Elasticsearch'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/es_main_2.png'
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

![](/images/es_main.png)

# Elasticsearch 소개

- 루씬(Lucene)의 색인 기반 검색엔진 라이브러리를 바탕으로 만든 검색 엔진 서비스
- 확장성, 가용성을 고려해 분산 시스템으로 설계
- Elastic Stack의 핵심 구성요소(Elasticsearch, Logstash, Kibana)
- 기본적으로는 검색엔진이지만, MongoDB나 HBase처럼 NoSQL로도 활용
- 보통 로그를 통합하고 분석하는 파이프라인의 구성요소로 많이 사용

# Elasticsearch 특징

- 색인 기반의 빠른 검색 엔진 기능 제공 (거의 실시간)
- 모든 요청과 응답을 REST API 형태로 제공
- 분산 시스템으로 대용량 데이터를 저장/처리할 수 있음 (샤딩)
- 서로 다른 인덱스를 하나의 질의로 묶어서 검색할 수 있는 멀티테넌시 기능 제공
- Elastic 생태계의 다른 도구와 함께 파이프라인 구축이 간단
- 자바 언어로 개발 되었고 JVM 있는 어떤 환경에서든 구동이 가능
- Java, Python, Go, Ruby 등 다양한 고수준 언어에 클라이언트 API 제공

![](/images/elasticsearch_1.png)


# Elasticsearch의 단점

- 완전한 실시간이 아니다
- 롤백 기능을 제공하지 않는다
- 업데이트 될 때마다 문서를 새로 생성한다

# Elasticsearch 용어

- 인덱스(Index)
- 도큐먼트(Document)
- 매핑(Mapping)

# Elasticsearch 동작

![](/images/es_main_2.png)

# 참고

- [김종민, Elastic 가이드 북](https://esbook.kimjmin.net/){:target="_blank"}