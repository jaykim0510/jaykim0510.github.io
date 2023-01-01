---
layout: post
title:  'Apache Pyspark Series [Part5]: PySpark Structured Streaming (1)'
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


# Overview

Working with streaming data is a little different from working with batch data. With streaming data, we will never have complete data for analysis, as data is continuously coming in. **Apache Spark provides a streaming API to analyze streaming data in pretty much the same way we work with batch data.** Apache Spark Structured Streaming is built on top of the Spark-SQL API to leverage its optimization. Spark Streaming is a processing engine to process data in real-time from sources and output data to external storage systems.  

Spark Streaming has 3 major components: input sources, streaming engine, and sink. Input sources generate data like Kafka, Flume, HDFS/S3, etc. Spark Streaming engine processes incoming data from various input sources. Sinks store processed data from Spark Streaming engine like HDFS, relational databases, or NoSQL datastores.  

Let’s conceptualise Spark Streaming data as an unbounded table where new data will always be appended at the end of the table.


![](/images/spark_stream_1.png)

Spark will process data in micro-batches which can be defined by triggers. For example, let's say we define a trigger as `1 second`, this means Spark will create micro-batches every second and process them accordingly.  


## Output modes

After processing the streaming data, Spark needs to store it somewhere on persistent storage. Spark uses various output modes to store the streaming data.  

- **Append Mode**: In this mode, Spark will output only newly processed rows since the last trigger.
- **Update Mode**: In this mode, Spark will output only updated rows since the last trigger. If we are not using aggregation on streaming data (meaning previous records can’t be updated) then it will behave similarly to append mode.
- **Complete Mode**: In this mode, Spark will output all the rows it has processed so far.

## Example

```py
from pyspark.sql import SparkSession
import pyspark.sql.functions as F

spark = SparkSession.builder.appName("test") \
                    .master("spark://spark-master:7077") \
                    .getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

df = spark.readStream.format("rate").option("rowsPerSecond", 3).load()

assert df.isStreaming == True

result_df = df.withColumn("result", F.col("value") + F.lit(1))

result_df.writeStream.format("console").outputMode("append").start().awaitTermination()
------------------------------------------------------------------------------------------------
Batch: 1
-------------------------------------------
+--------------------+-----+------+
|           timestamp|value|result|
+--------------------+-----+------+
|2023-01-01 11:35:...|    0|     1|
|2023-01-01 11:35:...|    2|     3|
|2023-01-01 11:35:...|    1|     2|
+--------------------+-----+------+

-------------------------------------------
Batch: 2
-------------------------------------------
+--------------------+-----+------+
|           timestamp|value|result|
+--------------------+-----+------+
|2023-01-01 11:35:...|    3|     4|
|2023-01-01 11:35:...|    5|     6|
|2023-01-01 11:35:...|    4|     5|
+--------------------+-----+------+
```

# Input Sources

Spark Streaming ingests data from different types of input sources for processing in real-time.  

- **Rate** (for Testing): It will automatically generate data including 2 columns timestamp and value . This is generally used for testing purposes. 
- **Socket** (for Testing): This data source will listen to the specified socket and ingest any data into Spark Streaming. It is also used only for testing purposes.
- **File**: This will listen to a particular directory as streaming data. It supports file formats like CSV, JSON, ORC, and Parquet. You can find the latest supported file format list here.
- **Kafka**: This will read data from Apache Kafka and is compatible with Kafka broker versions 0.10.0 or higher


## Socket

```
apt update
apt install netcat

nc -lk 9999
```

![](/images/spark_stream_2.png)

```py
# Socket Source
df = spark.readStream.format("socket").option("host", "127.0.0.1").option("port", 9999).load()

assert df.isStreaming == True

df.writeStream.format("console").outputMode("append").start().awaitTermination()
------------------------------------------------------------------------------------------------------------------
-------------------------------------------
Batch: 0
-------------------------------------------
+-----+
|value|
+-----+
+-----+

-------------------------------------------
Batch: 1
-------------------------------------------
+------+
| value|
+------+
|London|
+------+

-------------------------------------------
Batch: 2
-------------------------------------------
+-----+
|value|
+-----+
|Paris|
+-----+

-------------------------------------------
Batch: 3
-------------------------------------------
+-----+
|value|
+-----+
|Seoul|
+-----+
```


## File

With file input source, our application will wait for available data in the specified directory. We will use some of the stock data available here. For example, Apple stock data present in this file: [AAPL_2006–01–01_to_2018–01–01.csv](https://github.com/szrlee/Stock-Time-Series-Analysis/blob/master/data/AAPL_2006-01-01_to_2018-01-01.csv). We will take the data for a few years like 2015, 2016, and 2017 and manually save it to a different file like AAPL_2015.csv, AAPL_2016.csvand AAPL_2017.csv respectively. Similarly, we will create the sample data for Google, Amazon, and Microsoft as well. We will keep all the CSV files locally under data/stocks folder. Also, create another folder data/stream which we will use to simulate the streaming data.

```json
// a.json
{"message": "Paris"}
```

```json
// b.json
{"message": "Seoul"}
```

```json
// c.json
{"message": "London"}
```

```py
# File Source

ACCESS_KEY = "<AWS ACCEESS KEY>"
SECRET_KEY = "<AWS SECRET KEY>"
HADOOP_VERSION = "3.2.4"
spark = SparkSession.builder.appName("test") \
                    .master("spark://spark-master:7077") \
                    .config("spark.jars.packages", f"org.apache.hadoop:hadoop-aws:{HADOOP_VERSION},org.apache.hadoop:hadoop-client:{HADOOP_VERSION}") \
                    .config("spark.jars.excludes", "com.google.guava:guava") \
                    .config("spark.hadoop.fs.s3.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem") \
                    .config('spark.hadoop.fs.s3a.aws.credentials.provider', 'org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider') \
                    .config("spark.hadoop.fs.s3a.access.key", ACCESS_KEY) \
                    .config("spark.hadoop.fs.s3a.secret.key", SECRET_KEY) \
                    .getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

schema = StructType([StructField("message", StringType(), nullable=False)])

df = spark.readStream.format("json").option("path", f"s3a://jay-ml-models/test/").option("truncate", False).schema(schema).load()
-----------------------------------------------------------------------------------------------------------------------------
-------------------------------------------
Batch: 0
-------------------------------------------
+-------+
|message|
+-------+
|  Paris|
|  Seoul|
+-------+

-------------------------------------------
Batch: 2
-------------------------------------------
+-------+
|message|
+-------+
| London|
+-------+
```

## Kafka



```py
# Kafka Source

spark = SparkSession.builder.appName("test") \
        .master('spark://spark-master:7077') \
        .config('spark.jars', '/opt/spark/jars/kafka-clients-3.3.1.jar,/opt/spark/jars/spark-sql-kafka-0-10_2.13-3.2.2.jar,/opt/spark/jars/spark-token-provider-kafka-0-10_2.13-3.2.2.jar,/opt/spark/jars/commons-pool2-2.11.1.jar') \
        .getOrCreate()

result_df = df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")

result_df.writeStream \
          .outputMode("append") \
          .format("console") \
          .start().awaitTermination()
--------------------------------------------------------------------------------
-------------------------------------------
Batch: 1
-------------------------------------------
+----+-----+
| key|value|
+----+-----+
|null|paris|
+----+-----+

-------------------------------------------
Batch: 2
-------------------------------------------
+----+-----+
| key|value|
+----+-----+
|null|seoul|
+----+-----+

-------------------------------------------
Batch: 3
-------------------------------------------
+----+------+
| key| value|
+----+------+
|null|london|
+----+------+

```






# 참고

- [Apache Spark Structured Streaming with Pyspark](https://medium.com/analytics-vidhya/apache-spark-structured-streaming-with-pyspark-b4a054a7947d){:target="_blank"}
- [pyspark, Structured Streaming](https://spark.apache.org/docs/latest/api/python/reference/pyspark.ss/index.html){:target="_blank"}
- [Spark Streaming – Different Output modes explained](https://sparkbyexamples.com/spark/spark-streaming-outputmode/){:target="_blank"}
- [Apache Spark Structured Streaming — First Streaming Example (1 of 6)](https://medium.com/expedia-group-tech/apache-spark-structured-streaming-first-streaming-example-1-of-6-e8f3219748ef){:target="_blank"}
- [](){:target="_blank"}