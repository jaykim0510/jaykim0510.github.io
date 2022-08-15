---
layout: post
title:  'Data Engineering Series [Part17]: 분산 시스템(Distributed Systems)의 핵심'
description: 
date:   2022-07-23 15:01:35 +0300
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

distributed system은 fault tolerance 하기 위해 여러 서버에 replication. replication할 때 유의할 점이 consistency (어떤 서버가 선택되어도 클라이언트에게 일관된 결과를 돌려 주는가). consistency를 제공하기 위한 것이 합의 알고리즘?  

# 장애 대응(Fault Tolerance)

## 장애 감지와 회복

**Heartbeats and Ping**  

## 리더와 팔로워

동기화는 비용이 많이 들 수 있다. 동기화 오버헤드를 줄이기 위해 일부 알고리즘에는 분산 알고리즘의 단계를 수행 및 조정하는 리더 프로세스가 있다. 일반적으로 분산 시스템의 프로세스는 균일하고 모든 프로세스가 리더 역할을 맡을 수 있다. 장애가 발생하면 어떤 프로세스라도 리더 선출 과정을 시작할 수 있고 선출된 프로세스는 이전 리더의 작업을 이어서 수행한다.  

이상적으로는 한 번에 하나의 리더만 존재하고, 여러 리더가 선출되고 서로 존재를 모르는 상황(split brain 현상)은 절대로 발생하지 않아야 한다. 하지만 많은 리더 선출 알고리즘이 이 조건을 위반한다. 이 문제를 해결하기 위해서는 클러스터 구성원 과반수의 동의가 필요하다. 멀티 팍소스와 래프트를 비롯한 여러 합의 알고리즘은 리더 프로세스가 조율을 담당한다.

선출 작업은 결정론적이어야 한다. 정확히 하나의 리더를 선출하고 모든 참가자가 결과를 인정해야 한다. 선출된 새로운 리더는 모든 구성원에게 자신의 존재를 알려야 한다.  

리더 프로세스가 있는 시스템의 가장 큰 문제는 리더가 병목 지점이 될 수 있다는 점이다. 이 문제를 해결하기 위해 많은 시스템이 데이터를 독립적인 파티션으로 나누고 각 파티션별로 리더를 선출한다. 스패너(Spanner)가 이 방식을 사용한다.  

선출 작업은 비용이 높은 작업이지만 자주 수행되지 않기 때문에 시스템 성능에 큰 영향을 주지 않는다.  

리더의 정체는 프로세스가 모르는 사이에 바뀔 수 있다. 따라서 각 프로세스가 개별적으로 알고 있는 리더에 대한 정보가 유효한지 확인해야 한다. 이 문제는 리더 선출 알고리즘과 장애 감지 알고리즘을 같이 사용해 해결할 수 있다. 예를 들어 안정적인 리더 선출 알고리즘은 안정적인 프로세스에 리더의 기회를 주고 타임아웃 기반의 장애 감지 알고리즘을 사용해 해당 프로세스에 장애가 발생하지 않고 접근이 가능한 동안 계속해서 리더 역할을 유지할 수 있도록 보장한다.  

리더에 의존하는 대부분의 알고리즘은 여러 리더가 존재하는 것을 허용하고 리더 사이의 충돌을 최대한 빠르게 해결한다.  

## 복제

In a distributed system data is stored is over different computers in a network. Therefore, we need to make sure that data is readily available for the users. Availability of the data is an important factor often accomplished by data replication. Replication is the practice of keeping several copies of data in different places.  

Why do we require replication?  
The first and foremost thing is that it makes our system more stable because of node replication. It is good to have replicas of a node in a network due to following reasons:  

- If a node stops working, the distributed network will still work fine due to its replicas which will be there. Thus it increases the fault tolerance of the system.
- It also helps in load sharing where loads on a server are shared among different replicas.
- It enhances the availability of the data. If the replicas are created and data is stored near to the consumers, it would be easier and faster to fetch data.


**Types of Replication**  
- Active Replication
- Passive Replication

**Active Replication**  
- The request of the client goes to all the replicas.
- It is to be made sure that every replica receives the client request in the same order else the system will get inconsistent.
- There is no need for coordination because each copy processes the same request in the same sequence.
- All replicas respond to the client’s request.


**Advantages**  

- It is really simple. The codes in active replication are the same throughout.
- It is transparent.
- Even if a node fails, it will be easily handled by replicas of that node.

**Disadvantages**  

- It increases resource consumption. The greater the number of replicas, the greater the memory needed.
- It increases the time complexity. If some change is done on one replica it should also be done in all others.

**Passive Replication**  

- The client request goes to the primary replica, also called the main replica.
- There are more replicas that act as backup for the primary replica.
- Primary replica informs all other backup replicas about any modification done.
- The response is returned to the client by a primary replica.
- Periodically primary replica sends some signal to backup replicas to let them know that it is working perfectly fine.
- In case of failure of a primary replica, a backup replica becomes the primary replica.

**Advantages**  

- The resource consumption is less as backup servers only come into play when the primary server fails.
- The time complexity of this is also less as there’s no need for updating in all the nodes replicas, unlike active replication.

**Disadvantages**  

- If some failure occurs, the response time is delayed.

## 일관성 보장

**CAP Theorem**  

![](/images/cap_theorem.png)

The CAP Theorem (as put forth in a presentation by Eric Brewer in 2000) stated that distributed shared-data systems had three properties but systems could only choose to adhere to two of those properties:  

- Consistency
- Availability
- Partition-tolerance


Distributed systems designed for fault tolerance are not much use if they cannot operate in a partitioned state (a state where one or more nodes are unreachable). Thus, partition-tolerance is always a requirement, so the two basic modes that most systems use are either Availability-Partition-tolerant (“AP”) or Consistency-Partition-tolerant (“CP”).  

An “AP”-oriented database remains available even if it was partitioned in some way. For instance, if one or more nodes went down, or two or more parts of the cluster were separated by a network outage (a so-called “split-brain” situation), the remaining database nodes would remain available and continue to respond to requests for data (reads) or even accept new data (writes). However, its data would become inconsistent across the cluster during the partitioned state. Transactions (reads and writes) in an “AP”-mode database are considered to be “eventually consistent” because they are allowed to write to some portion of nodes; inconsistencies across nodes are settled over time using various anti-entropy methods.  

A “CP”-oriented database would instead err on the side of consistency in the case of a partition, even if it meant that the database became unavailable in order to maintain its consistency. For example, a database for a bank might disallow transactions to prevent it from becoming inconsistent and allowing withdrawals of more money than were actually available in an account. Transactions on such systems are referred to as “strongly consistent” because all nodes on a system need to reflect the change before the transaction is considered complete or successful.  

**Eventual Consistency** 

 Eventual consistency is a consistency model that enables the data store to be highly available. It is also known as optimistic replication & is key to distributed systems. So, how exactly does it work? Let’s Understand this with the help of a use case.  
 
 Real World Use Case :  

- Think of a popular microblogging site deployed across the world in different geographical regions like Asia, America, and Europe. Moreover, each geographical region has multiple data center zones: North, East, West, and South. 
- Furthermore, each zone has multiple clusters which have multiple server nodes running. So, we have many datastore nodes spread across the world that micro-blogging site uses for persisting data. Since there are so many nodes running, there is no single point of failure.
- The data store service is highly available. Even if a few nodes go down persistence service is still up. Let’s say a celebrity makes a post on the website that everybody starts liking around the world. 
- At a point in time, a user in Japan likes a post which increases the “Like” count of the post from say 100 to 101. At the same point in time, a user in America, in a different geographical zone, clicks on the post, and he sees “Like” count as 100, not 101.

Reason for the above Use case :  

- Simply, because the new updated value of the Post “Like” counter needs some time to move from Japan to America and update server nodes running there. Though the value of the counter at that point in time was 101, the user in America sees old inconsistent values. 
- But when he refreshes his web page after a few seconds “Like” counter value shows as 101. So, data was initially inconsistent but eventually got consistent across server nodes deployed around the world. This is what eventual consistency is.


**Strong Consistency**  

Strong Consistency simply means the data must be strongly consistent at all times. All the server nodes across the world should contain the same value as an entity at any point in time. And the only way to implement this behavior is by locking down the nodes when being updated.  

Real World Use Case :  

- Let’s continue the same Eventual Consistency example from the previous lesson. To ensure Strong Consistency in the system, when a user in Japan likes posts, all nodes across different geographical zones must be locked down to prevent any concurrent updates. 
- This means at one point in time, only one user can update the post “Like” counter value. So, once a user in Japan updates the “Like” counter from 100 to 101. The value gets replicated globally across all nodes. Once all nodes reach consensus, locks get lifted. Now, other users can Like posts. 
- If the nodes take a while to reach a consensus, they must wait until then. Well, this is surely not desired in the case of social applications. But think of a stock market application where the users are seeing different prices of the same stock at one point in time and updating it concurrently. This would create chaos. Therefore, to avoid this confusion we need our systems to be Strongly Consistent. 
- The nodes must be locked down for updates. Queuing all requests is one good way of making a system Strongly Consistent. The strong Consistency model hits the capability of the system to be Highly Available & perform concurrent updates. This is how strongly consistent ACID transactions are implemented.


**ACID Transaction Support**  

Distributed systems like NoSQL databases which scale horizontally on the fly don’t support ACID transactions globally & this is due to their design. The whole reason for the development of NoSQL tech is the ability to be Highly Available and Scalable. If we must lock down nodes every time, it becomes just like SQL. So, NoSQL databases don’t support ACID transactions and those that claim to, have terms and conditions applied to them. Generally, transaction support is limited to a geographic zone or an entity hierarchy. Developers of tech make sure that all the Strongly consistent entity nodes reside in the same geographic zone to make ACID transactions possible.  

Conclusion: For transactional things go for MySQL because it provides a lock-in feature and supports ACID transactions.  

## 합의 알고리즘

Consensus is a general agreement on a decision made by the majority of those involved. For example, the problem may be as simple as friends trying to decide which restaurant has multiple options to choose from or complex as decisions on distributed systems.  

**Need of consensus in a distributed system**  

In a distributed system, nodes are distributed across the network. Some of these nodes might get failed(crash fault) or starts behaving abnormally (Byzantine Fault). In such a scenario, it becomes difficult to come to a common decision. More concisely,  

- There are n processes, m of which may be faulty.
- The task is to make all the Nonfaulty processes agree on some value(s) even in the presence of the faulty processes.

So we can remove these problems by given below solutions:  

- Consensus Without Any Fault
- Consensus With at most m Crash Faults
- Consensus With at most m Byzantine Faults

**멀티 팍소스**  

**래프트**  

# 분산 처리(Distributed Computing)

# 시스템 확장(Scale-out)


# 참고

- [GeeksforGeeks: Consensus Problem of Distributed Systems](https://www.geeksforgeeks.org/consensus-problem-of-distributed-systems/?ref=gcse)