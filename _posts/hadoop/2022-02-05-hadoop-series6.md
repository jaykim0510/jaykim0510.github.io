---
layout: post
title: 'Hadoop Series [Part6]: Hadoop Hive(1) 소개와 설치'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/hadoop_logo.png'
logo_image: '/images/hadoop_logo.png'
categories: data_engineering
tags: Hadoop
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 하이브 소개

하이브(Hive)는 하둡 기반의 데이터 웨어하우징 프레임워크로, SQL 기술을 가진 분석가가 HDFS에 저장된 대량의 데이터를 분석할 수 있도록 개발되었다. 물론 모든 빅데이터 문제에 SQL이 이상적인 것은 아니다. 예를 들어 복잡한 머신러닝 알고리즘을 구현하기에는 적합하지 않다.  

# 하이브 특징

- HDFS에 저장된 데이터를 SQL과 유사한 언어로 다루고 싶은 니즈
- SQL like한 분석 지원 (HQL)
- 데이터 분석을 위한 쿼리 엔진 제공
- HQL로 작성한 쿼리를 내부적으로 MapReduce 형태로 변환
- 유사한 기술로 Spark가 있음
- Spark는 메모리 기반 소프트웨어이기 때문에 빠르다. 하지만 OOM(Out Of Memory) 자주 발생
- Hive는 디스크 기반 소프트웨어이기 때문에 느리지만, 대용량 데이터를 OOM 걱정 없이 다룰 수 있음

# 하이브 설치

일반적으로 하이브는 사용자의 워크스테이션에서 실행되고(사용자 워크스테이션과 하둡 클러스터는 네트워크로 연결되어 있어야 함), 작성된 SQL 쿼리는 일련의 맵리듀스 잡으로 변환되어 하둡 클러스터에서 구동된다. 하이브는 HDFS에 저장된 데이터에 스키마를 입히는 방식으로 데이터를 테이블로 구조화시킨다. 테이블 스키마와 같은 메타데이터는 메타스토어라 불리는 데이터베이스에 저장된다. 

```sh
# java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument 에러가 발생하는 경우
rm /opt/shared/apache-hive-3.1.2-bin/lib/guava-19.0.jar
cp /opt/shared/hadoop-3.2.1/share/hadoop/hdfs/lib/guava-27.0-jre.jar /opt/shared/apache-hive-3.1.2-bin/lib/
```

# 하이브 원격 하둡 클러스터와 연결

fs.defaultFS 값이 하이브와 연결하고자 하는 파일시스템. HDFS인 경우 `hdfs://`, 그냥 운영체제에서 제공하는 파일시스템을 사용할 경우 `file://`로 시작해 호스트명과 포트명을 명시해주면 된다.  

다음과 같은 두 가지 방법이 있다.  

1. 하이브의 conf 디렉터리에 있는 hive-site.xml 파일에서 fs.defaultFS 값을 설정
2. 하이브 쉘을 실행할 때 `hive --hiveconf fs.defaultFS=hdfs://<REMOTE>:8020` 이런식으로 설정



# 하이브 실행

하이브를 실행하는 가장 보편적인 방법은 하이브 쉘을 이용하는 것이다. 쉘을 이용할 때에도 다음과 같은 3가지 방식을 지원한다.  

```
# 대화식 모드
hive
hive> SHOW TABLES;
```

```
# 비대화식 모드 - 스크립트 전달
hive -f script.q
```

```
# 비대화식 모드 - 명령줄에 직접 스크립트 작성
hive -e 'SELECT * FROM dummy'
```

# 전통적인 DB와 비교

- 하이브는 HDFS와 맵리듀스를 기반으로 개발되었음
- 대부분의 DB는 로드 시점에 스키마 검증 -> 쓰기 스키마, 하이브는 쿼리를 실행할 때 스키마 검증 -> 읽기 스키마
- 쓰기 스키마는 DB가 컬럼 단위의 데이터 색인과 압축을 제공하기 때문에 쿼리가 더 빠름
- 읽기 스키마는 쿼리가 아직 정해지지 않아 스키마, 인덱스를 정의하기 어렵고 우선 데이터를 로드하고 싶을 때
- 하이브는 테이블과 파티션 수준의 잠금을 지원



# 참고

- [Truman show, 인공지능/기타하둡(hadoop) - 하이브(Hive) 설치](https://truman.tistory.com/209){:target="_blank"}
- [Hive, java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument](https://issues.apache.org/jira/browse/HIVE-22915)