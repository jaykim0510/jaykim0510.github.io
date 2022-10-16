---
layout: post
title:  'ElasticSearch Series [Part2]: Elasticsearch Installation'
description: 
date:   2022-01-03 15:01:35 +0300
image:  '/images/elasticsearch_logo.png'
logo_image:  '/images/elastic_logo.png'
categories: DE
tags: Elastic
---

---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# Elasticsearch 설치

🐱 `사용환경`  
- Macbook M1
- Docker on mac
- Local python 3.8.9

## Docker를 이용한 설치

먼저 Elasticsearch 이미지를 Dockerhub에서 다운 받아옵니다. [(참고: Dockerhub)](https://hub.docker.com/_/elasticsearch?tab=tags&page=1){:target="_blank"}  
제가 사용하고 있는 맥북의 M1칩은 `linux/arm64` OS architecture을 지원하기 때문에 7.16.2 버전의 이미지를 가져오려고 합니다.  
```
docker pull elasticsearch:7.16.2
```

이제 이미지를 가지고 컨테이너를 생성합니다. Elasticsearch는 보통 성능상의 이유로 분산환경에서 실행하는 것을 권장하지만 단순 테스트 또는 공부를 목적으로 한다면 단일 노드 환경에서 실행하여도 문제가 없습니다. Elasticsearch 문서에서는 두 가지 방법에 대한 도커 명령어를 제공하므로, 사용 목적에 맞게 실행시키면 됩니다. [(참고: Elasticsearch 공식 문서)](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html){:target="_blank"}

- Single-node
```
docker run -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.16.2
```
- Multi-node

```
# Create a docker-compose.yml file

version: '2.2'
services:
  es01:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.2
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es02,es03
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - elastic
  es02:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.2
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es01,es03
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data02:/usr/share/elasticsearch/data
    networks:
      - elastic
  es03:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.2
    container_name: es03
    environment:
      - node.name=es03
      - cluster.name=es-docker-cluster
      - discovery.seed_hosts=es01,es02
      - cluster.initial_master_nodes=es01,es02,es03
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data03:/usr/share/elasticsearch/data
    networks:
      - elastic

volumes:
  data01:
    driver: local
  data02:
    driver: local
  data03:
    driver: local

networks:
  elastic:
    driver: bridge
```
이렇게 하고나면 Elasticsearch 설치가 완료되었습니다. localhost의 9200번 포트로 Elasticsearch에 접근할 수 있습니다. 이제 클라이언트 모드로 Elasticsearch를 사용할 수 있습니다. 

## github + Docker를 이용한 설치
깃허브에 Elasticsearch뿐만 아니라, Kibana와 Logstash를 함께 설치해주는 코드가 있어서 공유드립니다.  
[(참고: deviantony/docker-elk)](https://github.com/deviantony/docker-elk){:target="_blank"}

## Linux에 직접 설치
이 방법은 제가 전에 부스트캠프에서 프로젝트를 진행할 때 팀원 중 한 분이 공유해주셨었는데, 잘 동작하여서 공유드립니다.  
```
apt-get update && apt-get install -y gnupg2
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list
apt-get update && apt-get install elasticsearch
service elasticsearch start
cd /usr/share/elasticsearch
bin/elasticsearch-plugin install analysis-nori
service elasticsearch restart
```
