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


```py
resultDF
  .writeStream
  .outputMode("complete")
  .option("checkpointLocation", "checkpoint")
  .format("console")
  .start()
  .awaitTermination()
```

![](/images/spark_stream_3.png)

We see a directory named `checkpoint` with a bunch of sub-directories and files. This folder contains the state of our streaming application. E.g. the `sources` folder contains batches of data processed so far.

# Triggers

By definition, data continuously flows into a streaming system. The arrival of data is not novel enough to kick off processing. In streaming systems, we need a special event to kick off processing and that event is called a trigger. Let’s discuss a few triggers in Spark Streaming.  

- **Default**: Executes a micro-batch as soon as the previous finishes.
- **Fixed interval micro-batches**: Specifies the interval when the micro-batches will execute. For example, 1 minute , 30 seconds or 1 hour etc.

```py
resultDF
  .writeStream
  .outputMode("complete")
  .trigger(Trigger.ProcessingTime("1 minute"))
  .format("console")
  .option("truncate", false)
  .start()
  .awaitTermination()
```

- **One-time micro-batch**: Executes only one micro-batch to process all available data and then stops.


```py
resultDF
  .writeStream
  .outputMode("complete")
  .trigger(Trigger.Once())
  .format("console")
  .option("truncate", false)
  .start()
  .awaitTermination()
```






















# 참고

- [Apache Spark Structured Streaming — First Streaming Example (1 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-first-streaming-example-1-of-6-e8f3219748ef){:target="_blank"}
- [Spark 공식문서, Pyspark Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html){:target="_blank"}