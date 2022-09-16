---
layout: post
title:  'Data Engineering Series [Part1]: Database, Warehouse, Lake, Lakehouse'
description: 
date:   2022-04-01 15:01:35 +0300
image:  '/images/data_en_1.png'
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

![](/images/data_en_1.png)

# Database

- 데이터베이스는 데이터 수집, 활용을 위한 도구
- 데이터베이스는 전형적으로 OLTP를 위한 도구로 사용
- 데이터베이스는 보통 데이터 접근을 돕는 DBMS를 포함
- 정형 데이터베이스, 비정형 데이터베이스가 있음

## 데이터베이스의 특징

- 인가된 사용자만 접근할 수 있도록할 수 있음
- 데이터의 ACID 특성을 보장해주는 트랜잭션 처리 기능을 지원하기도 함
- 데이터에 접근하기 위해 SQL과 유사한 언어를 지원함
- 쿼리의 성능을 위해 인덱싱 기능을 지원함

## 데이터베이스 예시

- Relational databases: Oracle, MySQL, Microsoft SQL Server, and PostgreSQL
- Document databases: MongoDB and CouchDB
- Key-value databases: Redis and DynamoDB
- Wide-column stores: Cassandra and HBase
- Graph databases: Neo4j and Amazon Neptune

# Data Warehouse

- 데이터 웨어하우스는 다양한 소스에서 수집한 대량의 데이터를 통합하기 위한 저장소
- 데이터 웨어하우스는 데이터에 기반한 비즈니스 분석, 결과 보고를 위한 핵심 저장소
- 그래서 보통 데이터를 정재해서 웨어하우스에 저장
- 데이터 웨어하우스는 여러 데이터베이스의 데이터를 정재하고 정형화해서 통합한 후 비즈니스 활용 목적으로 많이 사용됨

## 데이터 웨어하우스의 특징

- 데이터 웨어하우스는 보통 historical, various한 데이터를 정재, 통합하는 장소
- 데이터 분석가들이 보통 데이터 웨어하우스의 데이터를 활용해 분석
- 데이터 웨어하우스는 보통 미리 정의된 스키마가 있음
- 그래서 데이터를 정형화할 수 있음


## 데이터 웨어하우스의 장점

- 데이터가 정재, 정형화 되어 있어서 OLAP를 위한 용도에 적합
- 보통 컬럼 기반의 데이터베이스를 사용해 빠른 분석을 지원
- 빠른 의사결정을 위해 통합된 데이터 웨어하우스

## 데이터 웨어하우스 예시

- Amazon Redshift.
- Google BigQuery.
- IBM Db2 Warehouse.
- Microsoft Azure Synapse.
- Oracle Autonomous Data Warehouse.
- Snowflake.
- Teradata Vantage.



# Data Lake

- 데이터레이크는 다양한 소스에서 정재되지 않은 데이터를 우선적으로 통합 저장하는 곳
- 아직 데이터를 어떻게 정재해야 할지, 어떤 용도로 사용하지 정해지지 않았을 때 우선적으로 저장함
- 정재되지 않은 데이터 자체를 분석해 미래에 어떤 식으로 이용할지 계획하기도 함 -> 이를 위해 Presto, AWS Athena 등 이용
- JSON, BSON, CSV, Avro, Parquet 등 다양한 포맷의 데이터를 우선적으로 통합해 저장

## 데이터레이크 예시

- AWS S3
- Azure Data Lake Storage Gen2
- Google Cloud Storage

## 데이터레이크의 분석을 돕는 도구

- MongoDB Atlas Data Lake.
- AWS Athena.
- Presto.
- Starburst.
- Databricks SQL Analytics.

# Summary

||**Database**|**Data Warehouse**|**Data Lake**|
|**Workloads**|Operational and transactional|Analytical|Analytical|
|**Data Type**|Structured or semi-structured|Structured and/or semi-structured|Structured, semi-structured, and/or unstructured|
|**Schema Flexibility**|Rigid or flexible schema depending on database type|Pre-defined and fixed schema definition for ingest (schema on write and read)|No schema definition required for ingest (schema on read)|
|**Data Freshness**|Real time|May not be up-to-date based on frequency of ETL processes|May not be up-to-date based on frequency of ETL processes|
|**Users**|Application developers|Business analysts and data scientists|Business analysts, application developers, and data scientists|
|**Pros**|Fast queries for storing and updating data|The fixed schema makes working with the data easy for business analysts|Easy data storage simplifies ingesting raw data. A schema is applied afterwards to make working with the data easy for business analysts. Separate storage and compute|
|**Cons**|May have limited analytics capabilities|Difficult to design and evolve schema. Scaling compute may require unnecessary scaling of storage, because they are tightly coupled|Requires effort to organize and prepare data for use|



# 참고

- [MongoDB 공식문서: Databases vs. Data Warehouses vs. Data Lakes (추천)](https://www.mongodb.com/databases/data-lake-vs-data-warehouse-vs-database){:target="_blank"}
- [striim: Data Warehouse vs. Data Lake vs. Data Lakehouse](https://www.striim.com/blog/data-warehouse-vs-data-lake-vs-data-lakehouse-an-overview/){:target="_blank"}
- [EDUCBA: Redis vs MongoDB](https://www.educba.com/redis-vs-mongodb/?source=leftnav){:target="_blank"}
- [EDUCBA: Data Warehouse vs Data Lake](https://www.educba.com/data-lake-vs-data-warehouse/?source=leftnav){:target="_blank"}
- [비투엔: Data Warehouse vs Data Lake](https://blog.b2en.com/253){:target="_blank"}
- [화해블로그, 화해의 Data Warehouse를 소개합니다](http://blog.hwahae.co.kr/all/tech/tech-tech/9409/){:target="_blank"}
- [luminousmen, Data Lake vs Data Warehouse](https://luminousmen.com/post/data-lake-vs-data-warehouse){:target="_blank"}