---
layout: post
title:  'Kafka Series [Part8]: Client Won’t Connect to Apache Kafka Cluster in Docker/AWS/My Laptop.[번역]'
description: 클라이언트와 카프카간의 메세지를 주고받기 위해서는 두 가지의 연결이 반드시 선행되어야 한다. 
date:   2022-01-31 15:01:35 +0300
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

[원문: Confluent블로그](https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/?utm_source=github&utm_medium=rmoff&utm_campaign=ty.community.con.rmoff-listeners&utm_term=rmoff-devx){:target="_blank"}

# Connection Client To Broker

클라이언트와 카프카간의 메세지를 주고받기 위해서는 두 가지의 연결이 반드시 선행되어야 한다. 

1. 브로커와의 초기 연결. 연결이 되면 브로커는 클라이언트에게 연결 가능(resolvable and accessible from client machine)한 브로커의 엔드포인트 제공(`advertised.listeners`)
2. 클라이언트와 연결 가능한 브로커와의 연결

초기 연결은 `producer = KafkaProducer(bootstrap_servers=["localhost:9092"])` 와 같이 bootstrap_servers 중 하나의 서버와 초기 연결된다. 그러면 연결된 서버는 클라이언트에게 `advertised.listeners`를 노출해 연결되도록 한다.  

예시로 클라이언트와 카프카가 서로 다른 머신에 있는 경우를 보자.  

연결이 성공되는 경우는 다음과 같다.  

![](/images/kafka_39.png)  

연결이 실패되는 경우는 다음과 같다.  

![](/images/kafka_40.png)  

이러한 경우에는 `advertised.listeners`를 `localhost:9092`로 설정하면 안된다.  

## Scenario 0: Client and Kafka running on the same local machine

![](/images/kafka_41.png)  

```
bootstrap_servers = 'localhost:9092'
advertised_listeners = 'localhost:9092'  
```
잘 동작한다.  

클라이언트에 전달되는 메타데이터는 192.168.10.83이다. 이 값은 로컬 머신의 IP 주소이다.  

## Scenario 1: Client and Kafka running on the different machines  

카프카 브로커가 다른 머신에서 동작하는 경우를 살펴보자. 예를 들면 AWS, GCP와 같은 클라우드에서 생성한 머신  

![](/images/kafka_42.png)  

여기 예제에서 클라이언트는 나의 노트북이고 카프카 브로커가 동작하고 있는 머신의 LAN은 `asgard03`이라고 해보자.  

초기 연결은 성공한다. 하지만 메타데이터에서 돌려주는 노출된 리스너는 `localhost`이다. 하지만 클라이언트의 `localhost`에는 카프카 브로커가 없으므로 연결은 실패한다.  
![](/images/kafka_43.png)  

이 문제를 해결하기 위해서는 `server.properties`에서 `advertised.listeners` 값을 수정해 **클라이언트에서 접근 가능한 올바른 호스트네임과 포트를 제공**해주어야 한다.  

```sh
# advertised.listeners 수정 전
advertised.listeners=PLAINTEXT://localhost:9092
listeners=PLAINTEXT://0.0.0.0:9092
```

```sh
# advertised.listeners 수정 후
advertised.listeners=PLAINTEXT://asgard03.moffatt.me:9092
listeners=PLAINTEXT://0.0.0.0:9092
```  

![](/images/kafka_44.png)  

## Scenario 2: Kafka and client running in Docker  

도커를 이용할 때 기억해야할 점은 도커는 컨테이너를 통해 그들만의 작은 세상을 만든다는 것이다. 컨테이너는 자체적인 호스트네임, 네트워크 주소, 파일 시스템을 가지고 있다. 따라서 컨테이너를 기준으로 localhost는 더이상 나의 노트북이 아니다. 도커 컨테이너에서 localhost는 컨테이너 자기 자신이다. 

![](/images/kafka_46.png)  

여기서는 카프카와 클라이언트를 모두 각각 도커 호스트 위에 컨테이너로 만들어 본다.  

클라이언트를 컨테이너로 만들어주는 Dockerfile이다.  

```yaml
FROM python:3

# We'll add netcat cos it's a really useful
# network troubleshooting tool
RUN apt-get update
RUN apt-get install -y netcat

# Install the Confluent Kafka python library
RUN pip install confluent_kafka

# Add our script
ADD python_kafka_test_client.py /
ENTRYPOINT [ "python", "/python_kafka_test_client.py"]
```

위의 메니페스트를 이용해 클라이언트 이미지를 만든다.  

```
docker build -t python_kafka_test_client .
```

카프카 브로커를 생성하자.  

```sh
docker network create rmoff_kafka
docker run --network=rmoff_kafka --rm --detach --name zookeeper -e ZOOKEEPER_CLIENT_PORT=2181 confluentinc/cp-zookeeper:5.5.0
docker run --network=rmoff_kafka --rm --detach --name broker 
           -p 9092:9092
           -e KAFKA_BROKER_ID=1 
           -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 
           -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 
           -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
           confluentinc/cp-kafka:5.5.0

```

쥬키퍼와 카프카 브로커가 컨테이너로 돌아가고 있다.

```
$ docker ps
IMAGE                              STATUS              PORTS                          NAMES
confluentinc/cp-kafka:5.5.0        Up 32 seconds       0.0.0.0:9092->9092/tcp         broker
confluentinc/cp-zookeeper:5.5.0    Up 33 seconds       2181/tcp, 2888/tcp, 3888/tcp   zookeeper
```

위에서 우리는 우리만의 도커 네트워크를 만들었고 이제 이 네트워크를 통해 클라이언트와 브로커가 통신하도록 해보자

```
$ docker run --network=rmoff_kafka --rm --name python_kafka_test_client
        --tty python_kafka_test_client broker:9092
```

결과를 보면 초기 연결은 성공하지만, 메타데이터로 `localhost`를 돌려주기 때문에 프로듀서와 클라이언트의 연결은 실패된다.   

![](/images/kafka_47.png)  


이를 해결하려면 advertise.listeners의 호스트네임을 컨테이너 이름으로 바꿔줘야 한다.  

```sh
# 수정 전
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
```

```sh
# 수정 후 
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://broker:9092
```  

![](/images/kafka_48.png)  

최종적으로 브로커 설정을 다음과 같이 고칠 수 있다.  

```sh
docker stop broker
docker run --network=rmoff_kafka --rm --detach --name broker 
           -p 9092:9092 
           -e KAFKA_BROKER_ID=1 
           -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 
           -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://broker:9092 
           -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 
           confluentinc/cp-kafka:5.5.0

```

## Scenario 3: Kafka in Docker container with a client running locally  

![](/images/kafka_49.png)  

위의 Scenario 2와 비교하여 클라이언트가 컨테이너화 되어 있다가 여기서는 따로 컨테이너화 되지 않고 로컬 머신 위에 있다.  

로컬에 실행하는 클라이언트는 따로 네트워크가 구성되어 있지 않다. 그렇기 때문에 따로 특정 트래픽을 받기 위해서는 로컬의 포트를 열어 이를 통해 통신해야 한다. 아래 그림과 같이 `9092:9092 포트`를 열었다고 해보자. 클라이언트가 로컬의 9092포트 엔드포인트로 접근하기 위해서는 `bootstrap_servers='localhost:9092'`로 해야 한다. `advertised.listeners`는 `broker:9092`로 해야 한다(클라이언트와 `localhost`관계가 아니므로).  

![](/images/kafka_50.png)  

문제는 클라이언트 입장에서 `broker:9092`는 resolvable하지 않다.  

### Adding a new listener to the broker
이 문제를 해결하는 방법은 다수의 리스너를 만드는 것이다.  

```yaml
...
    ports:
      - "19092:19092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker:9092,CONNECTIONS_FROM_HOST://localhost:19092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,CONNECTIONS_FROM_HOST:PLAINTEXT
...
```  

![](/images/kafka_52.png)  

## Scenario 4: Kafka running locally with a client in Docker container

![](/images/kafka_53.png)  

이런 상황이 잘 있지는 않지만, 어쨋든 이런 경우에 대한 해결책은 있다. 다만 좀 임시방편적일 뿐이다.  

만약 맥에서 도커가 동작하고 있다면, `host.docker.internal`을 이용할 수 있다.  

![](/images/kafka_54.png)  