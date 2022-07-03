---
layout: post
title:  'Data Engineering Series [Part5]: 여러가지 파일 포맷(JSON, BSON, Arrow, Avro, Parquet, ORC)'
description: 
date:   2022-04-07 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
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

# JSON

## JSON 특징
- **J**ava**S**cript **O**bject **N**otation의 약자
- 서버와 클라이언트 간의 통신에서 일반적으로 많이 사용
- 자바스크립트 문법과 굉장히 유사하지만 텍스트 형식일 뿐


## JSON 장점
- 프로그래밍 모든 분야에 데이터를 표현하는 용도로 널리 사용된다
- 문법이 쉽고 간단하다
- 데이터를 쉽게 구조화할 수 있다


## JSON 단점
- 텍스트 기반이기 때문에 구문분석이 느리다
- BSON에 비해 크기가 크다


# BSON

## BSON 특징
- JSON을 Binary로 인코딩한 포맷이다
- MongoDB 진영에서 처음 등장한 데이터 포맷이다

## BSON 장점
- JSON에 비해 용량이 가벼운 데이터 포맷이다
- JSON과 비교해 더 많은 데이터 타입을 사용할 수 있다

## BSON 단점
- 아직 JSON만큼 프로그래밍의 다양한 진영에서 지원되지는 않는다

# Avro

## Avro 특징
- 아파치의 하둡 프로젝트에서 개발된 데이터 직렬화 프레임워크이다
- 데이터 직렬화를 위한 스키마를 뜻하며 JSON 형태로 나타낸다

## Avro 장점
- 데이터의 타입을 알 수 있다
- 데이터를 압축하여 저장한다
- Hadoop, Kafka 진영에서 많이 사용된다

## Avro 단점
- 바이너리 형태로 직렬화되어 데이터를 쉽게 분석할 수 없다

## Avro 예제

### Primitive Data Type

```
type: null, bool, int, long, float, double, bytes, string
```

```json
{"type": "string"}
{"type": "int"}
{"type": "boolean"}
{"type": "long"}
```
### Complex Data Type
```
type: record
name
namespace
doc
aliases
fields: name, doc, type, default
```

```json
{
  "type": "record",
  "name": "Students",
  "fields": [
    {"name": "id", "type": "long"},
    {"name": "name", "type": "string"},
    {"name": "majors", "type": "array", "values": "string"},
    {"name": "phone", "type": "string"}
  ]
}
```

# Parquet

## Parquet 특징
- 열 기반의 데이터 저장 포맷이다
  ![](/images/parquet_1.png)

- Apache 진영에서 많이 사용된다 (특히 Apache Spark)

## Parquet 장점
- 같은 데이터 타입을 압축하기 때문에 압축률이 Row based에 비해 더 높다
- 데이터 분석시 필요한 열(Column)만 읽어서 처리할 수 있다  
- 저장용량의 이점, 처리 성능의 이점이 있다


# Serialization vs Encoding

![](/images/serial_encode.png)

## Serialization
Serialization generally refers to taking a data structure which exists in memory, and converting it to a string (either binary or text) so that it can be saved to a file, or sent across a network.  

Serialization is an actual in-memory object that is transformed into an unusable state but the new state can be easily stored or transferred across a network. When it is needed to be used again, it can be deserialized and loaded back into memory in the same state that it was when it was serialized.  

Serializing is about moving structured data over a storage/transmission medium in a way that the structure can be maintained.

## Encoding

Encoding is a more general term. Encoding means converting to a different format expected by some consumer. So you might encode something to URL format, or JSON, or a binary format, or whatever. You're right that serialization is a specific instance of encoding.  

Encoding is more broad, like about how said data is converted to different forms, etc. Perhaps you could think about serializing being a subset of encoding in this example.  

With regard to a web service, you will probably be considering serializing/deserializing certain data for making/receiving requests/responses - effectively transporting "messages". Encoding is at a lower level, like how your messaging/web service type/serialization mechanism works under the hood.  


# 참고

- [everydayminder: Avro개요](https://luran.me/352){:target="_blank"}
- [Jaemun Jung, [Avro] Data Encoding과 Avro Format](https://jaemunbro.medium.com/avro-encoding-type%EA%B3%BC-avro-format%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-1920fe7015ca){:target="_blank"}
- [VCNC Engineering: Apache Spark에서 컬럼 기반 저장 포맷 Parquet(파케이) 제대로 활용하기](https://engineering.vcnc.co.kr/2018/05/parquet-and-spark/){:target="_blank"}