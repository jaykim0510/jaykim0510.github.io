---
layout: post
title:  'Data Engineering Series [Part4]: 데이터베이스간 주요 특징 비교'
description: 
date:   2022-04-05 15:01:35 +0300
image:  '/images/database_logo.jpeg'
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

# 데이터베이스 주요 특성

## 데이터베이스 모델

### RDBMS

- MySql
- PostreSQL
- Apache Hive
- AWS Redshift

### Document Store

- Schema free한 DBMS와 비슷한 느낌 (NoSQL 중에서 가장 RDBMS와 비슷한 데이터베이스)
- 데이터가 완전히 Structured 되어 있지 않지만, 최대한 DBMS와 비슷하게 사용하고 싶은 경우
- 데이터 하나는 JSON과 같은 객체
- SQL과 같은 언어로 데이터를 필터링하는 느낌으로 데이터를 읽음 => 읽어오는게 key-value만큼 빠르지는 않음
- 쿼리의 성능을 조금 포기하는 대신 범용적인 데이터 수집을 가능하게 함
- ex. MongoDB, Elasticsearch 등

### Wide Column Store
- Wide column databases store data in large column-based tables instead of rows. Queries can be run quickly on large amounts of data, making these databases common for retail and IoT data.
- A wide-column database is a NoSQL database that organizes data storage into flexible columns that can be spread across multiple servers or database nodes, using multi-dimensional mapping to reference data by column, row, and timestamp.
- A wide-column database is a type of NoSQL database in which the names and format of the columns can vary across rows, even within the same table. Wide-column databases are also known as column family databases. Because data is stored in columns, queries for a particular value in a column are very fast, as the entire column can be loaded and searched quickly. Related columns can be modeled as part of the same column family.
- Benefits of a wide-column NoSQL database include speed of querying, scalability, and a flexible data model.
- A relational database management system (RDBMS) stores data in a table with rows that all span a number of columns. If one row needs an additional column, that column must be added to the entire table, with null or default values provided for all the other rows. If you need to query that RDBMS table for a value that isn’t indexed, the table scan to locate those values will be very slow.

- Wide-column NoSQL databases still have the concept of rows, but reading or writing a row of data consists of reading or writing the individual columns. A column is only written if there’s a data element for it. Each data element can be referenced by the row key, but querying for a value is optimized like querying an index in a RDBMS, rather than a slow table scan.
- A Columnar data store will store each column separately on disk. A Wide-column database is a type of columnar database that supports a column family stored together on disk, not just a single column.
- Key-value와 비슷한데 차이점은 Key-value는 key로 무조건 Value 전체를 읽어야 함
- Wide-column은 key로 읽은 결과에서 Column을 통해 더 specific한 value를 얻을 수 있음
- ex. Apache Cassandra, Apache HBase
![](/images/wide_column_1.png)


### Key-Value Store

- 해시테이블과 같은 자료구조를 데이터베이스화 한 것
- Key를 통해 value를 가져올 수 있다
- Key는 유니크해야 한다
- Value는 어떤것이든 될 수 있다(숫자, 텍스트, JSON, URI, 이미지 등)
- Value의 일부만 읽는 것은 불가능 (이 점이 wide-column과의 차이)
- Value를 SQL과 같은 언어가 아니라 key값으로 가져옴 -> 굉장히 빠르다
- Key에 해당하는 value 한개
- Key-value store + In-memory => Redis => Redis가 캐싱 DB 서버로 많이 사용되는 이유
- ex. Redis, AWS DynamoDB, Apache HBase


## 쿼리 지원

## In-memory 지원

In-memory databases are purpose-built databases that rely **primarily on memory** for data storage, in contrast to databases that store data on disk or SSDs. In-memory data stores are designed to enable minimal response times by eliminating the need to access disks. Because all data is stored and managed exclusively in main memory, in-memory databases risk losing data upon a process or server failure. In-memory databases can persist data on disks by storing each operation in a log or by taking snapshots.  

In-memory databases are ideal for applications that require microsecond response times or have large spikes in traffic such as gaming leaderboards, session stores, and real-time analytics.  

- Redis
- AWS ElastiCache
- Microsoft SQL Server
- (MySQL, MongoDB와 같은 DB도 메모리 캐시를 지원하지만 주요 저장장치는 디스크이기 때문에 In-memory가 아님)

## 검색엔진 지원

- Elasticsearch

## Scale-Up, Scale-Out

- RDBMS가 Scale-Out이 가능한지에 관한 답은 CAP 이론을 공부해야함
- Relational databases are designed to run on a single server in order to maintain the integrity of the table mappings and avoid the problems of distributed computing.
- RDBMS가 Scale-out이 힘들다면 Redshift는 뭐지?

Today, the evolution of relational databases allows them to use more complex architectures, relying on a “master-slave” model in which the “slaves” are additional servers that can handle parallel processing and replicated data, or data that is “sharded” (divided and distributed among multiple servers, or hosts) to ease the workload on the master server.  

Other enhancements to relational databases such as using shared storage, in-memory processing, better use of replicas, distributed caching, and other new and ‘innovative’ architectures have certainly made relational databases more scalable. Under the covers, however, it is not hard to find a single system and a single point-of-failure (For example, Oracle RAC is a “clustered” relational database that uses a cluster-aware file system, but there is still a shared disk subsystem underneath). Often, the high costs of these systems is prohibitive as well, as setting up a single data warehouse can easily go over a million dollars.  

The enhancements to relational databases also come with other big trade-offs as well. For example, when data is distributed across a relational database it is typically based on pre-defined queries in order to maintain performance. In other words, flexibility is sacrificed for performance.  

Additionally, relational databases are not designed to scale back down—they are highly inelastic. Once data has been distributed and additional space allocated, it is almost impossible to “undistribute” that data.   

NoSQL databases are designed for massive scale on distributed systems (usually hundreds of Terabytes rather than tens of Gigabytes). They can scale-out “horizontally,” meaning that they run on multiple servers that work together, each sharing part of the load.  

Using this approach, a NoSQL database can operate across hundreds of servers, petabytes of data, and billions of documents—and still manage to process tens of thousands of transactions per second. And it can do all of this on inexpensive commodity (i.e. cheaper) hardware operating in any environment (i.e. cloud optimized!). Another benefit is that if one node fails, the others can pick up the workload, thus eliminating a single point of failure.  

Massive scale is impressive, but what is perhaps even more important is elasticity. Not all NoSQL databases are elastic. MarkLogic has a unique architecture that make it possible to quickly and easily add or remove nodes in a cluster so that the database stays in line with performance needs. There is not any complex sharding of data or architectural workarounds—data is automatically rebalanced across a cluster when nodes are added or removed. This also makes administration much easier, making it possible for one DBA to manage for data and with fewer headaches.  


# 주요 데이터베이스간 비교

## MySQL vs Hive vs Redshift

## MongoDB vs Cassandra vs ElasticSearch

## DynamoDB vs HBase vs Redis

- [AWS whitepapaer: Comparing the Use of Amazon DynamoDB and Apache HBase for NoSQL](https://docs.aws.amazon.com/whitepapers/latest/comparing-dynamodb-and-hbase-for-nosql/amazon-dynamodb-overview.html){:target="_blank"}

# Youtube

<iframe width="560" height="315" src="https://www.youtube.com/embed/FX5iWHFn1v0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  

![](/images/data_engineering_5.png)

![](/images/data_engineering_6.png)

# 참고

- [DB Engine 비교](https://db-engines.com/en/systems){:target="_blank"}
- [AWS, What Is an In-Memory Database?](https://aws.amazon.com/ko/nosql/in-memory/){:target="_blank"}
- [SCYLLA, Wide-column Database](https://www.scylladb.com/glossary/wide-column-database/){:target="_blank"}
- [stackoverflow, What exactly is a wide column store?](https://stackoverflow.com/questions/62010368/what-exactly-is-a-wide-column-store){:target="_blank"}
- [stackoverflow, Can relational database scale horizontally](https://stackoverflow.com/questions/27157227/can-relational-database-scale-horizontally){:target="_blank"}
- [What Keeps Relational Databases From Horizontal Scaling?](https://stackoverflow.com/questions/48825977/what-keeps-relational-databases-from-horizontal-scaling){:target="_blank"}
- [MATT ALLEN, Relational Databases Are Not Designed For Scale](https://www.marklogic.com/blog/relational-databases-scale/){:target="_blank"}
- [JBee, Scale Up, Scale Out, Sharding](https://asfirstalways.tistory.com/66)