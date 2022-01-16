---
layout: post
title:  'ElasticSearch Series [Part3]: ElasticSearch Modeling'
description: 엘라스틱서치에서 문서(데이터)를 어떤 형태로 색인할 것인지 설정하는 것을 모델링이라고 합니다. 엘라스틱서치에서 모델링할 때에 중요한 요소는 다음과 같습니다.
date:   2022-01-06 15:01:35 +0300
image:  '/images/elastic_logo.png'
tags:   DE
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Elasticsearch 모델링
엘라스틱서치에서 문서(데이터)를 어떤 형태로 색인할 것인지 설정하는 것을 모델링이라고 합니다. 엘라스틱서치에서 모델링할 때에 중요한 요소는 다음과 같습니다.  

- 필드에 지정할 데이터 타입
- 필드별 매핑 파라미터

예를 들어, 영화 정보를 엘라스틱서치를 이용해 저장하고 싶다면,  

|__필드명__|__필드 타입__|
|movieTitle|text|
|jenre|keyword|
|nation|keyword|
|produceYear|integer|
|releaseDate|date|
|actor|keyword|

이렇게 필드별로 `text`, `keyword`, `integer`, `date` 등의 데이터 타입을 설정할 수 있습니다.

## 데이터 타입  

```
# 대표적인 데이터 타입
- 문자열 관련한 데이터 타입: keyword, text
- 일반적인 데이터 타입: integer, long, double, boolean
- 특수한 데이터 타입: date, ip, geo_point, geo_shape
```

### Keyword 데이터 타입
Keyword 데이터 타입은 문자열 데이터를 색인할 때 자주 사용하는 타입 중 하나로, 별도의 분석기 없이 원문 그대로가 저장된다는 것이 특징입니다. 예를 들어 'elastic search'라는 문자열을 keyword 타입으로 저장한다면, 'elastic'이나 'search'로는 검색이 되지 않고 정확히 'elastic search'라고해야만 검색됩니다. 이러한 데이터 타입은 주로 카테고리형 데이터의 필드 타입으로 적절하며, `문자열을 필터링, 정렬, 집계`할 때는 keyword타입을 이용해야 합니다.  

### Text 데이터 타입
반지의 제왕 영화 시리즈에는 '반지의 제왕: 반지 원정대', '반지의 제왕: 두 개의 탑', '반지의 제왕: 왕의 귀환'이 있습니다. 근데 저는 부제목까지는 기억이 안나고 '반지의 제왕'만 기억이 납니다. 그래서 저는 '반지의 제왕'이라고만 검색해도 위의 영화들이 나왔으면 좋겠습니다. 이럴 때는 text데이터 타입을 이용합니다. Text타입은 `전문 검색`이 가a능하다는 점이 가장 큰 특징입니다. Text타입으로 데이터를 색인하면 전체 텍스트가 토큰화되어 역색인(inverted index)됩니다. 

더 자세한 내용은 공식문서를 참고해주시면 좋을 것 같습니다. [(엘라스틱서치 공식문서 참고)](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html)

## 매핑 파라미터
문서를 색인하는 과정은 당연 엘라스틱서치에서 가장 중요한 부분입니다. 그렇기 때문에 엘라스틱서치에서는 매핑 파라미터를 통해 색인 과정을 커스텀하도록 도와줍니다. 예를 들어 어떤 영화 데이터는 장르가 없다고 하면 색인할 때 필드를 생성하지 않습니다. 이럴 때 `null_value`를 '데이터 없음'이라고 설정했다면, 필드가 생성 되고 값에 '데이터 없음'이라는 값이 들어갑니다. 또 다른 예시는 특정 필드를 색인에 포함할지 말지를 결정하는 `enabled`, `index` 파라미터도 있습니다. [(둘의 차이는 stack overflow 참고)](https://stackoverflow.com/questions/50836504/elasticsearch-mapping-parameters-index-vs-enabled)


```
# 매핑 파라미터
- 문자열에 자주 사용: analyzer, search_analyzer, similarity, term_vector, normalizer
- 저장 관련: enabled, index, store, copy_to, doc_values
- 색인 방식과 관련: ignore_above, ignore_malformed, coerce, dynamic, null_value
- 필드 안의 필드를 정의할 때 사용: properties, fields
- 그 밖: position_increment_gap, format
```
[(엘라스틱서치 공식문서 참고)](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-params.html)