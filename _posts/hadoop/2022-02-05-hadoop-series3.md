---
layout: post
title: 'Hadoop Series [Part3]: Hadoop HDFS(2) 설치'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/hadoop_logo.png'
logo_image: '/images/hadoop_logo.png'
categories: data_engineering
tags: Hadoop
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 하둡 클러스터 설정

- 하둡 제어 스크립트는 SSH를 이용해 전체 클러스터를 대상으로 작업을 수행하도록 개발되었다


- HDFS 파일시스템 포맷: 포맷 작업은 새로운 빈 파일시스템을 생성하는 것이다. 네임노드가 파일시스템의 모든 메타데이터를 관리하는 반면, 데이터 노드는 클러스터에 동적으로 추가되고 제거되기 때문에 초기 포맷 과정에 전혀 관여하지 않는다.

```
hdfs namenode -format
```

- 클러스터에 있는 호스트 목록은 `workers` 파일에 저장한다. `workers` 파일에는 데이터노드와 노드 매니저가 구동될 컴퓨터를 기록한다
- 데몬 시작

```
start-dfs.sh
```

- 리소스 매니저는 `start-yarn.sh` 스크립트가 수행된 머신에서만 실행된다

```
start-yarn.sh
```

# 하둡 설정 파일

- hadoop-env.sh: 하둡을 구동하는 스크립트에서 사용되는 환경변수
- mapred-env.sh: 맵리듀스를 구동하는 스크립트에서 사용되는 환경변수
- yarn-env.sh: YARN을 구동하는 스크립트에서 사용되는 환경변수
- core-site.xml: HDFS, 맵리듀스, YARN에서 공통적으로 사용되는 하둡 환경 설정 구성
- hdfs-site.xml: 네임노드, 보조 네임노드, 데이터노드 등과 같은 HDFS를 위한 환경 설정 구성
- workers: 데이터노드와 노드 맴니저를 구동할 컴퓨터 목록

위 파일들은 `./etc/hadoop` 에 있다

- 하둡은 모든 마스터와 워커 컴퓨터가 하나의 환경 설정 파일 집합을 사용할 수 있도록 설계되었다
- (마스터와 워커가 각각 따로 파일을 가질 필요가 없다)

# 메모리

- 하둡은 각 데몬 당 1GB의 메모리를 기본으로 할당한다 (`hadoop-env.sh`의 `HADOOP_HEAPSIZE`)
- HDFS에서 메모리 용량을 증가시켜야 하는 경우는 보통 네임노드다 (블록에 대한 참조값을 모두 네임노드의 메모리에서 관리하기 때문)
- (`hadoop-env.sh`의 `HADOOP_NAMENODE_OPTS` 속성을 이용해 조절할 수 있다)
- (네임노드와 보조 네임노드는 동일하게 변경되어야 한다)

# 중요한 HDFS 데몬 속성

|속성명|기본값|설명|
|:---:|:---:|:---:|
|fs.defaultFS|file:///|기본 파일시스템. URI는 호스트명과 네임노드의 RPC 서버가 실행되는 포트 번호(기본값 8020)를 정의한다. 
|dfs.namenode.name.dir|file://${hadoop.tmp.dir}/dfs/name|네임노드가 영속적인 메타데이터를 지정할 디렉토리 목록을 지정한다. 네임노드는 메타데이터의 복제본을 목록에 디렉터리별로 저장한다|
|dfs.datanode.data.dir|file://${hadoop.tmp.dir}/dfs/data|데이터노드가 블록을 저장할 디렉터리의 목록. 각 븍록은 이 디렉터리중 오직 한 곳에만 저장된다.
|dfs.namenode.checkpoint.dir|file://${hadoop.tmp.dir}/dfs/namesecondary|보조 네임노드가 체크포인트를 저장하는 디렉터리 목록. 목록에 있는 각 디렉터리에 체크포인트의 복제본을 저장한다|

- HDFS의 저장 디렉터리는 `hadoop.tmp.dir` 하위에 위치한다. (기본값은 `/tmp/hadoop-${user.name}`)
- hdfs-site.xml의 dfs.blocksize 속성을 이용해 HDFS 블록크기를 설정한다
- HDFS는 휴지통 기능이 있어 삭제된 파일이 `trash` 디렉터리로 이동한다. `trash` 디렉터리에 보관되는 최소 기간은 `core-site.xml`의 `fs.trash.interval`로 설정한다. 기본값은 0으로 삭제하면 즉시 영구 삭제됨을 의미한다




- java8 설치
- hadoop 3.2.4 설치
- JAVA_HOME, HADOOP_HOME, PATH 환경변수 설정
  - `export JAVA_HOME=/opt/jdk`
  - `export HADOOP_HOME=/opt/hadoop`
  - `export PATH=${PATH}:/${JAVA_HOME}/bin:${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin`
- 노드 종류 상관 없이 공통 항목 설정후 ziontkim0510/hadoop3.2.4:1.0 이미지로 빌드
  - 노드에서 저장할 데이터 디렉터리 생성
    ```sh
    mkdir -p ${HADOOP_HOME}/data/hdfs/namenode
    mkdir -p ${HADOOP_HOME}/data/hdfs/datanode
    mkdir -p ${HADOOP_HOME}/data/hdfs/secondarynode
    mkdir -p ${HADOOP_HOME}/data/yarn/nm-local-dir
    mkdir -p ${HADOOP_HOME}/data/yarn/system/rmstore
    ```
  - `${HADOOP_HOME}/etc/hadoop/hadoop-env.sh` 파일
    ```sh
    export JAVA_HOME=/opt/jdk

    export HDFS_NAMENODE_USER="root"
    export HDFS_DATANODE_USER="root"
    export HDFS_SECONDARYNAMENODE_USER="root"
    export YARN_RESOURCEMANAGER_USER="root"
    export YARN_NODEMANAGER_USER="root"

    export HADOOP_LOG_DIR=/var/log/hadoop
    ```

  - `${HADOOP_HOME}/etc/hadoop/core-site.xml` 파일
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

    <configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://hdfs-name-node:8020</value>
    </property>
    </configuration>
    ```
  - `${HADOOP_HOME}/etc/hadoop/hdfs-site.xml` 파일
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
        
    <configuration>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:/opt/hadoop/data/hdfs/namenode</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:/opt/hadoop/data/hdfs/datanode</value>
    </property>
    <property>
        <name>dfs.namenode.checkpoint.dir</name>
        <value>file:/opt/hadoop/data/hdfs/secondarynode</value>
    </property>
    </configuration>
    ```
  - `${HADOOP_HOME}/etc/hadoop/yarn-site.xml` 파일
    ```xml
    <?xml version="1.0"?>

    <configuration>

    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.local-dirs</name>
        <value>/opt/hadoop/data/yarn/nm-local-dir</value>
    </property>
    <property>
        <name>yarn.resourcemanager.fs.state-store.uri</name>
        <value>/opt/hadoop/data/yarn/system/rmstore</value>
    </property>
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>hdfs-name-node</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>hdfs-name-node:8032</value>
    </property>
    </configuration>

    ```
- 네임노드, 세컨더리 노드 설정후 ziontkim0510/hadoop-name-3.2.4:1.0, ziontkim0510/hadoop-secondary-3.2.4:1.0 이미지로 빌드
  - HDFS 파일 시스템 포맷: 네임 노드에서 `hdfs namenode -format` 명령어 실행
  - `${HADOOP_HOME}/etc/hadoop/workers` 파일에 데이터 노드 추가 
    ```sh
    # workers
    hdfs-data-node-1
    hdfs-data-node-2
    ```
  - ssh 키 생성 후 설정: `ssh-keygen -t rsa`
- 데이터 노드 설정후 ziontkim0510/hadoop-data-3.2.4:1.0 이미지로 빌드
  - 네임노드에서 생성한 퍼블릭 키 복사 붙여넣기

# 도커 컴포즈


```yaml
version: '3.2'
services:
  hdfs-name-node:
    image: ziontkim0510/hadoop-name-3.2.4:1.0
    hostname: hdfs-name-node
    container_name: hdfs-name-node
    ports:
      - 9870:9870
    command: 
      - bash
      - -c 
      - |
        /etc/init.d/ssh restart &
        ./${HADOOP_HOME}/sbin/start-dfs.sh &
        ./${HADOOP_HOME}/sbin/start-yarn.sh &
        sleep infinity
    depends_on:
      - hdfs-data-node-1
      - hdfs-data-node-2

  hdfs-secondary-node:
    image: ziontkim0510/hadoop-secondary-3.2.4:1.0
    hostname: hdfs-secondary-node
    container_name: hdfs-secondary-node
    tty: true

  hdfs-data-node-1:
    image: ziontkim0510/hadoop-data-3.2.4:1.0
    hostname: hdfs-data-node-1
    container_name: hdfs-data-node-1
    ports:
      - 9860:9864
    command: 
      - bash
      - -c 
      - |
        /etc/init.d/ssh restart &
        sleep infinity

  hdfs-data-node-2:
    image: ziontkim0510/hadoop-data-3.2.4:1.0
    hostname: hdfs-data-node-2
    container_name: hdfs-data-node-2
    ports:
      - 9861:9864
    command: 
      - bash
      - -c 
      - |
        /etc/init.d/ssh restart &
        sleep infinity
```


![](/images/hdfs_10.png)

# 참고

- [Truman Show, 리눅스(Linux) - 하둡(Hadoop) 설치 및 환경 설정](https://truman.tistory.com/207#recentComments){:target="_blank"}
- [hoing, 하둡 프로그래밍(3) – 빅데이터 – 하둡 설치](https://hoing.io/archives/22174#3){:target="_blank"}
- [hanovator, Hadoop 설치](https://velog.io/@hanovator/Hadoop-%EC%84%A4%EC%B9%98){:target="_blank"}