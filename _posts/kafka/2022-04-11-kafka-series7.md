---
layout: post
title:  'Kafka Series [Part7]: Kafka Connector'
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

# Why Connector?

커넥터 없이도 프로듀서 컨슈머 사용 가능    

하지만 커넥터를 이용하면 카프카를 사용하면서 발생할 수 있는 장애에 대한 복구를 비롯한 필요한 기능들을 따로 개발할 필요없이 사용가능  

![](/images/kafka_56.png)

# Kafka Connect
- Kafka Connect는 다른 데이터 시스템을 Kafka와 통합하는 과정을 표준화한 프레임워크
- 통합을 위한 Connector 개발, 배포, 관리를 단순화

## Kafka Connect 구성요소
- **Connector**: Task를 관리하여 데이터 스트리밍을 조정하는 jar파일
- **Task**: 데이터 시스템간의 전송 방법을 구현한 구현체
- **Worker**: Connector와 Task를 실행하는 프로세스
- **Converter**: 데이터 포맷을 변환하는데 사용하는 구성요소
- **Trasform**: 데이터를 변환하는데 사용하는 구성요소

![](/images/kafka_55.png)

## Connect? Connector?
커넥트는 커넥터를 실행시키기 위한 환경(프레임워크)을 제공해줌. 커넥트 위에서 커넥터 설치하고 커넥터(jar파일) 실행하면 됨

커넥트 이미지로 인스턴스 띄우고 거기서 각종 커넥터 다운로드 받아서 커넥터를 몽고db, mysql, s3같은데 RESTapi로 등록  

## Standalone과 Distributed Workers

Worker 프로세스를 한 개만 띄우는 Standalone 모드와 여러개 실행시키는 Distributed 모드가 있다.  

보통 확장성과 내결함성을 이유로 Distributed 모드를 많이 사용한다.  

![](/images/kafka_58.png)

# Debezium

Debezium은 변경 데이터 캡처를 위한 오픈 소스 분산 플랫폼이다. 

Debezium 에서 변경된 데이터 캡쳐를 위해 mysql의 경우 binlog, postgresql의 경우 replica slot(logical)을 이용하여 데이터베이스에 커밋하는 데이터를 감시하여 Kakfa, DB, ElasticSearch 등 미들웨어에 이벤트를 전달한다

# 참고

- [Confluent 공식문서: Kafka Connect Tutorial on Docker](https://docs.confluent.io/5.0.0/installation/docker/docs/installation/connect-avro-jdbc.html){:target="_blank"}
- [Connect 도커 이미지](https://hub.docker.com/r/confluentinc/cp-kafka-connect){:target="_blank"}
- [Confluent 공식문서: MongoDB 커넥터](https://www.confluent.io/hub/mongodb/kafka-connect-mongodb){:target="_blank"}
- [MongoDB 공식문서: MongoDB 커넥터를 위한 Configuration](https://www.mongodb.com/docs/kafka-connector/current/){:target="_blank"}
- [kudl: CDC - debezium 설정](https://kudl.tistory.com/entry/CDC-debezium-설정){:target="_blank"}