---
layout: post
title:  'Data Engineering Series [Part15]: 분산 시스템(1) Comprehensive Guide'
description: 
date:   2022-07-21 15:01:35 +0300
image:  '/images/distributed_logo.png'
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

# 분산 시스템이란

> A distributed system is a system whose components are located on different networked computers, which communicate and coordinate their actions by passing messages to one another

![](/images/dis_sys_2.png)

나는 분산 시스템을 다음과 같은 맥락으로 정리하려고 한다.  

![](/images/dis_sys_1.png)

# 장점

## Performance

여기서 Performance는 단일 시스템에서의 Performance와 비교해 가격대비 더 낫다는 의미이다. Performance의 절대적인 수치 자체가 더 오를 이유는 없다. 오히려 네트워크 비용으로 감소할 가능성은 있다. 그럼에도 분산 시스템을 쓰는 이유는 가격적인 측면에서 그만큼 값싼 장비를 여러 대 사용하는 것이 낫고, 성능적인 측면 이외에도 분산 시스템이 주는 장점이 있기 때문이다.  

## Scalability

분산 시스템은 서비스 규모, 트래픽량, 작업량에 따라 시스템의 크기를 조절해 이를 핸들링할 능력이 있다. 물론 단일 시스템에서도 Vertical-scaling이 가능하다. 하지만 Horizontal-scaling이 가격적인 측면과 확장/감축이 용이하다는 점에서 이점이 있다.  

## Availability

분산 시스템은 노드 일부에 장애가 발생하더라도 계속 같은 기능을 유지할 수 있다. 이는 24시간 내내 장애없는 서비스가 가능하다는 말이다. 물론 이를 위해 요구되는 조건들이 있는데 이 부분은 뒤에서 더 자세히 다룰 것이다.  

지금까지 분산 시스템의 장점에 대해서 얘기했다. 이러한 장점을 얻기위해 해야할 일이 있다. 우선 High-level에서 이에 대해 알아보겠다.  

# High-level에서의 동작

## Partitioning

파티셔닝은 분산 시스템의 장점 중에서도 Scalability, Performance를 얻기 위해 필요한 핵심 동작 원리다. 파티셔닝은 처리(또는 저장)해야 할 데이터를 작게 나누어서 이를 처리(또는 저장)해야 할 노드에게 할당해 분산 처리(또는 저장)하도록 해준다.  

하지만 오히려 하나의 작업을 위해 네트워크를 거쳐 여러 노드에 접근해야 한다는 점에서 단점이 되는 경우도 있다. 그래서 데이터를 처리할 때는 최대한 네트워크 비용을 줄이는 것이 관건이다.  

파티셔닝은 크게 range partitioning, hash partitioning, consistent hashing 방식이 있다. Apache HBase는 range partitioning을 쓰고, Apache Cassandra는 consistent hasing을 쓴다.  

## Replication

복제(Replication)는 Availability를 위해 필요한 핵심이다. 복제는 같은 데이터를 여러 노드에 복수 저장함으로써, 노드 중 일부에 장애가 발생하더라도 계속 역할을 유지할 수 있게 한다.  

복제하는 것이 단순한 일은 아니다. 우선 복제 수 만큼 더 많은 저장용량이 필요하다. 또한 복제된 후에도 원본 데이터가 업데이트 될 때마다 복제된 데이터도 함께 동기화해야 한다.  

복제 방법 중 하나인 primary-backup replication에 대해 알아보자.   

![](/images/dis_sys_4.png)

보통 원본 데이터를 가지는 노드를 리더(Leader), 복제된 데이터를 가지는 노드들을 팔로워(Follower)라고 부른다. 읽기 작업은 모든 노드에서 가능하지만 쓰기 작업은 리더 노드만  담당한다. 데이터의 일관성을 유지하기 위해서는 리더가 팔로워에게 데이터를 잘 업데이트 해줘야 한다.  

리더는 업데이트를 어떻게 팔로워들에게 전파할까  

데이터 업데이트 방식에는 크게 동기적인 방법과 비동기 적인 방법이 있다.  

### Synchronous replication  

- 동기적 복제 방식은 클라이언트가 데이터 수정을 요청했을 때, 리더는 모든 팔로워로부터 업데이트를 완료했다는 ack를 받고나서  자신의 데이터를 업데이트 한 후, 업데이트 된 데이터가 잘 복제되었음을 클라이언트에 알려준다.
- 장점은 복제가 완료된 경우에만 업데이트된 데이터 읽기를 허용하므로, 도중 장애가 발생하더라도, 일관적 읽기가 가능해진다
- 단점은 쓰기 요청이 다소 느리다 

![](/images/dis_sys_3.png)

### Asynchronous replication  

- 비동기 복제 방식은 팔로워들의 ack를 기다리지 않고, 자신의 데이터를 우선 업데이트 한다
- 장점은 쓰기 요청이 굉장히 빠르다
- 단점은 다른 사용자가 업데이트 된 데이터를 읽던 도중 장애가 발생하면, 일관적 읽기가 보장되지 않는다

![](/images/dis_sys_5.png)

대부분의 널리 사용되는 데이터베이스(PostgreSQL, MySQL 등)은 프라이머리-백업 복제 방식을 사용하며, 동기적 복제 방식, 비동기적 복제 방식을 모두 지원한다.  

프라이머리-백업 복제 방식의 장단점은 다음과 같다.  

- 장점  
  - 동작 방식이 간단하다
  - 트랜잭션 처리를 간단하게 만들어준다
  - 무거운 읽기 작업에서 확장성이 높다 (팔로워 노드도 읽기 작업을 처리할 수 있으므로)

- 단점  
  - 무거운 쓰기 작업에서 확장성이 낮다 (리더가 쓰기 관련 처리를 모두 담당하므로)
  - 작업 방식에 따라 성능과 일관성간의 트레이드 오프가 있다
  - 읽기 성능을 높이기 위해 팔로워 수를 증가시키면, 업데이트할 때 네트워크 병목 현상이 생길 수 있다

또한 primary-backup replication은 항상 리더가 존재해야 한다. 따라서 리더가 잘 살아있는지 체크하고, 리더가 죽었다면 리더를 새로 선출하는 Leader election 문제도 고려해야 한다.  




# 어려운 점

## Synchronization

### Clock Synchronization

Distributed System is a collection of computers connected via the high speed communication network. In the distributed system, the hardware and software components communicate and coordinate their actions by message passing. Each node in distributed systems can share their resources with other nodes. So, there is need of proper allocation of resources to preserve the state of resources and help coordinate between the several processes. To resolve such conflicts, synchronization is used. Synchronization in distributed systems is achieved via clocks.  

The physical clocks are used to adjust the time of nodes.Each node in the system can share its local time with other nodes in the system. The time is set based on UTC (Universal Time Coordination). UTC is used as a reference time clock for the nodes in the system.  

The clock synchronization can be achieved by 2 ways: External and Internal Clock Synchronization.  

- External clock synchronization is the one in which an external reference clock is present. It is used as a reference and the nodes in the system can set and adjust their time accordingly.
- Internal clock synchronization is the one in which each node shares its time with other nodes and all the nodes set and adjust their times accordingly.

There are 2 types of clock synchronization algorithms: Centralized and Distributed.  

- Centralized is the one in which a time server is used as a reference. The single time server propagates its time to the nodes and all the nodes adjust the time accordingly. It is dependent on single time server so if that node fails, the whole system will lose synchronization. Examples of centralized are- Berkeley Algorithm, Passive Time Server, Active Time Server etc.
- Distributed is the one in which there is no centralized time server present. Instead the nodes adjust their time by using their local time and then, taking the average of the differences of time with other nodes. Distributed algorithms overcome the issue of centralized algorithms like the scalability and single point failure. Examples of Distributed algorithms are – Global Averaging Algorithm, Localized Averaging Algorithm, NTP (Network time protocol) etc.

### Data Synchronization

데이터 동기화 문제는 위에서 말했던 데이터 복제 과정에서, 그리고 업데이트시 복제된 데이터들간의 동기화를 말한다. 또한 트랜잭션과 같이 ACID 특성이 요구될 때, 데이터들이 Atomic하게 처리되는지와도 관련된다.  

## Network Asynchrony

Network asynchrony is a property of communication networks that cannot provide strong guarantees around delivering events, e.g., a maximum amount of time a message requires for delivery. This can create a lot of counter-intuitive behaviors that are not present in non-distributed systems. This contrasts to memory operations that provide much stricter guarantees. For instance, messages might take extremely long to deliver in a distributed system. They may even deliver out of order—or not at all.

- 분산 시스템을 이용한 인터넷 서비스에서 사용하는 어플리케이션의 아키텍처는 대부분 비공유 아키텍처(Shared-nothing)
  - 각 노드는 CPU, RAM, 디스크를 독립적으로 사용(디스크도 독립된다는 점에서 Shared Disk Architecture와 다름)
- 비공유 시스템에서 장비들이 통신하는 유일한 수단은 네트워크
- 전송 측은 패킷이 전송 된건지, 네트워크 문제인지, 수신 측 서버 문제인지 알 수 없으며 심지어 전달이 실패한건지 아니면 지연된건지 조차 알 수 없음

![](/images/dist_3.png)

## Partial Failures

Partial failures are the cases where only some components of a distributed system fail. This behavior can contrast with certain kinds of applications a single server deploys. These applications work under the assumption that either everything is working fine, or there has been a server crash. It introduces significant complexity when it requires atomicity across components in a distributed system. Thus, we must ensure that we either apply an operation to all the nodes of a system, or to none of them.  

![](/images/dis_sys_7.png)


# Low-level에서의 동작


## Consensus Algorithm

합의 알고리즘은 데이터 동기화 문제, 부분 장애 문제를 해결해준다. 

![](/images/dis_sys_8.png)

- whether a transaction has been committed or not
- whether a message has been delivered or not

### RAFT
Raft is a protocol for implementing distributed consensus.  

Raft decomposes consensus into three sub-problems:  

Each server exists in one of the three states: leader, follower, or candidate.  

![](/images/dis_sys_9.png)

- Leader Election: A new leader needs to be elected in case of the failure of an existing one.
- Log replication: The leader needs to keep the logs of all servers in sync with its own through replication

In normal operation there is exactly one leader and all of the other servers are followers. Followers are passive: they issue no requests on their own but simply respond to requests from leaders and candidates. The leader handles all client requests (if a client contacts a follower, the follower redirects it to the leader). The third state, candidate, is used to elect a new leader.  



## Failure Detector (Timeout)

The asynchronous nature of the network in a distributed system can make it very hard for us to differentiate between a crashed node and a node that is just really slow to respond to requests.  

Timeouts is the main mechanism we can use to detect failures in distributed systems. Since an asynchronous network can infinitely delay messages, timeouts impose an artificial upper bound on these delays. As a result, we can assume that a node fails when it is slower than this bound.  

However, a timeout does not represent an actual limit. Thus, it creates the following trade-off.  

내가 정한 타임아웃 설정이 발생한 문제의 근본적인 원인을 해결하는 점은 아니다. 발생한 문제로 잃게되는 성능이 실제 이상으로 떨어질 수 밖에 없다. 타임아웃 값에 따라 Completeness와 Accruacy 사이에 트레이드 오프 발생   

Completeness corresponds to the percentage of crashed nodes a failure detector successfully identifies in a certain period.  

Accuracy corresponds to the number of mistakes a failure detector makes in a certain period.  

## De-duplication Algorithm

In the de-duplication approach, we give every message a unique identifier, and every retried message contains the same identifier as the original. In this way, the recipient can remember the set of identifiers it received and executed already. It will also avoid executing operations that are executed.  

It is important to note that in order to do this, we must have control on both sides of the system: sender and receiver. This is because the ID generation occurs on the sender side, but the de-duplication process occurs on the receiver side.  

리더는 데이터를 전달할 때마다 데이터에 고유한 식별자를 붙인다. 팔로워들은 식별자를 보고 자기가 가지고 있는 식별자보다 큰 값인 경우에만 받아서 저장한다. 만약 같은 식별자의 데이터를 받았다면 리더에게 ACK 메시지만 보내고, 저장은 하지 않는다.  

# 참고

- [Video Demo,  Raft: Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft/){:target="_blank"}
- [Understanding the Raft consensus algorithm: an academic article summary](https://www.freecodecamp.org/news/in-search-of-an-understandable-consensus-algorithm-a-summary-4bc294c97e0d/){:target="_blank"}
- [Building a Distributed Log from Scratch, Part 2: Data Replication](https://bravenewgeek.com/building-a-distributed-log-from-scratch-part-2-data-replication/){:target="_blank"}