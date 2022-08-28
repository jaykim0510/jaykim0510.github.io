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
Serialization generally refers to taking a data structure which exists in memory, and converting it to a string (either binary or text) so that it can be saved to a file, or sent across a network.  

Serialization is an actual in-memory object that is transformed into an unusable state but the new state can be easily stored or transferred across a network. When it is needed to be used again, it can be deserialized and loaded back into memory in the same state that it was when it was serialized.  

Serializing is about moving structured data over a storage/transmission medium in a way that the structure can be maintained.

## Encoding

Encoding is a more general term. Encoding means converting to a different format expected by some consumer. So you might encode something to URL format, or JSON, or a binary format, or whatever. You're right that serialization is a specific instance of encoding.  

Encoding is more broad, like about how said data is converted to different forms, etc. Perhaps you could think about serializing being a subset of encoding in this example.  

With regard to a web service, you will probably be considering serializing/deserializing certain data for making/receiving requests/responses - effectively transporting "messages". Encoding is at a lower level, like how your messaging/web service type/serialization mechanism works under the hood.  

# File format

All files can be categorized into one of two file formats — binary or text. The two file types may look the same on the surface, but they encode data differently. While both binary and text files contain data stored as a series of bits (binary values of 1s and 0s), the bits in text files represent characters, while the bits in binary files represent custom data.  

While text files contain only textual data, binary files may contain both textual and custom binary data.  

## Binary Files
Binary files typically contain a sequence of bytes, or ordered groupings of eight bits. When creating a custom file format for a program, a developer arranges these bytes into a format that stores the necessary information for the application. Binary file formats may include multiple types of data in the same file, such as image, video, and audio data. This data can be interpreted by supporting programs, but will show up as garbled text in a text editor. Below is an example of a .PNG image file opened in an image viewer and a text editor.  

![](/images/kafka_86.png)

As you can see, the image viewer recognizes the binary data and displays the picture. When the image is opened in a text editor, the binary data is converted to unrecognizable text. However, you may notice that some of the text is readable. This is because the PNG format includes small sections for storing textual data. The text editor, while not designed to read this file format, still displays this text when the file is opened. Many other binary file types include sections of readable text as well. Therefore, it may be possible to find out some information about an unknown binary file type by opening it in a text editor.  

Binary files often contain headers, which are bytes of data at the beginning of a file that identifies the file's contents. Headers often include the file type and other descriptive information. For example, in the image above, the "PNG" text indicates the file is a PNG image. If a file has invalid header information, software programs may not open the file or they may report that the file is corrupted.  

## Text Files
Text files are more restrictive than binary files since they can only contain textual data. However, unlike binary files, they are less likely to become corrupted. While a small error in a binary file may make it unreadable, a small error in a text file may simply show up once the file has been opened. This is one of reasons Microsoft switched to a compressed text-based XML format for the Office 2007 file types.  

Text files may be saved in either a plain text (.TXT) format and rich text (.RTF) format. A typical plain text file contains several lines of text that are each followed by an End-of-Line (EOL) character. An End-of-File (EOF) marker is placed after the final character, which signals the end of the file. Rich text files use a similar file structure, but may also include text styles, such as bold and italics, as well as page formatting information. Both plain text and rich text files include a (character encoding, characterencoding) scheme that determines how the characters are interpreted and what characters can be displayed.  

Since text files use a simple, standard format, many programs are capable of reading and editing text files. Common text editors include Microsoft Notepad and WordPad, which are bundled with Windows, and Apple TextEdit, which is included with Mac OS X.  

# 참고

- [everydayminder: Avro개요](https://luran.me/352){:target="_blank"}
- [Jaemun Jung, [Avro] Data Encoding과 Avro Format](https://jaemunbro.medium.com/avro-encoding-type%EA%B3%BC-avro-format%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-1920fe7015ca){:target="_blank"}
- [VCNC Engineering: Apache Spark에서 컬럼 기반 저장 포맷 Parquet(파케이) 제대로 활용하기](https://engineering.vcnc.co.kr/2018/05/parquet-and-spark/){:target="_blank"}
- [Youtube, Differences AVRO vs Protobuf vs Parquet vs ORC, JSON vs XML](https://www.youtube.com/watch?v=oipFhroPFVM){:target="_blank"}
- [What is the difference between binary and text files?](https://fileinfo.com/help/binary_vs_text_files){:target="_blank"}