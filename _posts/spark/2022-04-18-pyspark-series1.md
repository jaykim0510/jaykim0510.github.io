---
layout: post
title:  'Apache Pyspark Series [Part1]: PySpark Tutorial'
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

# What is PySpark

PySpark is a Spark library written in Python to run Python applications using Apache Spark capabilities, using PySpark we can run applications parallelly on the distributed cluster (multiple nodes).  

In other words, PySpark is a Python API for Apache Spark. Apache Spark is an analytical processing engine for large scale powerful distributed data processing and machine learning applications.  

Spark basically written in Scala and later on due to its industry adaptation it’s API PySpark released for Python using Py4J. Py4J is a Java library that is integrated within PySpark and allows python to dynamically interface with JVM objects, hence to run PySpark you also need Java to be installed along with Python, and Apache Spark.  

# PySpark Installation

- JVM을 포함하는 패키지 (JRE 또는 JDK)
- Python 설치
- Spark 설치
- PySpark 라이브러리 설치 (Spark 버전과 일치시키는 것이 좋다 아니면 `Py4JException: Constructor org.apache.spark.sql.SparkSession([class org.apache.spark.SparkContext, class java.util.HashMap]) does not exist`에러 발생할 수 있음)

# SparkSession

- Spark 2.0 이후로 SparkSession이 RDD와 DataFrame을 다루기 위한 엔트리 포인트가 되었다
- (이전에는 SparkContext)
- `from pyspark.sql import SparkSession`
- `SparkSession.builder` 를 통해 `SparkSession` 객체를 만든다
- SparkSession internally creates SparkConfig and SparkContext with the configuration provided with SparkSession
- 내가 사용할 테이블 수만큼 많은 SparkSession 객체를 하나의 애플리케이션 내에서 생성할 수 있다
- (`SparkSession.builder()` or `SparkSession.newSession()`를 이용해서)
- (`SparkContext`는 애플리케이션당 1개. `SparkSession` 많이 생성해도 S`parkContext`는 공유)

## Create SparkSession

```python
import pyspark
from pyspark.sql import SparkSession

spark = SparkSession.builder.master("local[1]") \ 
                    .appName('SparkByExamples.com') \
                    .getOrCreate()
```

- `master()`
  - Sets the Spark master URL to connect to, such as `local` to run locally, `local[4]` to run locally with 4 cores, or `spark://master:7077` to run on a Spark standalone cluster
- `appName()`
  - Sets a name for the application, which will be shown in the Spark web UI
- `getOrCreate()`
  - Gets an existing SparkSession or, if there is no existing one, creates a new one based on the options set in this builder

## Create Another SparkSession

- 이미 존재하고 있는 master, appName, SparkContext 공유

```python
# Create new SparkSession
spark2 = SparkSession.newSession

```

## Using Spark Config

- set some configs to SparkSession
    ```python
    # Usage of config()
    spark = SparkSession.builder \
        .master("local[1]") \
        .appName("SparkByExamples.com") \
        .config("spark.some.config.option", "config-value") \
        .getOrCreate()

    ```

- 런타임 도중에 설정값을 바꾸거나 읽어올 수 있다
  ```python
  # Set Config
    spark.conf.set("spark.executor.memory", "5g")

    # Get a Spark Config
    partitions = spark.conf.get("spark.sql.shuffle.partitions")
    print(partitions)
  ```

## Create PySpark DataFrame

- SparkSession also provides several methods to create a Spark DataFrame and DataSet
- 리스트 또는 pandas의 DataFrame을 인자로 받을 수 있다

```python

# Create DataFrame
df = spark.createDataFrame(
    [("Scala", 25000), ("Spark", 35000), ("PHP", 21000)])
df.show()

# Output
#+-----+-----+
#|   _1|   _2|
#+-----+-----+
#|Scala|25000|
#|Spark|35000|
#|  PHP|21000|
#+-----+-----+

```

## Working with Spark SQL

- Using `SparkSession` you can access PySpark/Spark SQL capabilities in PySpark. In order to use SQL features first, you need to create a temporary view in PySpark. 
- Once you have a temporary view you can run any ANSI SQL queries using `spark.sql()` method.
- PySpark SQL temporary views are session-scoped and will not be available if the session that creates it terminates. If you want to have a temporary view that is shared among all sessions and keep alive until the Spark application terminates, you can create a global temporary view using `createGlobalTempView()`

```python
# Spark SQL
df.createOrReplaceTempView("sample_table")
df2 = spark.sql("SELECT _1,_2 FROM sample_table")
df2.show()
```

## SparkSession Commonly Used Methods

- `version()`: Returns the Spark version where your application is running, probably the Spark version your cluster is configured with.

- `createDataFrame()`: This creates a DataFrame from a collection and an RDD

- `getActiveSession()`: returns an active Spark session.

- `read()`: Returns an instance of DataFrameReader class, this is used to read records from csv, parquet, avro, and more file formats into DataFrame.

- `readStream()`: Returns an instance of DataStreamReader class, this is used to read streaming data. that can be used to read streaming data into DataFrame.

- `sparkContext()`: Returns a SparkContext.

- `sql()`: Returns a DataFrame after executing the SQL mentioned.

- `sqlContext()`: Returns SQLContext.

- `stop()`: Stop the current SparkContext.

- `table()`: Returns a DataFrame of a table or view.

- `udf()`: Creates a PySpark UDF to use it on DataFrame, Dataset, and SQL.

## SparkContext

- The Spark driver program creates and uses SparkContext to connect to the cluster manager to submit PySpark jobs, and know what resource manager (YARN, Mesos, or Standalone) to communicate to. It is the heart of the PySpark application.
- Since PySpark 2.0, Creating a SparkSession creates a SparkContext internally and exposes the sparkContext variable to use.
- At any given time only one SparkContext instance should be active per JVM. In case you want to create another you should stop existing SparkContext using stop() before creating a new one.

```python

# Create SparkSession from builder
from pyspark.sql import SparkSession
spark = SparkSession.builder.master("local[1]") \
                    .appName('SparkByExamples.com') \
                    .getOrCreate()
print(spark.sparkContext)
print("Spark App Name : "+ spark.sparkContext.appName)

# Outputs
#<SparkContext master=local[1] appName=SparkByExamples.com>
#Spark App Name : SparkByExamples.com



# SparkContext stop() method
spark.sparkContext.stop()

```


# 참고

- [Spark By Example, 스파크 배우기 좋은 블로그](https://sparkbyexamples.com/){:target="_blank"}
- [PySpark 공식문서, Spark Session](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/spark_session.html){:target="_blank"}