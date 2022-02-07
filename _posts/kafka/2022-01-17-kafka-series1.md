---
layout: post
title: 'Kafka Series [Part1]: What is Kafka'
description: Kafka는 이러한 데이터를 수집, 가공, 저장해주는 Event streaming platform입니다.
date: 2022-01-17 15:01:35 +0300
image:  '/images/kafka_12.png'
logo_image:  '/images/kafka_logo.png'
categories: DE
tags: Kafka
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Apache Kafka 소개  

> Apache Kafka is an open-source distributed publish-subscribe messaging platform that has been purpose-built to handle real-time streaming data for distributed streaming, pipelining, and replay of data feeds for fast, scalable operations.  

- 실시간 데이터를 스트리밍하는 분산환경의 publish-subscribe 메시지 플랫폼
- 복잡한 데이터 파이프라인 구조를 간단하게 해주며 파이프라인의 확장성을 높여준다

![](/images/kafka_12.png)

# Event

모든 기업에게 있어 데이터는 중요한 자산입니다. 특히나 요즘과 같이 데이터를 이용해 새로운 비즈니스를 창출하는 시대에는 그 가치가 더욱 큽니다. 이러한 데이터에는, 로그 메세지가 될 수도 있고, 사용자의 정보나 활동(배송, 결제, 송금 등) 그 밖에 모든 것들이 데이터가 될 수 있습니다.  

Kafka에서는 Event, Data, Record, Message를 모두 혼용해서 쓰고 있습니다. Event는 어떠한 행동이나, 사건도 모두 될 수 있습니다. 다음과 같은 것 들이 있습니다.  

- 웹 사이트에서 무언가를 클릭하는 것
- 센서의 온도/압력 데이터
- 청구서
- 배송 물건의 위치 정보

이렇게 세상에 있는 모든 정보를 실시간으로 저장하고, 처리하기 위해서는 높은 throughput, 낮은 latency가 요구됩니다. Kafka는 최대 600MB/s의 throughput과 200MB에 대해 5ms의 낮은 latency를 제공하고 있습니다.  

![](/images/kafka_3.png)
[(Benchmarking Kafka vs. Pulsar vs. RabbitMQ: Which is Fastest? 참고)](https://www.confluent.io/blog/kafka-fastest-messaging-system/){:target="_blank"}

지금까지는 Kafka가 높은 throughput과 낮은 latency로 엄청난 양의 데이터를 실시간으로 처리해주는 플랫폼이라고 배웠습니다. 이제 이러한 개념을 가지고 조금 더 앞으로 나가보겠습니다. 다음은 Kafka를 설명하는 좋은 문장이라고 생각되어 가져와 봤습니다. [(Apache Kafka Series [Part 1]: Introduction to Apache Kafka)](https://medium.com/codex/apache-kafka-series-part-1-introduction-to-apache-kafka-9b890832002){:target="_blank"}


> Publish/subscribe messaging is a pattern that is characterized by that a piece of data (message) of the sender (publisher) is not directing to certain receiver. Instead, the publisher classifies the message somehow, and that receiver (subscriber) subscribes to receive certain classes of messages. Pub/sub systems often have a broker, a central point where messages are published, to facilitate this.

Kafka를 이용하면 특정 Source에서 특정 Destination으로 데이터를 흘려보내는 것이 아니라, Publisher들이 실시간으로 언제든 데이터를 저장할 수 있으며, Subscriber는 언제든 저장된 데이터를 가지고 올 수 있습니다. 이러한 구조를 Pub/Sub 모델이라고 합니다. Pub/sub은 Messaging platform의 architecture를 훨씬 간단하게 만들고, 확장성을 용이하게 해줍니다.

![](/images/kafka_4.png)  

# 기업 사례: 잘란도(Zalando)

Kafka는 현재 Fortune 100대 기업 중 80% 이상이 사용하고 있는 데이터 플랫폼의 핵심 기술입니다. 해외의 링크드인, 트위터, 아마존, 넷플릭스, 우버를 포함해 국내에서는 대표적으로 카카오와 라인 등이 Kafka를 이용하고 있습니다. 제가 여기서 소개드릴 사례는 유럽의 대표 온라인 쇼핑몰 잘란도(Zalando)입니다. [(참고: Event First Development - Moving Towards Kafka Pipeline Applications)](https://engineering.zalando.com/posts/2017/10/event-first-development---moving-towards-kafka-pipeline-applications.html){:target="_blank"}  

잘란도는 회사의 규모가 점점 커지고 사업이 다각화되면서 내부적으로 데이터에 대한 문제가 점점 대두되었습니다. 처리해야 할 데이터 양의 증가, 복잡해져가는 데이터 파이프라인(데이터를 Produce하는 곳과 Consume하는 곳의 다양화), 데이터 수집 장애로 인한 신뢰도 하락과 같은 문제로 잘란도에서는 이벤트 드리븐 시스템을 도입하기로 결정하였습니다.  

> The aim here was the democratization of data for all potential users on the new platform.

![](/images/kafka_5.png)  
[(참고: https://realtimeapi.io/hub/event-driven-apis/)](https://realtimeapi.io/hub/event-driven-apis/){:target="_blank"}

결과적으로 잘란도는 Kafka를 도입함으로써 내부의 데이터 처리 파이프라인을 간소화하고, 확장을 용이하게 했으며, 스트림 데이터 처리량을 높일 수 있었습니다. 이러한 결과를 얻을 수 있었던 것은 Kafka에서 제공하는 몇 가지 핵심 기능 덕분이었습니다.  

# Kafka의 핵심 기능

## - 순서 보장
이벤트 처리 순서가 보장되면서, 엔티티 간의 유효성 검사나 동시 수정 같은 무수한 복잡성들이 제거됨으로써 구조 또한 매우 간결해졌습니다.  

## - 적어도 한 번 전송 방식
분산된 여러 네트워크 환경에서의 데이터 처리에서 중요한 것은 멱등성(itempotence)입니다. 멱등성이란 동일한 작업을 여러 번 수행하더라도 결과가 달라지지 않는 것을 의미합니다. 하지만 실시간 대용량 데이터 스트림에서 이를 완벽히 지켜내기란 쉽지 않습니다. 그래서 차선책으로 데이터가 중복은 되더라도, 손실은 일어나지 않도록 하는 방식이 '적어도 한 번' 전송 방식입니다. 만약 백엔드 시스템에서 중복 메세지만 처리해준다면 멱등성을 위한 시스템 복잡도를 기존에 비해 훨씬 낮출 수 있게 되고, 처리량 또한 더욱 높아집니다. 최근에는 '정확히 한 번' 전송 방식이 도입되어 카프카내에서 중복성을 제거하는 방법이 많이 사용되고 있습니다.  

## - Pull based approach
카프카에서 데이터를 소비하는 클라이언트는 풀 방식으로 동작합니다. 풀 방식의 장점은 자기 자신의 속도로 데이터를 처리할 수 있다는 점입니다. 푸시 방식은 브로커가 보내주는 속도에 의존해야 한다는 한계가 있습니다.  

## - 강력한 Partitioning
파티셔닝을 통해 확장성이 용이한 분산 처리 환경을 제공합니다.  

## - 비동기식 방식
데이터를 제공하는 Producer와 데이터를 소비하는 Consumer가 서로 각기 원하는 시점에 동작을 수행할 수 있습니다. (데이터를 보내줬다고 해서 반드시 바로 받을 필요가 없습니다) 

# 정리  
- Kafka는 Pub/sub모델의 실시간 데이터 처리 플랫폼이다.  
- 데이터를 분산처리하여 높은 throughput과 낮은 latency를 제공한다. 
- 심플한 데이터 처리 파이프라인과 용이한 확장성을 제공한다. 

다음 포스트에서는 Kafka의 주요 구성 요소에 대해 알아보겠습니다.  

# 참고자료
- [실전 카프카 개발부터 운영까지 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791189909345){:target="_blank"}
- [CodeX 블로그](https://medium.com/codex/apache-kafka-series-part-1-introduction-to-apache-kafka-9b890832002){:target="_blank"}