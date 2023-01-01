---
layout: post
title:  'Apache Pyspark Series [Part8]: PySpark Structured Streaming (3) Operations and Watermark'
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

# Operations


We can perform various operations on a streaming DataFrame like select, filter, groupBy, join, window, UDF, map, flatMap, etc.

## Filter

```scala
val resultDF = initDF.select("Name", "Date", "Open", "Close")
                    .filter(col("Close") - col("Open") > 0)
```

## GroupBy

## Join

## UDF

## Window




















































# Watermark








# 참고

- [Apache Spark Structured Streaming — First Streaming Example (1 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-first-streaming-example-1-of-6-e8f3219748ef){:target="_blank"}
- [Spark 공식문서, Pyspark Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html){:target="_blank"}