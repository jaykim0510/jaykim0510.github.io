---
layout: post
title:  'Data Engineering Series [Part17]: 분산 시스템(3) CAP Theorem'
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

> The CAP Theorem is one of the most fundamental theorems in the field of distributed systems. It outlines an inherent trade-off in the design of distributed systems.  

- CAP는 각각 Consistency, Availability, Partition tolerance 를 뜻한다
- 분산 시스템은 다음과 같은 3가지 특징을 가질 수 있지만, 실제 환경에서는 이중 2개만을 얻을 수 있다

- **Consistency**: 만약 성공적으로 데이터를 읽어왔다면, 반드시 가장 최근에 쓴 데이터를 읽어와야 한다. CAP 이론에서 말하는 Consistency와 ACID에서 말하는 Consistency는 다르다
- **Availability**: 모든 읽기/쓰기 요청은 반드시 응답을 받아야 한다
- **Partition tolerance**: 노드간의 네트워크에서 데이터가 지연되거나 유실되더라도 데이터베이스는 계속 동작해야 한다

분산 시스템에서 네트워크 장애는 가장 발생하기 쉬운 장애중 하나다. 이를 완벽하게 해결할 방법은 없기 때문에, 클러스터의 노드중 일부가 네트워크 장애를 겪게되는 상황을 반드시 고려해 분산 시스템을 디자인 해야한다.  

그래서 대부분의 분산 시스템은 "P"는 반드시 포함하도록 설계되고, 남은 "C"와 "A"중에서 시스템 목적에 맞게 하나를 선택한다. 그래서 대개 CP 또는 AP중 하나가 된다.  

데이터베이스의 경우 RDBMS는 대부분 트랜잭션의 ACID 특성을 지키기 위해 CP 방식으로 설계하고, NoSQL은 AP 방식으로 데이터베이스를 설계한다.  

참고로 

- AP 시스템은 네트워크 파티션이 생겼을 때 AP를 보장해준다. 네트워크 장애가 없는 상황에서는 C도 해결된다.  
- CP 시스템은 네트워크 파티션이 생겼을 때 CP를 보장해준다. 네트워크 장애가 없는 상황에서는 A도 해결된다
- CA 시스템은 현실적으로 둘 다 완벽하게 지켜낼 수 없다. C를 무조건 보장하면서 A를 최대한 제공해주는 방식이다. 

## AP – Availability + Partition Tolerance

- 어떤 데이터의 변경사항에 대해 모든 노드에 동기화 하기 전에 데이터 사용을 허용한다
- 노드 일부에 장애가 발생해 동기화되지 않아도 데이터 사용이 가능하다 -> Availability
- 만약 네트워크 파티션 문제가 해결된다면 분산 시스템은 resync를 하고 Consistency 또한 얻을 수 있다
- ex. DNS: 노드 일부에 장애가 발생해도 서비스를 지속 제공하지만, DNS에 도메인 등록/삭제가 모든 시스템에 전해지고 클라이언트에게 보이기까지 보통 며칠이 걸린다

## CA – Consistency + Availability

- 현실적으로 분산 시스템에서 Consistency와 Availability를 둘 다 동시에 얻는 것은 불가능하다
- 그래서 보통 단일서버가 CA 특성을 가진다 -> 전통적인 RDBMS
- 둘 다 높일 수는 없고, 하나를 높이면 다른 하나는 낮아진다

## CP – Consistency + Partition Tolerance

- Consistency를 지키기 위해서는 항상 분산 시스템의 모든 노드들이 in-sync 여야 한다
- 이러한 이유로 만약 일부 네트워크에 파티션 문제가 발생하면, in-sync 한 상황이 깨지기 때문에 시스템 작동을 아예 중지한다
- 이러한 특성은 보통 대부분의 서비스에서 사용하지 않는 방식이다.
- 하지만 금융 분야에서는 잠깐 서비스가 중단되더라도, 데이터의 Consistency를 맞추는 것이 훨씬 중요하기 때문에 사용된다

![](/images/cap.png)

![](/images/dis_sys_6.png)

# Importance of the CAP theorem

- CAP 이론을 알아야 분산 시스템을 디자인할 때 어떤 것을 얻기 위해 어떤 것을 포기해야 하는지 알 수 있다


# 참고

- [Understanding NoSQL Databases by the CAP Theorem](https://data-science-blog.com/blog/2021/10/14/cap-theorem/){:target="_blank"}