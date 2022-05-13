---
layout: post
title:  'Kafka Series [Part8]: MySQL Connector'
description: 
date:   2022-04-11 15:01:35 +0300
image:  '/images/kafka_logo.png'
logo_image:  '/images/kafka_logo.png'
categories:   DE
tags: Kafka
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

```
curl -X POST -H'Accept:application/json' -H'Content-Type:application/json' http://connect1:8083/connectors \
-w "\n" \
-d '{"name": "mysql-sink",
    "config": {
    "connector.class":"io.confluent.connect.jdbc.JdbcSinkConnector",
    "connection.user":"root",
    "connection.password":"passwd",
    "connection.url":"jdbc:mysql://root:passwd@mysql:3306",
    "mode":"upsert",
    "table.name.format":"taxi",
    "topics.regex": "jdbc-connector-user",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "true",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "true"
    }
}'
```

```
create table `taxi` (
    `VendorID` FLOAT,
    `tpep_pickup_datetime` CHAR(30),
    `tpep_dropoff_datetime` CHAR(30),
    `passenger_count` FLOAT,
    `trip_distance` FLOAT,
    `RatecodeID` FLOAT,
    `store_and_fwd_flag` CHAR(5),
    `PULocationID` INT(10),
    `DOLocationID` INT(10),
    `payment_type` FLOAT,
    `fare_amount` FLOAT,
    `extra` FLOAT,
    `mta_tax` FLOAT,
    `tip_amount` FLOAT,
    `tolls_amount` FLOAT,
    `improvement_surcharge` FLOAT,
    `total_amount` FLOAT,
    `congestion_surcharge` FLOAT
);
```

프로듀서와 컨슈머를 커넥터로 연결하고 나면 딱히 건드릴게 없다. 근데 생각해보면 프로듀서와 컨슈머 각각 설정할 configuration들이 굉장히 많다. 그러면 그런것들은 각각의 커넥터를 REST API로 등록할 때 바꿀 수 있는 것인가? [devidea: [Kafka] Connector-level producer/consumer configuration](https://devidea.tistory.com/96) 글을 보면 그런 것 같은데 아직 Confuent 쪽에서는 커넥터에 관해 이런 Configuration을 커스텀하도록 fully 지원하지는 않는 것 같기도 하다. 아마 예를 들어 MongoDB, MySQL 등 각각의 프로듀서/컨슈머별로 지원해야 하는 특성들을 자기들 생각에는 잘 설정해놓았기 때문에 사용자들이 직접 건드릴 필요가 없다고 생각해서 그런 건가?  

# 참고

- [JDBC Sink Connector Configuration Properties](https://docs.confluent.io/kafka-connect-jdbc/current/sink-connector/sink_config_options.html){:target="_blank"}
- [[Kafka] Sink Connector 생성](https://presentlee.tistory.com/6){:target="_blank"}
- [JDBC Connector (Source and Sink) for Confluent Platform](https://docs.confluent.io/5.5.1/connect/kafka-connect-jdbc/index.html#mysql-server){:target="_blank"}
- [[Kafka] Kafka Connect 개념/예제](https://cjw-awdsd.tistory.com/53){:target="_blank"}
- [[Kafka] Kafka Connect - JDBC Connector 예제](https://wecandev.tistory.com/110){:target="_blank"}
- [How to save a DataFrame to MySQL in PySpark](https://www.projectpro.io/recipes/save-dataframe-mysql-pyspark){:target="_blank"}
- [devidea: [Kafka] Connector-level producer/consumer configuration](https://devidea.tistory.com/96)