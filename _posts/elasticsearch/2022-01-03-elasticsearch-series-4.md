---
layout: post
title:  'ElasticSearch Series [Part4]: Elasticsearch 검색'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/elastic_query_logo.jpeg'
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

```json
GET /_search
{
  "_source": ["title", "status"] // 쿼리 결과로 보고 싶은 필드명
  "query": { 
    "bool": {  // 논리 쿼리는 여러 쿼리를 조합시켜준다
      "must": [ // 아래의 두 매치 쿼리가 모두 참인 경우
        { "match": { "title":   "Search"        }},
        { "match": { "content": "Elasticsearch" }}
      ],
      "filter": [ // must와 동작 원리가 같다. 차이점은 예/아니요 형식이기 때문에 스코어를 계산하지 않고, 쿼리는 범주형 데이터 타입에 대해 많이 사용하는 용어 쿼리, 범위 쿼리와 같은 것들을 사용한다
        { "term":  { "status": "published" }},
        { "range": { "publish_date": { "gte": "2015-01-01" }}}
      ]
    }
  }
}
```

# Elasticsearch 쿼리

- Elasticsearch에서 쿼리는 크게 매치 쿼리, 용어 쿼리, 논리 쿼리, 패턴 쿼리가 있다
- 매치 쿼리: 전문 검색이라고 생각하면 된다
- 용어 쿼리: 키워드 검색이라고 생각하면 된다
- 논리 쿼리: 여러 쿼리를 논리 연산자로 조합한 쿼리
- 패턴 쿼리: 특정 문자열이 아닌 패턴으로 쿼리


# 쿼리 하는 방식

- 쿼리 스트링: 간단한 쿼리시 사용
  - ex. `GET <쿼리할 인덱스명>/_search?q=name:Mary`
  - 복잡한 쿼리하기 어렵다
- 쿼리 DSL: REST API 요청 본문 안에 JSON 형태로 쿼리 작성
  - ex.
  ```json
  GET <쿼리할 인덱스명>/_search
  {
      "query": {
          "match": {
              "name": "Mary"
          }
      }
  }
  ```

# 매치 쿼리

- 전문 검색(Full text search)을 위해 사용하는 쿼리 방식
- 전문 검색을 할 필드는 텍스트 타입으로 매핑해야 한다
- 매치 쿼리는 분석기(Analyzer)를 거쳐서 나온 값을 쿼리에 사용한다
- (Inverted Index에 저장될 때도 분석기를 통해 나온 용어(term)를 저장했을 것이므로)
- (그래서 만약 쿼리할 때 다른 분석기를 사용하려면, Inverted Index도 분석기에 맞게 새로 인덱싱해야 한다)
- 매치쿼리에서 용어들 간의 공백은 OR로 인식한다
- 공백간의 용어를 AND로 하기 위해서는 `operator`라는 파라미터를 추가해주면 된다
- 만약 어떤 필드에 쿼리해야 할지 모르겠는 경우, 여러 필드에 매치 쿼리를 요청할 수도 있다 (멀티 매치 쿼리)
- (스코어는 각 필드에 대해 나온 스코어중 가장 높은 스코어를 최종 스코어로 가진다)

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "match": {
            "name": "Mary Johnson" // Mary 또는 Johnson 이 포함된 도큐먼트 리턴
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "match": {
            "name": { // Mary와 Johnson이 모두 포함된 도큐먼트 리턴
                "query": "Mary Johnson",
                "operator": "and"
            }
        }
    }
}

```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "multi_match": { // Mary를 first_name, middle_name, last_name 필드에 대해 각각 매치 쿼리를 한다
            "query": "Mary", // 각각의 매치 쿼리중 가장 높은 스코어를 최종 스코어로 선택한다
            "fields": [
                "first_name",
                "middle_name",
                "last_name"
            ]
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "multi_match": {
            "query": "Mary", 
            "fields": "*_name" // 이런식으로 와일드 카드 쓸 수도 있다
            ]
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "multi_match": { 
            "query": "Mary",
            "fields": [
                "first_name^0.7", // 0.7배 (승 아님)
                "middle_name^0.2", // 이런식으로 가중치를 주면 모두 스코어가 같다고 했을 때,
                "last_name^0.1" // first_name에 매칭된 도큐먼트를 리턴한다
            ]
        }
    }
}
```

# 용어 쿼리

- 용어 쿼리는 정확히 해당 용어인지 아닌지 확인하는 쿼리 방식
- `term`으로 표기한다
- `terms`는 여러 용어에 대해 쿼리할 때 사용한다
- 정확한 용어가 있는 경우만 매칭이 된다
- (분석기를 거치지 않기 때문에, 대소문자도 정확히 맞아야 한다)

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "term": {
            "name": "Mary Johnson" // 정확히 이름이 Mary Johnson 인 도큐먼트만 리턴
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "terms": {
            "name": ["Mary", "Johnson"] // 정확히 이름이 Mary 이거나 Johnson인 도큐먼트만 리턴
        }
    }
}
```

# 범위 쿼리

- 숫자나 날짜 또는 IP 타입의 값이 특정 범위안에 속하는 도큐먼트를 검색하고 싶을 때 사용한다
- `range`로 표기한다
- 범위 쿼리 파라미터로는 `gte`, `gt`, `lte`, `lt`이 있다
- `text`, `keyword` 같은 타입은 사용할 수 없다
- `now`를 이용하면 현재 시간을 기준으로 검색가능하다
- ex. `now+1d` 현재 시각 + 1일, `now+1h+30m+10s`, `now-1M`
- (시간 단위 표기법은 y: 연, M: 월, w: 주, .., m: 분, s: 초)
- (월(M)만 분(m)과 구분하기 위해 대문자)

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "range": {
            "timestamp": {
                "gte": "2020-12-15",
                "lt": "2020-12-23"
            }
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "range": {
            "timestamp": {
                "gte": "now-1M", // 현재 시간 기준 한달 전 이후 도큐먼트
            }
        }
    }
}
```

# 논리 쿼리

- 쿼리를 조합할 수 있다
- `bool`로 표기한다
- 파라미터로는 `must`, `must_not`, `should`, `filter`가 있다
- `must`: 쿼리가 참인 도큐먼트. 여러 쿼리를 가지는 경우 AND 연산을 한다
- `must_not`: 쿼리가 참인 도큐먼트 제외
- `should`: 쿼리가 참인 도큐먼트. 여러 쿼리를 가지는 경우 OR 연산을 한다
- `filter`: 예/아니오 형식의 쿼리를 위한 도큐먼트. 여러 쿼리를 가지는 경우 AND 연산 (스코어 계산에 포함 x)

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "bool": {
            "must": {
                "match": {
                    "name": "Mary" // 이름 안에 Mary가 포함되어 있고,
                }
            "filter": {
                "term": {
                    "status": "live" // status가 정확히 live인 도큐먼트 리턴
                }
            }
            }
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "bool": {
            "must": [
                {"match": {"first_name": "Mary"}}, // A: first_name은 Marry 가 들어가고,
                {"match": {"last_name": "Kim"}} // B: last_name에는 Kim이 들어가고,
            ],
            "should": [
                {"match": {"job": "Engineer"}}, // C: job이 Engineer 이거나,
                {"match": {"hobby": "Soccer"}} // D: hobby가 Soccer여야 한다
            ]
        // A, B, C 이거나, A, B, D 이거나, A, B, C, D 인 경우
        }
    }
}
```


# 패턴 쿼리

- 검색어를 정확히 알지 못하는 경우
- 와일드 카드를 사용하는 방식
  - `wildcard` 로 표기한다
  - `*`는 공백 포함한 모든 문자, 모든 글자수에 매칭
  - `?`는 오직 한 문자만 매칭
- 정규표현식을 사용하는 방식이 있다
  - `regexp`로 표기한다

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "wildcard": {
            "name": "M?r*" // Mary, Morata, Mur 등에 모두 매칭
        }
    }
}
```

```json
GET <쿼리할 인덱스명>/_search
{
    "query": {
        "regexp": {
            "name": "[MK]ar.+" // Mary, Kary 등에 모두 매칭
        }
    }
}
```

# 유사도 스코어

- 엘라스틱서치의 검색은 스코어를 계산해 가장 유사도가 높은 도큐먼트 순서대로 반환한다는 것이다
- 스코어는 어떻게 계산될까? 가장 대표적인 계산 알고리즘이 바로 BM25이다
- TF-IDF + 문서 길이를 고려한 알고리즘
- TF: 해당 문서에 용어가 얼마나 자주 등장하는가 -> 해당 문서에 용어가 자주 등장하면 값이 높아진다
- IDF: 얼마나 여러 문서에 등장하는가 -> 용어가 너무 여러 문서에 등장하면 값이 낮아진다
- (근데 스코어 계산에서 IDF 값은 크게 의미가 없어 보인다. 어차피 용어에 따라 달라지는 값이어서 도큐먼트간 차별성이 안생김)
- 문서 길이 고려: 얼마나 짧은 문서에서 등장했는가 -> 해당 문서의 길이가 평균 문서의 길이보다 짧은 경우 값이 높아진다

# 참고

- [elastic 공식문서, Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html){:target="_blank"}