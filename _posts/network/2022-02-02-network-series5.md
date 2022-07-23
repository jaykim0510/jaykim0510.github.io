---
layout: post
title:  'Network Series [Part5]: 네트워크 프로토콜(2) TCP, UDP'
description: 
date:   2022-02-02 15:01:35 +0300
image:  '/images/cs_logo.jpeg'
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

TCP와 UDP는 두 대의 컴퓨터를 서로 연결(connection)하는 역할을 하는 전송 계층(Transport layer)에서의 프로토콜  

# TCP

## TCP의 특징

- Transmission Control Protocol
- 연결 지향 TCP 3 way handshake (논리적 연결)
- 데이터 전달 보증
- 순서 보장

## 3 way handshake

- 클라이언트와 서버를 연결하는 방법

![](/images/network_32.png)

# UDP

## UDP의 특징

- User Datagram Protocol
- 기능이 거의 없음 (연결 지향 X, 데이터 전달 보증 X, 순서 보장 X)
- 단순하고 빠름
- 애플리케이션에서 추가 작업 필요

# TCP와 UDP 비교  

## 데이터 전송시 발생할 수 있는 오류

- 패킷의 잘못된 순서
- 패킷 손실
- 패킷 내부의 손상된 데이터(헤더, 패킷 내용, IP 주소 등을 기반으로 고정적인 길이의 체크섬 value를 만들어 손상 여부 파악)

위 3가지에 대해 TCP는 모두 해결 가능. UDP는 마지막 내부의 손상된 데이터에 대해서만 해결 가능.  

아래는 TCP와 UDP의 차이를 표로 비교한 것.  

![](/images/network_31.png)

# Port

IP 주소를 하나의 공간으로 생각해보자. 여러 서비스에 대해서 구역을 나누지 않고 사용을 하면, 서비스가 겹쳐 Overlap 되면서 서로서로 충돌 및 간섭 현상이 발생할 것이다. 이러한 현상이 발생하면, 통신이 되다가 안되다가를 반복하는 등 트래픽이 불안정해진다. 따라서 이것을 해소하기 위해서는 각각 서비스에 대한 간섭 현상을 없애야 한다. 각 서비스마다 독방 형식의 구역을 나누게 되면 간섭 현상이 사라질 것이다. 따라서 OSI 7계층 중 4계층에서는 하나의 IP 주소를 독방의 개념인 포트(Port)로 나눈다.  

TCP, UDP는 패킷이 어떤 포트로 이동해야 하는지를 나타낼 수 있습니다. TCP 및 UDP 헤더에는 포트 번호를 표시하는 섹션이 있습니다. 예를 들어 IP(인터넷 프로토콜)와 같은 네트워크 계층 프로토콜은 지정된 네트워크 연결에서 사용 중인 포트를 인식하지 못합니다. 표준 IP 헤더에는 데이터 패킷이 어떤 포트로 이동해야 하는지 나타내는 위치가 없습니다. IP 헤더는 대상 IP 주소만 나타내고 해당 IP 주소의 포트 번호는 표시하지 않습니다.

일반적으로 **네트워크 계층 프로토콜은 거의 항상 전송 계층 프로토콜과 함께 사용**되기 때문에 네트워크 계층에서 포트를 지시할 수 없는 것은 네트워킹 프로세스에 영향을 미치지 않는다.



# 참고

- [불곰, TCP, UDP 포트 (Port, OSI 4계층)](https://blog.naver.com/PostView.naver?blogId=taeheon714&logNo=222139481141&parentCategoryNo=&categoryNo=6&viewDate=&isShowPopularPosts=true&from=search){:target="_blank"}
- [What is a computer port? | Ports in networking](https://www.cloudflare.com/ko-kr/learning/network-layer/what-is-a-computer-port/){:target="_blank"}
- [곰돌이 놀이터: 소켓 통신이란?](https://helloworld-88.tistory.com/215){:target="_blank"}
- [아무거나올리는블로그: Socket Programming - Socket](https://junb51.tistory.com/2){:target="_blank"}
- [stackoverflow: difference between socket programming and Http programming](https://stackoverflow.com/questions/15108139/difference-between-socket-programming-and-http-programming/47637847#47637847){:target="_blank"}
