---
layout: post
title:  'Data Engineering Series [Part12]: Purpose-built Databases(OLTP, OLAP, Cache)'
description: 
date:   2022-07-09 15:01:35 +0300
image:  '/images/olap_logo.jpeg'
logo_image:  '/images/data_engineering_logo.png'
categories: data_engineering
tags: DE
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

Purpose-built databases address different workloads, including online transactional processing (OLTP), online analytical processing (OLAP), and caching. The data models representing the entities your applications work with and their relationships are supported by relational, document, key-value or graph, or time-series databases.  

![](/images/olap_1.png)

# OLTP

- 사용자와의 상호 작용을 중시 -> 빠르고 안전한 저장, 빠른 읽기, ACID 지원 -> Redis, DynamoDB, MySQL

# OLAP

- 데이터 분석을 중시 -> 컬럼 기반, 빠른 분석 -> 컬럼지향 RDBMS가 베스트일듯 -> BigQuery, Redshift

# 참고

- [ibm: OLAP vs. OLTP: What’s the Difference?](https://www.ibm.com/cloud/blog/olap-vs-oltp)
- [분석을 위해 등장한 데이터베이스, OLAP 따라잡기](https://www.ciokorea.com/news/225564){:target="_blank"}
- [OLAP이란?](https://brunch.co.kr/@qqplot/27){:target="_blank"}
- [What Is an OLTP Database?](https://phoenixnap.com/kb/oltp-database){:target="_blank"}
- [Youtube: Tech Dummies Narendra L, How row oriented and column oriented db works?](https://www.youtube.com/watch?v=uMkVi4SDLbM&t=180s){:target="_blank"}