---
layout: post
title:  'ElasticSearch Series [Part1]: What is ElasticSearch'
description: Kafka는 이러한 데이터를 수집, 가공, 저장해주는 Event streaming platform입니다.
date:   2021-01-03 15:01:35 +0300
image:  '/images/elasticsearch_logo.png'
tags:   Data_Engineering
---


# Apache Kafka란 무엇인가
모든 기업에게 있어 데이터는 중요합니다. 특히나 요즘과 같이 데이터를 이용해 새로운 비즈니스를 창출하는 시대에는 더더욱 중요합니다. 이러한 데이터는, 로그 메세지가 될 수도 있고, 사용자의 정보나 활동 그 밖에 모든 것들이 데이터가 될 수 있습니다. Kafka는 이러한 데이터를 수집, 가공, 저장해주는 Event streaming platform입니다. 그럼 지금부터 저희는 Event는 무엇을 말하고, Kafka가 다른 platform(RabbitMQ, Pulsar)에 비해 어떤 점에서 더 뛰어난지 한 번 알아보겠습니다. 

![](/images/kafka_2.png)

# Event

Kafka에서는 Event, Data, Record, Message를 모두 혼용해서 쓰고 있습니다. Event는 어떠한 행동이나, 사건도 모두 될 수 있습니다. 다음과 같은 것 들이 있습니다.  

- 웹 사이트에서 무언가를 클릭하는 것
- 센서의 온도/압력 데이터
- 청구서
- 배송 물건의 위치 정보

이렇게 세상에 있는 모든 정보를 실시간으로 저장하고, 처리하기 위해서는 높은 throughput, 낮은 latency가 요구됩니다. Kafka는 최대 600MB/s의 throughput과 200MB에 대해 5ms의 낮은 latency를 제공하고 있습니다.  

![](/images/kafka_3.png)
[Benchmarking Kafka vs. Pulsar vs. RabbitMQ: Which is Fastest?](https://www.confluent.io/blog/kafka-fastest-messaging-system/)

지금까지는 Kafka가 높은 throughput과 낮은 latency로 엄청난 양의 데이터를 실시간으로 처리해주는 플랫폼이라고 배웠습니다. 이제 이러한 개념을 가지고 조금 더 앞으로 나가보겠습니다. 다음은 Kafka를 설명하는 좋은 문장이라고 생각되어 가져와 봤습니다. [(Apache Kafka Series [Part 1]: Introduction to Apache Kafka)](https://medium.com/codex/apache-kafka-series-part-1-introduction-to-apache-kafka-9b890832002)

> Apache Kafka is an open-source distributed publish-subscribe messaging platform that has been purpose-built to handle real-time streaming data for distributed streaming, pipelining, and replay of data feeds for fast, scalable operations.  

- Distributed publish-subscribe messaging platform
- Handle real-time streaming data

> Publish/subscribe messaging is a pattern that is characterized by that a piece of data (message) of the sender (publisher) is not directing to certain receiver. Instead, the publisher classifies the message somehow, and that receiver (subscriber) subscribes to receive certain classes of messages. Pub/sub systems often have a broker, a central point where messages are published, to facilitate this.

Kafka를 이용하면 특정 Source에서 특정 Destination으로 데이터를 흘려보내는 것이 아니라, Publisher들이 실시간으로 언제든 데이터를 저장할 수 있으며, Subscriber는 어떠한 데이터라도 가져올 수 있습니다. 이러한 구조를 Pub/Sub 모델이라고 합니다.  

![](/images/kafka_4.png)  

# 정리  
- Kafka는 Pub/sub모델의 실시간 데이터 처리 플랫폼이다.  
- 데이터를 분산처리하여 높은 throughput과 낮은 latency를 제공한다.  

다음 포스트에서는 Kafka의 주요 구성 요소에 대해 알아보겠습니다.  