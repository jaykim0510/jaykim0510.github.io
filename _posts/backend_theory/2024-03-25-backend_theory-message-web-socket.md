---
layout: post
title:  '[Backend Thoery] 웹 소켓'
description: 
date:   2024-03-25 15:01:35 +0300
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

# 웹소켓 기초 지식

## TCP

- 웹 소켓은 전송 계층(Transport Layer, L4)으로 TCP를 사용한다
- TCP는 연결 지향적이다
- TCP는 데이터의 순서를 보장한다는 특징이 있다

## 소켓

- 소켓은 프로세스간의 통신을 위한 엔드포인트 역할을 하는 가상의 네트워크 장비 또는 소프트웨어를 말한다

## 웹소켓

- 웹소켓은 **소켓 프로그래밍을 통해** 응용 계층(Application Layer, L7)의 프로토콜 역할을 대신할 수 있다
- 웹소켓은 **양방향 통신을 위해 사용하는 대표적인 응용 계층의 프로토콜**이다
- 이러한 프로토콜을 **WS 프로토콜**(cf. HTTP 프로토콜)이라 한다
- WS 프로토콜은 서버 또는 클라이언트가 연결을 끊기 전까지 **연결이 계속 유지**된다

# Socket.IO

- 양방향, 이벤트 기반의 웹소켓 통신을 제공해주는 라이브러리이다
- 클라이언트에서의 WebSocket API, 서버에서의 ws 라이브러리 조합은 조금 더 low-level 에서 다룰 수 있지만, 그만큼 더 복잡하다
- 또 Socket.IO는 다양한 프로그래밍 언어를 지원하기 때문에 활용성 측면에서도 좋다
- Socket.IO는 WebSocket 프로토콜에 추가로 몇 가지 메타데이터가 더해지기 때문에, WebSocket 클라이언트로 Socket.IO 서버와 연결이 불가능하다. 그래서 Socket.IO를 사용한다면 클라이언트, 서버 모두 Socket.IO 라이브러리로 구현해야 한다

## 이벤트 기반

![](/images/backend_theory_ws_1.png)

- Socket.IO는 이벤트 기반 통신이다
- 서버가 클라이언트의 특정 이벤트에 데이터를 보내려면, 클라이언트에는 해당 이벤트가 등록되어 있어야 한다
- 반대로 클라이언트가 서버의 특정 이벤트에 데이터를 보내려면, 서버에 해당 이벤트가 등록되어 있어야 한다
- 그래서 만약 서버와 클라이언트가 서로 송수신하는 구조라면, 양쪽에 모두 해당 이벤트를 등록해야 한다

```js
// 서버

import express from 'express';
import http from 'http'
import { Server } from "socket.io";

const app = express()

const server = http.createServer(app)

const port = 8000

const io = new Server(server, {
    cors: {
      origin: 'http://127.0.0.1:5500'
    }
});
  
// c)
io.on('connect', (socket) => { // connect 이벤트의 콜백함수는 socket을 인자로 받는다
    socket.emit('sayHello', `Hello ${socket.id} from. Server`)
})

server.listen(port, () => {
  console.log(`Listening`)
})
```

```html
<!-- 클라이언트 -->

<script type="module">
  import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
  
  // a)
  const socket = io("http://localhost:8000", {
  });
  
  // b)
  socket.on("connect", () => {
    console.log("Connected!, from. Client")
  })
  
  // d)
  socket.on("sayHello", (message) => {
    console.log(message)
  })
  
</script>
```

- a) 클라이언트에서 `socket` 객체가 생성되면, Socket.IO는 연결 요청을 서버에 보낸다
- b) 연결에 성공하면 클라이언트에서의 `connect` 이벤트가 트리거 되고 `console.log("Connected!, from. Client")` 가 실행된다
- c) 마찬가지로 서버에서도 `connect` 이벤트가 트리거 되고 `sayHello` 이벤트를 리슨하고 있는 클라이언트에 메세지를 전송한다
- d) 클라이언트에는 `sayHello` 이벤트를 등록해뒀다. 메세지를 출력한다

![](/images/backend_theory_ws_2.png)

<br>

- 이렇게 Socket.IO 에서는 클라이언트와 서버가 서로의 이벤트를 트리거 하는 방식으로 통신한다

## 구성 요소

### 서버 객체

- 보통 `io` 라고 변수명을 정한다
- 서버 객체를 생성할 때, 포트번호, cors 등의 설정을 추가할 수 있다

```js
import { Server } from "socket.io";

const io = new Server({ /* options */ });
```

### 소켓 객체

- 서버 사이드 소켓 객체가 있고, 클라이언트 사이드 소켓 객체가 있다
- 공통적인 속성(ex. `id`), 메서드(ex. `emit`, `on`, `once`)도 있고, 각각이 별도로 가지는 속성, 메서드도 있다
- 소켓 객체에 원하는 어떤 속성도 추가할 수 있다 (ex. user)
- 연결(connect), 연결 실패(connect_error) 또는 연결 끊기(disconnect, disconnecting)과 같은 예약된 이벤트가 있다

#### id

- 소켓 식별자
- 공통적인 속성이다
- 소켓은 연결시 랜덤 문자열의 `id`를 가지며 이 값은 서버 사이드와 클라이언트 사이드의 소켓 객체가 서로 동기화된다
- 연결 상태 복구가 활성화되지 않은 경우, 재연결 될 때마다 새로운 `id` 값을 부여받는다
- 브라우저 탭마다 서로 다른 `id`를 가진다

```js
// server-side
io.on("connection", (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

// client-side
socket.on("connect", () => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});
```

#### rooms

- 소켓이 현재 속해있는 방들의 목록(rooms)을 가지는 Set 자료구조
- 서버 사이드 소켓 객체가 가지는 속성이다

```js
io.on("connection", (socket) => {
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join("room1");
  console.log(socket.rooms); // Set { <socket.id>, "room1" }
});
```

#### connected

- 소켓이 연결되어 있는지를 나타내는 불린(boolean) 자료구조
- 클라이언트 사이드 소켓 객체가 가지는 속성이다

```js
socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.on("disconnect", () => {
  console.log(socket.connected); // false
});
```

|위치|서버|클라이언트|
|속성|id, handshake, rooms, data, conn|id, connected, io|
|메서드|emit, on, once, removeListener|emit, on, once, off|
|이벤트|disconnect, disconnecting|connect, connect_error, disconnect|

## 트래픽 구분

### Broadcasting

- 위에서는 지금까지 이벤트를 트리거한 소켓과 통신하는 방법에 대해서 봤다
    ```js
    // 서버
    
    io.on('connect', (socket) => {
        socket.emit('sayHello', `Hello ${socket.id} from. Server`)
    })
    ```

- 모든 소켓에게 데이터를 전송할 수도 있다
    ```js
    // 서버
    
    io.on('connect', (socket) => {
        io.emit('sayHello', 'Hello everyone~ Newbie is connected. from. Server')
    })
    ```

- 이벤트를 트리거한 소켓을 제외한 모든 소켓에게 데이터를 전송할 수도 있다
    ```js
    // 서버
    
    io.on('connect', (socket) => {
        socket.broadcast.emit('sayHello', 'Hello previous members~ Newbie is connected. from. Server')
    })
    ```

![](/images/backend_theory_ws_3.png)

### Rooms

- 모든 소켓에게 브로드캐스팅 하는 방식이 아닌, 특정 방(room)에 속해있는 소켓들에만 브로드캐스팅 할수도 있다
- 카카오톡의 대화방과 비슷하다
- 방 만들기(create-room)/방 삭제하기(delete-room)/방 입장하기(join-room)/방 나가기(leave-room)

```js
io.on("join", (socket) => {
  socket.join("some room");
});

io.on("leave", (socket) => {
  socket.leave("some room");
});
```


- 방에 메세지 전송하는 방법은 `emit()` 앞에 `to('방 이름')` 만 붙여주면 된다

```js
io.to('방 이름').emit('sayHello', 'Hello everyone~ Newbie is connected. from. Server') // Broadcasting
socket.to('방 이름').emit('sayHello', `Hello ${socket.id} from. Server`) // Broadcasting except sender
```


### Namespaces

- Room과 비슷하다
- 차이점은, Room 보다 더 넓은 범위를 가진다. 즉 namespace -> room 순으로 트래픽이 분기된다
- 예를 들어, authorization이 있는 유저와 없는 유저를 구분하기 위해 namespace를 사용할 수 있다



# 참고

- [The WebSocket API (WebSockets), mozilla](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [ws: a Node.js WebSocket library, npm](https://www.npmjs.com/package/ws)
- [Socket.IO](https://socket.io/)
- [Socket.IO - client(주요 개념, 작동방식, 트래픽 격리 구분, 이벤트 송수신), fejigu](https://velog.io/@fejigu/Socket.IO-client#-socketio%EB%9E%80)