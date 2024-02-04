---
layout: post
title:  'Kafka Series [Part10]: MySQL Connector'
description: 
date:   2022-04-11 15:01:35 +0300
image:  '/images/kafka_logo.png'
logo_image:  '/images/kafka_logo.png'
category: data_engineering
tag: kafka
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

```
./kafka/bin/zookeeper-server-start.sh [-daemon] ./kafka/config/zookeeper.properties
./kafka/bin/kafka-server-start.sh ./kafka/config/server.properties
./kafka/bin/connect-distributed.sh ./kafka/config/connect-distributed.properties
```

```sh

# 등록 가능한 커넥터 플러그인 목록
curl -X GET http://localhost:8083/connector-plugins
```

```sh
# connect-distributed.properties

# 이렇게 추가하면 FileStreamSinkConnector, FileStreamSourceConnector 커넥터 클래스가 추가됨 (아래와 같은 경로가 없음에도 불구하고.. 그래서 이해가 안됨)
plugin.path=/usr/local/share/java,/usr/local/share/kafka/plugins,/opt/connectors
```

```sh
# 현재 등록된 커넥터 목록
curl -X GET http://localhost:8083/connectors
```

```sh
# FileStreamSinkConnector 커넥터 등록 (토픽 메세지를 파일에 쓴다)
curl -X POST http://localhost:8083/connectors -H 'Content-Type: application/json' -d '{ "name": "file-sink-test", "config": { "topics": "test", "connector.class": "org.apache.kafka.connect.file.FileStreamSinkConnector", "tasks.max": 1, "file": "./connect-test.txt"}}'
```

```sh
# 커넥터 상태 조회
curl -X GET http://localhost:8083/connectors/file-sink-test/status
```


|요청 메서드|경로|설명|
|--------|---|---|
|GET| /connector-plugins | 사용 가능한 커넥터 플러그인 목록|
|GET| / | 커넥트 정보|
|GET| /connectors | 커넥터 목록|
|POST| /connectors | 커넥터 등록|
|GET| /connectors/<커넥터 이름> | 커넥터 정보 확인|
|GET| /connectors/<커넥터 이름>/config | 커넥터 설정값 확인|
|PUT| /connectors/<커넥터 이름>/config | 커넥터 설정값 변경|
|GET| /connectors/<커넥터 이름>/status | 커넥터 상태 확인|
|POST| /connectors/<커넥터 이름>/restart | 커넥터 재실행|
|DELETE| /connectors/<커넥터 이름> | 커넥터 삭제|