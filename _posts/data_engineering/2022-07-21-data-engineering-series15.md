---
layout: post
title:  'Data Engineering Series [Part15]: 분산 시스템(Distributed Systems) 개요'
description: 
date:   2022-07-21 15:01:35 +0300
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
- **Transparency**: It hides the complexity of the Distributed Systems to the Users and Application programs as there should be privacy in every system.

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

- 동기화
- 네트워크 장애

# 분산 파일 시스템

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