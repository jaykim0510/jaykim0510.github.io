---
layout: post
title:  'Data Engineering Series [Part16]: 분산 시스템(2) CAP Theorem'
description: 
date:   2022-07-22 15:01:35 +0300
image:  '/images/distributed_logo.png'
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

# CAP Theorem

The CAP Theorem is one of the most fundamental theorems in the field of distributed systems. It outlines an inherent trade-off in the design of distributed systems.  

CAP theorem – or Brewer’s theorem – was introduced by the computer scientist Eric Brewer at Symposium on Principles of Distributed computing in 2000. The CAP stands for Consistency, Availability and Partition tolerance.  

The CAP Theorem (as put forth in a presentation by Eric Brewer in 2000) stated that distributed shared-data systems had three properties but systems could only choose to adhere to two of those properties:  

- **Consistency**: Consistency means that every successful read request receives the result of the most recent write request. Be aware that the definition of consistency for CAP means something different than to ACID (relational consistency).
- **Availability**: The database is not allowed to be unavailable because it is busy with requests. Every request received by a non-failing node in the system must result in a response. Whether you want to read or write you will get some response back. If the server has not crashed, it is not allowed to ignore the client’s requests.
- **Partition tolerance**: Databases which store big data will use a cluster of nodes that distribute the connections evenly over the whole cluster. If this system has partition tolerance, it will continue to operate despite a number of messages being delayed or even lost by the network between the cluster nodes.

Distributed systems designed for fault tolerance are not much use if they cannot operate in a partitioned state (a state where one or more nodes are unreachable). Thus, partition-tolerance is always a requirement, so the two basic modes that most systems use are either Availability-Partition-tolerant (“AP”) or Consistency-Partition-tolerant (“CP”).  

In a distributed system, there is always the risk of a network partition. If this happens, the system needs to decide either to continue operating and compromise data consistency, or stop operating and compromise availability.  

According to the final statement of the CAP theorem, a distributed system can be either consistent or available in the presence of a network partition.  

Database systems designed to fulfill traditional ACID guarantees like relational database (management) systems (RDBMS) choose consistency over availability, whereas NoSQL databases are mostly systems designed referring to the BASE philosophy which prefer availability over consistency.  

AP 시스템은 네트워크 파티션이 생겼을 때 AP를 보장해준다. C는 파티션이 없을 때 해결된다.  

CA 시스템은 현실적으로 둘 다 완벽하게 지켜낼 수 없다. C를 무조건 보장하면서 A를 최대한 제공해주는 방식이다. 

## AP – Availability + Partition Tolerance
If we have achieved Availability (our databases will always respond to our requests) as well as Partition Tolerance (all nodes of the database will work even if they cannot communicate), it will immediately mean that we cannot provide Consistency as all nodes will go out of sync as soon as we write new information to one of the nodes. The nodes will continue to accept the database transactions each separately, but they cannot transfer the transaction between each other keeping them in synchronization. We therefore cannot fully guarantee the system consistency. When the partition is resolved, the AP databases typically resync the nodes to repair all inconsistencies in the system.  

A well-known real world example of an AP system is the Domain Name System (DNS). This central network component is responsible for resolving domain names into IP addresses and focuses on the two properties of availability and failure tolerance. Thanks to the large number of servers, the system is available almost without exception. If a single DNS server fails,another one takes over. According to the CAP theorem, DNS is not consistent: If a DNS entry is changed, e.g. when a new domain has been registered or deleted, it can take a few days before this change is passed on to the entire system hierarchy and can be seen by all clients.  

## CA – Consistency + Availability
Guarantee of full Consistency and Availability is practically impossible to achieve in a system which distributes data over several nodes. We can have databases over more than one node online and available, and we keep the data consistent between these nodes, but the nature of computer networks (LAN, WAN) is that the connection can get interrupted, meaning we cannot guarantee the Partition Tolerance and therefor not the reliability of having the whole database service online at all times.  

Database management systems based on the relational database models (RDBMS) are a good example of CA systems. These database systems are primarily characterized by a high level of consistency and strive for the highest possible availability. In case of doubt, however, availability can decrease in favor of consistency. Reliability by distributing data over partitions in order to make data reachable in any case – even if computer or network failure – meanwhile plays a subordinate role.  

## CP – Consistency + Partition Tolerance
If the Consistency of data is given – which means that the data between two or more nodes always contain the up-to-date information – and Partition Tolerance is given as well – which means that we are avoiding any desynchronization of our data between all nodes, then we will lose Availability as soon as only one a partition occurs between any two nodes In most distributed systems, high availability is one of the most important properties, which is why CP systems tend to be a rarity in practice. These systems prove their worth particularly in the financial sector: banking applications that must reliably debit and transfer amounts of money on the account side are dependent on consistency and reliability by consistent redundancies to always be able to rule out incorrect postings – even in the event of disruptions in the data traffic. If consistency and reliability is not guaranteed, the system might be unavailable for the users.  

![](/images/cap.png)

![](/images/dis_sys_6.png)

# Importance of the CAP theorem
The CAP theorem is really important because it helped establish the basic limitations of all distributed systems.  

The CAP theorem forces designers of distributed systems to make explicit trade-offs between availability and consistency. Once the engineers become aware of these properties, they choose the appropriate system.  

# Conclusion
The CAP Theorem is still an important topic to understand for data engineers and data scientists, but many modern databases enable us to switch between the possibilities within the CAP Theorem. For example, the Cosmos DB von Microsoft Azure offers many granular options to switch between the consistency, availability and partition tolerance . A common misunderstanding of the CAP theorem that it´s none-absoluteness: “All three properties are more continuous than binary. Availability is continuous from 0 to 100 percent, there are many levels of consistency, and even partitions have nuances. Exploring these nuances requires pushing the traditional way of dealing with partitions, which is the fundamental challenge. Because partitions are rare, CAP should allow perfect C and A most of the time, but when partitions are present or perceived, a strategy is in order.”

# 참고

- [Understanding NoSQL Databases by the CAP Theorem](https://data-science-blog.com/blog/2021/10/14/cap-theorem/){:target="_blank"}