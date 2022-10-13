---
layout: post
title:  'Kafka Series [Part5]: 실습을 통한 카프카 명령어와 옵션'
description: 
date:   2022-01-27 15:01:35 +0300
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

# 카프카 CLI

## 토픽

```sh
# 토픽 리스트 확인
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

# 주키퍼 --zookeeper zookeeper:2181 명시해줘도 되지만 DEPRECATED 예정, --bootstrap-server 옵션 권장
```

```sh
# 토픽 생성
# bootstrap-server로 설정하면 --partition, --replication-factor 설정 안해도
# server.properties의 num.partitions=1, offsets.topic.replication.factor=1 디폴트값 가진다
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --create

# 주키퍼로 나타내면 --partition, --replication-factor 반드시 명시해야함
${KAFKA_HOME}/bin/kafka-topics.sh --zookeeper zookeeper:2181 --topic myKafkaTopic --create \
--partitions 1 --replication-factor 1
```

```sh
# 토픽 정보
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic myKafkaTopic1 --describe
```

```sh
# 토픽 삭제
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --delete
```

```sh
# 토픽 파티션 변경
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --alter --partitions 3
```

```sh
# 토픽별로 설정 변경
${KAFKA_HOME}/bin/kafka-configs.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --alter --add-config min.insync.replicas=2
```

```sh
# 설정값은 가장 넓은 범위로 브로커에 기본값을 설정할 수 있고, 
${KAFKA_HOME}/bin/kafka-server-start.sh ${KAFKA_HOME}/config/server.properties


# 각 토픽마다 오버라이딩하여 독립적으로 설정할 수 있다 (토픽 레벨의 설정값만)
# https://kafka.apache.org/081/documentation.html#topic-config

# 토픽 생성할 때,
${KAFKA_HOME}/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --create \
--config min.insync.replicas=2 --config min.cleanable.dirty.ratio=0.5

# 토픽 생성 후,
${KAFKA_HOME}/bin/kafka-configs.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --alter --add-config min.insync.replicas=2
```

```sh
# 브로커에 설정된 각종 기본값 조회
${KAFKA_HOME}/bin/kafka-configs.sh --bootstrap-server localhost:9092 --broker 1 --all --describe
```

## 프로듀서

```sh
# key없이 value만 전송
${KAFKA_HOME}/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic

# key와 value를 콤마(,)로 구분
${KAFKA_HOME}/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic \
--property "key.separator=,"

# key값을 이용해 파티셔닝 하겠지만 consumer에게는 value만 전달한다
${KAFKA_HOME}/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic \
--property "key.separator=," --property "parse.key=true"
```

## 컨슈머

```sh
${KAFKA_HOME}/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic

# 토픽에 쌓여있던 모든 데이터를 처음부터 읽어온다 (replay)
${KAFKA_HOME}/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --from-beginning

# 파티션 1번 데이터만 컨슘 (같은 key를 가지는 데이터는 같은 파티션으로 간다. 그래서 특정 파티션만 컨슘한다는 의미는 특정 키를 가지는 데이터만 컨슘하겠다는 의미이다)
${KAFKA_HOME}/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --from-beginning --partition 1
```

```sh
# 컨슈머에게 그룹을 할당해줄 수 있다
# 컨슈머 그룹간에는 같은 파티션을 할당받을 수 없다
${KAFKA_HOME}/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic myKafkaTopic --group groupA
```

# 프로듀서 주요 옵션

```
- acks: 프로듀서가 전송한 데이터가 브로커들에 정상적으로 저장되었는지 전송 성공 여부를 확인
    - 1(default): 리더 파티션을 가지는 브로커만 확인
    - 0: 브로커가 받았는지 전혀 신경쓰지 않는다 -> 가장 빠름, 불안전 -> GPS 데이터
    - -1(all): 리더와 팔로워 파티션을 가지는 모든 브로커에게 저장되었는지 확인 -> 가장 느림, 안전
- linger.ms: 배치를 전송하기 전까지 기다리는 최소 시간. 기본값은 0 -> 기본적으로 배치 전송 안함
- retries: 브로커로부터 에러를 받고 난 뒤 재전송을 시도하는 횟수. 기본값은 2147483647
- max.in.flight.requests.per.connection: 한 번에 요청하는 최대 커넥션 개수 기본값은 5 -> sender의 스레드 개수
- partitioner.class: 파티셔너 종류. 기본값은 org.apache.kafka.clients.producer.internals.DefaultPartitioner
- transactional.id: 트랜잭션 단위로 전송할지 여부. 기본값은 null
- min.insync.replicas: ISR 그룹에 복제되어야 하는 최소 파티션 개수
- enable.idempotence: 중복 저장 여부. 카프카 3.0.0 부터 기본값은 true
```

```
acks=-1, min.insync.replicas=2 조합이 성능도 얻으면서, 신뢰성도 얻는 가장 좋은 옵션
```

# 컨슈머 주요 옵션

```
- group.id: 컨슈머 그룹 아이디를 지정한다
- auto.offset.reset: 컨슈머 오프셋이 없을 때, 어느 오프셋부터 읽을지 선택하는 옵션. 기본값은 latest
- enable.auto.commit: 오토 커밋 여부. 기본값은 true
- auto.commit.interval.ms: 오토 커밋할 때 커밋의 시간 사이즈. 기본값은 5000(5초)
- heartbeat.interval.ms: 하트비트를 전송하는 간격. 기본값은 3000(3초)
- session.timeout.ms: 하트비트가 안와서 컨슈머가 죽었다 판단하기 까지 기다리는 시간. 기본값은 10000(10초)
```

# 처리량을 높이고 싶은 경우 (배치전송)

- linger.ms

# 지연율을 낮추고 싶은 경우

- linger.ms=0

# 순서 보장, 정확히 한 번 전송

- 순서를 보장하기 위해서는 partition 개수를 1개로 해야함 (파티션 1개 내에서는 순서보장 되지만 2개 이상에서는 순서 보장 안됨)
- 정확히 한 번 전송 (한 번 저장)을 위해서는 enable.idempotence=true 

# 토픽 내 데이터를 주기적으로 삭제

- `log.roll.ms`, `log.roll.hours`
- `log.retention.ms`, `log.retention.minutes`, or `log.retention.hours`

# 참고

- [intrepidgeeks, 카프카 기본 개념과 구조/프로듀서 옵션/컨슈머 옵션](https://intrepidgeeks.com/tutorial/kafka-basic-concept-and-structureproducer-optionsconsumer-options#7){:target="_blank"}