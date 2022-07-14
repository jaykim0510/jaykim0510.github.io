---
layout: post
title:  'Data Engineering Series [Part2]: 하둡 생태계(HDFS, Hive, HBase)'
description: 
date:   2022-04-02 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Hadoop

- 빅데이터 처리를 위한 다양한 소프트웨어 제공
- 하둡은 개발자 더크 커팅이 처음으로 시작
- 구글이 발표한 분산 파일 저장을 위한 논문 GFS, 분산 데이터 처리를 위한 MapReduce 논문을 발표
- 더그 커팅이 구글에서 발표한 논문을 구현해 하둡 프로젝트가 시작됨 -> HDFS와 MapReduce가 하둡 프로젝트에 포함
- 이 후 빅데이터 처리를 위한 다양한 소프트웨어 Hive, HBase, Cassandra, Yarn 등이 등장하여 하둡 생태계 구성

![](/images/hadoop_1.png)

# HDFS

## 구글 플랫폼의 철학
- 한대의 고가 장비보다 여러 대의 저가 장비가 낫다
- 데이터는 분산 저장한다
- 시스템(H/W)은 언제든 죽을 수 있다
- 시스템 확장이 쉬워야 한다

## 하둡 특성
- 구글 플랫폼이 녹아든 빅데이터 처리 소프트웨어
- 수천대 이상의 서버를 하나의 클러스터로 사용
- 마스터-슬레이브 구조
- 파일은 블록단위로 저장
- 복제를 통한 신뢰성 보장
- 데이터 처리의 지역성 보장

## 하둡 클러스터

![](/images/hadoop_2.png)  

- Name Node: HDFS에 대한 마스터 데몬
- Data Node: HDFS에 대한 슬레이브 데몬
- Job Tracker: 어플리케이션 관리를 위한 마스터 데몬
- Task Tracker: 작업 관리를 위한 슬레이브 데몬

## 하둡 블록

![](/images/hadoop_3.png)  

- 하나의 파일을 여러 개의 Block으로 저장
- 블럭의 기본 크기는 128MB. 설정을 통해 변경 가능
- 128MB와 같이 블록을 크게 잡는 이유는 탐색 비용을 최소화하기 위해(Minimizing seek operation)
- 데이터를 조각내고 복제하여 여러 서버에 분산 저장
- 복제 저장하는 것이 용량 낭비일 수 있지만 이를 통해 얻게 되는 이점이 더 큼
- 만약 서버 1대에 장애가 발생하면 하트비트가 끊기게 되고, 장애난 서버가 가지고 있던 블록과 같은 데이터를 가지는 서버가 다른 서버와 통신 후 데이터를 복사함으로써 복제 수 유지
- 블록의 지역성: 데이터를 처리할 때 해당 데이터를 가지고 있는 노드한테 잡을 먼저 할당함
- 블록 캐싱: 자주 읽는 블록을 데이터 노드의 메모리에 캐싱함으로써 읽기 성능 향상

## 네임노드

- 파일시스템에 관한 메타데이터 관리
- 데이터노드로부터 블럭 리포트를 받음
- 데이터 복제 유지를 위한 커맨더 역할을 수행
- 파일시스템 이미지(fsimage) 관리 (스냅샷)
- 파일시스템에 대한 Edit Log 관리

## 데이터노드

- 로컬 파일 시스템에 HDFS 데이터 저장
- 주기적으로 로컬 파일 시스템에 있는 모든 HDFS 블록들을 검사 후 정상적인 블록의 목록을 만들어 네임노드에 전송
- 데이터 복제시 클라이언트가 네임노드로부터 데이터노드 리스트를 전달 받음
- 네트워크 트래픽은 클라이언트와 데이터노드 간에만 발생

![](/images/hadoop_4.png)  

## HDFS 커맨드

```
version, mkdir, ls, put, put, copyFromLocal, copyToLocal, cat, mv, cp
moveFromLocal, moveToLocal, tail, rm, chwon, chgrp, setrep, du, df
touchz, chmod, test, text, count, find, getmerge
```

```
hadoop version

hadoop fs -ls

# hadoop fs -copyFromLocal <local source> <hdfs destination>
hadoop fs -copyFromLocal ~/test1 /dir1/copytest

# hadoop fs -cat <path_to_file_in_hdfs>
hadoop fs -cat /dir1/copytest

# hadoop fs -get <src> <local destination>
hadoop fs -get /testfile ~/copyfromhadoop

# hadoop fs -copyToLocal <hdfs source> <local destination>
hadoop fs -copyToLocal /dir1/sample ~/copysample

# hadoop fs -mv <source> <destination>
hadoop fs -mv /dir /dir1

# hadoop fs -tail [-f] <file>
# hadoop fs -rm <path>

# hadoop fs -chown [-R] [owner] [:[group]] <path>
hadoop fs -chown newdir /sample

# hadoop fs -setrep <replication num> <path>
hadoop fs -setrep 2 /dir1

# hadoop fs -du -s <file>
```

# Hive

- HDFS에 저장된 데이터를 SQL과 유사한 언어로 다루고 싶은 니즈
- SQL like한 분석 지원 (HQL)
- 데이터 분석을 위한 쿼리 엔진 제공
- HQL로 작성한 쿼리를 내부적으로 MapReduce 형태로 변환
- 유사한 기술로 Spark가 있음
- Spark는 메모리 기반 소프트웨어이기 때문에 빠르다. 하지만 OOM(Out Of Memory) 자주 발생
- Hive는 디스크 기반 소프트웨어이기 때문에 느리지만, 대용량 데이터를 OOM 걱정 없이 다룰 수 있음

# HBase

# Cassandra

# Yarn

# MapReduce

# Zookeeper

# 참고

- [Hoing: 하둡 프로그래밍(2) – 빅데이터 - 하둡 에코시스템](https://hoing.io/archives/21453){:target="_blank"}