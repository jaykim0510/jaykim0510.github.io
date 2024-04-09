---
layout: post
title:  '[Backend Thoery] 실시간 통신'
description: 
date:   2023-12-20 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 실시간 통신

- 새로운 데이터 또는 변경된 데이터가 발생할 때마다 **클라이언트의 요청 없이도** 서버에서 데이터를 보내고 싶은 경우가 있다
- ex. 주식 가격, 실시간 알림, 채팅 메세지 등
- 실시간 통신을 구현하는 방법에는 대표적으로 Polling, WebSocket, SSE 방식이 있다



# Polling

- 간단하게, 클라이언트가 서버에게 주기적으로 요청을 보내 새로운 데이터를 받아오는 방식이다
- 하지만, 실시간성을 위해 너무 자주 요청을 보내면 서버에 부하가 생기게 되고, 요청 간격이 길어지면 또 실시간성이 떨어진다는 단점이 있다


# Long Polling

- Polling과 비슷하게 클라이언트가 주기적으로 요청을 보낸다
- 차이점은, 서버가 유효한 응답을 보낼 때 까지 클라이언트는 연결을 유지하고 대기한다
- 클라이언트는 서버로 부터 응답을 받으면 다시 다음 응답을 위해 요청을 보낸다
- (무지성으로 요청을 보내는 방식에서, 유효한 응답을 받은 경우에만 요청을 보내는 방식으로 발전됐다)


# WebSocket

- 웹소켓은 단방향이 아닌 양방향 통신 방식이다
- 다른 방식들은 모두 응용 계층에서 HTTP 프로토콜을 사용하지만, 웹소켓은 그 자체로 하나의 프로토콜이며 WS 프로토콜이라 한다
- 웹소켓의 전송 계층은 TCP이다

![](/images/socket_2.png)  

<div class="bell-para">
    <div class="bell-bar">
      <i class="fa-solid fa-bell"></i>
      소켓(Socket)
    </div>
    <div class="bell-content">
      <ul>
        <li>소켓은 응용 계층에서 프로세스간의 통신을 위한 엔드포인트를 제공하는 소프트웨어다</li>
        <li>프로세스는 같은 서버에 있을 수도 있고 서로 다른 서버에 있을 수도 있다</li>
        <li>클라이언트-서버는 서로 다른 서버의 프로세스간 통신이 된다</li>
        <li>유닉스에서의 IPC는 같은 서버의 프로세스간 통신이 된다</li>
        <li>소켓은 결국 어떤 종류의 통신이든 필요로 하는 가상의 네트워크 장비이다</li>
        <li>SSH, FTP, HTTP, 웹소켓 통신과 같은 모든 응용 계층에서의 통신은 결국 소켓을 사용한다</li>
        <li>소켓 프로그래밍을 통해 HTTP와 같은 단방향 통신이 아닌 양방향 통신을 가능하게 하는 프로토콜을 직접 만들어 쓸 수도 있다(ex. 웹소켓)</li>
        <li>각 소켓은 IP주소와 Port번호로 이루어진 특정 주소를 가지고 있다</li>
      </ul>
    </div>
</div>



# SSE (Server-Sent-Event)


- 서버에서 발생(publish)한 이벤트를 클라이언트에서 구독(subscribe)하는 방식이다
- 최초의 연결만 클라이언트의 요청에 의해 발생되고, 이 후에는 클라이언트의 요청을 통한 폴링(polling)방식이 아닌, 서버가 알아서 이벤트를 푸싱(pushing)하는 방식으로  통신이 이루어진다



# Use Cases

- 채팅 시스템처럼 데이터를 양방향으로 주고 받아야 하는 경우에는 웹소켓을 사용한다
- 주식 가격처럼 데이터를 받기만 하고, 업데이트가 잦은 경우에는 SSE를 사용한다


# 참고

- [[Spring] Server-Sent Events(SSE), Amaranth](https://amaran-th.github.io/Spring/[Spring]%20Server-Sent%20Events(SSE)/)
- [Server Sent Events, javascript.info](https://ko.javascript.info/server-sent-events)