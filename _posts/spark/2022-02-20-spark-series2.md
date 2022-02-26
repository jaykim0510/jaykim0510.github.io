---
layout: post
title:  'Apache Spark Series [Part2]: 스파크 개발환경 구축하기'
description: 
date:   2022-02-20 15:01:35 +0300
image:  '/images/spark_10.png'
logo_image:  '/images/spark_logo.png'
categories: DE
tags: Spark
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 스파크 설치
스파크를 설치하는 과정 자체는 크게 복잡하지 않습니다. **자바와 스파크만 설치**하면 스파크를 사용할 수 있습니다. 자바가 필요한 이유는 스파크가 JVM 위에서 실행되기 때문입니다.  

하지만 실무에서는 대부분의 빅데이터 소프트웨어들이 클러스터 환경에서 동작하기 때문에 제대로 활용하기 위해서는 여러 가지 준비할 것도 많고 설정해야 할 것들도 많습니다. 그래서 스파크는 **개발/테스트를 위한 용도로 간단하게 사용할 때에는 단독 서버에서 동작하는 로컬 모드를, 배포를 위한 용도로 클라이언트, 클러스터 모드를 지원**합니다.  

스파크 애플리케이션 코드는 **자바, 스칼라, 파이썬, R**언어로 작성할 수 있습니다.  

## pyspark
우선 저는 파이썬을 주언어로 사용하기 때문에 pyspark를 이용해 파이썬으로 스파크 애플리케이션 코드를 작성할 예정입니다. pyspark의 장점은 만약 개발/테스트를 위한 목적으로만 스파크를 사용할 예정이라면 스파크를 설치할 필요가 없다는 것입니다. 스파크를 사용하는데 스파크를 설치할 필요가 없다? 무슨 뜻이냐면 pyspark를 설치하기만 해도 스파크를 실행하기 위해 필요한 최소한의 파일을 함께 설치해줍니다.  

하지만 여전히 자바는 설치해주어야 합니다.  

> To run Spark, you only require a Java runtime environment (JRE) but you may also download the Java development kit (JDK) which includes the JRE.  

저는 **파이썬이 설치되어 있는 도커 이미지를 이용해 컨테이너 안에서 실습**을 진행해 보았습니다.  


### 자바, 파이썬 설치
```sh
# 파이썬이 설치된 컨테이너 생성
docker run -it python:3.8-buster
```

```sh
# JDK 설치
apt-get update
apt-get install openjdk-11-jdk
```

```sh
# JAVA_HOME 변수 설정, 경로 추가


export JAVA_HOME=/etc/openjdk-11-jdk     # 본인의 자바 설치 경로
export PATH=$JAVA_HOME/bin:$PATH

. /etc/profile # bash쉘이면 source /etc/profile
```
### pyspark 설치
```sh
# pyspark 설치
pip install pyspark
```

```py
# 잘 설치되었는지 확인
import pyspark
sc = pyspark.SparkContext(appName="SparkContext")

sc
--------------------------------
SparkContext

Version
v3.2.1
Master
local[*]
AppName
SparkContext
```  

## Spark
이번에는 파이썬에 국한되지 않는 조금 더 일반적인 방법으로 스파크를 설치해보겠습니다. 이번에는 리눅스 운영체제만 가지는 컨테이너 위에서 실습을 진행하도록 하겠습니다.  

```sh
# 우분투 컨테이너 실행
docker run -it ubuntu:latest
```

```sh
# JDK 설치
# https://www.oracle.com/java/technologies/downloads/
wget https://download.oracle.com/java/17/latest/jdk-17_linux-aarch64_bin.tar.gz
tar -xzvf jdk-17_linux-aarch64_bin.tar.gz
```

```sh
# JAVA_HOME 변수 설정, 경로 추가
export JAVA_HOME=/root/jdk-17.0.2     # 본인의 자바 설치 경로
export PATH=$JAVA_HOME/bin:$PATH

. /etc/profile
```

```sh
# 스파크 설치
# https://www.apache.org/dyn/closer.lua/spark/spark-3.2.1/
wget https://dlcdn.apache.org/spark/spark-3.2.1/spark-3.2.1-bin-hadoop3.2.tgz
tar -xzvf spark-3.2.1-bin-hadoop3.2.tgz
```

```sh
cd spark-3.2.1-bin-hadoop3.2
ls
--------------------------------------------------------------------------------------------------------------
LICENSE  NOTICE  R  README.md  RELEASE  bin  conf  data  examples  jars  kubernetes  licenses  python  sbin  yarn
```

```
# 스파크에서 제공하는 실행 파일
cd bin
ls
```

![](../images/../../images/spark_9.png) 

```sh
# 스파크 셸 실행
./bin/spark-shell

# 셸 종료
:q
```  

![](../images/../../images/spark_8.png)  

# 로컬 개발 환경

# 클러스터 환경

- [Pyspark 코드는 어디서 실행되는가?](https://stackoverflow.com/questions/61816236/does-pyspark-code-run-in-jvm-or-python-subprocess){:target="_blank"}  
- [Pyspark만으로 스파크 애플리케이션 실행할 수 있나?](https://stackoverflow.com/questions/51728177/can-pyspark-work-without-spark){:target="_blank"}
- [Pyspark의 한계](https://stackoverflow.com/questions/58479357/pyspark-from-spark-installation-vs-pyspark-python-package){:target="_blank"}
- [bin/sh: 1: source: not found](https://askubuntu.com/questions/1363992/bin-sh-1-source-not-found){:target="_blank"}
- [[Linux] 우분투에 자바 설치](https://unit-15.tistory.com/114?category=521121#recentComments){:target="_blank"}