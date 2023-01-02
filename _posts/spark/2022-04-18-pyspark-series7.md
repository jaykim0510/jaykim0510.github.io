---
layout: post
title:  'Apache Pyspark Series [Part7]: PySpark Structured Streaming (2) Checkpoints and Triggers'
description: 
date:   2022-04-17 15:01:35 +0300
image:  '/images/pyspark_logo.png'
logo_image:  '/images/spark_logo.png'
categories: data_engineering
tags: Spark
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# Checkpoints

A checkpoint helps build **fault-tolerant and resilient** Spark applications. In Spark Structured Streaming, it maintains intermediate state on HDFS compatible file systems to recover from failures. To specify the checkpoint in a streaming query, we use the `checkpointLocation` parameter. The parameter enables the checkpoint and specifies the location where we keep checkpoint information.


```sh
# 인풋 소스를 csv 파일로 하는 과정에서, 
# spark cluster로 동작중이어서 일반 파일 시스템은 사용불가
# HDFS에서 파일 읽어와야함
hdfs dfs -mkdir /data

hdfs dfs -put ./data/AAPL.csv /data
hdfs dfs -put ./data/GOOGL.csv /data
hdfs dfs -put ./data/MSFT.csv /data
```


```py
from datetime import datetime
from pyspark.sql import SparkSession
import pyspark.sql.functions as F
from pyspark.sql.types import *

spark = SparkSession.builder.appName("test") \
                    .master("spark://spark-master:7077") \
                    .getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

schema = StructType([
      StructField("Date", StringType(), True),
      StructField("Open", DoubleType(), True),
      StructField("High", DoubleType(), True),
      StructField("Low", DoubleType(), True),
      StructField("Close", DoubleType(), True),
      StructField("Volume", IntegerType(), True),
      StructField("Name", StringType(), True),
])

df = spark.readStream.format("csv") \
                    .option("path", "hdfs://hdfs-name-node:8020/data") \
                    .option("maxFilesPerTrigger", 1) \
                    .option("header", True) \
                    .option("truncate", False) \
                    .schema(schema).load()

result_df = df.select("Name","Date", "Open", "High", "Low") \
  .groupBy(F.col("Name"), F.year(F.col("Date"))) \
  .agg(F.avg("High")).withColumn("timestamp", F.lit(str(datetime.now())))
                    # .withColumn("timestamp", F.current_date().cast("string")) 이렇게 쓰는 것이 더 나은 방법


result_df.writeStream.format("console") \
        .outputMode("complete") \
        .option("checkpointLocation", "checkpoint") \
        .start().awaitTermination()
```

![](/images/spark_stream_3.png)

We see a directory named `checkpoint` with a bunch of sub-directories and files. This folder contains the state of our streaming application. E.g. the `sources` folder contains batches of data processed so far.

# Triggers

By definition, data continuously flows into a streaming system. The arrival of data is not novel enough to kick off processing. In streaming systems, we need a special event to kick off processing and that event is called a trigger. Let’s discuss a few triggers in Spark Streaming.  

- **Default**: Executes a micro-batch as soon as the previous finishes.
- **Fixed interval micro-batches**: Specifies the interval when the micro-batches will execute. For example, 1 minute , 30 seconds or 1 hour etc.
- **One-time micro-batch**: Executes only one micro-batch to process all available data and then stops.
- **Available-now micro-batch**: Similar to queries one-time micro-batch trigger, the query will process all the available data and then stop on its own. The difference is that, it will process the data in (possibly) multiple micro-batches based on the source options (e.g. maxFilesPerTrigger for file source), which will result in better query scalability.


```py
# Default trigger (runs micro-batch as soon as it can)
df.writeStream \
  .format("console") \
  .start()

# ProcessingTime trigger with two-seconds micro-batch interval
df.writeStream \
  .format("console") \
  .trigger(processingTime='2 seconds') \
  .start()

# One-time trigger
df.writeStream \
  .format("console") \
  .trigger(once=True) \
  .start()

# Available-now trigger
df.writeStream \
  .format("console") \
  .trigger(availableNow=True) \
  .start()
```



# 참고

- [Neeraj Bhadani, Apache Spark Structured Streaming — Checkpoints and Triggers (4 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-checkpoints-and-triggers-4-of-6-b6f15d5cfd8d){:target="_blank"}
- [Spark 공식문서, Pyspark Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html){:target="_blank"}