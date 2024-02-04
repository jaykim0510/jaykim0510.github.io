---
layout: post
title:  'Network Series [Part3]: 네트워크 계층 TCP/IP 4계층과 OSI 7계층'
description: 
date:   2022-02-02 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: [network]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# 인터넷의 계층화 

인터넷 프로토콜 스위트(suite: 모음, 세트)~~(인터넷 프로토콜 스택이라고도 함)~~는 인터넷에서 컴퓨터들이 서로 정보를 주고 받는데 쓰이는 프로토콜의 모음을 뜻합니다. 이 프로토콜의 모음을 **프로토콜의 네트워킹 범위에 따라** 4개 또는 7개로 계층화한 것을 TCP/IP-4계층 또는 OSI-7계층 이라고 부릅니다. 여기서 각각의 계층은 특정 계층에서 사용하는 프로토콜이 변경되더라도 다른 계층에 영향을 주지 않도록 설계되었습니다.  

아래 그림은 각각 OSI-7계층과 TCP/IP-4계층을 나타낸 그림입니다.  

![](/images/osi-7-layer.png)  

예전에는 인터넷을 계층화하는 모델로 OSI-7계층을 주로 사용했지만, 요즘에는 이를 좀 더 간소화한 TCP/IP-4계층 모델을 더 많이 사용합니다. 

 * 국제표준화기구(ISO)에서 개발한 모델로, 컴퓨터 네트워크 프로토콜 디자인과 통신을 계층으로 나누어 설명한 것이다.
 * 이 모델은 프로토콜을 기능별로 나눈 것이다. 
 * 각 계층은 하위 계층의 기능만을 이용하고, 상위 계층에게 기능을 제공한다. 
 * 프로토콜 스택은 하드웨어나 소프트웨어 혹은 둘의 혼합으로 구현될 수 있다. 
 * 일반적으로 하위 계층들은 하드웨어로, 상위 계층들은 소프트웨어로 구현된다.

# 애플리케이션 계층 (L7)

- 애플리케이션 계층은 FTP, HTTP, SSH, SMTP, DNS 등 응용 프로그램이 사용되는 계층
- 웹 브라우저와 같은 서비스를 실질적으로 사용자들에게 제공하는 계층
- 일반적인 응용 서비스는 관련된 응용 프로세스들 사이의 전환을 제공한다. 
- 대표적인 프로토콜: FTP, HTTP, SSH, SMTP, DNS

# 표현 계층
* 코드 간의 번역을 담당하여 사용자 시스템에서 데이터의 형식상 차이를 다루는 부담을 응용 계층으로부터 덜어 준다. 
* MIME 인코딩이나 암호화 등의 동작이 이 계층에서 이루어진다. 

# 세션 계층
* 양 끝단의 응용 프로세스가 통신을 관리하기 위한 방법을 제공한다. 
* 동시 송수신 방식(duplex), 반이중 방식(half-duplex), 전이중 방식(Full Duplex)의 통신과 함께, 체크 포인팅과 유휴, 종료, 다시 시작 과정 등을 수행한다. 
* 이 계층은 TCP/IP 세션을 만들고 없애는 책임을 진다.


# 전송 계층 (L4)

- 전송 계층은 송신자와 수신자를 서로 연결(connection)하는 계층
* 양 끝단(End to end)의 사용자들이 신뢰성있는 데이터를 주고 받을 수 있도록 해 주어, 상위 계층들이 데이터 전달의 유효성이나 효율성을 생각하지 않도록 해준다. 
* 시퀀스 넘버 기반의 오류 제어 방식을 사용한다. 
* 전송 계층은 특정 연결의 유효성을 제어하고, 일부 프로토콜은 상태 개념이 있고(stateful), 연결 기반(connection oriented)이다. (이는 전송 계층이 패킷들의 전송이 유효한지 확인하고 전송 실패한 패킷들을 다시 전송한다는 것을 뜻한다.) 
* 가장 잘 알려진 전송 계층의 예는 TCP이다.
* 데이터 전송 단위는 Segment(TCP), Datagram(UDP)이다.
- 대표적인 프로토콜: TCP, UDP

# 네트워크(인터넷) 계층 (L3)

- 네트워크 패킷을 IP주소를 이용해 목적지로 전송하기 위해 사용되는 계층
- 네트워크 계층은 라우팅, 흐름 제어, 세그멘테이션(segmentation/desegmentation), 오류 제어, 인터네트워킹(Internetworking) 등을 수행한다. 
- 상대방이 데이터를 제대로 수신했는지에 대해 보장하지 않는 비연결형적인 특징을 가짐
- 데이터 전송 단위는 Packet (또는 Datagram)이다.
- 대표적인 프토로콜: IP, ARP

# 링크 계층

- 링크 계층은 전선, 광섬유, 무선으로 네트워크 장비(스위치, 라우터)를 연결해 실질적으로 데이터를 전송하는 계층
* 주소 값은 물리적으로 할당 받는데, 이는 네트워크 카드가 만들어질 때부터 맥 주소(MAC address)가 정해져 있다는 뜻이다. 
* 데이터 전송 단위는 Frame이다. 
- 대표적인 프로토콜: Ethernet, Token-Ring

# 물리 계층

* 네트워크의 기본 네트워크 하드웨어 전송 기술을 이룬다. 
* 네트워크의 높은 수준의 기능의 논리 데이터 구조를 기초로 하는 필수 계층이다.
* 전송 단위는 Bit이다.

# Protocol Data Unit (PDU)

![](/images/pdu_1.png)
- Encapsulation:
  - 데이터를 출발지에서 도착지로 가는 동안 필요한 정보를 덧붙여서 전송한다
  - 도착지에서 캡슐화된 헤더를 하나씩 확인하며 제거한다
- Segment:
  - 전송 계층에서 TCP를 사용한 경우 전송 단위를 세그먼트라고 한다
- Packet:
  - 패킷이라는 용어의 의미는 한 번에 전송할 수 없는 크기의 데이터를 여러 개로 쪼갠 각각의 조각을 의미
  - 보통 전송 계층에서 TCP를 사용했을 때, 네트워크 계층에서의 전송 단위를 패킷이라고 한다
  - 다른 용어에 비해 비교적 혼용되어 사용되는 것 같다
- Datagram:
  - 전송 계층에서 UDP를 사용한 경우, 전송 단위를 데이터그램이라고 한다
  - 전송 계층에서 전송 단위가 데이터그램인 경우, 
    - 네트워크 계층에서 쪼개진 각각의 조각을 패킷이라고 표현하는 곳도 있고, 데이터그램이라고 표현하는 곳도 있다

![](/images/pdu_2.png)

```
내 생각에는 1번이나 2번 정도가 맞는 것 같다
전송 계층에서는 확실히 TCP를 사용했는지 UDP를 사용했는지에 따라 세그먼트/데이터그램으로 분류되고,
네트워크 계층에서는 TCP, UDP에 따라 패킷/데이터그램으로 분류하기도 하고, 그냥 모두 패킷으로 표현하는 것 같다
```

# 참고

- [Quora, What is the exact difference between packets and datagrams](https://www.quora.com/What-is-the-exact-difference-between-packets-and-datagrams-that-are-used-in-communication-networks){:target="_blank"} 
- [badldung, Definition of Network Units: Packet, Fragment, Frame, Datagram, and Segment](https://www.baeldung.com/cs/networking-packet-fragment-frame-datagram-segment){:target="_blank"} 
- [coengoedegebure, The OSI Model](https://www.coengoedegebure.com/osi-model/){:target="_blank"} 