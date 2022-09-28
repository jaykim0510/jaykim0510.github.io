---
layout: post
title:  'Data Engineering Series [Part3]: Elastic 생태계 (Elasticsearch, Logstash, Kibana)'
description: 
date:   2022-04-03 15:01:35 +0300
image:  '/images/elastic_logo.png'
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
# ELK Stack



![](/images/elastic_1.png)

- **Elasticsearch**: Lucene 기반의 전문 검색을 지원하는 분산 검색 엔진
- **Logstash**: 데이터를 추출하고 전처리한 후 엘라스틱서치로 전달하는 파이프라인
- **Kibana**: 엘라스틱서치에 저장된 데이터를 시각화 하는 도구
- **Beats**: 단일 목적의 데이터 수집기 무료 오픈 소스 플랫폼. 수백 수천 개의 장비와 시스템으로부터 Logstash나 Elasticsearch에 데이터를 전송

Together, these components form a comprehensive, tightly integrated, easily scalable search solution for businesses of all sizes.  

## ELK의 어원

- 초기에는 Elasticsearch + Logstash + Kibana를 줄여 ELK 스택이라고 했음
  ![](/images/elk_1.png)
- Beats의 등장 이후 Beats + Elasticsearch + Logstash + Kibana를 ELK (Elastic Stack)이라고 하게됨
  ![](/images/elk_2.png)
- 최근에는 데이터 용량이 커짐에 따라 버퍼, 안정성 등을 이유로 Kafka, RabbitMQ 와 같은 서비스 함께 사용
  ![](/images/elk_3.png)


## ELK의 등장배경

- 최근 마이크로서비스 형태의 패턴으로 서비스가 개발됨에 따라 중앙화된 로깅 시스템이 필요해짐
- ELK는 다양한 소스, 다양한 포맷, 검색엔진, 분석 그리고 시각화까지 중앙화된 로깅 시스템에 필요한 많은 기능을 갖추고 있음

- 클라우드 기반 서비스에서는 각 노드에서의 작업량, 환경, 사용자 수에 따라 성능이 상이함
- 어플리케이션마다 발생할 수 있는 장애가 다름

## Why ELK

- ELK는 비즈니스가 성장하는 규모에 맞춰 효율적으로 통합된 실시간 분석 시스템을 구축하도록 하는 도구 모음
- 오랜시간 커뮤니티에서 활발하게 사용되어 왔고, 많은 성공 사례를 가짐

# Elasticsearch

- NoSQL 데이터베이스
- 루씬(Lucene) 기반의 검색 엔진 -> 역색인을 지원하는 검색 엔진
- RESTful API를 통해 쿼리 가능
- 간단하게 검색 서비스 배포 가능
- 샤딩 기반의 분산 저장 -> Scale-Out

## Features of Elastic search:

- Java 언어로 개발
- REST API를 통해 접근, 쿼리 가능
- JSON 형태의 아웃풋 제공
- 전문 검색 엔진 서비스
- 실시간에 가까운 검색 속도 제공

## Advantages of Elasticsearch

- 스키마 제약 없이 데이터를 저장할 수도 있고, 필요한 경우 스키마를 설계한 후 그에 맞게 저장할 수도 있음
- 데이터에서 인사이트를 얻기 위해 필터링, 쿼리 기능을 제공
- RESTful API 제공
- Provides horizontal scalability, reliability, and multitenant capability for real time use of indexing to make it faster search

# Logstash

Logstash is the data collection pipeline tool. It collects data inputs and feeds into the Elasticsearch. It gathers all types of data from the different source and makes it available for further use.  

Logstash can unify data from disparate sources and normalize the data into your desired destinations. It allows you to cleanse and democratize all your data for analytics and visualization of use cases.  

It consists of three components:  

- Input: passing logs to process them into machine understandable format
- Filters: It is a set of conditions to perform a particular action or event
- Output: Decision maker for processed event or log

## Features of Logstash

- Events are passed through each phase using internal queues
- Allows different inputs for your logs
- Filtering/parsing for your logs

## Advantage of Logstash

- Offers centralize the data processing
- It analyzes a large variety of structured/unstructured data and events
- ELK LogStash offers plugins to connect with various types of input sources and platforms

# Kibana

Kibana is a data visualization which completes the ELK stack. This tool is used for visualizing the Elasticsearch documents and helps developers to have a quick insight into it. Kibana dashboard offers various interactive diagrams, geospatial data, and graphs to visualize complex quires.  

It can be used for search, view, and interact with data stored in Elasticsearch directories. Kibana helps you to perform advanced data analysis and visualize your data in a variety of tables, charts, and maps.  

In Kibana there are different methods for performing searches on your data.  

- Free text searches: It is used for searching a specific string
- Field-level searches: It is used for searching for a string within a specific field
- Logical statements: It is used to combine searches into a logical statement.
- Proximity searches: It is used for searching terms within specific character proximity.

## Features of Kinbana:

- Powerful front-end dashboard which is capable of visualizing indexed information from the elastic cluster
- Enables real-time search of indexed information
- You can search, View, and interact with data stored in Elasticsearch
- Execute queries on data & visualize results in charts, tables, and maps
- Configurable dashboard to slice and dice logstash logs in elasticsearch
- Capable of providing historical data in the form of graphs, charts, etc.
- Real-time dashboards which is easily configurable
- Kibana ElasticSearch enables real-time search of indexed information

## Advantages and Disadvantages of Kinbana

- Easy visualizing
- Fully integrated with Elasticsearch
- Visualization tool
- Offers real-time analysis, charting, summarization, and debugging capabilities
- Provides instinctive and user-friendly interface
- Allows sharing of snapshots of the logs searched through
- Permits saving the dashboard and managing multiple dashboards

# Beats

![](/images/beats_1.png)

# Advantages and Disadvantages of ELK stack

## Advantages

- ELK works best when logs from various Apps of an enterprise converge into a single ELK instance
- It provides amazing insights for this single instance and also eliminates the need to log into hundred different log data sources
- Rapid on-premise installation
- Easy to deploy Scales vertically and horizontally
- Elastic offers a host of language clients which includes Ruby. Python. PHP, Perl, .NET, Java, and JavaScript, and more
- Availability of libraries for different programming and scripting languages

## Disadvantages

- Different components In the stack can become difficult to handle when you move on to complex setup
- There’s nothing like trial and error. Thus, the more you do, the more you learn along the way


# Case Studies

## NetFlix
Netflix heavily relies on ELK stack. The company using ELK stack to monitor and analyze customer service operation’s security log. It allows them to index, store, and search documents from more than fifteen clusters which comprise almost 800 nodes.

## LinkedIn
The famous social media marketing site LinkedIn uses ELK stack to monitor performance and security. The IT team integrated ELK with Kafka to support their load in real time. Their ELK operation includes more than 100 clusters across six different data centers.

## Tripwire:
Tripwire is a worldwide Security Information Event Management system. The company uses ELK to support information packet log analysis.

## Medium:
Medium is a famous blog-publishing platform. They use ELK stack to debug their production issues. The company also uses ELK to detect DynamoDB hotpots. Moreover, using this stack, the company can support 25 million unique readers as well as thousands of published posts each week.

# Summary

- Centralized logging can be useful when attempting to identify problems with servers or applications
- ELK server stack is useful to resolve issues related to centralized logging system
- ELK stack is a collection of three open source tools Elasticsearch, Logstash Kibana
- Elasticsearch is a NoSQL database
- Logstash is the data collection pipeline tool
- Kibana is a data visualization which completes the ELK stack
- In cloud-based environment infrastructures, performance and isolation is very important
- In ELK stack processing speed is strictly limited whereas Splunk offers accurate and speedy processes
- Netflix, LinkedIn, Tripware, Medium all are using ELK stack for their business
- ELK Syslog works best when logs from various Apps of an enterprise converge into a single ELK instance
- Different components In the stack can become difficult to handle when you move on to complex setup

# 참고

- [elastic, ELK Stack이란 무엇인가요?](https://www.elastic.co/kr/what-is/elk-stack){:target="_blank"}
- [Guru99, ELK Stack Tutorial: What is Kibana, Logstash & Elasticsearch?](https://www.guru99.com/elk-stack-tutorial.html){:target="_blank"}
- [MC+A, Why you should be using the Elastic (ELK) Stack](https://www.mcplusa.com/the-3-reasons-why-you-should-be-using-elk/){:target="_blank"}
- [logz.io, THE COMPLETE GUIDE TO THE ELK STACK](https://logz.io/learn/complete-guide-elk-stack/){:target="_blank"}
