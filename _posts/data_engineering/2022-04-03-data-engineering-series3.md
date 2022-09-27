---
layout: post
title:  'Data Engineering Series [Part3]: Elastic 생태계 (Elasticsearch, Logstash, Kibana)'
description: 
date:   2022-04-03 15:01:35 +0300
image:  '/images/elastic_logo.jpeg'
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

- **Elasticsearch**: a distributed search engine with highly refined analytics capabilities
- **Logstash**: a data-processing pipeline that collects data and delivers it to Elasticsearch
- **Kibana**: a visualization platform built expressly for Elasticsearch
- **Beats**: a collection of open source log shippers that act as agents installed on the different servers in your environment for collecting logs or metrics

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

**Why Log Analysis?**  

- In cloud-based environment infrastructures, performance, and isolation is very important. The performance of virtual machines in the cloud may vary based on the specific loads, environments, and number of active users in the system. Therefore, reliability and node failure can become a significant issue
- Log management platform can monitor all above-given issues as well as process operating system logs, NGINX, IIS server log for web traffic analysis, application logs, and logs on AWS (Amazon web services)
- Log management helps DevOps engineers, system admin to make better business decisions. Hence, log analysis via Elastic Stack or similar tools is important

## Why ELK

The Elastic Stack meets the needs of growing businesses with an efficient, integrated toolset designed to deliver actionable real-time insights from large sets of search data. Its highly active community and years of successful implementations offer an unmatched combination of maturity and future-proof development.  

There are scores of reasons to consider the Elastic Stack. Here are four of the most important.  

- Enterprise Search
    - Empower users to search for everything from anywhere. Elastic can unify your content platforms into a highly personalized and relevant search experience. By unifying content platforms at the search level, the Elastic Stack empowers users to search across enterprise systems and data silos, giving them a comprehensive yet highly personalized search experience.
- Observability
    - The Elastic stack brings real-time metrics, logs, and APM traces into a single easily consulted view. Companies can spot opportunities as they arise and challenges as they begin to develop, allowing for a quick and profitable response.
- Scalability
    - Elastic deploys at scale, regardless of a company’s technical infrastructure. Public and private cloud implementations, bare-metal or containerized, even as a SaaS solution, Elastic is built to work with any company’s systems and to adapt as companies grow.
- Security
    - On top of the platform’s internal security (index encryption, field-level security on documents) the SIEM app collects security information across the enterprise and provides richly detailed dashboards that allow close scrutiny of security operations.

# Elasticsearch

Elasticsearch is a NoSQL database. It is based on Lucene search engine, and it is built with RESTful APIS. It offers simple deployment, maximum reliability, and easy management. It also offers advanced queries to perform detail analysis and stores all the data centrally. It is helpful for executing a quick search of the documents.

Elasticsearch also allows you to store, search and analyze big volume of data. It is mostly used as the underlying engine to powers applications that completed search requirements. It has been adopted in search engine platforms for modern web and mobile applications. Apart from a quick search, the tool also offers complex analytics and many advanced features.

## Features of Elastic search:

- Open source search server is written using Java
- Used to index any kind of heterogeneous data
- Has REST API web-interface with JSON output
- Full-Text Search
- Near Real Time (NRT) search
- Sharded, replicated searchable, JSON document store
- Schema-free, REST & JSON based distributed document store
- Multi-language & Geolocation support

## Advantages of Elasticsearch

- Store schema-less data and also creates a schema for your data
- Manipulate your data record by record with the help of Multi-document APIs
- Perform filtering and querying your data for insights
- Based on Apache Lucene and provides RESTful API
- Provides horizontal scalability, reliability, and multitenant capability for real time use of indexing to make it faster search
- Helps you to scale vertically and horizontally

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
