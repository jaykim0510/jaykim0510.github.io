---
layout: post
title:  'Logstash Series [Part1]: Logstash 공부'
description: 
date:   2022-01-07 15:01:35 +0300
image:  '/images/logstash_logo.png'
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

# Logstash의 특징

- 플러그인 기반의 오픈소스 데이터 처리 파이프라인 도구
- 데이터 전처리 과정을 별도의 애플리케이션 작성 없이 간단한 설정만으로 수행할 수 있다
- 장애 대응 로직이나 성능 저하 요인을 쉽게 파악할 수 있는 모니터링 API를 제공한다
- 성능을 튜닝할 수 있는 파라미터를 제공한다
- 현업에서 사용하는 대부분의 데이터 소스를 지원한다
- 자체적으로 내장되어 있는 메모리와 파일 기반의 큐(queue)를 가지고 있다
- (메모리는 높은 성능을, 파일 기반의 큐는 도큐먼트 유실을 최소화해준다)

# Logstash 설치

- Logstash는 Elasticsearch, Kibana와 달리 JVM을 별도로 설치해줘야 한다
- 설치후 bin 폴더에서 스크립트를 통해 실행 시켜주면 된다
- Elastic은 ELK 스택의 도구들을 도커로 쉽게 시작할 수 있도록 이미지를 제공한다
- (전체 파이프라인을 Elastic에서 모두 관리하기 때문에 서로간의 연결성이 굉장히 뛰어나다)

```yml
version: '3.2'

services:

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:${ELK_VERSION}
    hostname: elasticsearch
    container_name: elasticsearch
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      ELASTIC_PASSWORD: changeme
      ELASTIC_USERNAME: elastic
      # Use single node discovery in order to disable production mode and avoid bootstrap checks.
      # see: https://www.elastic.co/guide/en/elasticsearch/reference/current/bootstrap-checks.html
      discovery.type: single-node
    mem_limit: ${MEM_LIMIT}

  logstash:
    image: docker.elastic.co/logstash/logstash:${ELK_VERSION}
    container_name: logstash
    ports:
      - "5044:5044"
      - "5001:5001/tcp"
      - "5001:5001/udp"
      - "9600:9600"
    mem_limit: ${MEM_LIMIT}
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:${ELK_VERSION}
    container_name: kibana
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

# Logstash 구성요소

- Logstash의 핵심 역할은 입력으로부터 데이터를 받아 간단한 전처리 후 출력에 전달하는 것이다
- 이를 위해 Logstash는 입력, 필터, 출력이라는 세 가지 구성요소로 이루어진다 (입력과 출력은 필수, 필터는 옵션이다)

```conf
input {
    { 입력 플러그인 }
}

filter {
    { 필터 플러그인 }
}

output {
    { 출력 플러그인 }
}
```

## 설정 파일과 실행 파일

- 기본 디렉터리
  - `/usr/share/logstash`
- 설정 파일
  - `/usr/share/logstash/config/logstash.yml`
    - Logstash 프로세스에 관한 설정
  - `/usr/share/logstash/config/pipelines.yml`
    - 하나의 프로세스 위에서 실행되는 파이프라인에 관한 설정
    - 여러 파이프라인을 정의함으로써 다중 파이프라인을 하나의 프로세스 위에서 실행시킬 수 있다
    ```yml
    - pipeline.id: main # 파이프라인의 고유한 ID
      path.config: "/usr/share/logstash/pipeline/mylogstash.conf" # 파이프라인 설정 파일의 위치
      pipeline.workers: # 병렬로 처리하기 위한 코어 수 (기본값: 호스트의 CPU 코어 수)
      pipeline.batch.size: # 출력으로 보낼 도큐먼트의 배치 사이즈
      queue.type: # 파이프라인에서 사용할 큐의 종류 (기본값: memory) persisted 타입은 이벤트 유실 최소화할 수 있음
    ```
  - `/usr/share/logstash/pipeline/mylogstash.conf`
    - 파이프라인 로직 작성
- 실행 파일
  - `/usr/share/logstash/bin/logstash`

## 입력

- 소스로부터 데이터를 입력받는 단계
- 직접 소스에 접근해 읽어들이는 경우도 있고, 서버를 열어놓고 받아들이는 경우도 있다
- (확장자가 꼭 위와 같을 필요는 없다. 다만 많은 사용자들이 위와 같은 확장자를 관례적으로 많이 쓰고 있을 뿐)
- 대표적인 입력 플러그인은 file, syslog, kafka, jdbc, beats, http, redis, S3 등이 있다
- 플러그인마다 설정 옵션이 다르므로 공식문서를 확인해보자
- (https://www.elastic.co/guide/en/logstash/current/input-plugins.html){:target="_blank"}

```
input {
    file {
        path => "/opt/test/test.log"
        start_position => "beginning"
        sincedb_path => "nul"
    }
}
```

```
- start_position: 
    - 최초 파일 발견했을 때 데이터를 처음부터(beginning) 읽을지, 실행 이후 생긴 부분부터(end) 읽을지
- sincedb_path: 
    - 파일의 어디까지 읽었는지 저장해둔다. 
    - nul로 설정하면 어디까지 읽었는지 모르게 된다. 설정 안하면 기본으로 data/plugins/inputs/file에 sincedb 파일을 생성한다
```

```
input {
    kafka {
        bootstrap_servers => "kafka:29092"
        topics => ["test_topic"]
    }
}
```

## 출력

- 출력은 가공된 데이터를 지정한 대상으로 내보내는 단계다
- 입력과 비슷한 방식으로 작성한다
- 대표적인 플러그인은 elasticsearch, file, kafka, email, redis, S3 등이 있다

```
output {
	elasticsearch {
		hosts => "elasticsearch:9200"
		user => "elastic"
		index => "test"
		password => "changeme"
	}
}
```

## 필터

- 입력 플러그인으로부터 받은 데이터를 정제하여 의미 있는 데이터로 정형화하는 역할
- 필수 구성요소는 아니지만, 필터 없는 파이프라인은 의미 있는 기능을 하기 어려움
- 대표적인 플러그인은 grok, dissect, mutate 등이 있다

### mutate

- 필드 이름 변경, 간단한 문자열 전처리와 같은 기능을 제공하는 플러그인
  - rename: 필드 이름 변경
  - uppercase: 문자열 대문자로 변경
  - split: 쉼표, 띄어쓰기와 같은 구분 문자를 기준으로 문자열을 배열로 나눔
  - 더 많은 옵션은 공식문서 참고: https://www.elastic.co/guide/en/logstash/current/plugins-filters-mutate.html

```
filter {
  mutate {
    rename => { "message" => "mymessage" }
  }

  dissect {
    mapping => {"mymessage" => "[%{timestamp}]%{?->}[%{id}]%{?->} [%{level}] - %{message}"}
  }

  mutate {
    lowercase => "level"
  }
}

```

![](/images/logstash_3.png)

# 다중 파이프라인

- 하나의 로그스태시 프로세스에서 여러 개의 파이프라인을 독립적으로 실행할 수 있게 한다
- `/usr/share/logstash/config` 의 `pipelines.yml` 파일에 여러 개의 파이프라인을 등록하면 된다
    ```sh
    # pipelines.yml 파일
    - pipeline.id: pl1
      path.config: "/usr/share/logstash/pipeline/logstash_1.conf"
    - pipeline.id: pl2
      path.config: "/usr/share/logstash/pipeline/logstash_2.conf"
    ```

# 모니터링

- Kibana를 활용하면 ELK 스택을 모니터링 할 수 있다
- Management -> Stack Monitoring -> Or set up with self monitoring -> Turn on monitoring

![](/images/logstash_4.png)

# 참고

- [elastic 공식문서, Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html){:target="_blank"}
- [logz.io, THE COMPLETE GUIDE TO THE ELK STACK](https://logz.io/learn/complete-guide-elk-stack/){:target="_blank"}
- [[Logstash] 로그스테이시 사용법 (설정파일) + Elastic](https://soyoung-new-challenge.tistory.com/99){:target="_blank"}
- [elastic: 데이터 집계, 변환, 저장](https://www.elastic.co/kr/logstash/){:target="_blank"}
