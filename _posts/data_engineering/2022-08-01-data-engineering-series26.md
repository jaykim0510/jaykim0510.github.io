---
layout: post
title:  'Data Engineering Series [Part26]: I 🤍 Logs(2) Data Integration'
description: 
date:   2022-08-01 15:01:35 +0300
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

# Introduction

- **Data Integration and Logs**

> Data Integration means making available all the data (that an organization has) to all the services and systems that need it

The more recognizable term ETL(populating a relational data warehouse) usually covers only a limited part of data integration.  

1. Capturing all the relevant data and being able to put it together in an applicable processing environment
2. This data has to be modeled in a uniform way to make it easy to read and process
3. Process this data in various ways: MapReduce, real-time query systems, ans so on

**Focus on step-by-step**  

1. Reliable and complete data flow
2. Refining data modeling and consistency
3. Better visualization, reporting, algorithmic processing and prediction

How can we build reliable data flow throughout all the data systems?  

# Two Complications

Two things have made data integration an increasingly difficult proflem.  

## Data is More Diverse

Transactional data - things that **are**,  Event data - things that **happen**  

Log = Data structure what event data is logged  

Event data is generated from Web service, Financial organization, IoT

This type of event data shakes up traditional data integration approaches because it tends to be several orders of magnitude larger than transactional data. 

## The Explosion of Specialized Data Systems

ex. OLAP, Search service, Batch processing, Graph analysis  

# Log-Structured Data Flow

Log is the natural problem data structure for handling data flow between systems.

# Experience at LinkedIn

# Relationship to ETL and Data Warehouse

# ETL and Scalability

# Where Should We Put the Data Transformations?

# Decoupling Systems

# Scaling a Log

# 참고

- [책 I Heart Logs](http://www.kyobobook.co.kr/product/detailViewEng.laf?barcode=9781491909386&ejkGb=BNT&mallGb=ENG){:target="_blank"}
- [Try Kill batch processing with unified log stream processing...](https://medium.com/logika-io/try-kill-batch-processing-with-unified-log-stream-processing-d92709117f74){:target="_blank"}