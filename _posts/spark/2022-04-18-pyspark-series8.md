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

Window operations are very similar to `groupBy` operations. In `groupBy`, aggregation is based on the specified group or key while in `window` operations, aggregation is based on event windows. Spark supports 2 types of windows Tumbling window and Sliding window.

Let’s discuss each one of them in detail. Take an example of numbers from 1–10 and we will calculate `SUM` using different window operations.  

### Tumbling window

Tumbling windows are non-overlapping which means each data point will be part of only one window.


![](/images/spark_stream_4.png)


Here the size of the window is 2 and we have 5 non-overlapping windows along with the sum of the elements in each window. Also, we can verify that none of the elements are overlapping between windows.  

Now let us define one in our streaming application. We can use a window function and specify the `DateTime` column and window duration say `2 minutes` or `30 seconds` or `1 hour` or `5 days` etc.  


```scala
val resultDF = initDF.select("Name", "Date", "Open", "High", "Low")
  .groupBy(window($"Date", "10 days"), $"Name")
  .agg(max("High").as("Max"))
  .orderBy($"window.start")
```

### Sliding window 

As its name suggests, this window will slide instead of tumbling on the data. We can specify the level of sliding needed. These are overlapping windows. Let’s first try to understand with a simple example of numbers from 1–10.  


![](/images/spark_stream_5.png)


Here we have defined the window size as 3 and slide interval as 2. As we can see in the snapshot above, these windows overlap. For example, the number 3 is present in both windows 1 and 2.  

To define a sliding window, along with `DateTime` and `Window Size` in the window function, we specify `slide Duration` as the third argument. Let’s try to perform a sliding window operation in our streaming application.  


```scala
val resultDF = initDF.select("Name", "Date", "Open", "High", "Low")
  .groupBy(window($"Date", "10 days", "5 days"), 
          $"Name", year($"Date").as("Year"))
  .agg(max("High").as("Max"))
  .orderBy($"window.start")
```

# Watermark

We can use `watermarking` to handle late data so that the system discards records automatically.

Now let’s add `withWatermark()` to our application and see how it works. We set watermark to `delayThreshold = 10 minutes` as well as `windowDuration = 5 minutes` using `groupBy()`. Watermark is set to `max event time seen so far — delayThreshold`.  

(수신한 데이터중 이벤트 시간이 가장 큰 값이 2022-12-27 10:30:00 이라면, 워터마크는 2022-12-27 10:20:00에 찍힌다. -> 10:20:00 이전에 발생한 데이터는 수신하더라도 처리하지 않겠다는 의미이다. -> 10:15:00 ~ 10:20:00 윈도우에서 출력되는 값은 더 이상 업데이트 하지 않겠다는 의미이다.)

```scala
val resultDF = eventDF
  .withWatermark("event_timestamp", "10 minutes")
  .groupBy(window(col("event_timestamp"), "5 minute"))
  .agg(sum("val").as("sum"))
```


# 참고

- [Apache Spark Structured Streaming — First Streaming Example (1 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-first-streaming-example-1-of-6-e8f3219748ef){:target="_blank"}
- [Spark 공식문서, Pyspark Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html){:target="_blank"}