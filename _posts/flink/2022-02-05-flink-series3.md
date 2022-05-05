---
layout: post
title: 'Flink Series [Part3]: 스트림 처리의 핵심(2) 상태관리'
description: 
date: 2022-02-05 15:01:35 +0300
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

Every non-trivial streaming application is stateful, i.e., only applications that apply transformations on individual events do not require state. Any application that runs basic business logic needs to remember events or intermediate results to access them at a later point in time, for example when the next event is received or after a specific time duration.  

Application state is a first-class citizen in Flink. You can see that by looking at all the features that Flink provides in the context of state handling.  

- **Multiple State Primitives**: Flink provides state primitives for different data structures, such as atomic values, lists, or maps. Developers can choose the state primitive that is most efficient based on the access pattern of the function.
- **Pluggable State Backends**: Application state is managed in and checkpointed by a pluggable state backend. Flink features different state backends that store state in memory or in RocksDB, an efficient embedded on-disk data store. Custom state backends can be plugged in as well.
- **Exactly-once state consistency**: Flink’s checkpointing and recovery algorithms guarantee the consistency of application state in case of a failure. Hence, failures are transparently handled and do not affect the correctness of an application.
- **Very Large State**: Flink is able to maintain application state of several terabytes in size due to its asynchronous and incremental checkpoint algorithm.
- **Scalable Applications**: Flink supports scaling of stateful applications by redistributing the state to more or fewer workers.

# 참고
- [Flink 공식문서: What is Apache Flink? — Applications](https://flink.apache.org/flink-applications.html){:target="_blank"}
- [Flink 공식문서: Stateful Stream Processing](https://nightlies.apache.org/flink/flink-docs-master/docs/concepts/stateful-stream-processing/){:target="_blank"}
- [아파치 플링크로 하는 스트림 데이터 처리 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791161754093&orderClick=LEa&Kc=){:target="_blank"}
- [](){:target="_blank"}
- [](){:target="_blank"}