---
layout: post
title:  'Data Engineering Series [Part1]: Database, Warehouse, Lake, Lakehouse'
description: 
date:   2022-04-01 15:01:35 +0300
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

# DataBase

A database is a collection of data or information. Databases are typically accessed electronically and are used to support Online Transaction Processing (OLTP). Database Management Systems (DBMS) store data in the database and enable users and applications to interact with the data. The term “database” is commonly used to reference both the database itself as well as the DBMS.  

A variety of database types have emerged over the last several decades. All databases store information, but each database will have its own characteristics. Relational databases store data in tables with fixed rows and columns. Non-relational databases (also known as NoSQL databases) store data in a variety of models including JSON (JavaScript Object Notation), BSON (Binary JSON), key-value pairs, tables with rows and dynamic columns, and nodes and edges. Databases store structured and/or semi-structured data, depending on the type.  

You may also find database characteristics like:  

- Security features to ensure the data can only be accessed by authorized users.
- ACID (Atomicity, Consistency, Isolation, Durability) transactions to ensure data integrity.
- Query languages and APIs to easily interact with the data in the database.
- Indexes to optimize query performance.
- Full-text search.
- Optimizations for mobile devices.
- Flexible deployment topologies to isolate workloads (e.g., analytics workloads) to a specific - set of resources.
- On-premises, private cloud, public cloud, hybrid cloud, and/or multi-cloud hosting options.

If your application needs to store data (and nearly every interactive application does), your application needs a database. Applications across industries and use cases are built on databases. Many types of data can be stored in databases, including:  

- Patient medical records
- Items in an online store
- Financial records
- Articles and blog entries
- Sports scores and statistics
- Online gaming information
- Student grades and scores
- IoT device readings
- Mobile application information

Database examples  

- Relational databases: Oracle, MySQL, Microsoft SQL Server, and PostgreSQL
- Document databases: MongoDB and CouchDB
- Key-value databases: Redis and DynamoDB
- Wide-column stores: Cassandra and HBase
- Graph databases: Neo4j and Amazon Neptune

![](/images/data_engineering_2.png){: width="70%"}

# Data Warehouse

![](/images/data_engineering_1.png)

![](/images/data_engineering_4.png)

데이터 웨어하우스는 정보에 입각한 의사 결정을 내릴 수 있도록 분석 가능한 정보의 중앙 repository다
트랜잭션 시스템, RDB 및 기타 소스의 데이터들이 데이터웨어하우스에 들어간다(insert)

이렇게 데이터웨어하우스에 있는 데이터들을 Business Analyst나 Data Scientist 와 같은 사람들이 BI(Business Inteligence)나 SQL 등을 이용해서 데이터에 액세스 한다

하단 티어 즉 최하위에 있는 부분은 Data 부분인 위에서 말했던 트랜잭션 시스템, RDB 등을 비롯한 데이터들이고 이것들이 ETL(Extract Transform Load) 과정을 거쳐서 Data Warehouse에 적재가 된다

중간 티어 OLAP Server는 데이터에 액세스하고 분석하는데 사용되는 분석엔진 들이다, 여기서 OLAP란 OnLine Analytical Processing을 말한다.

상위 티어는 사용자가 실제로 데이터를 분석하고 마이닝을 하고 또 보고할 때 사용하게 되는 frontend가 존재하는 티어다.

이렇게 이루어진 데이터 웨어하우스는 데이터를 정수, 데이터 필드 또는 문자열과 같은 레이아웃 및 유형들을 설명하는 스키마로 구성함으로써 동작하게 된다. 즉 ETL, 데이터를 추출해서 변환해서 스키마에 적재해두는 것이다

A data warehouse is a unified data repository for storing large amounts of information from multiple sources within an organization. A data warehouse represents a single source of “data truth” in an organization and serves as a core reporting and business analytics component.  

Typically, data warehouses store historical data by combining relational data sets from multiple sources, including application, business, and transactional data. Data warehouses extract data from multiple sources and transform and clean the data before loading it into the warehousing system to serve as a single source of data truth. Organizations invest in data warehouses because of their ability to quickly deliver business insights from across the organization.  

Data warehouses enable business analysts, data engineers, and decision-makers to access data via BI tools, SQL clients, and other less advanced (i.e., non-data science) analytics applications.  

Note that data warehouses are not intended to satisfy the transaction and concurrency needs of an application. If an organization determines they will benefit from a data warehouse, they will need a separate database or databases to power their daily operations.

- Amazon Redshift.
- Google BigQuery.
- IBM Db2 Warehouse.
- Microsoft Azure Synapse.
- Oracle Autonomous Data Warehouse.
- Snowflake. (YOUR DATA WAREHOUSE AND DATA LAKE)
- Teradata Vantage.

# Data Lake

데이터 레이크는 데이터 웨어하우스와는 달리 별도로 정형화나 정규화 등을 하지 않고 데이터를 있는 그대로 원시데이터 상태를 저장한다는 것이다.  

데이터 레이크로 유입되는 데이터들은 자신의 출처와 시간 같은 메타데이터가 존재하여야 한다.  

데이터 레이크는 그 크기가 매우 커질것이고 대부분의 저장소는 스키마가 없는 큰 규모의 구조를 지향하기 때문에 일반적으로 데이터 레이크를 구현을 할 때 Hadoop과 HDFS를 비롯한 에코시스템을 사용하는 것이다. (?)  

A data lake is a centralized, highly flexible storage repository that stores large amounts of structured and unstructured data in its raw, original, and unformatted form. In contrast to data warehouses, which store already “cleaned” relational data, a data lake stores data using a flat architecture and object storage in its raw form. Data lakes are flexible, durable, and cost-effective and enable organizations to gain advanced insight from unstructured data, unlike data warehouses that struggle with data in this format.  

In data lakes, the schema or data is not defined when data is captured; instead, data is extracted, loaded, and transformed (ELT) for analysis purposes. Data lakes allow for machine learning and predictive analytics using tools for various data types from IoT devices, social media, and streaming data.  

A data lake is a repository of data from disparate sources that is stored in its original, raw format. Like data warehouses, data lakes store large amounts of current and historical data. What sets data lakes apart is their ability to store data in a **variety of formats** including JSON, BSON, CSV, TSV, Avro, ORC, and Parquet.  

Typically, the primary purpose of a data lake is to analyze the data to gain insights. However, organizations sometimes use data lakes simply for their cheap storage with the idea that the data may be used for analytics in the future.  

You might be wondering, "Is a data lake a database?" A data lake is a repository for data stored in a variety of ways including databases. With modern tools and technologies, a data lake can also form the storage layer of a database. Tools like Starburst, Presto, Dremio, and Atlas Data Lake can give a database-like view into the data stored in your data lake. In many cases, these tools can power the same analytical workloads as a data warehouse.  
(데이터 레이크는 데이터 분석 단계에서 사용할 목적으로 수집한 저장소는 아니다. 하지만 Presto 같은 걸 사용하면 데이터 레이크에서도 데이터 웨어하우스나 데이터베이스에서 처럼 데이터 분석을 할 수 있다)


Data lakes store large amounts of structured, semi-structured, and unstructured data. They can contain everything from relational data to JSON documents to PDFs to audio files.  

Data does not need to be transformed in order to be added to the data lake, which means data can be added (or “ingested”) incredibly efficiently without upfront planning.  

The primary users of a data lake can vary based on the structure of the data. Business analysts will be able to gain insights when the data is more structured. When the data is more unstructured, data analysis will likely require the expertise of developers, data scientists, or data engineers.  

The flexible nature of data lakes enables business analysts and data scientists to look for unexpected patterns and insights. The raw nature of the data combined with its volume allows users to solve problems they may not have been aware of when they initially configured the data lake.  

Data in data lakes can be processed with a variety of OLAP systems and visualized with BI tools.  

Data lakes are a cost-effective way to store huge amounts of data. Use a data lake when you want to gain insights into your current and historical data in its raw form without having to transform and move it. Data lakes also support machine learning and predictive analytics.  

Like data warehouses, data lakes are not intended to satisfy the transaction and concurrency needs of an application.  

- AWS S3
- Azure Data Lake Storage Gen2
- Google Cloud Storage

Other technologies enable organizing and querying data in data lakes, including:  

- MongoDB Atlas Data Lake.
- AWS Athena.
- Presto.
- Starburst.
- Databricks SQL Analytics.

# Data Lakehouse

A data lakehouse is a new, big-data storage architecture that combines the best features of both data warehouses and data lakes. A data lakehouse enables a single repository for all your data (structured, semi-structured, and unstructured) while enabling best-in-class machine learning, business intelligence, and streaming capabilities.

Data lakehouses usually start as data lakes containing all data types; the data is then converted to Delta Lake format (an open-source storage layer that brings reliability to data lakes). Delta lakes enable ACID transactional processes from traditional data warehouses on data lakes.

# Summary

Databases, data warehouses, and data lakes are all used to store data. So what's the difference?  

The key differences between a database, a data warehouse, and a data lake are that:  

- A database stores the current data required to power an application.
- A data warehouse stores current and historical data from one or more systems in a predefined and fixed schema, which allows business analysts and data scientists to easily analyze the data.
- A data lake stores current and historical data from one or more systems in its raw form, which allows business analysts and data scientists to easily analyze the data.

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
