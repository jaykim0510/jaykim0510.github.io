---
layout: post
title:  '[Network] 네트워크 용어(2): 소켓(Socket)'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# Socket

- 소켓은 응용 계층에서 두 프로세스(클라이언트-서버)간의 통신을 위한 엔드포인트를 제공하는 소프트웨어다 -> 서로 다른 서버의 프로세스간의 통신
- 유닉스 계열의 운영체제에서 IPC를 위한 엔드포인트 -> 같은 서버안에 있는 프로세스간의 통신
- 소켓은 결국 어떤 종류의 통신이든 필요로 하는 가상의 네트워크 장비이다
- SSH, FTP, HTTP, 웹소켓 통신과 같은 **모든 응용 계층에서의 통신은 결국 소켓을 사용**한다
- 소켓 프로그래밍을 통해 HTTP와 같은 단방향 통신이 아닌 양방향 통신을 가능하게 하는 프로토콜을 직접 만들어 쓸 수도 있다(ex. 웹소켓)
- 소켓은 응용 계층에 사용되는 프로토콜을 실제로 코드로 구현해 놓은 소프트웨어라고 할 수 있다
- 각 소켓은 IP주소와 Port번호로 이루어진 특정 주소를 가지고 있다

![](/images/socket_2.png)  


## 소켓을 이용한 통신 메커니즘

```
- 클라이언트와 서버에서 각각 소켓을 생성한다
- 서버는 클라이언트가 서버를 찾을 수 있도록 소켓에 주소를 bind 한다
- 그리고 클라이언트의 요청을 기다린다
- 클라이언트가 서버에 연결을 요청하고, 서버가 이를 수락하면 통신이 가능해진다
```

![](/images/socket_4.png)  


- `socket()`을 호출하면 통신을 위한 엔드포인트를 나타내는 소켓 디스크립터를 리턴한다
- 서버는 `bind()`를 호출해 클라이언트가 서버를 찾을 수 있도록 소켓에 주소를 바인딩한다
- `listen()`은 서버가 클라이언트의 요청을 받을 준비가 되었다는 신호를 의미한다
- 클라이언트는 `connect()`를 이용해 서버에 연결을 요청한다
- 클라이언트는 `accept()`를 통해 요청을 받아들인다
- 서버와 클라이언트는 `recv()`, `send()`, `read()`, `write()`와 같은 전송 API를 이용해 데이터를 주고 받는다
- 서버 또는 클라이언트가 연결을 종료하고 싶을 때는 `close()`를 호출하여 연결을 종료한다

```
The socket APIs are located in the communications model between the application layer and the transport layer. 
The socket APIs are not a layer in the communication model. 
Socket APIs allow applications to interact with the transport or networking layers of the typical communications model.
```

## 소켓의 종류

- 소켓의 종류에 따라 L4(Transport Layer)의 프로토콜이 달라진다
- 또는 원하는 L4의 프로토콜에 따라 소켓의 종류를 다르게 사용해야 한다

- **Datagram Socket**
  - 데이터그램 소켓의 연결은 단방향이고 신뢰할 수 없다. 
  - 또한 수신 측에서 데이터를 순서대로 받는다고 보장할 수도 없다. 데이터그램은 L4 계층에서 UDP(User Datagram Protocol)라는 표준 프로토콜을 사용한다. 
  - 안전장치도 별로 없어서 단순하고 간단하고, 가벼운 방법이다. 고로, 부하가 매우 적다. 
  - 패킷 손실이 허용되기도 한다. 
  - 보통, 네트워크 게임이나 미디어 스트리밍에서 자주 쓰인다.
- **Stream Socket**
  - 전화와 같이 믿을 수 있는 양방향 통신을 제공한다. 
  - 한쪽에서 다른 한쪽으로의 연결을 초기화하고, 연결이 생성된 후에는 어느 쪽에서든 다른 쪽으로 통신할 수 있다. 
  - 보낸 내용이 실제로 도착했는지도 즉각 확인할 수 있다. 스트림 소켓은 TCP(Transmission Control Protocol)라 불리는 표준 통신 프로토콜을 사용한다.
  - TCP는 패킷이 오류 없이 순서대로 도착하도록 설계되었다. 
  - 웹서버, 메일서버, 각 클라이언트 애플리케이션 모두는 TCP와 스트림 소켓을 사용한다.

# Web Socket

- 웹 소켓은 양방향 통신을 위한 응용 계층 표준 프로토콜
- 이 때 전송계층은 TCP
- Web Socket is designed to work over HTTP ports 443 and 80 to support HTTP proxies and interfaces.

```
There are two significant API types when it comes to web communication. 
Whether to use HTTPS or Web Socket is a crucial decision while deploying projects / applications. 
The choice would depend on which technology best fits actual client requirements and situations.
```

- 웹소켓은 HTTP통신과 자주 비교된다
- 왜냐하면 HTTP통신의 단방향, 실시간 통신에 약하다는 단점을 웹소켓이 해결해주기 때문이다

### Web Socket Pros and Cons

- **장점**
  - 빠르고, 리소스 소모가 적다
  - 실시간에 가까운 요청/응답
  - 양방향 통신

- **단점**
  - 웹 브라우저는 완전히 HTML5 규칙을 따라야함
  - Intermediary / Edge caching not possible
  - 단방향에 비해 통신 방식이 조금 더 복잡
 

### Applications of Web Socket

- 비트코인 거래소, 게임, 채팅 어플리케이션에 이상적


## What is HTTP?
- HTTP is a communication protocol of the World Wide Web. 
- Http works as a request-response protocol in the client-server computing model.  
- HTTP is a uni-directional protocol where the client sends the request and the server sends the response. 
- Each request is associated with a corresponding response , after the response is sent and connection gets closed each HTTP or HTTPS request establishes a new connection to the server every time and post getting response connection gets terminated itself.  
- HTTP is a stateless protocol that runs on TCP which is a connection-oriented protocol 

### How HTTP works?

HTTP message information is encoded in ASCII and each HTTP request message comprising HTTP protocol version (HTTP/1.1, HTTP/2), HTTP methods (GET/POST etc.) , HTTP headers (content type, content length) , host details etc. and the body which contain the actual message sent to server. HTTP headers size varies from 200 bytes to 2 KB in size.

### HTTP Pros and Cons
- **장점**
  - Advanced addressing scheme by assigning IP Addresses with recognizable names for ease of identification on World Wide web
  - Capability to download extensions or plugins and display relevant data
  - Chance of interception during transmission is minimized as each file download happens from independent connection and gets closed
  - Less latency due to no handshaking following the request except during initial stage when connection is established
  - All HTTP page gets stored inside the Internet cache for quick content loading

- **단점**
  - Data integrity is an issue as hacker manage to intercept the request, they can view all the content present on web page
  - Client don’t take any measures to close connection once all data is received hence during this time-period server may not be present
  - HTTP needs multiple connections causing administrative overhead
  - Not suitable for IoT devices as it uses number of system resources which leads to more consumption of power
 

### Applications of HTTP
- Fetching /transferring old data
- Simple RESTful applications use HTTP

![](/images/socket_5.png)


# 참고

- [[소켓과 웹소켓] 한 번에 정리 (1),소켓이란?, 소켓 API의 실행 흐름, 클라이언트 소켓과 서버 소켓](https://velog.io/@rhdmstj17/%EC%86%8C%EC%BC%93%EA%B3%BC-%EC%9B%B9%EC%86%8C%EC%BC%93-%ED%95%9C-%EB%B2%88%EC%97%90-%EC%A0%95%EB%A6%AC-1){:target="_blank"}
- [baeldung, The Difference Between a Port and a Socket](https://www.baeldung.com/cs/port-vs-socket){:target="_blank"}
- [Web Socket vs HTTP: What to choose for your next API Design](https://ipwithease.com/web-socket-vs-http/){:target="_blank"}
- [What is web socket and how it is different from the HTTP?](https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/){:target="_blank"}
