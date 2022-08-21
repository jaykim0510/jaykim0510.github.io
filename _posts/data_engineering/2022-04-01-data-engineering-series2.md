---
layout: post
title:  'Data Engineering Series [Part2]: RDBMS vs NoSQL'
description: 
date:   2022-04-01 15:01:35 +0300
image:  '/images/rdbms_nosql.png'
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

# RDBMS

- RDBMS는 Relational DataBase Management System의 약자
- Relational Data Model을 담고있는 데이터베이스를 CRUD할 수 있는 소프트웨어
- 그 밖에도 데이터의 ACID 특성, 보안과 같은 필요한 기능들을 제공

A database back end for your application is vital. It’s likely your database is a relational database. This is because relational databases have dominated the software industry for decades, even as other technologies have radically changed around them.  

In a relational database management system (RDBMS), data needs to be actively managed and maintained. An RDBMS categorizes data in the form of tables, and the database manager must create a blueprint — otherwise known as a schema — of the relationships between those tables before any data gets stored. The fields in these tables must also have well-defined data types for which values can be stored.   

When considering implementing a relational database for your data storage needs, it’s important to completely understand what you’re getting into. While RDBMSs are known for being robust, they’re also known for being slow and inflexible.   

Be sure to consider the query language used to interface with the database you’re interested in. You should also perform a cost-benefit analysis of what it will take to create indices that can speed data operations, as well as the administrative tooling to operate the database.   

## Relational Data Model

- 1970년 대 E. F. Codd에 의해 처음 제안
- 테이블과 같은 형태로 데이터를 저장할 수 있도록 모델링한 것
- 관계형 데이터 모델은 세상을 상호 관계를 가지는 테이블들의 집합으로 묘사

![](/images/data_model_1.png)

![](/images/data_model_2.png)

- Table: Record의 집합
- Attribute: Record의 속성
- Record: 관계형 모델로 모델링된 데이터
- Degree: 속성(Attribute)의 수
- Cardinality: Unique한 Record의 수 (집합의 크기)

# NoSQL

- 요즘은 세상의 모든 것들을 데이터로 뽑아낼 수 있다면 수집해서 저장하길 원함
- 그런데 온갖 종류의 데이터가 다 관계형 데이터 모델로 정의되지 않음
- Semi-Structured한 데이터를 저장하기 위한 용도로 NoSQL 등장
- RDBMS와 비교해 쿼리의 성능을 조금 포기하는 대신 범용적인 데이터 수집을 가능하게 함
- (JOIN과 같은 쿼리 고급 기능이 없거나, 성능이 떨어짐)
- NoSQL은 데이터를 표현하는 방법도 다양해서 그 안에서도 Document store, Key-value store, Wide column store 등과 같이 더 세분화됨

## The benefits of NoSQL 
"Not only SQL" (NoSQL)  databases were designed to fill the gaps left by relational databases. Consider the core characteristics of a NoSQL database:  

- Schema-less with no complex relationships 
- Distributed by replicating data to avoid a single point of failure 
- Flexible storage of both unstructured and semi-structured data 
- Highly scalable no matter how much data is entered  


# RDBMS vs NoSQL

- RDBMS도 그 종류가 다양하고, NoSQL은 더 다양함 -> 묶어서 비교하는 것은 정확한 비교 방법은 아님
- 그래도 최대한 비교 가능한 부분만 가지고 비교해보자

![](/images/data_model_3.png)

# 참고

- [khj93, [Database] RDBMS와 NoSQL의 차이점](https://khj93.tistory.com/entry/Database-RDBMS%EC%99%80-NOSQL-%EC%B0%A8%EC%9D%B4%EC%A0%90){:target="_blank"}
- [BCcampus, The Relational Data Model](https://opentextbc.ca/dbdesign01/chapter/chapter-7-the-relational-data-model/){:target="_blank"}
- [DB Enigne](https://db-engines.com/en/systems){:target="_blank"}