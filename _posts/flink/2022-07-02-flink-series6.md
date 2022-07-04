---
layout: post
title: 'Flink Series [Part5]: Flink 설치'
description: 
date: 2022-07-01 15:01:35 +0300
logo_image: '/images/flink_logo.png'
image: '/images/flink_logo.png'
categories: DE
tags: Flink
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Flink 설치

```
실행환경: M1 맥북, 도커-컴포즈
```

처음에는 도커 허브에서 Flink가 공식적으로 제공해주는 이미지를 이용했다.  

근데 자꾸 `LD_PRELOAD cannot be preloaded`에러가 터진다.  

unset LD_PRELOAD 해보면 된다고 하길래 

`docker-compose.yml`에서 `command: sh -c unset LD_PRELOAD`도 해보고, `Dockerfile`에서 `ENV LD_PRELOAD=` 도 해봤는데 안됨... 도커만 있으면 뭐든 편할 줄 알았는데 흑..  

어쨋든 결국 플링크를 직접 설치하기로 함. 설치는 간단함. 근데 문제는..  

플링크는 간단하게 설치할 수 있는데, pyflink를 설치하기 위한 `pip install apache-flink`에서 계속 에러가 터짐  

구글링 해본 결과로는 m1이 문제인 것 같다.  

(무슨 이유인지 Flink 1.12 버전만 고집하긴 했다. 어떤 글에서 m1을 지원하는 버전은 아직 1.12 정도 뿐이라는 걸 읽은 것 같아서.. 1.12를 위해 파이썬 버전도 3.8은 안된다길래 3.7, 3.6 다 해보았지만 같은 에러)  

(Flink 1.14 버전도 해보자..해봤는데 안됨.. 같은 에러)  

어쨋든 pyflink를 고려하지 않고, Flink를 설치하는 법이라도 기록해두자  

1. python 설치

나는 python3.7-buster 라는 이미지를 컨테이너로 띄웠다  

```
docker run -it python3.7-buster /bin/bash
```

2. java 설치  

java는 8, 11 원하는걸 쓰면 된다길래 8로 설치했다.  

처음에는 wget 명령어로 깔아봤는데 로컬로 받았을 때와 디렉터리 구조가 달라서 뭔가 찝찝해서 로컬로 다운 받았다. (실제로 apache-flink 설치할 때 java안에 include라는 폴더가 없다고 에러가 터졌었음)  

```
https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html 접속

본인 환경에 맞는 파일 다운, 나의 경우 jdk-8u311-linux-aarch64.tar.gz 설치함
```

```
로컬에 다운받은 파일 도커 컨테이너로 복사

docker cp [로컬파일경로] [컨테이너ID]:[원하는 컨테이너경로]
```

```
압축 풀고 환경변수 설정

tar -xzvf jdk-8u311-linux-aarch64.tar.gz

export JAVA_HOME=/jdk1.8.0_311
export PATH=$JAVA_HOME/bin:$PATH

. /etc/profile
```

3. 플링크 설치

```
https://flink.apache.org/downloads.html 에서 원하는 버전 로컬에 다운

마찬가지로 플링크 파일 도커 컨테이너로 복사
docker cp [로컬파일경로] [컨테이너ID]:[원하는 컨테이너경로]

컨테이너에 접속해서 해당 파일 압축 풀기
tar -xzf flink-[플링크 버전]-bin-scala_[스칼라 버전].tgz
```

끝!  

4. 실행

```
클러스터 실행: ./bin/start-cluster.sh

파이썬 예제 실행: ./bin/flink run --python ./examples/python/table/batch/word_count.py
```

```
localhost:8081에 접속해서 UI로 확인 가능
```

# pyflink 설치

pyflink가 설치가 안됨. 일단 Flink 1.14로 버전 올려서 다시 도전... 안됨....ㅋㅋㅋ  


