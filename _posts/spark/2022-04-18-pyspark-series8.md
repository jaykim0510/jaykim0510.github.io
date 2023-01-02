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

```py
result_df = df.select("Name", "Date", "Open", "Close") \
              .filter(F.col("Close") - F.col("Open") > 0)
-------------------------------------------
Batch: 0
-------------------------------------------
+----+----------+-----+-----+
|Name|      Date| Open|Close|
+----+----------+-----+-----+
|AAPL|2006-01-03|10.34|10.68|
|AAPL|2006-01-06|10.75| 10.9|
|AAPL|2006-01-10|10.89|11.55|
|AAPL|2006-01-11|11.98|11.99|
|AAPL|2006-01-13|12.14|12.23|
|AAPL|2006-01-23|10.87| 11.1|
|AAPL|2006-01-30|10.17|10.71|
|AAPL|2006-02-01|10.71|10.77|
|AAPL|2006-02-08| 9.78| 9.83|
|AAPL|2006-02-10| 9.31| 9.62|
|AAPL|2006-02-14|  9.3| 9.66|
|AAPL|2006-02-15| 9.59| 9.89|
|AAPL|2006-02-16| 9.99|10.08|
|AAPL|2006-02-22| 9.86|10.19|
|AAPL|2006-03-01| 9.83| 9.87|
|AAPL|2006-03-02| 9.86| 9.94|
|AAPL|2006-03-07| 9.39| 9.47|
|AAPL|2006-03-13| 9.29| 9.38|
|AAPL|2006-03-14|  9.4| 9.62|
|AAPL|2006-03-29| 8.45|  8.9|
+----+----------+-----+-----+
```

## GroupBy

```py
result_df = df.select("Name","Date", "Open", "High", "Low") \
  .groupBy(F.col("Name"), F.year(F.col("Date")).alias("YEAR")) \
  .agg(F.max("High").alias("Highest")).withColumn("timestamp", F.current_date().cast("string"))
-------------------------------------------
Batch: 0
-------------------------------------------
+----+----+-------+----------+
|Name|YEAR|Highest| timestamp|
+----+----+-------+----------+
|AAPL|2017|  177.2|2023-01-02|
|AAPL|2014| 119.75|2023-01-02|
|AAPL|2006|  13.31|2023-01-02|
|AAPL|2008|  28.61|2023-01-02|
|AAPL|2012| 100.72|2023-01-02|
|AAPL|2009|  30.56|2023-01-02|
|AAPL|2011|  60.96|2023-01-02|
|AAPL|2016| 118.69|2023-01-02|
|AAPL|2015| 134.54|2023-01-02|
|AAPL|2013|  82.16|2023-01-02|
|AAPL|2010|  46.67|2023-01-02|
|AAPL|2007|  28.99|2023-01-02|
+----+----+-------+----------+
```

## Join

### Stream-Batch Join

With stream-batch joins, we can join a batch DataFrame with a streaming DataFrame. Let’s discuss with an example.  

```py
company_df = spark.read.format("csv").option("path", "hdfs://hdfs-name-node:8020/static/company.csv").option("header", True).load()
company_df.show()
-------
+-----+---------------+
| Name|FullCompanyName|
+-----+---------------+
| AAPL|          Apple|
| AMZN|         Amazon|
|GOOGL|         Google|
+-----+---------------+
```

```py
# inner, left_outer, right_outer
join_df = result_df.join(company_df, "Name", "inner")

join_df.writeStream.format("console") \
        .outputMode("append") \
        .start().awaitTermination()
------------------------------------------------------------
-------------------------------------------
Batch: 0
-------------------------------------------
+----+----------+-----+-----+---------------+
|Name|      Date| Open|Close|FullCompanyName|
+----+----------+-----+-----+---------------+
|AAPL|2006-01-03|10.34|10.68|          Apple|
|AAPL|2006-01-06|10.75| 10.9|          Apple|
|AAPL|2006-01-10|10.89|11.55|          Apple|
|AAPL|2006-01-11|11.98|11.99|          Apple|
|AAPL|2006-01-13|12.14|12.23|          Apple|
|AAPL|2006-01-23|10.87| 11.1|          Apple|
|AAPL|2006-01-30|10.17|10.71|          Apple|
|AAPL|2006-02-01|10.71|10.77|          Apple|
|AAPL|2006-02-08| 9.78| 9.83|          Apple|
|AAPL|2006-02-10| 9.31| 9.62|          Apple|
|AAPL|2006-02-14|  9.3| 9.66|          Apple|
|AAPL|2006-02-15| 9.59| 9.89|          Apple|
|AAPL|2006-02-16| 9.99|10.08|          Apple|
|AAPL|2006-02-22| 9.86|10.19|          Apple|
|AAPL|2006-03-01| 9.83| 9.87|          Apple|
|AAPL|2006-03-02| 9.86| 9.94|          Apple|
|AAPL|2006-03-07| 9.39| 9.47|          Apple|
|AAPL|2006-03-13| 9.29| 9.38|          Apple|
|AAPL|2006-03-14|  9.4| 9.62|          Apple|
|AAPL|2006-03-29| 8.45|  8.9|          Apple|
+----+----------+-----+-----+---------------+

# inner join 이기 때문에 MSFT.csv 데이터를 넣었을때는 안나온다
-------------------------------------------
Batch: 1
-------------------------------------------
+----+----+----+-----+---------------+
|Name|Date|Open|Close|FullCompanyName|
+----+----+----+-----+---------------+
+----+----+----+-----+---------------+

-------------------------------------------
Batch: 2
-------------------------------------------
+-----+----------+------+------+---------------+
| Name|      Date|  Open| Close|FullCompanyName|
+-----+----------+------+------+---------------+
|GOOGL|2006-01-03|211.47|217.83|         Google|
|GOOGL|2006-01-04|222.17|222.84|         Google|
|GOOGL|2006-01-05|223.22|225.85|         Google|
|GOOGL|2006-01-06|228.66|233.06|         Google|
|GOOGL|2006-01-09|233.44|233.68|         Google|
|GOOGL|2006-01-10|232.44|235.11|         Google|
|GOOGL|2006-01-11|235.87|236.05|         Google|
|GOOGL|2006-01-13|232.39|233.36|         Google|
|GOOGL|2006-01-17|231.76|233.79|         Google|
|GOOGL|2006-01-23|203.89|213.96|         Google|
|GOOGL|2006-01-24|218.23|221.74|         Google|
|GOOGL|2006-01-31| 215.5|216.55|         Google|
|GOOGL|2006-02-01|194.71|201.09|         Google|
|GOOGL|2006-02-08|184.42|184.72|         Google|
|GOOGL|2006-02-10|181.16|181.49|         Google|
|GOOGL|2006-02-15|170.81|171.36|         Google|
|GOOGL|2006-02-16|173.01|183.41|         Google|
|GOOGL|2006-02-21| 183.4|183.48|         Google|
|GOOGL|2006-02-23|182.99|189.22|         Google|
|GOOGL|2006-02-24|188.84|188.89|         Google|
+-----+----------+------+------+---------------+
```

### Stream-Stream Join

`left_outer` and `right_outer` joins are conditionally supported with watermark but full_outer join is not supported.

```py
df = spark.readStream.format("csv") \
                    .option("path", "hdfs://hdfs-name-node:8020/data") \
                    .option("maxFilesPerTrigger", 1) \
                    .option("header", True) \
                    .schema(schema).load()

stream_df_high = df.select("Name","Date", "High")
stream_df_low = df.select("Name","Date", "Low")

join_df = stream_df_high.join(stream_df_low, ["Name", "Date"])

join_df.writeStream.format("console") \
        .outputMode("append") \
        .start().awaitTermination()
-------------------------------------------
Batch: 0
-------------------------------------------
+-----+----------+-------+-------+
| Name|      Date|   High|    Low|
+-----+----------+-------+-------+
|GOOGL|2006-03-08|  180.2| 175.45|
|GOOGL|2006-08-29| 191.35| 188.79|
|GOOGL|2007-12-17| 348.06| 332.17|
|GOOGL|2008-09-03| 237.38| 230.02|
|GOOGL|2009-10-28| 275.27| 269.39|
|GOOGL|2010-06-29| 232.51| 225.79|
|GOOGL|2011-02-09| 310.03| 306.48|
|GOOGL|2011-02-11| 312.81| 306.81|
|GOOGL|2011-04-14| 290.01| 286.34|
|GOOGL|2014-02-12| 595.59| 591.28|
|GOOGL|2014-09-10| 593.72| 587.14|
|GOOGL|2014-11-06|  556.8| 550.58|
|GOOGL|2014-11-25|  552.5| 546.91|
|GOOGL|2015-01-09|  508.6| 498.65|
|GOOGL|2015-03-12| 561.84| 555.53|
|GOOGL|2015-11-12|  765.8| 755.86|
|GOOGL|2016-08-12| 807.19| 803.64|
|GOOGL|2016-08-23|  801.0| 795.99|
|GOOGL|2017-10-13|1014.76|1007.06|
|GOOGL|2006-02-24| 190.23| 186.93|
+-----+----------+-------+-------+

-------------------------------------------
Batch: 1
-------------------------------------------
+----+----------+-----+-----+
|Name|      Date| High|  Low|
+----+----------+-----+-----+
|MSFT|2007-02-23|29.28|28.89|
|MSFT|2007-04-12|28.62|28.04|
|MSFT|2008-02-04|30.72|30.11|
|MSFT|2008-09-26|27.56|26.14|
|MSFT|2008-10-30|23.88|22.39|
|MSFT|2009-04-22|19.19| 18.7|
|MSFT|2009-04-24| 21.2| 19.5|
|MSFT|2010-02-08|28.08|27.57|
|MSFT|2010-08-26|24.19|23.79|
|MSFT|2010-12-31|27.92|27.63|
|MSFT|2011-09-22|25.65| 24.6|
|MSFT|2012-12-10|26.97|26.52|
|MSFT|2013-06-10|35.65|35.14|
|MSFT|2013-09-18| 33.4|32.83|
|MSFT|2014-11-04|47.73|47.25|
|MSFT|2006-10-05|28.11|27.78|
|MSFT|2009-03-04| 16.4|15.89|
|MSFT|2009-08-31|24.85|24.29|
|MSFT|2009-09-23|26.25|25.64|
|MSFT|2009-12-02|29.99|29.65|
+----+----------+-----+-----+
```


## UDF

```py
df = spark.readStream.format("csv") \
                    .option("path", "hdfs://hdfs-name-node:8020/data") \
                    .option("maxFilesPerTrigger", 1) \
                    .option("header", True) \
                    .schema(schema).load()

def up_down(op, cl):
    if op < cl:
        return "Up"
    elif op > cl:
        return "Down"
    return "Same"

UDF_up_down = F.udf(up_down)

result_df = df.withColumn("Up/Down", UDF_up_down(F.col("Open"), F.col("Close")))

result_df.writeStream.format("console") \
        .outputMode("append") \
        .start().awaitTermination()

-------------------------------------------
Batch: 0
-------------------------------------------
+----------+-----+-----+-----+-----+---------+----+-------+
|      Date| Open| High|  Low|Close|   Volume|Name|Up/Down|
+----------+-----+-----+-----+-----+---------+----+-------+
|2006-01-03|26.25| 27.0| 26.1|26.84| 79974418|MSFT|     Up|
|2006-01-04|26.77|27.08|26.77|26.97| 57975661|MSFT|     Up|
|2006-01-05|26.96|27.13|26.91|26.99| 48247610|MSFT|     Up|
|2006-01-06|26.89| 27.0|26.49|26.91|100969092|MSFT|     Up|
|2006-01-09|26.93|27.07|26.76|26.86| 55627836|MSFT|   Down|
|2006-01-10|26.65|27.02|26.59| 27.0| 64924946|MSFT|     Up|
|2006-01-11|27.01|27.39| 26.9|27.29| 70123544|MSFT|     Up|
|2006-01-12|27.25|27.26|26.97|27.14| 45994725|MSFT|   Down|
|2006-01-13|27.03|27.25|27.01|27.19| 41449046|MSFT|     Up|
|2006-01-17| 26.9|27.19| 26.9|26.99| 58574807|MSFT|     Up|
|2006-01-18|26.74|26.98| 26.7|26.83| 52495587|MSFT|     Up|
|2006-01-19|26.87|27.24|26.85|27.02| 60382450|MSFT|     Up|
|2006-01-20|27.01|27.01|26.26|26.41| 79228490|MSFT|   Down|
|2006-01-23|26.41|26.53| 26.3|26.35| 47971611|MSFT|   Down|
|2006-01-24|26.34|26.45|26.22|26.28| 63061743|MSFT|   Down|
|2006-01-25|26.41|26.57|26.23| 26.4| 59072711|MSFT|   Down|
|2006-01-26|26.56|26.72|26.31| 26.5| 69531321|MSFT|   Down|
|2006-01-27|27.23|27.95|27.19|27.79|134525193|MSFT|     Up|
|2006-01-30|27.82|28.18|27.78| 28.0|103999604|MSFT|     Up|
|2006-01-31|27.91|28.38|27.87|28.15| 94844406|MSFT|     Up|
+----------+-----+-----+-----+-----+---------+----+-------+
```


## Window

Window operations are very similar to `groupBy` operations. In `groupBy`, aggregation is based on the specified group or key while in `window` operations, aggregation is based on event windows. Spark supports 2 types of windows Tumbling window and Sliding window.

Let’s discuss each one of them in detail. Take an example of numbers from 1–10 and we will calculate `SUM` using different window operations.  

### Tumbling window

Tumbling windows are non-overlapping which means each data point will be part of only one window.


![](/images/spark_stream_4.png)


Here the size of the window is 2 and we have 5 non-overlapping windows along with the sum of the elements in each window. Also, we can verify that none of the elements are overlapping between windows.  

Now let us define one in our streaming application. We can use a window function and specify the `DateTime` column and window duration say `2 minutes` or `30 seconds` or `1 hour` or `5 days` etc.  


```py
result_df = df.select("Name", "Date", "Open", "High", "Low") \
              .groupBy(F.window(F.col("Date"), "10 days"), F.col("Name")) \
              .agg(F.max("High").alias("Max")).orderBy(F.col("window"))

result_df.writeStream.format("console") \
        .outputMode("complete") \
        .option("truncate", False) \
        .start().awaitTermination()

-------------------------------------------
Batch: 0
-------------------------------------------
+------------------------------------------+----+-----+
|window                                    |Name|Max  |
+------------------------------------------+----+-----+
|{2006-01-02 00:00:00, 2006-01-12 00:00:00}|MSFT|27.39|
|{2006-01-12 00:00:00, 2006-01-22 00:00:00}|MSFT|27.26|
|{2006-01-22 00:00:00, 2006-02-01 00:00:00}|MSFT|28.38|
|{2006-02-01 00:00:00, 2006-02-11 00:00:00}|MSFT|28.07|
|{2006-02-11 00:00:00, 2006-02-21 00:00:00}|MSFT|26.93|
|{2006-02-21 00:00:00, 2006-03-03 00:00:00}|MSFT|27.3 |
|{2006-03-03 00:00:00, 2006-03-13 00:00:00}|MSFT|27.5 |
|{2006-03-13 00:00:00, 2006-03-23 00:00:00}|MSFT|28.22|
|{2006-03-23 00:00:00, 2006-04-02 00:00:00}|MSFT|27.54|
|{2006-04-02 00:00:00, 2006-04-12 00:00:00}|MSFT|27.94|
|{2006-04-12 00:00:00, 2006-04-22 00:00:00}|MSFT|27.5 |
|{2006-04-22 00:00:00, 2006-05-02 00:00:00}|MSFT|27.63|
|{2006-05-02 00:00:00, 2006-05-12 00:00:00}|MSFT|25.0 |
|{2006-05-12 00:00:00, 2006-05-22 00:00:00}|MSFT|24.0 |
|{2006-05-22 00:00:00, 2006-06-01 00:00:00}|MSFT|23.92|
|{2006-06-01 00:00:00, 2006-06-11 00:00:00}|MSFT|22.99|
|{2006-06-11 00:00:00, 2006-06-21 00:00:00}|MSFT|22.76|
|{2006-06-21 00:00:00, 2006-07-01 00:00:00}|MSFT|23.65|
|{2006-07-01 00:00:00, 2006-07-11 00:00:00}|MSFT|23.72|
|{2006-07-11 00:00:00, 2006-07-21 00:00:00}|MSFT|23.46|
+------------------------------------------+----+-----+
```

### Sliding window 

As its name suggests, this window will slide instead of tumbling on the data. We can specify the level of sliding needed. These are overlapping windows. Let’s first try to understand with a simple example of numbers from 1–10.  


![](/images/spark_stream_5.png)


Here we have defined the window size as 3 and slide interval as 2. As we can see in the snapshot above, these windows overlap. For example, the number 3 is present in both windows 1 and 2.  

To define a sliding window, along with `DateTime` and `Window Size` in the window function, we specify `slide Duration` as the third argument. Let’s try to perform a sliding window operation in our streaming application.  


```py
result_df = df.select("Name", "Date", "Open", "High", "Low") \
              .groupBy(F.window(F.col("Date"), "10 days", "5 days"), F.col("Name")) \
              .agg(F.max("High").alias("Max")).orderBy(F.col("window"))

result_df.writeStream.format("console") \
        .outputMode("complete") \
        .option("truncate", False) \
        .start().awaitTermination()

-------------------------------------------
Batch: 0
-------------------------------------------
+------------------------------------------+----+-----+
|window                                    |Name|Max  |
+------------------------------------------+----+-----+
|{2005-12-28 00:00:00, 2006-01-07 00:00:00}|MSFT|27.13|
|{2006-01-02 00:00:00, 2006-01-12 00:00:00}|MSFT|27.39|
|{2006-01-07 00:00:00, 2006-01-17 00:00:00}|MSFT|27.39|
|{2006-01-12 00:00:00, 2006-01-22 00:00:00}|MSFT|27.26|
|{2006-01-17 00:00:00, 2006-01-27 00:00:00}|MSFT|27.24|
|{2006-01-22 00:00:00, 2006-02-01 00:00:00}|MSFT|28.38|
|{2006-01-27 00:00:00, 2006-02-06 00:00:00}|MSFT|28.38|
|{2006-02-01 00:00:00, 2006-02-11 00:00:00}|MSFT|28.07|
|{2006-02-06 00:00:00, 2006-02-16 00:00:00}|MSFT|27.54|
|{2006-02-11 00:00:00, 2006-02-21 00:00:00}|MSFT|26.93|
|{2006-02-16 00:00:00, 2006-02-26 00:00:00}|MSFT|26.9 |
|{2006-02-21 00:00:00, 2006-03-03 00:00:00}|MSFT|27.3 |
|{2006-02-26 00:00:00, 2006-03-08 00:00:00}|MSFT|27.3 |
|{2006-03-03 00:00:00, 2006-03-13 00:00:00}|MSFT|27.5 |
|{2006-03-08 00:00:00, 2006-03-18 00:00:00}|MSFT|27.66|
|{2006-03-13 00:00:00, 2006-03-23 00:00:00}|MSFT|28.22|
|{2006-03-18 00:00:00, 2006-03-28 00:00:00}|MSFT|28.22|
|{2006-03-23 00:00:00, 2006-04-02 00:00:00}|MSFT|27.54|
|{2006-03-28 00:00:00, 2006-04-07 00:00:00}|MSFT|27.94|
|{2006-04-02 00:00:00, 2006-04-12 00:00:00}|MSFT|27.94|
+------------------------------------------+----+-----+
```

# Watermark

We can use `watermarking` to handle late data so that the system discards records automatically.

Now let’s add `withWatermark()` to our application and see how it works. We set watermark to `delayThreshold = 10 minutes` as well as `windowDuration = 5 minutes` using `groupBy()`. Watermark is set to `max event time seen so far — delayThreshold`.  

(수신한 데이터중 이벤트 시간이 가장 큰 값이 2022-12-27 10:30:00 이라면, 워터마크는 2022-12-27 10:20:00에 찍힌다. -> 10:20:00 이전에 발생한 데이터는 수신하더라도 처리하지 않겠다는 의미이다. -> 10:15:00 ~ 10:20:00 윈도우에서 출력되는 값은 더 이상 업데이트 하지 않겠다는 의미이다.)

```sh
nc -lk 9999

2023-01-01 10:06:00#2
2023–01–01 10:13:00#5
2022–12–31 10:06:00#1
2023–01–01 10:08:00#8
```

```py
df = spark.readStream.format("socket") \
                    .option("host", "127.0.0.1") \
                    .option("port", "9999") \
                    .load()

event_df = df.select(F.split(F.col("value"), "#").alias("data")) \
  .withColumn("event_timestamp", F.element_at(F.col("data"), 1).cast("timestamp")) \
  .withColumn("val", F.element_at(F.col("data"), 2).cast("int")) \
  .drop("data")

result_df = event_df.withWatermark("event_timestamp", "10 minutes") \
                    .groupBy(F.window(F.col("event_timestamp"), "5 minutes")) \
                    .agg(F.sum("val").alias("sum"))

result_df.writeStream.format("console") \
        .outputMode("complete") \
        .option("truncate", False) \
        .start().awaitTermination()
```


# 참고

- [Neeraj Bhadani, Apache Spark Structured Streaming — Operations (5 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-operations-5-of-6-40d907866fa7){:target="_blank"}
- [Spark 공식문서, Pyspark Structured Streaming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html){:target="_blank"}