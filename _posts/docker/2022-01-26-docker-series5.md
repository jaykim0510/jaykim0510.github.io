---
layout: post
title:  'Docker Compose를 이용해 데이터 파이프라인 구축하기'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2022-01-26 18:01:35 +0300
image:  '/images/datapipeline_logo.png'
logo_image:  '/images/docker_logo.png'
categories: devops DE
tags: Docker Spark Kafka Elasticsearch
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

ES와 Spark 컨테이너 실행

```yml
version: '3.2'

services:
  elasticsearch:
    image: elasticsearch:7.16.2
    hostname: elasticsearch
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      ES_JAVA_OPTS: "-Xmx256m -Xms256m"
      ELASTIC_PASSWORD: changeme
      ELASTIC_USERNAME: elastic
      discovery.type: single-node
  
  spark:
    image: kimziont:spark
    hostname: spark
    ports:
      - "4040:4040"
    tty: true
```

Spark에서 ElasticSearch를 쓰려면 커넥터가 필요한 것 같다. Elastic에서 이를 위해 elasticsearch-hadoop를 제공하는데 우선 다운을 받아야 한다.  

```sh
wget https://artifacts.elastic.co/downloads/elasticsearch-hadoop/elasticsearch-hadoop-6.4.1.zip
unzip elasticsearch-hadoop-6.4.1.zip
mkdir -p /app/spark/jars/ext/elasticsearch-hadoop
mv elasticsearch-hadoop-6.4.1 /app/spark/jars/ext/elasticsearch-hadoop/6.4.1
```

설치가 완료되었으면 스파크를 실행할 때 설치한 경로를 실행 인자로 주면되는 것 같다.  

pyspark에서 사용할 때는 아래와 같다.  

```sh
# pyspark 실행 커맨드
pyspark --driver-class-path=/app/spark/jars/ext/elasticsearch-hadoop/6.4.1/dist/elasticsearch-hadoop-6.4.1.jar
```

```python
from pyspark.sql import SQLContext

sqlContext = SQLContext(sc)

df = sqlContext.read.format("org.elasticsearch.spark.sql").option("es.nodes","192.168.179.141:9200").option("es.nodes.discovery", "true").load("${INDEX}/${TYPE}")
df.registerTempTable("tab")

output = sqlContext.sql("SELECT distinct request FROM tab")
output.show()
```

spark-shell을 사용할 때는 아래와 같다.  

```
spark-shell --jars /app/spark/jars/ext/elasticsearch-hadoop/6.4.1/dist/elasticsearch-hadoop-6.4.1.jar
```



# 참고

- [Docker 공식문서](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"}  

- [Spark와 ElasticSearch 연동하기](https://oboki.net/workspace/python/pyspark-elasticsearch-index-에서-dataframe-생성하기/){:target="_blank"}  
- [elasticsearch-hadoop](https://github.com/elastic/elasticsearch-hadoop){:target="_blank"}
