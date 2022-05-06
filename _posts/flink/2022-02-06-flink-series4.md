---
layout: post
title: 'Flink Series [Part4]: 플링크의 아키텍처'
description: 
date: 2022-02-06 15:01:35 +0300
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

# Flink 생태계 구성  

![](/images/flink_23.png) 

# Flink 런타임 아키텍처

플링크 런타임은 두 종류의 프로세스로 구성됩니다. 하나는 **Job Manager**이고 다른 하나는 **Task Manger**로 Task Manager는 한 개 이상으로 구성할 수 있습니다.  

플링크 클라이언트는 런타임에 포함되지는 않지만 데이터플로우를 Job Manager로 보내는 역할을 합니다. 이 후 클라이언트는 연결을 끊을 수도 있고 또는 attached mode를 통해 진행 경과를 보고 받을 수도 있습니다. 클라이언트는 자바 위에서 클라이언트 명령어로 실행됩니다.  

![](/images/flink_22.png) 

## Job Manager

잡 매니저는 어플리케이션의 **실행을 제어하는 마스터 프로세스**입니다. 클라이언트는 잡 매니저로 어플리케이션을 제출합니다. 어플리케이션은 데이터플로우 그래프(또는 잡그래프)와 필요한 클래스, 라이브러리 등을 포함하는 JAR파일로 구성되어 있습니다.  

잡 매니저는 잡그래프를 실행그래프(ExecutionGraph)라고 불리는 물리적인 그래프로 변환합니다. 잡 매니저는 태스크 매니저내에 사용 가능한 태스크 슬롯에 잡그래프를 태스크 형태로 배포합니다.  

![](/images/flink_25.png) 

또한 잡 매니저는 완료된 태스크, 실행 실패, 장애 복구, 체크포인트 조율 등 중앙에서 제어해야 하는 모든 동작에 책임을 집니다.  

![](/images/flink_21.png)  

## Task Manager

태스크 매니저(워커)는 **데이터플로우의 태스크들을 실행**합니다. 태스크 매니저에 할당하는 가장 작은 작업 단위를 태스크 슬롯이라고 합니다. 태스크 매니저 안에 있는 슬롯의 개수는 동시에 처리되는 작업의 개수를 나타냅니다. 하나의 슬롯안에서 여러개의 연산자가 실행될 수도 있습니다. 

![](/images/flink_26.png)  

## Tasks and Operator Chains

플링크의 태스크는 연산자를 체이닝한 서브태스크의 집합으로 이루어져 있습니다. 각각의 서브태스크는 하나의 스레드에서 실행됩니다. 이렇게 연산자들을 체이닝 함으로써 플링크는 스레드간 핸드오버와 버퍼링으로 인한 오버헤드를 줄입니다. 이는 전체적인 처리량 증가와 지연율 감소를 가능하게 합니다.  

![](/images/flink_28.png) 



## Task Slots and Resources

태스크 매니저는 각각 하나의 JVM 프로세스입니다. 그리고 태스크 매니저는 하나 이상의 서브태스크를 스레드로 분리할 수 있습니다. 

각각의 태스크 슬롯은 각각의 분리된 자원으로 가장 작은 작업 단위 입니다. 태스크 슬롯으로 분리된 작업들은 자원을 위해 서로 경쟁할 일이 없습니다. 태스크 슬롯에서 분리하는 자원은 메모리 뿐입니다. CPU는 분리되지 않습니다.  

태스크 매니저는 각각 하나의 JVM 프로세스이기 때문에 태스크 매니저가 여러개의 태스크 슬롯을 가진다면 여러개의 태스크가 하나의 JVM 프로세스 위에서 실행된다는 의미입니다. 하나의 JVM 위에서 실행되는 태스크들은 TCP 연결을 통해 서로 하트비트 메세지를 주고 받습니다. 또한 태스크간 데이터셋을 공유함으로써 태스크별로 발생하는 오버헤드를 줄여줍니다.  

플링크는 디폴트로 작업의 전체 파이프라인을 하나의 슬롯에 할당합니다.  

![](/images/flink_27.png)  

# Flink API

![](/images/flink_24.png) 

- The lowest level abstraction simply offers stateful and timely stream processing. It is embedded into the DataStream API via the Process Function. It allows users to freely process events from one or more streams, and provides consistent, fault tolerant state. In addition, users can register event time and processing time callbacks, allowing programs to realize sophisticated computations.

- In practice, many applications do not need the low-level abstractions described above, and can instead program against the Core APIs: the DataStream API (bounded/unbounded streams) and the DataSet API (bounded data sets). These fluent APIs offer the common building blocks for data processing, like various forms of user-specified transformations, joins, aggregations, windows, state, etc. Data types processed in these APIs are represented as classes in the respective programming languages.

    The low level Process Function integrates with the DataStream API, making it possible to use the lower-level abstraction on an as-needed basis. The DataSet API offers additional primitives on bounded data sets, like loops/iterations.

- The Table API is a declarative DSL centered around tables, which may be dynamically changing tables (when representing streams). The Table API follows the (extended) relational model: Tables have a schema attached (similar to tables in relational databases) and the API offers comparable operations, such as select, project, join, group-by, aggregate, etc. Table API programs declaratively define what logical operation should be done rather than specifying exactly how the code for the operation looks. Though the Table API is extensible by various types of user-defined functions, it is less expressive than the Core APIs, and more concise to use (less code to write). In addition, Table API programs also go through an optimizer that applies optimization rules before execution.

    One can seamlessly convert between tables and DataStream/DataSet, allowing programs to mix the Table API with the DataStream and DataSet APIs.

- The highest level abstraction offered by Flink is SQL. This abstraction is similar to the Table API both in semantics and expressiveness, but represents programs as SQL query expressions. The SQL abstraction closely interacts with the Table API, and SQL queries can be executed over tables defined in the Table API.

# 참고
- [Flink and Kafka Streams: a Comparison and Guideline for Users](https://www.confluent.io/blog/apache-flink-apache-kafka-streams-comparison-guideline-users/){:target="_blank"}
- [Kartik Khare, Here’s How Apache Flink Stores Your State data](https://towardsdatascience.com/heres-how-flink-stores-your-state-7b37fbb60e1a){:target="_blank"}
- [stackoverflow: Storage in Apache Flink](https://stackoverflow.com/questions/31951978/storage-in-apache-flink){:target="_blank"}
