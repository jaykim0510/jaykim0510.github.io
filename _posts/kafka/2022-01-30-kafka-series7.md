---
layout: post
title:  'Kafka Series [Part7]: Kafka Listeners – Explained[번역]'
description: 카프카 클라이언트가 카프카에 연결되기 위해서는 advertised.listeners를 external IP 주소로 설정해야 합니다.
date:   2022-01-30 15:01:35 +0300
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

[원문: Confluent블로그](https://www.confluent.io/blog/kafka-listeners-explained/){:target="_blank"}

[읽어보면 좋은 포스트](https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/?utm_source=github&utm_medium=rmoff&utm_campaign=ty.community.con.rmoff-listeners&utm_term=rmoff-devx){:target="_blank"}

# Kafka Listeners

카프카 클라이언트가 카프카에 연결되기 위해서는 `advertised.listeners`(또는 도커 이미지를 사용할 경우 `KAFKA_ADVERTISED_LISTENERS`)를 **external IP 주소**로 설정해야 합니다.  

![](/images/kafka_36.png)  

아파치 카프카는 분산 시스템입니다. 데이터는 리더 파티션으로부터 쓰고 읽어지며 리더 파티션은 어떤 브로커에도 있을 수 있습니다. 그래서 클라이언트가 카프카에 연결되기 위해서는 해당 리더 파티션을 가지고 있는 브로커가 누구인지에 대한 메타데이터를 요청합니다. 이 메타데이터에는 리더 파티션을 가지는 브로커의 엔드포인트 정보를 포함하고 있으며 클라이언트는 이 정보를 이용해 카프카와 연결될 것입니다.  

만약 카프카가 도커와 같은 가상머신이 아닌 bare metal 위에서 동작한다면 이 엔드포인트는 그저 `hostname`이나 `localhost` 정도가 될 것입니다. 하지만 조금 더 복잡한 네트워크 환경 또는 멀티 노드 환경으로 오게 되면 조금 더 주의가 필요하게 됩니다.  

초기에 브로커가 연결되면 실제로 리더 파티션을 가지는 브로커의 host와 IP의 정보를 돌려줍니다. 이러한 과정은 단일 노드 환경에서도 마찬가지입니다. 

```sh
KAFKA_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://localhost:9092
KAFKA_ADVERTISED_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://localhost:9092
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_BOB:PLAINTEXT,LISTENER_FRED:PLAINTEXT
KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_BOB
```  

`server.properties`  

- **KAFKA_LISTENERS**: 카프카가 리스닝하기 위해 노출하는 host/IP와 port
- **KAFKA_ADVERTISED_LISTENERS**: 클라이언트에게 알려주는 리스너의 host/IP와 port 리스트
- **KAFKA_LISTENER_SECURITY_PROTOCOL_MAP**: 각 리스너들이 사용하는 security protocol 
- **KAFKA_INTER_BROKER_LISTENER_NAME**: 브로커들 간의 통신을 위해 사용하는 리스너

브로커에 연결되면 연결된 리스너가 반환됩니다. `kafkacat`은 이러한 정보를 알아보는 유용한 툴입니다. `-L`을 이용하면 연결된 리스너에 관한 메타데이터를 얻을 수 있습니다.  

```sh
# 9092포트로 연결시, localhost:9092 리스너가 반환
$ kafkacat -b kafka0:9092
           -L
Metadata for all topics (from broker -1: kafka0:9092/bootstrap):
1 brokers:
  broker 0 at localhost:9092
```  

```sh
# 29092포트로 연결시, kafka0:29092 리스너가 반환
$ kafkacat -b kafka0:29092
           -L
Metadata for all topics (from broker 0: kafka0:29092/0):
1 brokers:
  broker 0 at kafka0:29092
```

#  Why can I connect to the broker, but the client still fails?

초기 브로커 연결에 성공했다고 하더라도, 브로커가 반환하는 메타데이터 안에 있는 주소로 여전히 클라이언트가 접근하지 못하는 경우가 있습니다.  

- AWS EC2 인스턴스에 브로커를 만들어 로컬 머신에서 EC2에 있는 브로커로 메세지를 보내보려고 합니다. external hostname은 `ec2-54-191-84-122.us-west-2.compute.amazonaws.com`입니다. 로컬 머신과 EC2가 포트포워딩을 통해 연결되었는지 확인해보겠습니다.  

- 우리의 로컬 머신은 `ec2-54-191-84-122.us-west-2.compute.amazonaws.com`을 `54.191.84.122`으로 성공적으로 리졸브(resolve) 합니다.  

```
$ kafkacat -b ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092 -L
Metadata for all topics (from broker -1: ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092/bootstrap):
1 brokers:
  broker 0 at ip-172-31-18-160.us-west-2.compute.internal:9092
```

- hostname이 `ip-172-31-18-160.us-west-2.compute.internal`인 리스너를 반환합니다. 

- 하지만 인터넷을 통해 `ip-172-31-18-160.us-west-2.compute.internal`은 not resolvable해서 클라이언트는 브로커에 메세지 전송을 실패합니다.  

```
$ echo "test"|kafka-console-producer --broker-list ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092 --topic test
>>[2018-07-30 15:08:41,932] ERROR Error when sending message to topic test with key: null, value: 4 bytes with error: (org.apache.kafka.clients.producer.internals.ErrorLoggingCallback)
org.apache.kafka.common.errors.TimeoutException: Expiring 1 record(s) for test-0: 1547 ms has passed since batch creation plus linger time
```

- 브로커가 설치된 서버의 클라이언트로는 문제없이 동작한다.   

```
$ echo "foo"|kafka-console-producer --broker-list ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092 --topic test
>>
$ kafka-console-consumer --bootstrap-server ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092 --topic test --from-beginning
foo
```
이러한 일이 발생하는 이유는 9092포트로 연결하는 리스너가 내부 리스너이기 때문이라고 한다. 그래서 브로커가 설치된 서버의 내부에서만 resolvable한 hostname인 `ip-172-31-18-160.us-west-2.compute.internal`을 리턴한다.  

# HOW TO: Connecting to Kafka on Docker  

![](/images/kafka_36.png)  

도커에서 동작하기 위해서는 카프카의 두 개의 listener를 지정해야 한다.  

- **도커 네트워크 내에서의 통신**: 이것은 브로커간의 통신 또는 도커 안의 다른 컴포넌트와의 통신을 의미한다. 이를 위해서는 도커 네트워크 안에 있는 컨테이너의 호스트네임을 사용해야 한다. 각각의 브로커는 컨테이너의 호스트네임을 통해 서로 통신하게 될 것이다. 


- **도커가 아닌 네트워크로부터의 트래픽**: 이것은 도커를 실행하는 서버에서 로컬로 동작하는 클라이언트가 될 수 있다. 이러한 경우 도커를 실행하는 서버(`localhost`)에서 컨테이너의 포트에 연결할 수 있다. 아래의 도커 컴포즈 스니펫을 한 번 보자.  

```yaml
[…]

kafka0:
    image: "confluentinc/cp-enterprise-kafka:5.2.1"
    ports:
      - '9092:9092'
      - '29094:29094'
    depends_on:
      - zookeeper
    environment:
      […]
      # For more details see See https://rmoff.net/2018/08/02/kafka-listeners-explained/
      KAFKA_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://kafka0:9092,LISTENER_ALICE://kafka0:29094
      KAFKA_ADVERTISED_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://localhost:9092,LISTENER_ALICE://never-gonna-give-you-up:29094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_BOB:PLAINTEXT,LISTENER_FRED:PLAINTEXT,LISTENER_ALICE:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_BOB
[…]
```  

- 도커 네트워크 내에 클라이언트가 있다면 클라이언트는 `호스트네임 kafka0`, `29092 포트`를 이용한 `BOB` 리스너를 통해 브로커와 통신할 것입니다. 각각의 컨테이너(클라이언트, 브로커)는 kafka0를 도커 내부 네트워크를 통해 resolve합니다.  

- 도커를 실행하는 호스트 머신(VM)에 있는 외부 클라이언트의 경우, `호스트 네임 localhost`, `9092 포트`를 이용한 `FRED` 리스너를 통해 브로커와 통신한다.  

- 도커를 실행하는 호스트 머신(VM) 밖에 있는 외부 클라이언트는 위의 리스너를 통해 통신할 수 없다. 왜냐하면 `kafka0`도 `localhost`도 모두 resolvable하지 않기 때문이다.  

# HOW TO: Connecting to Kafka on IaaS/Cloud

도커와의 차이점은, 도커에서 외부의 연결은 단순히 localhost에서 이루어진 반면, 클라우드 호스트 기반의 카프카는 클라이언트가 localhost에 존재하지 않는다는 것이다. 

더 복잡한 것은 도커 네트워크가 호스트의 네트워크와는 크게 분리되어 있지만 IaaS에서는 외부 호스트 이름이 내부적으로 확인 가능한 경우가 많기 때문에 이러한 문제가 실제로 발생할 경우 호스트 이름이 잘못될 수 있다. 

브로커에 연결할 외부 주소가 브로커에게 로컬로 확인할 수 있는지 여부에 따라 두 가지 방법이 있다.  

## Option 1: External address is resolvable locally

![](/images/kafka_37.png)  

EC2 인스턴스의 IP 주소는 기본적으로 External IP. 만약 local에서 resolvable하다면, 로컬 내의 클라이언트, 외부 클라이언트 모두 이를 통해 통신 가능. 다만 외부 클라이언트는 밑의 설정만 추가해주면 된다.  

```
advertised.listeners=PLAINTEXT://ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092
```

## Option 2: External address is NOT resolvable locally

![](/images/kafka_38.png)  

만약 로컬 내에서 resolvable하지 않다면, 두 가지 리스너가 필요하다. 

- VPC 내에서의 통신을 위해 local에서 resolvable한 Internal IP를 통해 내부에서 리슨한다
- VPC 밖, 예를 들어 나의 노트북에서 접속하려는 경우 인스턴스의 External IP가 필요하다  

```
listeners=INTERNAL://0.0.0.0:19092,EXTERNAL://0.0.0.0:9092
listener.security.protocol.map=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
advertised.listeners=INTERNAL://ip-172-31-18-160.us-west-2.compute.internal:19092,EXTERNAL://ec2-54-191-84-122.us-west-2.compute.amazonaws.com:9092
inter.broker.listener.name=INTERNAL
```

# Exploring listeners with Docker  

- Listener BOB (port 29092) for **internal traffic on the Docker network**
- Listener FRED (port 9092) for **traffic from the Docker host machine (localhost)**
- Listener ALICE (port 29094) for **traffic from outside**, reaching the Docker host on the DNS name never-gonna-give-you-up

```yaml
---
version: '2'
services:
  zookeeper:
    image: "confluentinc/cp-zookeeper:5.2.1"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
  kafka0:
    image: "confluentinc/cp-enterprise-kafka:5.2.1"
    ports:
      - '9092:9092'
      - '29094:29094'
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 0
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://kafka0:9092,LISTENER_ALICE://kafka0:29094
      KAFKA_ADVERTISED_LISTENERS: LISTENER_BOB://kafka0:29092,LISTENER_FRED://localhost:9092,LISTENER_ALICE://never-gonna-give-you-up:29094
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_BOB:PLAINTEXT,LISTENER_FRED:PLAINTEXT,LISTENER_ALICE:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_BOB
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 100

  kafkacat:
    image: confluentinc/cp-kafkacat
    command: sleep infinity
```