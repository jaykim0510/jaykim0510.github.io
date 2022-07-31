---
layout: post
title:  'MySQL Series [Part14] MySQL Optimizing SELECT Statements'
description: 
date:   2022-07-29 15:01:35 +0300
image:  '/images/mysql_logo.webp'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# Optimization Overview

Database performance depends on several factors at the database level, such as tables, queries, and configuration settings. These software constructs result in CPU and I/O operations at the hardware level, which you must minimize and make as efficient as possible. 

# Things to Consider for Optimization

- Are the tables structured properly? In particular, do the columns have the right data types, and does each table have the appropriate columns for the type of work? For example, applications that perform frequent updates often have many tables with few columns, while applications that analyze large amounts of data often have few tables with many columns.

- Are the right indexes in place to make queries efficient?

- Are you using the appropriate storage engine for each table, and taking advantage of the strengths and features of each storage engine you use? In particular, the choice of a transactional storage engine such as InnoDB or a nontransactional one such as MyISAM can be very important for performance and scalability.

- Does each table use an appropriate row format? This choice also depends on the storage engine used for the table. In particular, compressed tables use less disk space and so require less disk I/O to read and write the data. Compression is available for all kinds of workloads with InnoDB tables, and for read-only MyISAM tables.

- Does the application use an appropriate locking strategy? For example, by allowing shared access when possible so that database operations can run concurrently, and requesting exclusive access when appropriate so that critical operations get top priority. Again, the choice of storage engine is significant. The InnoDB storage engine handles most locking issues without involvement from you, allowing for better concurrency in the database and reducing the amount of experimentation and tuning for your code.

- Are all memory areas used for caching sized correctly? That is, large enough to hold frequently accessed data, but not so large that they overload physical memory and cause paging. The main memory areas to configure are the InnoDB buffer pool and the MyISAM key cache.

# Optimizing SELECT Statements

## WHERE Clause Optimization

- Use Indexes Where Appropriate
- Avoid % Wildcard in a Predicate
- Avoid using a function in the predicate of a query

## GROUP BY Optimization

GROUP BY 절을 만족시키는 가장 일반적인 방법은 전체 테이블을 스캔하여 각 그룹의 모든 행이 연속되는 새 임시 테이블을 만든 다음 이 임시 테이블을 사용하여 그룹을 검색하고 집계 함수를 적용하는 것입니다  

In some cases, MySQL is able to do much better than that and avoid creation of temporary tables by **using index access**.  

GROUP BY에 인덱스를 사용하기 위한 가장 중요한 전제 조건은 모든 GROUP BY 열이 동일한 인덱스의 속성을 참조하고 인덱스가 해당 키를 순서대로 저장한다는 것입니다(예: BTREE 인덱스의 경우 해당되지만 해시 인덱스의 경우 해당되지 않음). 임시 테이블의 사용이 인덱스 액세스로 대체될 수 있는지 여부도 쿼리에 사용되는 인덱스의 부분, 이러한 부분에 대해 지정된 조건 및 선택한 집계 함수에 따라 달라집니다.  

There are two ways to execute a GROUP BY query through index access, as detailed in the following sections.  

- The first method applies the grouping operation together with all range predicates (if any)
- The second method first performs a range scan, and then groups the resulting tuples.

# 참고

- [MySQL 공식문서: Optimizing SELECT Statements](https://dev.mysql.com/doc/refman/8.0/en/select-optimization.html){:target="_blank"}  
- [MySQL Performance Tuning and Optimization Tips](https://phoenixnap.com/kb/improve-mysql-performance-tuning-optimization){:target="_blank"}  