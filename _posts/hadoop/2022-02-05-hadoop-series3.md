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