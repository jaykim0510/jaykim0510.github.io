---
layout: post
title:  'Kafka Series [Part2]: Main elements of Kafka'
description: Kafka는 이러한 데이터를 수집, 가공, 저장해주는 Event streaming platform입니다.
date:   2021-01-04 15:01:35 +0300
image:  '/images/kafka_logo.png'
categories:   DE
tags: Kafka
---


# Kafka의 주요 구성요소
Kafka는 크게 3가지로 이루어 있습니다.  
- Producer: Kafka로 메시지를 보내는 모든 클라이언트
- Broker: Kafka 애플리케이션이 설치된 서버로 메시지를 분산 저장 및 관리
- Consumer: Kafka에서 메시지를 꺼내서 사용하는 모든 클라이언트

![](/images/kafka_7.png)
[(참고: cloudkarafka)](https://www.cloudkarafka.com/blog/part1-kafka-for-beginners-what-is-apache-kafka.html)  

## Topic, Partition, Segment
Kafka의 구성요소에 대해 알아보기 전에 메시지가 어떤 식으로 구성, 저장되는지에 대해 짚고 넘어가려고 합니다.
- Topic: 메시지가 저장될 카테고리 이름 (논리적인 저장소)
- Partition: 병렬 처리를 위해 Topic을 여러 개로 나눈 것 (Server 디스크에 저장된 디렉토리)
- Segment: 메시지가 실제로 저장되는 파일  

![](/images/kafka_8.png)

![](/images/kafka_9.png)

![](/images/kafka_6.png)  
[(참고: cloudkarafka)](https://www.cloudkarafka.com/blog/part1-kafka-for-beginners-what-is-apache-kafka.html)  

위와 같이 하나의 브로커에는 여러 개의 Topic을 가질 수 있으며, Topic은 여러 개의 Partition으로 나누어 저장되어 있습니다. 이렇게 Partition들에 메시지들이 저장되는 방법은 프로듀서에 있는 `Partitioner`로 메시지를 미리 나눠서 배치 전송할 수도 있고, Broker에서 메시지를 받을 때마다 메시지에 있는 key값으로 Partition에 분배할 수도 있습니다. 이 때 고려할 수 있는 사항은 다음과 같은 것들이 있습니다.  
- 메시지를 프로듀서에서 Partition으로 분배할 것인가 브로커에서 분배할 것인가
- 몇 개의 Partition으로 나눌 것인가
- Segment파일은 언제마다 새로 파일을 만들 것인가(Roll strategy) 

## Producer
프로듀서는 카프카의 토픽으로 메시지를 전송하는 역할을 합니다. 그렇다면 프로듀서에서 메시지를 전송할 때 고려해야 할 것에는 어떤 것들이 있을까요?  
- 메시지를 어떤 형태로 전송할 것인가
- 메시지를 파티션에 골고루 분배
- 메시지 중복 전송을 허용할 것인가
- 브로커에 제대로 전달이 되었는가
- 배치 전송

## Broker
브로커는 Topic내의 Partition들을 분산 저장, 관리해줍니다. 하나의 브로커에는 Topic의 모든 데이터를 가지고 있지 않고, 일부분(Partition)만 가지게 됩니다. 보통 Broker를 최소 3대 이상으로 구성해 Kafka cluster를 형성합니다.

## Consumer
컨슈머는 브로커에 저장되어 있는 메시지를 가져오는 역할을 합니다. 그러나 단순히 가져오는 역할만 하지는 않고, 조금 더 자세히 들여다 보면 컨슈머 그룹을 만들고, 그룹 내 모든 컨슈머가 파티션을 골고루 가져오도록 하는 리밸런싱과 같은 역할도 합니다.  

![](/images/kafka_10.png)

컨슈머 그룹 내에 있는 컨슈머들은 서로 협력하여 메시지를 처리합니다. 이 때 Partition은 같은 그룹에 있는 컨슈머 중 한 개의 컨슈머에 의해서만 소비됩니다. (같은 그룹에 있는 여러 컨슈머가 한 개의 Partition을 소비하면 메시지 중복 문제를 해결하는데 또 비용이 든다) 컨슈머에서 고려해야 할 사항에는 다음과 같은 것들이 있습니다.  
- 파티션 할당 전략
- 컨슈머 그룹 내에 장애가 발생한 컨슈머가 생기면 어떻게 처리할 것인가

# 마치며
Kafka를 구성하는 요소에는 크게 Producer, Broker, Consumer가 있었고, 이 밖에도 Broker에 관한 정보를 저장하고 관리하는 Zookeeper가 있습니다. 각 요소에 대해서는 조금 더 공부를 해서 나중에 더 정리를 하도록 하겠습니다.  

위의 글을 보면 각 요소별로 고려해야할 것들이 많습니다. 보통 이런 것들은 Kafka를 구성할 때 옵션으로 값을 줘서 설정하게 됩니다. 옵션에 대해서는 나중에 따로 포스트를 정리할 계획입니다.  