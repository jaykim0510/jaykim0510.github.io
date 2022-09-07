---
layout: post
title:  'Data Engineering Series [Part1]: Database, Warehouse, Lake, Lakehouse'
description: 
date:   2022-04-01 15:01:35 +0300
image:  '/images/data_warehouse_logo.png'
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


A data warehouse is a unified data repository for storing large amounts of information from multiple sources within an organization. A data warehouse represents a single source of “data truth” in an organization and serves as a core reporting and business analytics component.  

Typically, data warehouses store historical data by combining relational data sets from multiple sources, including application, business, and transactional data. Data warehouses extract data from multiple sources and transform and clean the data before loading it into the warehousing system to serve as a single source of data truth. Organizations invest in data warehouses because of their ability to quickly deliver business insights from across the organization.  

Data warehouses enable business analysts, data engineers, and decision-makers to access data via BI tools, SQL clients, and other less advanced (i.e., non-data science) analytics applications.  

A data warehouse is a system that stores highly structured information from various sources. Data warehouses typically store current and historical data from one or more systems. The goal of using a data warehouse is to combine disparate data sources in order to analyze the data, look for insights, and create business intelligence (BI) in the form of reports and dashboards.

You might be wondering, "Is a data warehouse a database?" Yes, a data warehouse is a giant database that is optimized for analytics.

## Data warehouse characteristics
Data warehouses store large amounts of current and historical data from various sources. They contain a range of data, from raw ingested data to highly curated, cleansed, filtered, and aggregated data.  

Extract, transform, load (ETL) processes move data from its original source to the data warehouse. The ETL processes move data on a regular schedule (for example, hourly or daily), so data in the data warehouse may not reflect the most up-to-date state of the systems.  

Data warehouses typically have a pre-defined and fixed relational schema. Therefore, they work well with structured data. Some data warehouses also support semi-structured data.  

Once the data is in the warehouse, business analysts can connect data warehouses with BI tools. These tools allow business analysts and data scientists to explore the data, look for insights, and generate reports for business stakeholders.  

## Why use a data warehouse?
Data warehouses are a good option when you need to store large amounts of historical data and/or perform in-depth analysis of your data to generate business intelligence. Due to their highly structured nature, analyzing the data in data warehouses is relatively straightforward and can be performed by business analysts and data scientists.  

Note that data warehouses are not intended to satisfy the transaction and concurrency needs of an application. If an organization determines they will benefit from a data warehouse, they will need a separate database or databases to power their daily operations.   

Improving data standardization, quality, and consistency: Organizations generate data from various sources, including sales, users, and transactional data. Data warehousing consolidates corporate data into a consistent, standardized format that can serve as a single source of data truth, giving the organization the confidence to rely on the data for business needs.  

Delivering enhanced business intelligence: Data warehousing bridges the gap between voluminous raw data, often collected automatically as a matter of practice, and the curated data that offers insights. They serve as the data storage backbone for organizations, allowing them to answer complex questions about their data and use the answers to make informed business decisions.  

Increasing the power and speed of data analytics and business intelligence workloads: Data warehouses speed up the time required to prepare and analyze data. Since the data warehouse’s data is consistent and accurate, they can effortlessly connect to data analytics and business intelligence tools. Data warehouses also cut down the time required to gather data and give teams the power to leverage data for reports, dashboards, and other analytics needs.  

Improving the overall decision-making process: Data warehousing improves decision-making by providing a single repository of current and historical data. Decision-makers can evaluate risks, understand customers’ needs, and improve products and services by transforming data in data warehouses for accurate insights.   

## Data warehouse examples
Examples of data warehouses include:  

- Amazon Redshift.
- Google BigQuery.
- IBM Db2 Warehouse.
- Microsoft Azure Synapse.
- Oracle Autonomous Data Warehouse.
- Snowflake.
- Teradata Vantage.



# Data Lake


A data lake is a centralized, highly flexible storage repository that stores large amounts of structured and unstructured data in its raw, original, and unformatted form. In contrast to data warehouses, which store already “cleaned” relational data, a data lake stores data using a flat architecture and object storage in its raw form. Data lakes are flexible, durable, and cost-effective and enable organizations to gain advanced insight from unstructured data, unlike data warehouses that struggle with data in this format.  

In data lakes, the schema or data is not defined when data is captured; instead, data is extracted, loaded, and transformed (ELT) for analysis purposes. Data lakes allow for machine learning and predictive analytics using tools for various data types from IoT devices, social media, and streaming data.  

A data lake is a repository of data from disparate sources that is stored in its original, raw format. Like data warehouses, data lakes store large amounts of current and historical data. What sets data lakes apart is their ability to store data in a **variety of formats** including JSON, BSON, CSV, TSV, Avro, ORC, and Parquet.  

Typically, the primary purpose of a data lake is to analyze the data to gain insights. However, organizations sometimes use data lakes simply for their cheap storage with the idea that the data may be used for analytics in the future.  

## Is a data lake a database?

You might be wondering, "Is a data lake a database?" A data lake is a repository for data stored in a variety of ways including databases. With modern tools and technologies, a data lake can also form the storage layer of a database. Tools like Starburst, Presto, Dremio, and Atlas Data Lake can give a database-like view into the data stored in your data lake. In many cases, these tools can power the same analytical workloads as a data warehouse.  
(데이터 레이크는 데이터 분석 단계에서 사용할 목적으로 수집한 저장소는 아니다. 하지만 Presto 같은 걸 사용하면 데이터 레이크에서도 데이터 웨어하우스나 데이터베이스에서 처럼 데이터 분석을 할 수 있다)

## Data lake characteristics

Data lakes store large amounts of structured, semi-structured, and unstructured data. They can contain everything from relational data to JSON documents to PDFs to audio files.  

Data does not need to be transformed in order to be added to the data lake, which means data can be added (or “ingested”) incredibly efficiently without upfront planning.  

The primary users of a data lake can vary based on the structure of the data. Business analysts will be able to gain insights when the data is more structured. When the data is more unstructured, data analysis will likely require the expertise of developers, data scientists, or data engineers.  

The flexible nature of data lakes enables business analysts and data scientists to look for unexpected patterns and insights. The raw nature of the data combined with its volume allows users to solve problems they may not have been aware of when they initially configured the data lake.  

Data in data lakes can be processed with a variety of OLAP systems and visualized with BI tools.  

## Why use a data lake?

Data lakes are a cost-effective way to store huge amounts of data. Use a data lake when you want to gain insights into your current and historical data in its raw form without having to transform and move it. Data lakes also support machine learning and predictive analytics.  

Like data warehouses, data lakes are not intended to satisfy the transaction and concurrency needs of an application.  

Data consolidation: Data lakes can store both structured and unstructured data to eliminate the need to store both data formats in different environments. They provide a central repository to store all types of organizational data.  

Data flexibility: A significant benefit of data lakes is their flexibility; you can store data in any format or medium without the need to have a predefined schema. Allowing the data to remain in its native format allows for more data for analysis and caters to future data use cases.  

Cost savings: Data lakes are less expensive than traditional data warehouses; they are designed to be stored on low-cost commodity hardware, like object storage, usually optimized for a lower cost per GB stored. For example, Amazon S3 standard object storage offers an unbelievable low price of $0.023 per GB for the first 50 TB/month.  

Support for a wide variety of data science and machine learning use cases: Data in data lakes is stored in an open, raw format, making it easier to apply various machine and deep learning algorithms to process the data to produce meaningful insights.  

## Data lake examples

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
- [화해블로그, 화해의 Data Warehouse를 소개합니다](http://blog.hwahae.co.kr/all/tech/tech-tech/9409/){:target="_blank"}