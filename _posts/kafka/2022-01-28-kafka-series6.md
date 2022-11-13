---
layout: post
title:  'Kafka Series [Part6]: 데이터 파이프라인에서 카프카를 사용하는 목적'
description: 
date:   2022-01-28 15:01:35 +0300
image:  '/images/kafka_logo.png'
logo_image:  '/images/kafka_logo.png'
categories: data_engineering
tags: Kafka
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

# Kafka as a Datastore

Kafka can be used for storing data. You may be wondering whether Kafka is a relational or NoSQL database. The answer is that it is neither one nor the other.  

Kafka, as an event streaming platform, works with streaming data. At the same time, Kafka can store data for some time before removing it. This means that Kafka is different from traditional message queues that drop messages as soon as they are read by the consumer. The period during which the data is stored by Kafka is called retention. Theoretically, you can set this period to forever. Kafka also can store data on persistent storage, and replicates data over the brokers inside a cluster. This is just another trait that makes Kafka look like a database.  

Why then isn’t Kafka used widely as a database, and why aren’t we addressing the idea that this might be a data storage solution? The simplest reason for this is because Kafka has some peculiarities that are not typical for general databases. For example, Kafka also doesn’t provide arbitrary access lookup to the data. This means that there is no query API that can be used to fetch columns, filter them, join them with other tables, and so on. Actually, there is a Kafka StreamsAPI and even an ksqlDB. They support queries and strongly resemble traditional databases. But they are like scaffolds around Kafka. They act as consumers that process data for you after it’s consumed. So, when we talk about Kafka in general and not its extensions, it’s because there isn’t a query language like SQL available within Kafka to help you access data. By the way, modern data lake engines like Dremio can solve this issue. Dremio supports interactions using SQL with data sources that don’t support SQL natively. So, for example, you can persist data from Kafka streams in AWS S3, and then access it using Dremio AWS edition.  

Kafka is also focused on the paradigm of working with streams. Kafka is designed to act as the core of applications and solutions that are based on streams of data. In short, it can be seen as a brain that processes signals from different parts of the body and allows an organ to work by interpreting those signals. The aim of Kafka is not to replace more traditional databases. Kafka lives in a different domain, and it can interact with databases, but it is not a replacement for databases. Kafka can be easily integrated with databases and cloud data lake storage such as Amazon S3 and Microsoft ADLS with the help of Dremio.  

Keep in mind that Kafka has the ability to store data and the data storage mechanism is quite easy to understand. Kafka stores the log of records (messages) from the first message up till now. Consumers fetch data starting from the specified offset in this log of records. This is the simplified explanation of what it looks like:  

![](/images/kafka_85.png)

The offset can be moved back in history which will force the consumer to read past data again.  

Because Kafka is different from traditional databases, the situations where it can be used as a data store are also somewhat specific. Here are some of them:  

- To repeat the processing of the data from the beginning when the logic of processing changes;
- When a new system is included in the processing pipeline, and it needs to process all previous records from the very beginning or from some point in time. This features helps avoid copying the full dump of one database to another;
- When consumers transform data and save the results somewhere, but for some reason, you need to store the log of data changes over time.
Later in this article, we will look at an example of how Kafka can be used as a data store in a use case similar to the first one described above.

# Kafka as a Data Loss Prevention Tool

A lot of developers choose Kafka for their projects because it provides a high level of durability and fault-tolerance. These features are achieved by saving records on disk and replicating data. Replication means that the same copies of your data are located on several servers (Kafka brokers) within the cluster. Because the data is saved on disk, the data is still there even if the Kafka cluster becomes inactive for some period of time. Thanks to the replication, the data stays protected even when one or several of the clusters inside the broker are damaged.  

After data is consumed, it is often transformed and/or saved somewhere. Sometimes data can become corrupt or lost during data processing. In such cases, Kafka can help restore the data. If needed, Kafka can provide a way to execute operations from the beginning of the data stream.  

You should be aware that the two main parameters used to control the data loss prevention policy are the replication factor and the retention period. The replication factor shows how many redundant copies of data for the given topic are created in the Kafka cluster. To support fault-tolerance you should set the replication factor to a value greater than one. In general, the recommended value is three. The greater the replication factor, the more stable the Kafka cluster. You can also use this feature to place Kafka brokers closer to the data consumers while having replicas on geographically remote brokers at the same time.  

The retention period is the time during which Kafka saves the data. It is obvious that the longer the period, the more data you will save, and the more data you will be able to restore in case something bad happens (for example, the consumer goes down due to power failure, or the database loses all data as the result of an accidental wrong database query or hacker attack, etc.).  

# 참고


- [Towards Data Science, Using Kafka as a Temporary Data Store and Data-loss Prevention Tool in The Data Lake](https://towardsdatascience.com/using-kafka-as-a-temporary-data-store-and-data-loss-prevention-tool-in-the-data-lake-5472f2b586e){:target="_blank"}
