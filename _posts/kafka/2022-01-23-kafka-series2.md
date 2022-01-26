---
layout: post
title:  'Kafka Series [Part2]: Main elements of Kafka'
description: 프로듀서는 메세지의 전송, 브로커는 저장, 컨슈머는 읽어가는 역할을 담당합니다.
date:   2022-01-23 15:01:35 +0300
image:  '/images/kafka_logo.png'
categories:   DE
tags: Kafka
---


# Kafka의 주요 구성요소
Kafka는 크게 3가지로 이루어 있습니다.  
- Producer: Kafka로 메시지를 보내는 모든 클라이언트
- Broker: 메시지를 분산 저장 및 관리하는 Kafka 애플리케이션이 설치된 서버
- Consumer: Kafka에서 메시지를 꺼내서 사용하는 모든 클라이언트

![](/images/kafka_7.png)
[(참고: cloudkarafka)](https://www.cloudkarafka.com/blog/part1-kafka-for-beginners-what-is-apache-kafka.html){:target="_blank"}  

## Topic, Partition, Segment
Kafka의 구성요소에 대해 알아보기 전에 메시지가 어떤 식으로 구성, 저장되는지에 대해 짚고 넘어가려고 합니다.
- Topic: 메시지가 저장될 카테고리 이름 (논리적인 저장소)
- Partition: 병렬 처리를 위해 Topic을 여러 개로 나눈 것 (Server 디스크에 저장된 디렉토리)
- Segment: 메시지가 실제로 저장되는 파일  

![](/images/kafka_8.png)

![](/images/kafka_9.png)

![](/images/kafka_6.png)  
[(참고: cloudkarafka)](https://www.cloudkarafka.com/blog/part1-kafka-for-beginners-what-is-apache-kafka.html){:target="_blank"}  


## Producer
프로듀서는 카프카의 토픽으로 메시지를 전송하는 역할을 합니다. 프로듀서가 동작하는 방식은 다음과 같습니다.  

![](/images/kafka_13.webp)  
[(Dzone 블로그 참고)](https://dzone.com/articles/take-a-deep-dive-into-kafka-producer-api){:target="_blank"}  

프로듀서가 카프카의 브로커로 데이터를 전송할 때에는 `ProducerRecord`라고 하는 형태로 전송되며, `Topic`과 `Value`는 필수값이며, `Partition`과 `Key`는 선택값입니다. 프로듀서는 카프카로 레코드를 전송할 때, 카프카의 특정 토픽으로 메세지를 전송합니다. 전송 과정은
- 프로듀서에서 send() 메소드 호출
- Serializer는 JSON, String, Avro 등의 object를 bytes로 변환
- ProducerRecord에 target Partition이 있으면 해당 파티션으로 레코드 전달
- Partition이 지정되지 않았을 때, Key값이 지정되었다면 Partitioner가 Key값을 바탕으로 해당 파티션에 전달
- Partition, Key값이 모두 없으면 라운드 로빈(Round-Robbin)방식으로 메세지를 파티션에 할당 
- 파티션에 세그먼트 파일 형태로 저장된 레코드는 바로 전송할 수도 있고, 프로듀서의 버퍼 메모리 영역에 잠시 저장해두고 배치로 전송할 수도 있음  

## Broker
브로커는 Topic내의 Partition들을 분산 저장, 관리해줍니다. 하나의 브로커에는 Topic의 모든 데이터를 가지고 있지 않고, 일부분(Partition)만 가지게 됩니다. 보통 Broker를 최소 3대 이상으로 구성해 Kafka cluster를 형성합니다.

## Consumer
컨슈머는 브로커에 저장되어 있는 메시지를 가져오는 역할을 합니다. 그러나 단순히 가져오는 역할만 하지는 않고, 조금 더 자세히 들여다 보면 컨슈머 그룹을 만들고, 그룹 내 모든 컨슈머가 파티션을 골고루 가져오도록 하는 리밸런싱과 같은 역할도 합니다. 컨슈머 수는 파티션 수보다 작거나 같도록 하는 것이 바람직합니다. 

![](/images/kafka_10.png)

컨슈머 그룹 내에 있는 컨슈머들은 서로 협력하여 메시지를 처리합니다. 이 때 Partition은 같은 그룹에 있는 컨슈머 중 한 개의 컨슈머에 의해서만 소비됩니다. (같은 그룹에 있는 여러 컨슈머가 한 개의 Partition을 소비하면 메시지 중복 문제를 해결하는데 또 비용이 든다) 컨슈머에서 고려해야 할 사항에는 다음과 같은 것들이 있습니다.  
- 파티션 할당 전략
- 프로듀서가 브로커에 메세지를 저장하는 속도와 컨슈머가 읽어가는 속도가 비슷한가
- 컨슈머의 개수가 파티션보다 많지는 않은가
- 컨슈머 그룹 내에 장애가 발생한 컨슈머가 생기면 어떻게 처리할 것인가

# 마치며
이번 포스트에서는 카프카에서 중요한 개념들에 대해 간단히 살펴보았습니다. 프로듀서는 메세지의 전송, 브로커는 저장, 컨슈머는 읽어가는 역할을 담당합니다. 또한 카프카에서 주고 받는 데이터는 토픽, 파티션, 세그먼트라는 단위로 나뉘어 처리, 저장됩니다.  

카프카는 데이터 파이프라인의 중심에 위치하는 허브 역할을 합니다. 그렇기 때문에 카프카는 `장애 발생에 대처 가능한 안정적인 서비스를 제공`해 줄 수 있어야 하고, 각 서비스들의 원활한 이용을 위한 `높은 처리량`, `데이터 유실, 중복을 해결함으로써 각 서비스에서의 이용을 원활`하게 해주는 것이 좋습니다.  

다음 포스트에서는 이러한 역할을 어떤 방식으로 제공해주었는지 살펴보며 그 과정에서 필요한 개념들을 하나씩 배워가도록 하겠습니다.  

# 참고자료
- [실전 카프카 개발부터 운영까지 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791189909345){:target="_blank"}
- [Dzone 블로그](https://dzone.com/articles/take-a-deep-dive-into-kafka-producer-api){:target="_blank"}
- [CodeX 블로그](https://medium.com/codex/apache-kafka-series-part-1-introduction-to-apache-kafka-9b890832002){:target="_blank"}