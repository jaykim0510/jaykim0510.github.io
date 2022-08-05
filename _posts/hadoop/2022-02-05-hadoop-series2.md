---
layout: post
title: 'Hadoop Series [Part2]: Hadoop HDFS'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/hadoop_logo.png'
logo_image: '/images/hadoop_logo.png'
categories: DE
tags: Hadoop
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

데이터가 단일 물리 머신의 저장 용량을 초과하게 되면 전체 데이터셋을 분리된 여러 머신에 나눠서 저장할 필요가 있다. 네트워크로 연결된 여러 머신의 스토리지를 관리하는 파일시스템을 분산 파일시스템이라고 한다.  

하둡은 HDFS(Hadoop Distributed File System)라는 분산 파일시스템을 제공한다. HDFS는 범용 하드웨어로 구성된 클러스터에서 실행되고 스트리밍 방식의 데이터 접근 패턴으로 대용량 파일을 다룰 수 있도록 설계된 파일시스템이다. HDFS의 설계특성은 다음과 같다.  

- 매우 큰 파일
- 스트리밍 방식의 데이터 접근
  - HDFS는 '가장 효율적인 데이터 처리 패턴은 한 번 쓰고 여러 번 읽는 것'이라는 아이디어에서 출발
- 범용 하드웨어
- 높은 데이터 처리량
  - HDFS는 높은 데이터 처리량을 제공하기 위해 최적화되어 있고 이를 위해 응답 시간을 희생했다
  - 빠른 응답시간을 원한다면 HBase가 하나의 대안이 될 수 있다