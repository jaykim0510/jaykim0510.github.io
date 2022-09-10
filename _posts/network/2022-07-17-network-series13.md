---
layout: post
title:  'Network Series [Part12]: 네트워크 용어(3): IPC, RPC'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/rpc_2.png'
logo_image: '/images/cs_logo.jpeg'
categories: CS
tags: Network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# IPC

- Inter-Process Communication의 줄임말 -> 프로세스간 통신을 의미
- 프로세스끼리 서로 데이터를 주고 받는 방법들을 일컫어 IPC라고 함
- 스레드끼리는 메모리를 공유한다 -> 공유하는 공간이 있기 때문에 데이터를 주고 받는데 크게 어려움이 없다
- 프로세스는 별도의 메모리에 생성된다 -> 공유하는 공간이 없다 -> 이를 위해 운영체제 커널에서 IPC를 위한 여러 도구를 제공
- 공유 메모리, 파일, 파이프, 소켓, 메세지 큐, RPC

## Use Cases
There are several good reasons and common use cases for IPC:

- **Sharing information/data** – Share data between processes to synchronize different applications
- **Computational Speedups** – Sending data off site for processing
- **Modularity** – Google Chrome separates each tab into a separate process to help avoid crashes, as well as security.
- **Development** – Often it is easier to have two teams build separate programs. By building them with IPC in mind you can essentially “plugin” to any programs which need similar functionality without any recompiling
- **Security** – It is often useful to separate processes to ensure system security. Each process has it’s own memory and if they communicate as opposed to sharing memory the process will be modularized and possibly more secure.

## 공유 메모리

> Shared memory IPCs refer to sharing a physical memory location where multiple processes read and write to. The processes do this by mapping local memory to the shared physical memory location (via pointers or some other method). The physical memory is then used throughout the processes life spawn, meaning some processes can finish and close, but the physical memory remains until it is released (and all processes detach).

> It is possible (and advised) to address the issue of mutual exclusion by building a mutex that spans processes. Programers must recognize this and program accordingly.


![](/images/ipc_1.png)

- 프로세스간 read, write를 모두 필요로 할 때 사용
- 중개자 없이 메모리에 바로 접근 가능 -> 모든 IPC 방법 중에 가장 빠름
- 공유 메모리 모델의 장점
   - 커널의 관여 없이 메모리를 직접 사용하여 IPC 속도가 빠르다.
   - 프로그램 레벨에서 통신 기능을 제공하여, 자유로운 통신이 가능하다.
- 공유 메모리 모델의 단점
   - 구현하기 어렵다는 단점이 있다.
- 컨텍스트 스위칭 관점
   - 공유 메모리 모델에서의 IPC는 해당 프로세스가 CPU를 사용하는 행위이다. 
   - 즉, IPC를 많이 한다고 컨텍스트 스위칭 많이 일어나지 않는다.
- 동기화 관점
   - 메모리 영역에 대한 동시적인 접근을 제어하기 위한 방법이 필요하다.
   - 커널이 동기화를 제공하지 않으며, 부가적인 방법이 필요하다.
   - 접근 제어 방식은 locking이나 세마포어(semaphore) 등이 있다.
- 공유 메모리 모델의 활용의 예 : 데이터베이스


## 파일

- 파일을 이용한 통신은 부모-자식 프로세스 간 통신에 많이 사용
- 운영체제가 별다른 동기화를 제공하지 않음
- 동기화를 위해 주로 부모 프로세스가 wait() 함수를 이용하여 자식 프로세스의 작업이 끝날 때까지 기다렸다가 작업을 시작

## 파이프

> Pipes are relatively straight forward. Instead of using shared/mapped memory to share data among processes, instead we “pipe” data across processes with the help of the operating system. Although this does not mean that less memory is used necessarily (by the system), but it does remove the programmers requirement to manage it. The major advantage they have over the shared or mapped memory IPCs is that the programmer does not have to worry about does not have to worry about mutual exclusion for read/writing, the operating system handles it all.

![](/images/ipc_2.png)

- 익명 파이프 (Anonymous Pipe)
  - 기본 파이프
  - 부모-자식, 형제 프로세스간 통신에 사용
  - 기본적으로 하나의 프로세스는 read, 다른 하나는 write만 가능한 단방향 통신 -> 양방향 통신을 위해서는 2개의 파이프 필요
  - 파이프를 사용하는 프로세스가 없으면 자동으로 제거됨
- 네임드 파이프 (Named Pipe)
  - 부모-자식, 형제 프로세스가 아닌 서로 무관한 프로세스간 통신에도 사용 가능
  - FIFO라 불리는 특수한 파일 사용
  - 네임드 파이프로 양방향 통신을 위해서는 2개의 파이프 필요
  - 파이프를 사용하는 프로세스가 없어도 제거되지 않고 남아있음

## 소켓

> sockets are similar to pipes, but capable of network connections (i.e. communication across computers). The data then travels through the network to another computer and to the desired process. You can also use sockets locally by using the “localhost” to essentially loop-back to the another process on the system.

![](/images/ipc_3.png)

- 소켓은 두 프로세스간 통신을 위해 제공되는 엔드포인트
- 원격에 있는 프로세스간 통신을 제공
- 양방향 통신이 가능
- 서버/클라이언트 구조의 프로세스간 통신에 자주 사용

## 메세지 큐

- 파이프와 비슷하게 단방향 통신
- 파이프와 다른점은 메세지 큐는 메모리를 사용
- 다수의 프로세스간 데이터 전달 가능
- 메시지 큐를 사용하기 위해서는, "메시지 큐 ID"를 알아야 함 (cf.소켓은 상대방 프로세스의 "포트 번호"만 알면 가능)

위에서 살펴본 파이프, 소켓, 메세지 큐와 같은 방식을 메세지 전달 모델이라고 한다.  

- 메시지 전달 모델의 장점
   - 구현하기에 간단하여 사용하기 편리하다.
- 메시지 전달 모델의 단점
   - 커널을 경유하므로, 속도가 느리다.
- 컨텍스트 스위칭 관점
   - 메시지 전달 모델에서의 IPC는 해당 프로세스 입장에서 일종의 입출력(I/O)로 볼 수 있다.
   - 즉, IPC를 하면 할수록 컨텍스트 스위칭이 많이 일어난다.
   => 예를 들어, send하고 상대방이 받을 때까지 기다려야 하며, 이 때 컨텍스트 스위칭이 발생한다.
   => 마찬가지로, receive하면 상대방이 보낼 때까지 기다려야 하며, 이 때 컨텍스트 스위칭이 발생한다.
- 동기화 관점
   - send와 receive와 같은 연산에 대해서는 커널이 동기화를 제공한다.
   - send와 receive를 수행할 때에 프로그램은 동기화에 대한 고려 없이 사용할 수 있다.
- 메시지 전달 모델 활용의 예 : 서버-클라이언트 방식의 통신
- 메시지 전달 모델의 구현 IPC : PIPE, Message Queue, Socket


# RPC

> Remote Procedure Call is a technique for building distributed systems. Basically, it allows a program on one machine to call a subroutine on another machine without knowing that it is remote

- IPC의 한 종류
- 분산 네트워크에서 많이 사용하는 방식
- 클라이언트는 마치 로컬에 있는 프로시저를 실행하듯 사용 -> 실제로는 원격의 주소 공간에 있는 프로세스에게 요청 -> 원격에서 실행한 뒤 결과를 리턴
- (프로시저(procedure)는 서브루틴(subroutine)이 될 수도 있고, 서비스가 될 수도 있고, 함수가 될 수도 있다)
- MSA(Micro Service Architecture)패턴으로 서비스를 개발하는 환경에서 유용하게 활용됨
- RPC는 Java, Python, Go와 같은 다양한 언어로 구현할 수 있음
- RPC는 프로세스간 통신 과정을 추상화
- 네트워크 장비, 프로토콜, 운영체제에 무관하게 개발 가능

![](/images/rpc_2.png)

## When the client calls the server, the RPC system must take care of:  

- Taking all the parameters which are passed to the subroutine and transferring them to the remote node;
- Having the subroutine executed on the remote node; and
- Transferring back all the parameters which are returned to the calling routine.

The most common method of doing this is by the use of **stub** modules. The client program is linked to a client stub module. This is a subroutine which looks (from the outside) in every respect like the remote subroutine. On the inside, it is almost empty: all it does is take the values of the parameters which are passed to it, and put them in a message. This is known as **marshalling**.  

The client stub then uses a routine in the RPC **Run-Time System (RTS)** to send the message off and wait for a reply message. When the reply arrives, the stub unmarshals the parameters that were returned in the reply message, putting their values into the variables of the calling program. The client stub then returns to the calling program just like a normal subroutine.  

The server stub is located on the remote machine. It is called by the RPC run-time system when the message arrives from the client. The server stub performs the operations complementary to those of the the client stub: unmarshalling the parameters passed to the subroutine, calling the subroutine, and marshalling the return parameters.  

All the communication details are handled by the RPC run-time system, so the stubs contain only the code which is specific to the application involved. Each stub handles a specific set of procedures known as a package.  

In order to produce stub modules, one needs to know

- The names of the procedures in the package
- The number of parameters which they take
- The data type of each parameter
- The direction in which each parameter is transferred.

## The following steps take place during a RPC

![](/images/rpc_1.png)

- A client invokes a client stub procedure, passing parameters in the usual way. The client stub resides within the client’s own address space. 
- The client stub marshalls(pack) the parameters into a message. Marshalling includes converting the representation of the parameters into a standard format, and copying each parameter into the message. 
- The client stub passes the message to the transport layer, which sends it to the remote server machine. 
- On the server, the transport layer passes the message to a server stub, which demarshalls(unpack) the parameters and calls the desired server routine using the regular procedure call mechanism. 
- When the server procedure completes, it returns to the server stub (e.g., via a normal procedure call return), which marshalls the return values into a message. The server stub then hands the message to the transport layer. 
- The transport layer sends the result message back to the client transport layer, which hands the message back to the client stub. 
- The client stub demarshalls the return parameters and execution returns to the caller.

## 장점

- The technique of using procedure calls in RPC permits high-level languages to provide communication between clients and servers.
- This method is like a local procedure call but with the difference that the called procedure is executed on another process and a different computer.
- The thread-oriented model is also supported by RPC in addition to the process model.
- The RPC mechanism is employed to conceal the core message passing method.
- The amount of time and effort required to rewrite and develop the code is minimal.
- The distributed and local environments can both benefit from remote procedure calls.
- To increase performance, it omits several of the protocol layers.
- Abstraction is provided via RPC.  To exemplify, the user is not known about the nature of message-passing in network communication.
- RPC empowers the utilization of applications in a distributed environment.

## 단점

- In Remote Procedure Calls parameters are only passed by values as pointer values are not allowed.
- It involves a communication system with another machine and another process, so this mechanism is extremely prone to failure.
- The RPC concept can be implemented in a variety of ways, hence there is no standard.
- Due to the interaction-based nature, there is no flexibility for hardware architecture in RPC.
- Due to a remote procedure call, the process’s cost has increased.


## gRPC

> gRPC는 Google 에서 만든 RPC(Remote Procedure Call) 프로토콜이다. 네트워크 요청을 소프트웨어 내부에 있는 함수를 호출하듯이 사용하게 도와주는 프로토콜이다.

![](/images/grpc_1.png)

Monolithic 구조에서는 하나의 프로그램으로 동작하기 때문에 그 안에서 구조적인 2개의 서비스간의 데이터는 공유 메모리를 통해서 주고받을 수 있습니다. 따라서 이 경우 서비스간 메시지 전송 성능은 큰 이슈가 되지 않습니다. 반면 MSA에서는 여러 모듈로 분리되어있고 동일 머신에 존재하지 않을 수 있습니다. 따라서 일반적으로는 보편화된 방식인 REST 통신을 통해 메시지를 주고 받습니다. 문제는 Frontend 요청에 대한 응답을 만들어내기 위해 여러 마이크로 서비스간의 협력이 필요하다면, 구간별 REST 통신에 따른 비효율로 인해 응답속도가 저하된다는 점입니다.  

- 3 way handshake
- HTTP 헤더

gRPC는 HTTP 2.0 기반위에서 동작하기 때문에 지금까지 HTTP 2.0의 특징에 대해서 살펴봤습니다. 짧게 정리하자면, Header 압축, Multiplexed Stream 처리 지원 등으로 인해 네트워크 비용을 많이 감소시켰습니다. 그렇다면 HTTP 2.0 특징을 제외한 gRPC만의 특징은 무엇이 있을까요? 먼저 REST API 통신의 문제점에 대해서 먼저 살펴본 다음 gRPC의 특징에 대해서 살펴보도록 하겠습니다. REST 구조에서는 JSON 형태로 데이터를 주고 받습니다. JSON은 데이터 구조를 쉽게 표현할 수 있으며, 사람이 읽기 좋은 표현 방식입니다. 하지만 사람이 읽기 좋은 방식이라는 의미는 머신 입장에서는 자신이 읽을 수 있는 형태로 변환이 필요하다는 것을 의미합니다. 따라서 Client와 Server간의 데이터 송수신간에 JSON 형태로 Serialization 그리고 Deserialization 과정이 수반되어야합니다. JSON 변환은 컴퓨터 CPU 및 메모리 리소스를 소모하므로 수많은 데이터를 빠르게 처리하는 과정에서는 효율이 떨어질 수 밖에 없습니다.  

두 번째 이슈는 JSON 구조는 값은 String으로 표현됩니다. 따라서 사전에 타입 제약 조건에 대한 명확한 합의가 없거나 문서를 보고 개발자가 인지하지 못한다면, Server에 전달전에 이를 검증할 수 없습니다. 가령 위 예시와 같이 Server에서 zipCode는 숫자 타입으로 처리되어야하지만 Client에서는 이에 대한 제약 없이 문자열을 포함시켜 전달할 수 있음을 의미합니다.  

그렇다면 gRPC 기술은 위 두 가지 이슈를 어떻게 풀어내었을까요?  

Client에서 Server측의 API를 호출하기 위해서 기존에는 어떤 Endpoint로 호출해야할 지 그리고 전달 Spec에 대해서 API 문서 작성 혹은 Client와 Server 개발자간의 커뮤니케이션을 통해 정의해야했습니다. 그리고 이는 별도의 문서 생성이나 커뮤니케이션 비용이 추가로 발생합니다.  

이러한 문제를 감소시키기 위해 다양한 방법이 존재합니다. 그 중 한가지는 Server의 기능을 사용할 수 있는 전용 Library를 Client에게 제공하는 것입니다. 그러면 Client는 해당 Library에서 제공하는 Util 메소드를 활용해서 호출하면 내부적으로는 Server와 통신하여 올바른 결과를 제공할 수 있습니다. 또한 해당 방법은 Server에서 요구하는 Spec에 부합되는 데이터만 보낼 수 있게 강제화 할 수 있다는 측면에서 스키마에 대한 제약을 가할 수 있습니다.  

gRPC에서는 위 그림과 같이 이와 유사한 형태인 Stub 클래스를 Client에게 제공하여 Client는 Stub을 통해서만 gRPC 서버와 통신을 수행하도록 강제화 했습니다.   

그렇다면 Stub 클래스는 무엇이고 위 그림에서 보이는 Proto는 무엇일까요?  

Protocol Buffer는 Google이 공개한 데이터 구조로써, 특정 언어 혹은 특정 플랫폼에 종속적이지 않은 데이터 표현 방식입니다. 하지만 Protocol Buffer는 특정 언어에 속하지 않으므로 Java나 Kotlin, Golang 언어에서 직접적으로 사용할 수 없습니다.  

따라서 Protocol Buffer를 언어에서 독립적으로 활용하기 위해서는 이를 기반으로 Client 혹은 Server에서 사용할 수 있는 Stub 클래스를 생성해야합니다. 이때 protoc 프로그램을 활용해서 다양한 언어에서 사용할 수 있는 Stub 클래스를 자동 생성할 수 있습니다.  

Stub 클래스를 생성하면, 해당 클래스 정보를 Server와 Client에 공유한 다음 Stub 클래스를 활용하여 서로 양방향 통신을 수행할 수 있습니다.  

지금까지 학습한 Protocol Buffer 내용을 정리하면 다음과 같은 장점을 지닌 것을 확인할 수 있습니다.  

1. 스키마 타입 제약이 가능하다
2. Protocol buffer가 API 문서를 대체할 수 있다.

위 두가지 특징은 이전에 REST에서 다룬 이슈 중 하나인 API Spec 정의 및 문서 표준화 부재의 문제를 어느정도 해소해줄 수 있습니다. 그렇다면 또 하나의 이슈인 JSON Payload 비효율 문제와 대비하여 gRPC는 어떠한 이점을 지니고 있을까요?  

JSON 타입은 위와같이 사람이 읽기는 좋지만 데이터 전송 비용이 높으며, 해당 데이터 구조로 Serialization, Deserialization 하는 비용이 높음을 앞서 지적했습니다.  

gRPC의 통신에서는 데이터를 송수신할 때 Binary로 데이터를 encoding 해서 보내고 이를 decoding 해서 매핑합니다. 따라서 JSON에 비해 payload 크기가 상당히 적습니다.  

또한 JSON에서는 필드에 값을 입력하지 않아도 구조상에 해당 필드가 포함되어야하기 때문에 크기가 커집니다.  반면 gRPC에서는 입력된 값에 대해서만 Binary 데이터에 포함시키기 때문에 압축 효율이 JSON에 비해 상당히 좋습니다.  

결론적으로 이러한 적은 데이터 크기 및 Serialization, Deserialization 과정의 적은 비용은 대규모 트래픽 환경에서 성능상 유리합니다.  

## gRPC 이점

- 성능
    - 네트워크 요청으로 보내기 위해 Protobuf를 직렬화(Serialization) 및 역직렬화(Deserialization)하는 작업은 JSON 형태의 직렬화/역직렬화 보다 빠르다. 또한 gRPC의 네트워크 속도가 HTTP POST/GET 속도보다 빠르다. 특히 POST 요청 시 많은 차이를 보인다. 자세한 내용은 Mobile gRPC Benchmarks 문서를 참고한다.
- API-우선 방식
    - Protobuf를 통해 기능을 개발하기 전에 API를 먼저 정의할 수 있다. API가 먼저 정의될 경우 개발팀이 병렬적으로 일을 진행할 수 있고, 개발 속도가 빨라지며, API를 좀 더 안정적으로 제공할 수 있다. 자세한 내용은 Understanding the API-First Approach to Building Products 문서를 참고한다.
- REST API 지원
    - Protobuf로 정의된 API는 envoyproxy나 grpc-gateway 같은 gateway 를 통해 REST API로 제공 가능하다. gRPC로 정의된 API를 OpenAPI 프로토콜로 변환하여 REST API를 사용하는 클라이언트에도 API-우선 방식을 적용할 수 있다.


# 참고

- [Austin G. Walters, Intro to IPC](https://austingwalters.com/introduction-to-ipc-interprocess-communication/)
- [DR-kim, 프로세스간 통신 방법](https://dar0m.tistory.com/233){:target="_blank"}
- [우당탕탕 히온이네, [운영체제] IPC 프로세스간 통신](https://heeonii.tistory.com/13){:target="_blank"}
- [bycho211, 프로세스간 통신(IPC)](https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=bycho211&logNo=220985701140){:target="_blank"}
- [얼음연못, [개발상식] 프로세스간 통신(IPC)](https://frozenpond.tistory.com/126){:target="_blank"}
- [nesoy, RPC란?](https://nesoy.github.io/articles/2019-07/RPC){:target="_blank"}
- [jakeseo, RPC란?](https://velog.io/@jakeseo_me/RPC%EB%9E%80){:target="_blank"}
- [w3, What is Remote Procedure Call?](https://www.w3.org/History/1992/nfs_dxcern_mirror/rpc/doc/Introduction/WhatIs.html){:target="_blank"}
- [grpc공식문서, What is gRPC?](https://grpc.io/docs/what-is-grpc/){:target="_blank"}
- [navercloud, [네이버클라우드 기술&경험] 시대의 흐름, gRPC 깊게 파고들기 #1](https://medium.com/naver-cloud-platform/nbp-%EA%B8%B0%EC%88%A0-%EA%B2%BD%ED%97%98-%EC%8B%9C%EB%8C%80%EC%9D%98-%ED%9D%90%EB%A6%84-grpc-%EA%B9%8A%EA%B2%8C-%ED%8C%8C%EA%B3%A0%EB%93%A4%EA%B8%B0-1-39e97cb3460){:target="_blank"}
- [cla9, 1. gRPC 개요](https://cla9.tistory.com/175?category=993774){:target="_blank"}
- [buzzvil Tech, gRPC](https://tech.buzzvil.com/handbook/grpc/){:target="_blank"}