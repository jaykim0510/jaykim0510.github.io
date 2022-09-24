---
layout: post
title:  'Data Engineering Series [Part5]: 여러가지 파일 포맷(JSON, BSON, Arrow, Avro, Parquet, ORC)'
description: 
date:   2022-04-07 15:01:35 +0300
image:  '/images/data_format_logo.jpeg'
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

- 메모리에 존재하는 데이터 자료구조를 문자열(바이너리 또는 텍스트)로 변환하는 것
- 문자열로 변환함으로써 네트워크를 통해 전송하고, 파일로 저장하는 것이 가능해짐
- Serialization은 데이터를 전송/저장 가능한 매개체로 변환하는 것

## Encoding

- 인코딩은 더욱 범용적인 용어
- 다른 포맷으로 바꾸는 모든 과정을 인코딩이라고 함
- URL 포맷, JSON 포맷, 바이너리 포맷 등 어떤 포맷으로 변환하는 과정을 모두 인코딩이라고 함
- Serialization은 인코딩의 특수한 경우

# File format

- 파일: 데이터를 전송/저장 가능하도록 만든 것
- 모든 파일은 바이너리 또는 텍스트 둘중 하나로 분류됨
- 바이너리와 텍스트 모두 비트 형태의 데이터를 저장하고 있음
- 텍스트에서 비트는 문자를 나타냄
- 바이너리에서 비트는 커스텀 데이터를 나타냄


## Binary Files

- 바이너리 파일은 보통 바이트열을 데이터로 가짐
- 바이너리 파일은 안에 이미지, 비디오, 음성 등 여러 종류의 데이터를 동시에 가질 수 있음
- 바이너리 파일은 대개의 경우 헤더 정보를 가짐 -> 헤더 정보에 따라 프로그램이 파일을 열 수 있는지 여부가 결정됨
- 바이너리 파일을 텍스트 에디터로 열면 아래의 오른쪽과 같이 이상한 결과가 나오게 됨
  ![](/images/kafka_86.png)
- ex. `.jpeg`, `.zip`, `.mp4` 등



## Text Files

- 텍스트 파일은 텍스트 데이터를 저장하기 위함
- 각 텍스트는 End-ofLine (EOL) 문자로 연결되어 있음. 가장 끝에는 End-of-File (EOF)가 놓임
- ex. `.csv`, `.txt`, `.py` 등

# 참고

- [everydayminder: Avro개요](https://luran.me/352){:target="_blank"}
- [Jaemun Jung, [Avro] Data Encoding과 Avro Format](https://jaemunbro.medium.com/avro-encoding-type%EA%B3%BC-avro-format%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-1920fe7015ca){:target="_blank"}
- [VCNC Engineering: Apache Spark에서 컬럼 기반 저장 포맷 Parquet(파케이) 제대로 활용하기](https://engineering.vcnc.co.kr/2018/05/parquet-and-spark/){:target="_blank"}
- [Youtube, Differences AVRO vs Protobuf vs Parquet vs ORC, JSON vs XML](https://www.youtube.com/watch?v=oipFhroPFVM){:target="_blank"}
- [What is the difference between binary and text files?](https://fileinfo.com/help/binary_vs_text_files){:target="_blank"}