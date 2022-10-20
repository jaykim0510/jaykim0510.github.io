---
layout: post
title:  'Apache Pyspark Series [Part2]: PySpark RDD'
description: 
date:   2022-04-17 15:01:35 +0300
image:  '/images/pyspark_logo.png'
logo_image:  '/images/spark_logo.png'
categories: DE
tags: Spark
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# RDD

- RDD는 스파크의 기본적인 데이터 모델
- RDD는 장애에 강인, 네트워크 비용을 최소화 시켜주는 연산 최적화, 파티셔닝을 통한 분산처리를 가능하게 한다
- 분산처리를 위해 RDD를 파티셔닝하고 분산하는 과정을 걱정하지 않아도 된다. 스파크가 기본적으로 제공해준다

# PySpark RDD Benefits

- 스파크를 이용하면 기존의 머신러닝과 데이터 사이언스에서의 데이터 처리와 비교해 아래와 같은 장점이 있다

- **In-Memory Processing**
  - 스파크는 기본적으로 데이터를 메모리에 먼저 올려놓고, 선택적으로 디스크에 저장한다. 그래서 굉장히 빠르다
- **Fault Tolerance**
  - RDD는 transformation(RDD1 -> RDD2) 연산을 하면 항상 새로운 RDD를 만들어 낸다
  - 중간에 네트워크, 하드웨어 등의 장애로 연산에 실패하면 자동으로 다시 이전의 RDD로 돌아가 재연산 한다
- **Lazy Evolution**
  - RDD는 transformation 연산을 바로 실행하지 않고, action 연산이 일어날 때 지금까지의 transformation을 네트워크 비용을 최소화하는 방향으로 실행 계획을 세워 실행한다
- **Partitioning**
  - 스파크는 자동으로 RDD를 코어 수만큼 파티셔닝한다

# Creating RDD

## Create RDD using sparkContext.parallelize()

- 이미 존재하는 데이터를 RDD로 만들고 파티셔닝해준다
- 상용 서비스에서는 대개 HDFS, S3, HBase와 같은 외부 저장소의 데이터를 이용해 RDD를 만든다

```python
#Create RDD from parallelize    
data = [1,2,3,4,5,6,7,8,9,10,11,12]
rdd=spark.sparkContext.parallelize(data)

```

## Create RDD using sparkContext.textFile()

```python
#Create RDD from external Data source
rdd2 = spark.sparkContext.textFile("/path/textFile.txt")

```

## Create empty RDD

```python
# Creates empty RDD with no partition    
rdd = spark.sparkContext.emptyRDD 
# rddString = spark.sparkContext.emptyRDD[String]



#Create empty RDD with partition
rdd2 = spark.sparkContext.parallelize([],10) #This creates 10 partitions

```

# RDD Operations

- RDD transformations: Transformations are lazy operations, instead of updating an RDD, these operations return another RDD
- RDD actions: operations that trigger computation and return RDD values

## RDD Transformation

- Transformations on PySpark RDD returns another RDD and transformations are lazy meaning they don’t execute until you call an action on RDD
- ex. `flatMap()`, `map()`, `reduceByKey()`, `filter()`, `sortByKey()`
- Shuffle Operation
  - Shuffling is a mechanism PySpark uses to redistribute the data across different executors and even across machines. PySpark shuffling triggers when we perform certain transformation operations like `groupByKey()`, `reduceByKey()`, `join()`
  - PySpark Shuffle is an expensive operation since it involves the Disk I/O, Involves data serialization and deserialization, Network I/O

## RDD Action

- RDD Action operations return the values from an RDD to a driver program. In other words, any RDD function that returns non-RDD is considered as an action. 
- ex. `count()`, `first()`, `max()`, `reduce()`, `take()`, `collect()`, `saveAsTextFile()`

# 실습 자료

- [**주피터 노트북 실습 자료**](https://github.com/kimziont/pyspark_train){:target="_blank"}

# 참고

- [Spark By Example, 스파크 배우기 좋은 블로그](https://sparkbyexamples.com/){:target="_blank"}
- [PySpark 공식문서, Spark Session](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/spark_session.html){:target="_blank"}