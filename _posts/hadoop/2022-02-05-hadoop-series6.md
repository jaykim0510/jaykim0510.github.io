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

- 하이브(Hive)는 하둡 기반의 데이터 웨어하우징 프레임워크로, SQL 기술을 가진 분석가가 HDFS에 저장된 대량의 데이터를 분석할 수 있도록 개발되었다. 
- 물론 모든 빅데이터 문제에 SQL이 이상적인 것은 아니다. 예를 들어 복잡한 머신러닝 알고리즘을 구현하기에는 적합하지 않다.  

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

# 하이브 설정하기

- `hive-site.xml`
  - 하이브 설정
  - 클러스터 연결을 위한 세부사항
  - 메타스토어에 대한 환경 설정
  - 기본값은 `hive-default.xml` 에 정의되어 있다.
- `hive.execution.engine` 속성
  - 하이브의 기본 실행 엔진은 맵리듀스이다
  - 맵리듀스보다 더 높은 성능을 제공하는 아파치 테즈, 스파크를 사용할 수도 있다
  - `SET hive.execution.engine=tez;`

# 메타스토어

- 메타스토어는 하이브 메타데이터의 핵심 저장소다
- 메타스토어는 크게 내장 메타스토어, 로컬 메타스토어, 원격 메타스토어가 있다
- 한 번에 하나의 하이브 세션만 내장 메타스토어를 사용할 수 있다
- 이를 해결하기 위해 독립형 데이터베이스(MySQL 가장 많이 사용)를 사용하면 다중 사용자를 지원한다.

|속성|기본값|설명|
|:---:|:---:|:---:|
|hive.meatastore.warehouse.dir|/user/hive/warehouse/|관리 테이블이 저장되는 fs.defaultFS의 디렉터리|
|hive.metastore.uris|없음|메타스토어 서버 URI|

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


# 테이블

- 하이브 **테이블은 데이터와 메타데이터로 논리적으로 구성**된다
- 데이터는 로컬 파일시스템이나 S3 등에도 둘 수 있지만, 일반적으로 HDFS에 둔다
- 메타데이터는 관계형 데이터베이스에 저장한다
- **관리테이블**: 하이브는 기본적으로 데이터를 직접 관리한다(데이터를 자신이 관리하는 웨어하우스 디렉터리로 이동시킨다)
- **외부테이블**: 외부 테이블을 생성해 웨어하우스 디렉터리 외부의 데이터를 참조할 수도 있다
- 두 종류의 테이블은 `LOAD`와 `DROP`에 대한 해석에서 차이점이 있다

## 관리 테이블

- 사용자가 데이터를 관리 테이블에 로드할 때 그 데이터는 하이브의 웨어하우스 디렉터리로 이동하게 된다

```sql
LOAD DATA INPATH '/user/tom/data.txt' INTO table managed_table;
```

- `LOAD` 연산은 파일시스템에서 파일을 단순히 이동시키거나 이름을 변경하는 것이기 때문에 매우 빠르다
- 하지만 하이브는 해당 테이블의 디렉터리에 있는 파일과 관리 테이블을 위해 선언된 스키마의 정합성을 미리 점검하지 않는다
- 만일 정합성에 문제가 있다면 쿼리 시점에 누락된 필드에 대해 NULL을 반환한다
- `DROP TABLE managed_table;`을 사용해 테이블을 제거하면 메타스토어와 데이터가 함께 삭제된다

## 외부 테이블

- 외부 테이블은 데이터의 생성과 삭제를 직접 제어해야 한다
- 외부 테이블을 삭제할 때 하이브는 데이터는 건드리지 않고 메타데이터만 삭제한다
- 보통 하이브에서만 데이터를 처리한다면 관계 테이블을, 동일한 데이터셋을 하이브를 비롯해 다른 도구와 함께 사용한다면 외부 테이블을 주로 선택한다
- 외부 테이블을 사용하는 또 다른 이유는 동일한 데이터셋과 관련된 다중 스키마를 적용하기 위해서다

# 파티션과 버킷

## 파티션

- 하이브는 테이블을 파티션으로 구조화할 수 있다
- 파티션이란 특정 컬럼을 파티션 컬럼으로 하여 테이블을 큰 단위로 분할하는 방식이다
- 파티션을 이용하면 데이터의 일부를 매우 빠르게 쿼리할 수 있다
- 파티션은 다중 차원으로 할 수도 있다 (날짜를 기반으로 파티션 한 뒤, 국가별로 한 번 더 파티션할 수 있다)
- 파티션은 테이블을 생성하는 시점에 PARTITIONED BY 절을 이용해 선언한다
    ```sql
    CREATE TABLE logs (ts BIGINT, line STRING)
    PARTITIONED BY (dt STRING, country STRING);
    ```
- 파티션이 정의된 테이블로 데이터를 로드할 때는 파티션 값을 명시적으로 지정해야 한다
    ```sql
    LOAD DATA LOCAL INPATH 'input/hive/partitions/file1'
    INTO TABLE logs
    PARTITION (dt='2001-01-01', country='GB');
    ```
- 파일시스템 수준에서 보면 파티션은 단순히 테이블 디렉터리에 내포된 서브디렉터리다
    ```
    /user/hive/warehouse/logs
    |-- dt=2001-01-01/
    |   |-- country=GB/
    |   |   |-- file1
    |   |   |-- file2
    |   |-- country=US/
    |   |   |-- file3
    |-- dt=2001-01-02/
    |   |-- country=GB/
    |   |   |-- file4
    |   |-- country=US/
    |   |   |-- file5
    |   |   |-- file6
    ```
- 데이터 파일에는 파티션 컬럼 값은 저장되지 않는다 (디렉터리 이름으로 유추할 수 있기 때문에)
- `SHOW PARTITIONS`로 테이블에 포함된 파티션의 목록을 확인할 수 있다

## 버킷

- 테이블과 파티션은 버킷으로 더욱 세분화될 수 있다
- 버킷은 데이터 일부를 샘플링해 쿼리가 제대로 실행되는지 빠르게 평가해볼 때 유용하다
- 물리적으로 각 버킷은 하나의 파일이다
- 하이브는 사용자가 지정한 컬럼의 값을 해싱하고, 그 값을 버킷 수로 나눈 나머지를 버킷의 번호로 선택한다
- 버킷팅 하는 가장 권장되는 방법은, 빈 버킷 테이블을 만들고, 기존의 테이블에 있는 데이터를 빈 버킷 테이블로 로드하는 방법이다
    ```sql
    # 빈 버킷 테이블 만든다
    CREATE TABLE bucketed_users (id INT, name STRING)
    CLUSTERED BY (id) INTO 4 BUCKETS;

    # 기존의 테이블(users)을 hive.enforce.bucketing 을 true 로 설정한다

    # 빈 버킷 테이블로 데이터를 로드한다
    INSERT OVERWRITE TABLE bucketed_users
    SELECT * FROM users;
    ```

# 참고

- [Truman show, 인공지능/기타하둡(hadoop) - 하이브(Hive) 설치](https://truman.tistory.com/209){:target="_blank"}
- [Hive, java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument](https://issues.apache.org/jira/browse/HIVE-22915)