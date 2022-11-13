---
layout: post
title:  'Data Engineering Series [Part21]: 시스템 디자인(2) Inter-Service Communication'
description: 
date:   2022-07-26 15:01:35 +0300
image:  '/images/system_design_logo.png'
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
# Inter-Service Communication

- 서비스간 통신 방식을 이해함으로써 어떻게 최고의 사용자 경험을 효율적으로 제공할지, 시스템간에 연쇄적으로 발생하는 문제를 어떻게 사전에 방지할지 알 수 있다

# Modes of communication

- **동기화**: 자기 자신의 응답을 리턴하기 전에 먼저 다운스트림 서비스의 응답을 기다린다
- **비동기화**: 다운스트림 서비스를 호출만 할 뿐 응답을 기다리지 않는다

# Synchronous Approach

![](/images/system_design_3.png)

- 아마존(Amazon) 시스템을 설계한다고 해보자. U1이 주문을 하려고 한다. U1은 먼저 Order 서비스에 접근할 것이다. Order 서비스는 Inventory 서비스를 통해 재고가 있는지 확인한다. 재고가 있다면 이제 Payment 서비스를 호출한다. 결제가 완료되면 Warehouse 서비스에 배송을 요청하고, Notification 서비스가 U1에게 이메일을 전송할 것이다.
- 만약 Notification 서비스에 문제가 생겼다면 어떻게 해야할까? 알림이 가지 않았다고 주문을 취소한다면 좋은 서비스라고 할 수 없다
- Payment 서비스에 문제가 생겼다면? 이 때는 Inventory 서비스, Order 서비스에 모두 Fail 응답을 반드시 보내야 한다
- 만약 모든 서비스를 동기화하는 방식으로 시스템을 디자인하면,
  - 굉장히 지연률이 높아진다
  - 일부의 장애가 연쇄적으로 다른 서비스에 영향을 미친다
  - 코드 복잡성이 높아져서 유지 관리가 어려워진다

# Asynchronous Approach 

![](/images/system_design_4.png)

- 비동기적인 방식을 생각해 보면 U1의 Order 서비스가 Inventory 서비스를 호출하더라도, 재고가 있든 없든 상관없이 주문을 진행하게 된다. 만약 이렇게 시스템을 디자인하면 문제가 더 커지게 될 것이다
- 결론은 다운스트림 서비스의 결과에 따라 자기 자신의 응답이 달라져야 한다면 동기적으로, 다운스트림 서비스의 결과에 상관 없다면 비동기적으로 설계하면 된다

## Best of Both Worlds
- 하이브리드 방식으로 설계하면, Order 서비스는 Inventory 서비스를 동기 호출, 성공시 Order 서비스는 Payment 서비스를 다시 동기 호출, 성공시 Order 서비스는 Warehouse 서비스, Notification 서비스를 비동기 호출할 것이다
- 꽤 괜찮은 솔루션이지만 약간의 문제가 있다. 만약 Warehouse 서비스에 일시적으로 장애가 발생하면, 배송이 출발하지 않는 오류가 발생할 것이다. 이런 문제를 해결해주는 것이 바로 **Message Queue**다

## Message Queues

- Order 서비스가 Warehouse 서비스에 보낼 메세지를 메세지 큐에 잘 보내기만 한다면, Warehouse 서비스는 다시 동작할 때 메세지 큐의 메세지를 읽고, 배송을 문제없이 처리할 것이다
- 이를 위해서는 메세지 큐에 메세지가 잘 도착하도록 하는 것이 중요하며, 메세지 큐 관련 시스템을 잘 설계해야 한다

![](/images/system_design_5.png)  

# Protocols for communication

In this article, we will look at the protocols we can use to interact with clients.  

## How clients and servers interact

In a real-world scenario, rather than talking to a specific server, the client’s request will instead be sent to a data center, where it could be picked up by any of the servers. However, irrespective of which server receives the request, the response will be the same. Based on this flow, we can draw the following conclusions about this architecture:  

- It is client-driven. Only on the user’s button click will the client send the requests to the server, and the server will only respond to these requests.
- It is a simple request-response model. For every request from the client, the server will respond with some information or a simple confirmation.
- There are occasional requests from clients, only one request every few seconds based on the user's actions i.e. from the client-side it is a low throughput system.
- It is a stateless system i.e. irrespective of which server is responding, the response remains the same.


## HTTP와 WebSocket

![](/images/system_design_6.png)

- HTTP
  - HTTP는 클라이언트 기반 프로토콜. 클라이언트-서버 연결은 클라이언트에 의해서만 초기화되고, 서버는 오직 응답만

  - U1이 메세지를 서버에 보내도 U2는 request로 물어봐야만 서버가 메세지를 U2에 보내준다
  - U2가 최대한 빨리 메세지를 받고 싶다면, 서버에 메시지가 왔는지 안왔는지도 모른채 계속 request를 보내야한다
  - U2가 이런식으로 계속 요청 메세지를 보내게 되면 채팅 서버에는 과부하가 걸리게 된다
  - The best approach would be **if the server could send a notification to the user every time there is a message**. For this, we use a protocol called **WebSocket**.  
  - 서버가 U2에게 보낼 메시지를 가지고 있음에도 불구하고, 능동적으로 U2에게 보내지 않는다. U2로부터 request를 받을때까지 기다린다.
  - U2는 언제 자신이 받아야할 메시지가 서버에 도착했는지 모르므로, 계속 서버에 request를 보내야 한다.
- WebSocket
  - A WebSocket connection is a **persistent connection**. It is also a **bidirectional
  - It is **optimized for high-frequency communication**
  - WebSocket을 사용하면 서버는 U2와 connection되어 있으면 request를 받지 않아도 알아서 U2에 메시지를 보낸다 
  - connection되어 있지 않으면, 가만히 있다가, connection되고 U2가 request보내면 메시지 보낸다
  - 장점: high-frequency communication에서 낮은 지연율, CPU와 Bandwidth와 같은 리소스를 아낄 수 있음
  - 하지만 수십만명의 유저와 persistent connection 유지하는데 비용이 많이 들어감

- 낮은 지연율 필요하거나, 양방향 통신이 필요하면 -> WebSocket
- 통신이 자주 발생하지 않고, 단방향 통신으로 괜찮다면 -> HTTP
