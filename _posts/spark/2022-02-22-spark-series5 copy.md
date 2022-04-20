---
layout: post
title:  'Apache Spark Series [Part6]: 몽고DB에서 스파크(pyspark)로 데이터 읽어오기(feat.Docker)'
description: 
date:   2022-02-22 15:01:35 +0300
image:  '/images/spark_16.jpg'
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

# 도커 컴포즈로 컨테이너 띄우기

```yml
version: '3.2'
services:
    spark-client:
      image: kimziont/spark:1.0
      hostname: spark-client
      depends_on:
        - spark-master
      command: 
        - bash
        - -c
        - |
          apt -y install python-is-python3
          sleep infinity

    spark-master:
      image: kimziont/spark-master:1.0
      hostname: spark-master
      ports:
        - "4041:8080"
      command: 
        - bash
        - -c
        - |
          ./spark/sbin/start-master.sh &
          sleep infinity

    spark-worker1:
      image: kimziont/spark-worker:1.0
      hostname: worker1
      depends_on:
        - spark-master
      ports:
        - "4042:8081"
      command: 
        - bash
        - -c
        - |
          ./spark/sbin/start-worker.sh spark://spark-master:7077 &
          sleep infinity

    spark-worker2:
      image: kimziont/spark-worker:1.0
      hostname: worker2
      depends_on:
        - spark-master
      ports:
        - "4043:8081"
      command: 
        - bash
        - -c
        - |
          ./spark/sbin/start-worker.sh spark://spark-master:7077 &
          sleep infinity
    
    mongodb:
      image: mongo:latest
      hostname: mongodb
      ports:
        - "27017:27017"
      environment:
        MONGO_INITDB_ROOT_USERNAME: root
        MONGO_INITDB_ROOT_PASSWORD: root
      tty: true
```

- 마스터의 UI는 디폴트로 8080포트로 보여준다, 워커는 8081포트이다
- 워커들은 마스터의 7077포트로 연결될 수 있다

```sh
docker compose up
```

# spark-client 컨테이너에서 pyspark 셸을 실행

```sh
./bin/pyspark --master spark://spark-master:7077 --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1
```

# pyspark 셸에서 몽고DB와 연결

```
from pyspark.sql import SparkSession

spark = SparkSession.builder.master('spark://spark-master:7077').config('spark.mongodb.input.uri', 'mongodb://root:root@mongodb:27017/quickstart.topicData/spark.times?authSource=admin').getOrCreate()

df = spark.read.format("mongo").option("uri", "mongodb://root:root@mongodb:27017/quickstart.topicData/spark.times?authSource=admin").load()

df.show()
```

# 이슈

- 현재 `df.show()` 했을 때 몽고DB에 저장된 데이터 안보이는 이슈



# 참고

- [Error connecting from pyspark to mongodb with password](https://stackoverflow.com/questions/58305720/error-connecting-from-pyspark-to-mongodb-with-password)