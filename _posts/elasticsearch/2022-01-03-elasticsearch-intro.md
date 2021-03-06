---
layout: post
title:  'ElasticSearch Series [Part1]: ElasticSearch Installation'
description: Elasticsearch는 정형 및 비정형 데이터 등 모든 유형의 데이터를 위한 무료 검색 및 분석 엔진
date:   2022-01-03 15:01:35 +0300
image:  '/images/elastic_1.png'
logo_image:  '/images/elastic_logo.png'
categories: DE
tags: Elasticsearch
---

---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# Elasticsearch 소개
 - Elasticsearch는 정형 및 비정형 데이터 등 모든 유형의 데이터를 위한 무료 검색 및 분석 엔진
 - Apache Lucene을 기반으로 구축
 - Elastic Stack의 핵심 구성요소(Elasticsearch, Logstash, Kibana)
 - 기본적으로는 검색엔진이지만, MongoDB나 HBase처럼 대용량 스토리지로도 활용


![](/images/elastic_1.png)

## Elasticsearch를 사용하는 이유  

### Elasticsearch는 빠릅니다
Elasticsearch는 Lucene을 기반으로 구축되기 때문에, 전문(Full-text) 검색에 뛰어납니다. Elasticsearch는 또한 거의 실시간 검색 플랫폼입니다. 이것은 문서가 색인될 때부터 검색 가능해질 때까지의 대기 시간이 아주 짧다는 뜻입니다. 이 대기 시간은 보통 1초입니다. 결과적으로, Elasticsearch는 보안 분석, 인프라 모니터링 같은 시간이 중요한 사용 사례에 이상적입니다.  

🐱 `전문 검색`: 내용 전체를 색인해서 특정 단어가 포함된 문서를 검색하는 것  
🐱 `Lucene기반의 검색 엔진`: 역색인을 지원하는 검색 엔진으로 보통 책 마지막 부분의 단어별 페이지 수를 적어놓은 것과 비슷

### Elasticsearch는 본질상 분산적입니다. 
Elasticsearch에 저장된 문서는 샤드라고 하는 여러 다른 컨테이너에 걸쳐 분산되며, 이 샤드는 복제되어 하드웨어 장애 시에 중복되는 데이터 사본을 제공합니다. Elasticsearch의 분산적인 특징은 수백 개(심지어 수천 개)의 서버까지 확장하고 페타바이트의 데이터를 처리할 수 있게 해줍니다.   

### Elasticsearch는 광범위한 기능 세트와 함께 제공됩니다. 
속도, 확장성, 복원력뿐 아니라, Elasticsearch에는 데이터 롤업, 인덱스 수명 주기 관리 등과 같이 데이터를 훨씬 더 효율적으로 저장하고 검색할 수 있게 해주는 강력한 기본 기능이 다수 탑재되어 있습니다.  

### 그 밖에, RESTful API, 멀티 테넌시 등을 지원합니다.
RESTful API를 지원하고, 요청과 응답에 JSON 형식을 사용해, 개발 언어에 관계없이 이용 가능하며, 서로 다른 인덱스(테이블)일지라도 필드명(컬럼)만 같으면 한번에 여러 개의 인덱스(테이블)을 조회할 수 있습니다.  

🐱 `Elasticsearch의 약점`
- 완전한 실시간이 아니다
- 롤백 기능을 제공하지 않는다
- 업데이트 될 때마다 문서를 새로 생성한다

![](/images/elastic_3.png)

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

## 마치며  

Elasticsearch에서는 다양한 프로그래밍 언어로 Elasticsearch Client API를 제공하고 있습니다. 
- Java
- Python
- Node.js
- C#
- Go
- Ruby
- PHP
- Perl  

다음 포스트부터는 파이썬으로 Client API를 사용해 실습과 함께 포스트를 작성하도록 하겠습니다. 