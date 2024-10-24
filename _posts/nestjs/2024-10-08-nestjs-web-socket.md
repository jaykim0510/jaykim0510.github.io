---
layout: post
title:  '[NestJS] 웹 소켓'
description: 
date:   2024-10-08 15:01:35 +0300
image:  '/images/nestjs_practice_logo.png'
logo_image: '/images/nestjs_practice_logo.png'
category: backend
tag: NestJS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# 웹소켓이란
- 웹소켓(WebSocket)은 클라이언트와 서버 간의 양방향 통신을 가능하게 하는 프로토콜입니다.
- 일반적인 HTTP 요청/응답 방식은 클라이언트가 요청을 보내고 서버가 응답을 보내는 단방향 구조인 반면,
- 웹소켓은 연결이 한 번 이루어진 후에는 클라이언트와 서버가 상시 연결된 상태로 데이터를 주고받을 수 있습니다.
- 이 덕분에 실시간 데이터 교환이 가능하며, 별도의 요청을 계속해서 보내지 않고도 즉각적인 정보를 주고받을 수 있습니다.

# 웹소켓이 유용한 경우

- 웹소켓은 실시간 통신이 필요한 다양한 애플리케이션에서 유용하게 사용됩니다. 예를 들어:
    - 채팅 애플리케이션: 사용자가 메시지를 보낼 때마다 새로고침 없이 실시간으로 대화를 주고받을 수 있습니다.
    - 실시간 알림 시스템: 새로운 알림이 발생할 때 바로 사용자에게 전달됩니다.
    - 온라인 게임: 게임 상태를 실시간으로 업데이트할 수 있습니다.
    - 주식/환율 등 실시간 데이터 시각화: 주식 가격이나 환율 변동을 실시간으로 업데이트하여 사용자에게 보여줍니다.

# 장단점

## 장점

- 실시간 양방향 통신: 서버와 클라이언트 간의 상시 연결을 유지하여 실시간으로 데이터를 주고받을 수 있습니다.
- 낮은 대기 시간: 서버에서 클라이언트로 데이터를 빠르게 전달할 수 있습니다.
- 효율적인 리소스 사용: 클라이언트가 데이터를 요청하는 HTTP 방식과 달리, 데이터를 푸시(push) 방식으로 받을 수 있어 불필요한 리소스 소모를 줄입니다.

## 단점

- 복잡한 연결 관리: 항상 연결된 상태를 유지하기 때문에 연결 관리가 복잡할 수 있습니다. 연결이 끊어졌을 때 이를 처리하는 추가적인 로직이 필요합니다.
- 보안 이슈: 지속적인 연결로 인해 보안 관리가 중요해집니다. WebSocket은 일반적인 HTTP 요청보다 공격에 취약할 수 있기 때문에 이를 보호하기 위한 SSL이나 추가적인 인증 메커니즘이 필요합니다.

# NestJS

- NestJS에서는 웹소켓 게이트웨이(Gateway)를 통해 서버에서 실시간 이벤트를 처리한다

```
npm install @nestjs/websockets @nestjs/platform-socket.io
```

```ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(8001, { cors: true })
export class ClubGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('chat')
  handleMessage(client: Socket, payload: { clubId: string; message: string }) {
    client.to(payload.clubId).emit('chat', payload.message);
    console.log(
      `${client.id} 님이 ${payload.clubId} 방에서 '${payload.message}' 메세지를 전송했습니다.`,
    );
  }
}
```