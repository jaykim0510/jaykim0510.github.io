---
layout: post
title:  'ElasticSearch Series [Part2]: ElasticSearch에서 사용되는 간단한 용어와 파이썬 코드'
description: Elasticsearch에서 데이터는 인덱스 안의 특정 타입에 문서로 저장되는데..
date:   2022-01-05 15:01:35 +0300
image:  '/images/elastic_logo.png'
categories: DE
tags: Elasticsearch
---


# Elasticsearch를 구성하는 개념
"Elasticsearch에서 데이터는 __인덱스__ 안의 특정 __타입__ 에 __문서__ 로 저장되는데 이 때 문서는 __필드__ 를 가지고 있으며, 이러한 필드는 __매핑__ 프로세스로 정의된 이름과 속성을 보통 따른다. 그리고 이 때 모든 문서들은 정의된 __샤드__ 의 개수에 각각 골고루 분배되어 분산처리된다. 또한 장애를 대비해 __레플리카__ 의 개수만큼 복제해 놓기도 한다."  
위의 내용은 Elasticsearch의 데이터 저장방식에 관한 글입니다. 하지만 Elasticsearch가 익숙하지 않은 사람에게는 낯선 용어들도 있고 익숙하지만 이해하기 힘든 용어들도 있습니다. 그래도 Elasticsearch에서 사용하는 용어와 RDBMS에서 사용하는 용어를 비교하며 살펴보고 다시 한번 읽어보면 조금 더 이해가 갈 것입니다.

|__Elasticsearch__|__RDBMS__|
|인덱스|데이터베이스|
|타입|테이블|
|문서|행|
|필드|열|
|매핑|스키마|
|샤드|파티션|  

## 인덱스
인덱스는 논리적 데이터 저장 공간을 뜻하며, 하나의 물리적인 노드에 여러 개의 인덱스를 생성할 수도 있습니다. 이는 곧 멀티테넌시를 지원한다는 뜻이기도 합니다. 만약 Elasticsearch를 분산 환경으로 구성했다면 하나의 인덱스는 여러 노드에 분산 저장되며 검색 시 더 빠른 속도를 제공합니다.  

## 샤드
분산 환경으로 저장되면 인덱스가 여러 노드에 분산 저장된다고 했는데, 이렇게 물리적으로 여러 공간에 나뉠 때의 단위를 샤드라고 합니다. 이 때 샤드는 레플리카의 단위가 되기도 합니다.  

![](/images/elastic_4.png)

## 타입
타입은 보통 카테고리와 비슷한 의미로 노래를 K-pop, Classic, Rock처럼 장르별로 나누는 것과 같습니다. 하지만 6.1 버전 이후 인덱스 당 한 개의 타입만 지원하고 있습니다.  

## 문서
한 개의 데이터를 뜻하며, 기본적으로 JSON 형태로 저장됩니다.

## 필드
필드는 문서의 속성을 나타내며 데이터베이스의 컬럼과 비슷한 의미입니다. 다만 컬럼의 데이터 타입은 정적이고, 필드의 데이터 타입은 좀 더 동적이라고 할 수 있습니다.  

## 매핑  
매핑은 필드와, 필드의 타입을 정의하고 그에 따른 색인 방법을 정의하는 프로세스입니다.  

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

## 집계 API




