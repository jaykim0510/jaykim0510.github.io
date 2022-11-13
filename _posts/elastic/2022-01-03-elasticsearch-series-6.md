---
layout: post
title:  'ElasticSearch Series [Part6]: Elasticsearch with Python'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/es_python.png'
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


# Elasticsearch에서 제공하는 주요 API

```python
from elasticsearch import Elasticsearch

ES_URL = 'localhost:9200'
ES_INDEX = 'first_index'
DOC_TYPE = '_doc'

es = Elasticsearch(ES_URL)
```

## 인덱스 관련 API

```python
# 인덱스 메타데이터, 매핑 정의
index_settings = {
    'settings': {
        'number_of_shards': 2,
        'number_of_replicas': 1
    },
    'mappings': { 
        'properties': {
            'name': {'type': 'text'},
            'age': {'type': 'long'},
            'gender': {'type': 'text'},
            'company': {'type': 'text'},
            'email': {'type': 'text'},
            'address': {'type': 'text'},
            'phone': {'type': 'text'}
        }
        
    }
}

# 인덱스 생성
es.indices.create(index=ES_INDEX, **index_settings)
--------------------------------------------------------
{'acknowledged': True, 'shards_acknowledged': True, 'index': 'first_index'}

# 인덱스 메타 데이터 확인
es.indices.get_settings()
--------------------------------------------------------
{'first_index': {'settings': {'index': {'routing': {'allocation': {'include': {'_tier_preference': 'data_content'}}},
    'number_of_shards': '2',
    'provided_name': 'first_index',
    'creation_date': '1641728644368',
    'number_of_replicas': '1',
    'uuid': '3QtIZXthRcGtCdV40WmUCg',
    'version': {'created': '7160299'}}}}}

# 인덱스 매핑 확인
es.indices.get_mapping(index=ES_INDEX)
--------------------------------------------------------
{'first_index': {'mappings': {'properties': {'address': {'type': 'text'},
    'age': {'type': 'long'},
    'company': {'type': 'text'},
    'email': {'type': 'text'},
    'gender': {'type': 'text'},
    'name': {'type': 'text'},
    'phone': {'type': 'text'}}}}}

# 인덱스 삭제
es.indices.delete(ES_INDEX)
--------------------------------------------------------
{'acknowledged': True}

# 인덱스 존재 유무
es.indices.exists(ES_INDEX)
--------------------------------------------------------
True

# 매핑 업데이트
new_field = {
  "properties": {
    "school" : {
      "type": "text"
    }
  }
}

es.indices.put_mapping(new_field, index=ES_INDEX)
--------------------------------------------------------
{'acknowledged': True}
```

## 문서 관련 API

```python
# 문서 삽입
unit_document = {
    'name': 'Jay Kim',
    'age': 28,
    'gender': 'male',
    'email': 'abc@gmail.com',
    'address': '부산 해운대 앞바다',
    'phone': '010-1234-5678'
}

es.index(index=ES_INDEX, doc_type=DOC_TYPE, id=1, document=unit_document)
--------------------------------------------------------------------------
{'_index': 'first_index',
 '_type': '_doc',
 '_id': '1',
 '_version': 1,
 'result': 'created',
 '_shards': {'total': 2, 'successful': 1, 'failed': 0},
 '_seq_no': 4,
 '_primary_term': 1}

# 문서 정보 확인
es.get(index=ES_INDEX, doc_type=DOC_TYPE, id=1)
-----------------------------------------------------
{'_index': 'first_index',
 '_type': '_doc',
 '_id': '1',
 '_version': 1,
 '_seq_no': 0,
 '_primary_term': 1,
 'found': True,
 '_source': {'name': 'Jay Kim',
  'age': 28,
  'gender': 'male',
  'email': 'abc@gmail.com',
  'address': '부산 해운대 앞바다',
  'phone': '010-1234-5678'}}

# 문서를 가지는 인덱스 생성 (이미 있으면 삽입)
unit_document = {
    'name': 'Jae yeong Kim',
    'age': 28,
    'gender': 'male',
    'email': 'abc@gmail.com',
    'address': '경북 구미 형곡동',
    'phone': '010-3321-5668'
}

es.create(index=ES_INDEX, id=2, body=unit_document)
------------------------------------------------------------
{'_index': 'first_index',
 '_type': '_doc',
 '_id': '2',
 '_version': 1,
 'result': 'created',
 '_shards': {'total': 2, 'successful': 1, 'failed': 0},
 '_seq_no': 1,
 '_primary_term': 1}

# 문서 삭제
es.delete(index=ES_INDEX, id=2)
---------------------------------------------------------------
{'_index': 'first_index',
 '_type': '_doc',
 '_id': '2',
 '_version': 2,
 'result': 'deleted',
 '_shards': {'total': 2, 'successful': 1, 'failed': 0},
 '_seq_no': 2,
 '_primary_term': 1}

# query로 삭제
body = {
    'query':{
        'match_all':{}
    }
}

es.delete_by_query(index=ES_INDEX, body=body)
----------------------------------------------
{'took': 23,
 'timed_out': False,
 'total': 1,
 'deleted': 1,
 'batches': 1,
 'version_conflicts': 0,
 'noops': 0,
 'retries': {'bulk': 0, 'search': 0},
 'throttled_millis': 0,
 'requests_per_second': -1.0,
 'throttled_until_millis': 0,
 'failures': []}

# 문서 수정
# ""doc"" is essentially Elasticsearch's ""_source"" field

update_document = {'doc': {
         'address': '경북 구미 송정동',
         'age': 28,
         'email': 'ziont0510@gmail.com',
    }
}

es.update(index=ES_INDEX, id=1, body=update_document)
------------------------------------------------------------
{'_index': 'first_index',
 '_type': '_doc',
 '_id': '1',
 '_version': 2,
 'result': 'updated',
 '_shards': {'total': 2, 'successful': 1, 'failed': 0},
 '_seq_no': 5,
 '_primary_term': 1}
```

## 검색 API

```python
# 매칭되는 문서 개수
body = {
    'query':{
        'match_all':{}
    }
}

es.count(body=body, index=ES_INDEX)
---------------------------------------------------------------
{'count': 2,
 '_shards': {'total': 2, 'successful': 2, 'skipped': 0, 'failed': 0}}

# 문서 검색
body = {
    'size':10,
    'query':{
        'match_all':{}
    }
}
    
es.search(body=body, index=ES_INDEX)
-------------------------------------------------------
{'took': 6,
 'timed_out': False,
 '_shards': {'total': 2, 'successful': 2, 'skipped': 0, 'failed': 0},
 'hits': {'total': {'value': 0, 'relation': 'eq'},
  'max_score': None,
  'hits': []}}
```

