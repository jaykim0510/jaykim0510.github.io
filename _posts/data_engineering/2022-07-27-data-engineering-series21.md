---
layout: post
title:  'Data Engineering Series [Part21]: 시스템 디자인(2) Inter-Service Communication'
description: 
date:   2022-07-26 15:01:35 +0300
image:  '/images/system_design_logo.png'
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
Let us see what happens in a purely asynchronous approach.   

![](/images/system_design_4.png)

U1 sends a call to the Order Service which makes asynchronous calls to all the downstream systems. In such a case, even if Inventory Service responds with an error code, or even if the payment fails, the order would get placed. Which is an even bigger mess! So how do we go about this?  

Well, as we can see, some parts of this process must be mandatory, and some can be done on a best-effort basis. If the Inventory Service or Payment Service responds with an error, we cannot place the order. But if the notification does not go through or the Warehouse Service is temporarily down, we don’t need to cancel our order. So we can follow a hybrid approach here; **use a synchronous approach for the mandatory steps and an asynchronous approach for the rest.**    

## Best of Both Worlds
The Hybrid approach suggests that the mandatory tasks need to be performed in a synchronous manner and everything else can be done asynchronously.  

So Order Service will send out a synchronous call to Inventory Service, and wait for a response. In case of success, it will call the Payment Service. If the Payment Service gives a successful response, Order Service will make parallel asynchronous calls to the Warehouse Service and Notification Service and, at the same time, respond to the user saying the order has been placed. If the Payment Service call had failed, Order Service would send an asynchronous call to the Inventory Service reverting the quantity change.  

So this looks like a much better solution. There are still some misses here though. What if the asynchronous call to Warehouse Service failed? It would lose the details for that order. This is where we would use **Message Queues**.  

## Message Queues
Message Queues(Kafka, RabbitMQ, ActiveMQ 등) are highly fault-tolerant and persist messages for some time. How a message Queue works is, it has some Publishers adding messages to it, and some Subscribers listening to it and picking up the events meant for them at their own pace. Since these queues store messages for some time, if a subscriber is temporarily down, the messages will remain in the queue and will be picked up when the subscriber is running again.  

![](/images/system_design_5.png)  

So now, when Order Service wants to make asynchronous calls to Warehouse and Notification services, it will instead put an event in the Message Queue. Warehouse Service and Notification Service, which will be listening to the queue, will pick up the events meant for them. If one of the systems is down, the messages will remain in the queue until the service is back up and ready to receive messages again. This way, none of the data gets lost.  


# Protocols for communication

In this article, we will look at the protocols we can use to interact with clients.  

## How clients and servers interact

In a real-world scenario, rather than talking to a specific server, the client’s request will instead be sent to a data center, where it could be picked up by any of the servers. However, irrespective of which server receives the request, the response will be the same. Based on this flow, we can draw the following conclusions about this architecture:  

- It is client-driven. Only on the user’s button click will the client send the requests to the server, and the server will only respond to these requests.
- It is a simple request-response model. For every request from the client, the server will respond with some information or a simple confirmation.
- There are occasional requests from clients, only one request every few seconds based on the user's actions i.e. from the client-side it is a low throughput system.
- It is a stateless system i.e. irrespective of which server is responding, the response remains the same.


## HTTP

These requirements make this a perfect use case for HTTP(s) protocol. Although these days, most architectures on HTTP have moved to HTTPS, which is a more secure version of HTTP as it prevents man-in-the-middle attacks.  

Now, when we are using HTTP, REST is usually the best API standard to follow as it is very widely used and very user friendly.  

Let us look at an example for a REST request and response:  

```
Request:
Method: GET
URL: https://www.twitter.com/user/{id}

Response:
Status: 200 OK
Headers: <...>
Body: {
    “userId”: 1,
    “Email”: “someone@example.com”
}
```

The client makes a request to twitter.com over HTTPS to get information about a user with an id. In response, the server sends a success status code along with the user’s user id and email. As you can see, REST API standard is pretty much self-documenting, which adds to its user friendliness.  

Now let us look at an example of a chat application.  

![](/images/system_design_6.png)

We know that HTTP is a client-driven protocol, so the server cannot initiate any contact with the client. It can only respond to the client upon receiving a request. So when U1 sends a message to U2 via chat server, U2 doesn’t receive the message until it asks the server to share any pending messages. This leads to a delay when receiving messages.  

A solution to this would be that U2 sends frequent requests to the chat server in the hopes of receiving a message. But this puts a huge load on the chat server as it will receive a huge number of requests from all its clients.  

The best approach would be **if the server could send a notification to the user every time there is a message**. For this, we use a protocol called **WebSocket**.  

(서버가 U2에게 보낼 메시지를 가지고 있음에도 불구하고, 능동적으로 U2에게 보내지 않는다. U2로부터 request를 받을때까지 기다린다.)  
(U2는 언제 자신이 받아야할 메시지가 서버에 도착했는지 모르므로, 계속 서버에 request를 보내야 한다.)  
(WebSocket을 사용하면 서버는 U2와 connection되어 있으면 request를 받지 않아도 알아서 U2에 메시지를 보낸다)  
(connection되어 있지 않으면, 가만히 있다가, connection되고 U2가 request보내면 메시지 보낸다)  
(WebSocket에도 단점은 있다. cost of maintaining a persistent connection with millions of users.)

## WebSocket
A WebSocket connection is a persistent connection. It is also a bidirectional protocol, where communication can be initiated by the client or the server as long as there is an open connection. It is **optimized for high-frequency communication**.  

Let's look at how our chat application would work in the case of WebSocket protocol.  

![](/images/system_design_7.png)  

First, U1 and U2 will establish HTTP connections with the chat server, which are then upgraded to a WebSocket connection. When U1 sends a message for U2 via the chat server, it will store the message along with its status, RECEIVED, let's say.  

The chat server, if it has an open connection with U2, will then send the message to U2 and update the status to SENT. If U2 was not online and there was no open connection between U2 and the server, the messages will be saved until U2 comes online and requests the server to send all pending messages. The server will send all messages with the status RECEIVED and update the status to SENT.  

As you can see, with this approach we have:  

- Reduced the latency, since the server can simply send the messages over an open connection
- Saved on CPU and bandwidth, as the client doesn’t need to unnecessarily send requests to the server and the server is not under unnecessary load
- Provided better user experience


Even with the benefits, there is a high cost to using WebSockets; that is the cost of maintaining a persistent connection with millions of users.  

So how do we decide whether to use HTTP or WebSocket? Do we always go for Websocket then? Well, not really, as WebSocket is much more expensive than HTTP. We can safely say, if the communication between client and server is at a **lower throughput on the client-side**, HTTP is the way to go. **If the communication is always client-driven**, WebSocket is not needed. Also, if you are on a **tight budget**, HTTP may be the better choice.  

On the other hand, if the communication from the **client is at a higher throughput**, WebSocket may be a better option. If the **communication can be driven by both client and server**, WebSocket is the way to go. Although here comes the tradeoff between cost and performance. We must decide if the optimization is really worth the huge cost of maintaining persistent connections with so many users.  