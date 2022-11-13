---
layout: post
title:  'ElasticSearch Series [Part5]: Elasticsearch REST API'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/elasticsearch_logo.png'
logo_image:  '/images/elastic_logo.png'
categories: data_engineering
tags: Elastic
---

---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

![](/images/elasticsearch_1.png)

- Elasticsearch의 모든 기능을 REST API 형태로 사용할 수 있다
- Postman, linux curl과 같은 도구를 사용해도 되지만, ELK의 Kibana는 Elasticsearch REST API 를 위한 자동 완성, 구문 검사와 같은 기능들을 제공해준다. Kibana의 Dev Tools의 콘솔을 이용하자

## Elasticsearch의 시스템 상태 확인

- https://www.elastic.co/guide/en/elasticsearch/reference/current/cat.html

```
GET _cat
GET _cat/shards
GET _cat/shards/{index}
GET _cat/nodes
GET _cat/indices
GET _cat/indices/{index}
...
```


## 인덱스 관련

- https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html

## 도큐먼트 관련

- https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html

## 검색 관련

- https://www.elastic.co/guide/en/elasticsearch/reference/current/search.html

# 참고

- [Elastic 공식문서, REST APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)