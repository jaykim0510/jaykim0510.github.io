---
layout: post
title: 'Hadoop Series [Part2]: Hadoop HDFS(1) 소개'
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

# HDFS

데이터가 단일 물리 머신의 저장 용량을 초과하게 되면 전체 데이터셋을 분리된 여러 머신에 나눠서 저장할 필요가 있다. 네트워크로 연결된 여러 머신의 스토리지를 관리하는 파일시스템을 분산 파일시스템이라고 한다.  

하둡은 HDFS(Hadoop Distributed File System)라는 분산 파일시스템을 제공한다. HDFS는 범용 하드웨어로 구성된 클러스터에서 실행되고 스트리밍 방식의 데이터 접근 패턴으로 대용량 파일을 다룰 수 있도록 설계된 파일시스템이다.  


## Local File System vs HDFS

- Local File System
  - In an operating system, file system is the strategy that is used to keep track of files on a disk
  - The basic file system of Linux operating system is termed as Local file system. It stores any data file as it is in single copy.
  - It stores data files in Tree format. Here, any user can access data files directly. LFS does not Replicate the data blocks. It always used for storing and processing personal data(small data)
  - The block size is 4 KB both in Windows and Unix local file systems
  - multiple disk-seeks in local file system due to its 4KB block size
  - physically a single unit

- HDFS
  - HDFS will be deployed on top of the existing Operating system to bring its own file system method
  - the block size in Hadoop HDFS is 64 MB in the initial version and in later versions, it is 128 MB which is configurable
  - HDFS maintains higher block allocation, the data will be read sequentially after every individual seek -> Data retrieval in DFS is fast
  - Large files will be split into multiple chunks automatically, distributed and stored across various slave machines (aka. nodes) in HDFS
  - logically a single unit

## 구글 플랫폼의 철학
- 한대의 고가 장비보다 여러 대의 저가 장비가 낫다
- 데이터는 분산 저장한다
- 시스템(H/W)은 언제든 죽을 수 있다
- 시스템 확장이 쉬워야 한다

## 하둡 특성
- 구글 플랫폼의 철학이 녹아든 빅데이터 처리 소프트웨어
- 수천대 이상의 서버를 하나의 클러스터로 사용 (Scalable)
- 범용 하드웨어 클러스터 (Support for Heterogeneous Cluster)
- 복제를 통한 신뢰성 보장 (Fault Tolerant)
- 어떠한 대용량 파일도 분산 저장함으로써 적재 가능 (Built for Large Dataset)
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
- 블럭 크기는 한 번에 읽고 쓸 수 있는 데이터의 크기
- 블럭의 기본 크기는 128MB. 설정을 통해 변경 가능
- 128MB와 같이 블록을 크게 잡는 이유는 탐색 비용을 최소화하기 위해(Minimizing seek operation: 시작점 찾는 비용 최소화)
- 데이터를 조각내고 복제하여 여러 서버에 분산 저장
- 복제 저장하는 것이 용량 낭비일 수 있지만 이를 통해 얻게 되는 이점이 더 큼
- 만약 서버 1대에 장애가 발생하면 하트비트가 끊기게 되고, 장애난 서버가 가지고 있던 블록과 같은 데이터를 가지는 서버가 다른 서버와 통신 후 데이터를 복사함으로써 복제 수 유지
- 블록의 지역성: 데이터를 처리할 때 해당 데이터를 가지고 있는 노드한테 잡을 먼저 할당함
- 블록 캐싱: 자주 읽는 블록을 데이터 노드의 메모리에 캐싱함으로써 읽기 성능 향상

## 네임노드

- 네임노드의 관리 대상: 파일시스템 트리, 트리에 포함된 모든 파일과 디렉터리에 대한 메타데이터
- 이 정보는 네임스페이스 이미지와 에디트 로그라는 두 종류의 파일로 로컬 디스크에 영속적으로 저장됨
- 데이터노드로부터 블럭 리포트를 받음
- 데이터 복제 유지를 위한 커맨더 역할을 수행
- 파일시스템 이미지(fsimage) 관리 (스냅샷)
- 파일시스템에 대한 Edit Log 관리
- 네임노드가 없으면 파일시스템은 동작하지 않음
  - 네임노드 장애 복구 방법
    - 메타데이터를 지속적인 상태로 보존하기 위해 파일로 백업
    - 보조 네임노드 운영: 에디트 로그가 너무 커지지 않도록 주기적으로 이미지와 에디트 로그를 병합해 새로운 이미지를 만듬

## 데이터노드

- 로컬 파일 시스템에 HDFS 데이터 저장
- 주기적으로 로컬 파일 시스템에 있는 모든 HDFS 블록들을 검사 후 정상적인 블록의 목록을 만들어 네임노드에 전송
- 데이터 복제시 클라이언트가 네임노드로부터 데이터노드 리스트를 전달 받음
- 네트워크 트래픽은 클라이언트와 데이터노드 간에만 발생

![](/images/hdfs_1.png)  


## 보조 네임 노드


- 네임노드(NN)와 보조 네임노드(SNN)는 Active/Standby 구조 아님 (각자 역할이 따로 있음)
- 체크 포인트
  - fsimage 와 edits 파일을 주기적으로 병합
    - 1시간 주기로 실행
    - edits 로그가 일정 사이즈 이상이면 실행
- 한계점
  - 네임노드의 SPOF 문제 해결 x
  - 보조 네임노드의 장애 상황 감지 툴 없음

**fsimage와 edits 파일**  

- 파일 시스템에 관한 스냅샷
- 스냅샷 이후에 발생된 데이터에 관한 변경사항은 edits 파일에 기록됨
- 처음 네임노드 데몬이 실행되면 fsimage 스냅샷을 이용해 hdfs 구동
- 이후 발생되는 변경사항은 fsimage와 병합. 이러한 병합은 보조 네임 노드에서 실행
- 병합된 fsimage를 주기적으로 네임노드로 가져와서 fsimage를 최신화

![](/images/hadoop_5.png)

## 데이터 읽기 과정

![](/images/hadoop_7.png)

```
1. 클라이언트가 HDFS의 FileSystem 객체의 open() 메서드를 호출해 원하는 파일을 연다
2. HDFS는 해당 파일의 첫 번째 블록 위치를 파악하기 위해 RPC를 사용하여 네임노드를 호출한다
3. 네임노드는 해당 블록을 가지는 데이터 노드의 주소를 가까운 순으로 정렬하여 리스트로 반환한다
4. HDFS는 클라이언트가 데이터를 읽을 수 있도록 파일 탐색을 지원하는 입력 스트림(FSDataInputStream)을 반환한다
5. 클라이언트는 스트림을 읽기 위해 read() 메서드를 호출한다
6. read() 메서드를 반복적으로 호출하면 데이터 노드에서 클라이언트로 모든 데이터가 전송된다
7. 블록의 끝에 도달하면 해당 데이터 노드의 연결을 닫고 다음 블록의 데이터 노드를 찾는다
8. 2-7번이 파일의 모든 블록을 읽을 때까지 반복된다
9. 클라이언트는 FSDataInputStream의 close() 메서드를 호출한다
```

## 데이터 쓰기 과정

![](/images/hadoop_6.png)  

```
1. 클라이언트는 HDFS의 FileSystem의 create() 메서드를 호출하여 파일을 생성한다
2. HDFS는 파일시스템의 네임스페이스에 새로운 파일을 생성하기 위해 네임노드에 RPC 요청을 보낸다
3. 네임노드는 요청한 파일과 동일한 파일이 있는지, 클라이언트에 권한이 있는지 등을 검사한다
4. 검사가 통과하면 HDFS는 클라이언트에 데이터를 쓸 수 있도록 FSDataOutputStream을 반환한다
5. 클라이언트가 데이터를 쓸 때 네임 노드로부터 데이터 노드 리스트를 전달 받는다
6. 데이터 노드 사이에 파이프라인이 형성되고 데이터가 복제 수준만큼 복사된다
7. 이 때 네트워크 트래픽은 클라이언트와 데이터 노드 간에만 발생한다
```

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


# 참고

- [[토크ON세미나] 아파치 하둡](https://www.youtube.com/watch?v=OPodJE1jYbg){:target="_blank"}
- [Simplilearn, What Is HDFS?](https://www.youtube.com/watch?v=nRX4_3qf3rc&list=PLghTMrY7fIM5ZVa43Re7T_-DzLLIdAx6s){:target="_blank"}
- [Difference between Local File System (LFS) and Distributed File System (DFS)](https://www.geeksforgeeks.org/difference-between-local-file-system-lfs-and-distributed-file-system-dfs/){:target="_blank"}
- [Hoing: 하둡 프로그래밍(2) – 빅데이터 - 하둡 에코시스템](https://hoing.io/archives/21453){:target="_blank"}
