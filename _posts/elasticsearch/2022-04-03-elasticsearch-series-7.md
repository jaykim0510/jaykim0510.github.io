---
layout: post
title:  'ElasticSearch Series [Part1]: ElasticSearch Installation'
description: Elasticsearch는 정형 및 비정형 데이터 등 모든 유형의 데이터를 위한 무료 검색 및 분석 엔진
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
# Elasticsearch 소개
 - Elasticsearch는 정형 및 비정형 데이터 등 모든 유형의 데이터를 위한 무료 검색 및 분석 엔진
 - Apache Lucene을 기반으로 구축
 - Elastic Stack의 핵심 구성요소(Elasticsearch, Logstash, Kibana)
 - 기본적으로는 검색엔진이지만, MongoDB나 HBase처럼 대용량 스토리지로도 활용


![](/images/elastic_1.png)

## Elasticsearch를 사용하는 이유  

### Elasticsearch는 빠릅니다
Elasticsearch는 Lucene을 기반으로 구축되기 때문에, 전문(Full-text) 검색에 뛰어납니다. Elasticsearch는 또한 거의 실시간 검색 플랫폼입니다. 이것은 문서가 색인될 때부터 검색 가능해질 때까지의 대기 시간이 아주 짧다는 뜻입니다. 이 대기 시간은 보통 1초입니다. 결과적으로, Elasticsearch는 보안 분석, 인프라 모니터링 같은 시간이 중요한 사용 사례에 이상적입니다.  

🐱 `전문 검색`: 내용 전체를 색인해서 특정 단어가 포함된 문서를 검색하는 것  
🐱 `Lucene기반의 검색 엔진`: 역색인을 지원하는 검색 엔진으로 보통 책 마지막 부분의 단어별 페이지 수를 적어놓은 것과 비슷

### Elasticsearch는 본질상 분산적입니다. 
Elasticsearch에 저장된 문서는 샤드라고 하는 여러 다른 컨테이너에 걸쳐 분산되며, 이 샤드는 복제되어 하드웨어 장애 시에 중복되는 데이터 사본을 제공합니다. Elasticsearch의 분산적인 특징은 수백 개(심지어 수천 개)의 서버까지 확장하고 페타바이트의 데이터를 처리할 수 있게 해줍니다.   

### Elasticsearch는 광범위한 기능 세트와 함께 제공됩니다. 
속도, 확장성, 복원력뿐 아니라, Elasticsearch에는 데이터 롤업, 인덱스 수명 주기 관리 등과 같이 데이터를 훨씬 더 효율적으로 저장하고 검색할 수 있게 해주는 강력한 기본 기능이 다수 탑재되어 있습니다.  

### 그 밖에, RESTful API, 멀티 테넌시 등을 지원합니다.
RESTful API를 지원하고, 요청과 응답에 JSON 형식을 사용해, 개발 언어에 관계없이 이용 가능하며, 서로 다른 인덱스(테이블)일지라도 필드명(컬럼)만 같으면 한번에 여러 개의 인덱스(테이블)을 조회할 수 있습니다.  

🐱 `Elasticsearch의 약점`
- 완전한 실시간이 아니다
- 롤백 기능을 제공하지 않는다
- 업데이트 될 때마다 문서를 새로 생성한다

![](/images/elastic_3.png)
