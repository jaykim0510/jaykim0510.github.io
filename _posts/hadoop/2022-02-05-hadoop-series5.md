---
layout: post
title: 'Hadoop Series [Part5]: Hadoop MapReduce'
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

- 하둡은 데이터의 일부분이 저장된 클러스터의 각 머신에서 맵리듀스 프로그램을 실행한다
- 이를 위해 하둡은 YARN(하둡 자원관리 시스템)을 이용한다.
- 맵리듀스 프로그램은 어떠한 파일시스템도 접근할 수 있고 실행될 수 있지만, 대용량 데이터를 처리할 때는 데이터 지역성 최적화가 가능한 HDFS와 같은 분산 파일시스템을 선택하는 것이 좋다