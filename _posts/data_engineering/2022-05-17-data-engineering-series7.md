---
layout: post
title:  'Data Engineering Series [Part7]: CDC(Change Data Capture)'
description: 
date:   2022-05-17 15:01:35 +0300
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

관계형 데이터베이스에 캡처된 비즈니스 트랜잭션은 비즈니스 운영 상태를 이해하는 데 매우 중요합니다. 데이터의 가치는 시간이 지남에 따라 빠르게 떨어지기 때문에 조직에서는 데이터가 생성될 때 이를 분석할 수 있는 방법이 필요합니다. 운영 데이터베이스의 중단을 방지하기 위해 기업은 일반적으로 분석을 위해 데이터를 데이터 웨어하우스에 복제합니다.  

![](/images/cdc_5.png)  

기존에는 배치 기반 방식을 사용하여 하루에 한 번 또는 여러 번 데이터를 이동했습니다. 그러나 배치 이동은 지연 시간을 유발하고 조직에 운영 가치를 감소시킵니다.  

CDC(Change Data Capture)는 관계형 데이터베이스에서 데이터 웨어하우스, 데이터 레이크 또는 기타 데이터베이스로 데이터를 거의 실시간으로 이동하기 위한 이상적인 솔루션으로 부상했습니다. 이 게시물에서는 거의 실시간에 가까운 비즈니스 인텔리전스 및 클라우드 마이그레이션에 Change Data Capture가 이상적인 이유와 4가지 다른 Change Data Capture 방법에 대해 알아보겠습니다.  

# CDC
CDC는 데이터베이스에서 데이터에 대한 변경 사항을 식별하고 추적하는 소프트웨어 프로세스입니다. CDC는 새로운 데이터베이스 이벤트가 발생할 때 지속적으로 데이터를 이동하고 처리하여 실시간 또는 거의 실시간에 가까운 데이터 이동을 제공합니다.  

![](/images/cdc_1.png)

시간에 민감한 의사 결정이 내려지는 고속 데이터 환경에서 Change Data Capture는 지연 시간이 짧고 안정적이며 확장 가능한 데이터 복제를 달성하는 데 매우 적합합니다.  

2025년까지 80% 이상의 기업이 멀티 클라우드 전략을 구현할 계획을 세우고 있는 가운데, 여러 환경에서 데이터를 복제해야 하는 상황에서 비즈니스에 적합한 CDC 방법을 선택하는 것이 그 어느 때보다 중요합니다.  

## CDC를 구현하는 방법  

### 컬럼 검사

By using existing “LAST_UPDATED” or “DATE_MODIFIED” columns, or by adding them if not available in the application, you can create your own change data capture solution at the application level. This approach retrieves only the rows that have been changed since the data was last extracted.  

The CDC logic for the technique would be:  

Step 1: Get the maximum value of both the target (blue) table’s ‘Created_Time’ and ‘Updated_Time’ columns  

Step 2: Select all the rows from the data source with ‘Created_Time’ greater than (>) the target table’s maximum ‘Created_Time’ , which are all the newly created rows since the last CDC process was executed.   

Step 3: Select all rows from the source table that have an ‘Updated_Time’ greater than (>) the target table’s maximum ‘Updated_Time’ but less than (<) its maximum ‘Created_Time’. The reason for the exclusion of rows less than the maximum target create date is that they were included in step 2.  

Step 4: Insert new rows from step 2 or modify existing rows from step 3 in the target.  

### 테이블 델타

SQL문을 사용해서 소스 테이블과 타겟 테이블간의 테이블 델타(table delta 또는 tablediff)를 타겟 테이블에 적용(apply 또는 propagation)      

![](/images/cdc_2.png)

[**(Ways to compare and find differences for SQL Server tables and data 참고)**](https://www.mssqltips.com/sqlservertip/2779/ways-to-compare-and-find-differences-for-sql-server-tables-and-data/){:target="_blank"}

- 장점
  - 변경된 데이터를 정확히 볼 수 있다
- 단점
  - 데이터, 이전 스냅샷, 현재 스냅샷을 모두 저장하고 있어야 해서 용량 측면에서 비효율적
  - 데이터가 커질수록 변경된 부분 캡처하는데 CPU 자원 사용량이 선형적으로 증가
  - 캡처하는데 지연이 발생하기 때문에 실시간 데이터 환경에서 활용도 떨어짐

### 로그 기반

데이터베이스에는 충돌 시 데이터베이스를 복구할 수 있는 모든 데이터베이스 이벤트를 저장하는 트랜잭션 로그(redo 로그라고도 함)가 있습니다. 로그 기반 변경 데이터 캡처를 사용하면 삽입, 업데이트 및 삭제를 포함한 새로운 데이터베이스 트랜잭션이 원본 데이터베이스의 기본 트랜잭션 로그에서 읽힙니다.  

[**(Log-Based Change Data Capture: the Best Method for CDC 참고)**](https://www.striim.com/blog/log-based-change-data-capture/){:target="_blank"}

![](/images/cdc_4.png)  

애플리케이션 수준을 변경하지 않고 운영 테이블을 검색하지 않아도 변경 사항이 캡처됩니다. 이러한 변경 사항은 워크로드를 추가하고 소스 시스템의 성능을 저하시킵니다.

- 장점
  - 프로덕션 데이터베이스 시스템에 미치는 영향 최소화 
  - 각 트랜잭션에 대해 추가 쿼리 필요 없음
  - 여러 시스템에 걸쳐 ACID 신뢰성을 유지할 수 있습니다.
  - 프로덕션 데이터베이스 시스템의 스키마를 변경할 필요가 없거나 테이블을 추가할 필요가 없음

- 어려운 점
  - 데이터베이스의 내부 로깅 형식을 구문 분석하는 것은 복잡합니다. 대부분의 데이터베이스는 형식을 문서화하지 않으며 새로운 릴리스에서 데이터베이스의 변경 사항을 알리지 않습니다. 이 경우 새 데이터베이스 릴리스마다 데이터베이스 로그 구문 분석 논리를 변경해야 할 수 있습니다.
  - 원본 데이터베이스 변경 이벤트 메타데이터를 관리하는 시스템이 필요합니다.
  - 검색 가능한 트랜잭션 로그를 생성하는 데 필요한 추가 로그 레벨로 인해 한계 성능 오버헤드가 추가될 수 있음

Every database supporting transactions first writes any changes (inserts, updates, and deletes) to a database log before writing it to the database. This is done to assure the integrity of transactions from unexpected occurrences like power failure etc., while the transaction is still inflight.  

The database logs cycle between active log (redo log) and archive logs based on file size or time interval events. Depending on the target database's data latency requirements, the CDC tool can access the active log or archive logs for the source database.  

Since the CDC tool only reads from the source database logs, it does not add to the source database load. Moreover, the changelog is typically many orders of magnitude smaller than the source table. Such a flow of such a changelog over the network does not cause any network load issues.  

Since database logs only contain information about the most recent inserts, updates, and deletes, changelog calculation becomes a trivial undertaking. However, since there are many database vendors, each with its own (sometimes proprietary) log format, such tasks are best left to commercial CDC tool vendors.  


# Debezium
Another option for implementing a CDC solution is by using the native database logs that both MySQL and Postgres can produce when configured to do so. These database logs record every operation that is executed against the database which can then be used to replicate these changes in a target system.  

The advantage of using database logs is that firstly, you don’t need to write any code or add any extra logic to your tables as you do with update timestamps. Second, it also supports deletion of records, something that isn’t possible with update timestamps.  

In MySQL you do this by turning on the binlog and in Postgres, you configure the Write Ahead Log (WAL) for replication. Once the database is configured to write these logs you can choose a CDC system to help capture the changes. Two popular options are Debezium and Amazon Database Migration Service (DMS). Both of these systems utilise the binlog for MySQL and WAL for Postgres.  

Debezium works natively with Kafka. It picks up the relevant changes, converts them into a JSON object that contains a payload describing what has changed and the schema of the table and puts it on a Kafka topic. This payload contains all the context required to apply these changes to our target system, we just need to write a consumer or use a Kafka Connect sink to write the data. As Debezium uses Kafka, we get all the benefits of Kafka such as fault tolerance and scalability.  

![](/images/cdc_6.png)  

AWS DMS works in a similar way to Debezium. It supports many different source and target systems and integrates natively with all of the popular AWS data services including Kinesis and Redshift.  

The main benefit of using DMS over Debezium is that it's effectively a “serverless” offering. With Debezium, if you want the flexibility and fault tolerance of Kafka, you have the overhead of deploying a Kafka cluster. DMS as its name states is a service. You configure the source and target endpoints and AWS takes care of handling the infrastructure to deal with monitoring the database logs and copying the data to the target.  

However, this serverless approach does have its drawbacks, mainly in its feature set.    

When weighing up which pattern to follow it’s important to assess your specific use case. Using update timestamps works when you only want to capture inserts and updates, if you already have a Kafka cluster you can get up and running with this very quickly, especially if most tables already include some kind of update timestamp.  

If you’d rather go with the database log approach, maybe because you want exact replication then you should look to use a service like Debezium or AWS DMS. I would suggest first checking which system supports the source and target systems you require. If you have some more advanced use cases such as masking sensitive data or re-routing data to different queues based on its content then Debezium is probably the best choice. If you’re just looking for simple replication with little overhead then DMS will work for you if it supports your source and target system.  

If you have real-time analytics needs, you may consider using a target database like Rockset as an analytics serving layer. Rockset integrates with MySQL and Postgres, using AWS DMS, to ingest CDC streams and index the data for sub-second analytics at scale. Rockset can also read CDC streams from NoSQL databases, such as MongoDB and Amazon DynamoDB.  

The right answer depends on your specific use case and there are many more options than have been discussed here, these are just some of the more popular ways to implement a modern CDC system.  


# 참고

- [striim: Change Data Capture (CDC): What it is and How it Works](https://www.striim.com/blog/change-data-capture-cdc-what-it-is-and-how-it-works/){:target="_blank"}
- [Farhan Siddiqui, Change Data Capture(CDC) for Data Lake Data Ingestion](https://towardsdatascience.com/change-data-capture-cdc-for-data-ingestion-ca81ff5934d2){:target="_blank"}
- [How to Implement CDC for MySQL and Postgres](https://rockset.com/blog/cdc-mysql-postgres/){:target="_blank"}
- [/blog What are the Different Methods of Change Data Capture (CDC)?](https://www.hvr-software.com/blog/change-data-capture/){:target="_blank"}