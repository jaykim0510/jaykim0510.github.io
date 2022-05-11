---
layout: post
title:  'Kafka Series [Part8]: Kafka Connector'
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

# 참고

- [JDBC Sink Connector Configuration Properties](https://docs.confluent.io/kafka-connect-jdbc/current/sink-connector/sink_config_options.html){:target="_blank"}
- [[Kafka] Sink Connector 생성](https://presentlee.tistory.com/6){:target="_blank"}
- [JDBC Connector (Source and Sink) for Confluent Platform](https://docs.confluent.io/5.5.1/connect/kafka-connect-jdbc/index.html#mysql-server){:target="_blank"}
- [[Kafka] Kafka Connect 개념/예제](https://cjw-awdsd.tistory.com/53){:target="_blank"}
- [[Kafka] Kafka Connect - JDBC Connector 예제](https://wecandev.tistory.com/110){:target="_blank"}