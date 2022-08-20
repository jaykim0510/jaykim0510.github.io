---
layout: post
title:  'Data Engineering Series [Part15]: 분산 시스템(Distributed Systems) 개요'
description: 
date:   2022-07-21 15:01:35 +0300
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


# 분산 시스템

## 개요

Distributed System is a collection of autonomous computer systems that are physically separated but are connected by a centralized computer network that is equipped with distributed system software. The autonomous computers will communicate among each system by sharing resources and files and performing the tasks assigned to them.  

![](/images/dist_1.png)



## 특징

- **Resource Sharing**: It is the ability to use any Hardware, Software, or Data anywhere in the System.
- **Openness**: It is concerned with Extensions and improvements in the system (i.e., How openly the software is developed and shared with                                others)
- **Concurrency**: It is naturally present in the Distributed Systems, that deal with the same activity or functionality that can be performed by separate users who are in remote locations. Every local system has its independent Operating Systems and Resources.
- **Scalability**: It increases the scale of the system as a number of processors communicate with more users by accommodating to improve the responsiveness of the system.
- **Fault tolerance**: It cares about the reliability of the system if there is a failure in Hardware or Software, the system continues to operate properly without degrading the performance the system.
- **Transparency**: It hides the complexity of the Distributed Systems to the Users and Application programs as there should be privacy in every system.(유저는 자신이 사용하는 어플리케이션이 분산시스템인지 인지하지 못함 -> 단일 시스템을 사용하는 것처럼 사용할 수 있음)

## 장점

- Applications in Distributed Systems are Inherently Distributed Applications.
- Information in Distributed Systems is shared among geographically distributed users.
- Resource Sharing (Autonomous systems can share resources from remote locations).
- It has a better price performance ratio and flexibility.
- It has shorter response time and higher throughput.
- It has higher reliability and availability against component failure.
- It has extensibility so that systems can be extended in more remote locations and also incremental growth.

## 단점

- Relevant Software for Distributed systems does not exist currently.
- Security possess a problem due to easy access to data as the resources are shared to multiple systems.
- Networking Saturation may cause a hurdle in data transfer i.e., if there is a lag in the network then the user will face a problem accessing data.

## 아키텍처

- Centralized Architecture
- Decentralized Architecture

## 어려운 점

### Synchronization

Distributed System is a collection of computers connected via the high speed communication network. In the distributed system, the hardware and software components communicate and coordinate their actions by message passing. Each node in distributed systems can share their resources with other nodes. So, there is need of proper allocation of resources to preserve the state of resources and help coordinate between the several processes. To resolve such conflicts, synchronization is used. Synchronization in distributed systems is achieved via clocks.  

The physical clocks are used to adjust the time of nodes.Each node in the system can share its local time with other nodes in the system. The time is set based on UTC (Universal Time Coordination). UTC is used as a reference time clock for the nodes in the system.  

The clock synchronization can be achieved by 2 ways: External and Internal Clock Synchronization.  

- External clock synchronization is the one in which an external reference clock is present. It is used as a reference and the nodes in the system can set and adjust their time accordingly.
- Internal clock synchronization is the one in which each node shares its time with other nodes and all the nodes set and adjust their times accordingly.

There are 2 types of clock synchronization algorithms: Centralized and Distributed.  

- Centralized is the one in which a time server is used as a reference. The single time server propagates its time to the nodes and all the nodes adjust the time accordingly. It is dependent on single time server so if that node fails, the whole system will lose synchronization. Examples of centralized are- Berkeley Algorithm, Passive Time Server, Active Time Server etc.
- Distributed is the one in which there is no centralized time server present. Instead the nodes adjust their time by using their local time and then, taking the average of the differences of time with other nodes. Distributed algorithms overcome the issue of centralized algorithms like the scalability and single point failure. Examples of Distributed algorithms are – Global Averaging Algorithm, Localized Averaging Algorithm, NTP (Network time protocol) etc.

### Network Partition

- 분산 시스템을 이용한 인터넷 서비스에서 사용하는 어플리케이션의 아키텍처는 대부분 비공유 아키텍처(Shared-nothing)
  - 각 노드는 CPU, RAM, 디스크를 독립적으로 사용(디스크도 독립된다는 점에서 Shared Disk Architecture와 다름)
- 비공유 시스템에서 장비들이 통신하는 유일한 수단은 네트워크
- 전송 측은 패킷이 전송 된건지, 네트워크 문제인지, 수신 측 서버 문제인지 알 수 없으며 심지어 전달이 실패한건지 아니면 지연된건지 조차 알 수 없음

![](/images/dist_3.png)

# 분산 파일 시스템

A Distributed File System (DFS) as the name suggests, is a file system that is distributed on multiple file servers or multiple locations. It allows programs to access or store isolated files as they do with the local ones, allowing programmers to access files from any network or computer.  

The main purpose of the Distributed File System (DFS) is to allows users of physically distributed systems to share their data and resources by using a Common File System. A collection of workstations and mainframes connected by a Local Area Network (LAN) is a configuration on Distributed File System. A DFS is executed as a part of the operating system. In DFS, a namespace is created and this process is transparent for the clients.   

**Working of DFS**  
There are two ways in which DFS can be implemented:  

- Standalone DFS namespace
    - It allows only for those DFS roots that exist on the local computer and are not using Active Directory. A Standalone DFS can only be acquired on those computers on which it is created. It does not provide any fault liberation and cannot be linked to any other DFS. Standalone DFS roots are rarely come across because of their limited advantage.
- Domain-based DFS namespace
    - It stores the configuration of DFS in Active Directory, creating the DFS namespace root accessible at \\<domainname>\<dfsroot> or \\<FQDN>\<dfsroot>

![](/images/dist_2.png)

**Advantages**  
- DFS allows multiple user to access or store the data.
- It allows the data to be share remotely.
- It improved the availability of file, access time, and network efficiency.
- Improved the capacity to change the size of the data and also improves the ability to exchange the data.
- Distributed File System provides transparency of data even if server or disk fails.
**Disadvantages**  
- In Distributed File System nodes and connections needs to be secured therefore we can say that security is at stake.
- There is a possibility of lose of messages and data in the network while movement from one node to another.
- Database connection in case of Distributed File System is complicated.
- Also handling of the database is not easy in Distributed File System as compared to a single user system.
- There are chances that overloading will take place if all nodes tries to send data at once.

# 분산 데이터베이스

# 분산 처리

# 분산 시스템과 쿠버네티스

쿠버네티스는 'A라는 컨테이너화된 프로세스를 어느 서버에 띄울까? 프로세스를 몇 대의 서버에 복제해두고 일부 서버가 장애가 생기면 다른 서버에 있는 프로세스로 대체'  

분산 시스템은 'A라는 어플리케이션을 여러 서버에서 동작하도록 하여 동시처리(병렬적으로)하도록 하고, 일부 서버에 장애가 발생하면 해당 서버에 있는 어플리케이션을 클러스터에서 제외, 복구 되었는지 주기적으로 헬스체크해서 복구 되면 다시 클러스터에 추가'  


# 참고

- [책, Database Internals](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791161754963&orderClick=LEa&Kc=){:target="_blank"}
- [slideshare: Basic distributed systems principles](https://www.slideshare.net/rubentan/basic-distributed-systems-principles){:target="_blank"}
- [pdf: Distributed Systems: Principles and Paradigms](https://vowi.fsinf.at/images/b/bc/TU_Wien-Verteilte_Systeme_VO_%28G%C3%B6schka%29_-_Tannenbaum-distributed_systems_principles_and_paradigms_2nd_edition.pdf){:target="_blank"}
- [GeeksforGeeks: What is a Distributed System?](https://www.geeksforgeeks.org/what-is-a-distributed-system/?ref=gcse){:target="_blank"}
- [GeeksforGeeks: Comparison – Centralized, Decentralized and Distributed Systems](https://www.geeksforgeeks.org/comparison-centralized-decentralized-and-distributed-systems/?ref=gcse){:target="_blank"}
- [GeeksforGeeks: Synchronization in Distributed Systems](https://www.geeksforgeeks.org/synchronization-in-distributed-systems/?ref=gcse){:target="_blank"}
- [GeeksforGeeks: What is DFS (Distributed File System)?](https://www.geeksforgeeks.org/what-is-dfsdistributed-file-system/?ref=gcse){:target="_blank"}