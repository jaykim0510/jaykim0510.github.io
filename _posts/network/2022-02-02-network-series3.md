---
layout: post
title:  'Network Series [Part3]: 네트워크 계층 TCP/IP 4계층과 OSI 7계층'
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

# 인터넷의 계층화 

인터넷 프로토콜 스위트(suite: 모음, 세트)~~(인터넷 프로토콜 스택이라고도 함)~~는 인터넷에서 컴퓨터들이 서로 정보를 주고 받는데 쓰이는 프로토콜의 모음을 뜻합니다. 이 프로토콜의 모음을 **프로토콜의 네트워킹 범위에 따라** 4개 또는 7개로 계층화한 것을 TCP/IP-4계층 또는 OSI-7계층 이라고 부릅니다. 여기서 각각의 계층은 특정 계층에서 사용하는 프로토콜이 변경되더라도 다른 계층에 영향을 주지 않도록 설계되었습니다.  

아래 그림은 각각 OSI-7계층과 TCP/IP-4계층을 나타낸 그림입니다.  

![](/images/net_12.png)  

예전에는 인터넷을 계층화하는 모델로 OSI-7계층을 주로 사용했지만, 요즘에는 이를 좀 더 간소화한 TCP/IP-4계층 모델을 더 많이 사용합니다. 

# 애플리케이션 계층

- 애플리케이션 계층은 FTP, HTTP, SSH, SMTP, DNS 등 응용 프로그램이 사용되는 계층
- 웹 브라우저와 같은 서비스를 실질적으로 사용자들에게 제공하는 계층
- 대표적인 프로토콜: FTP, HTTP, SSH, SMTP, DNS
- 소켓(Socket) 라이브러리  
  ![](/images/net_20.png)  


# 전송 계층

- 전송 계층은 송신자와 수신자를 서로 연결(connection)하는 계층
- 대표적인 프로토콜: TCP, UDP

# 인터넷 계층

- 인터넷 계층은 네트워크 패킷을 IP주소를 이용해 목적지로 전송하기 위해 사용되는 계층
- 인터넷 계층은 상대방이 데이터를 제대로 수신했는지에 대해 보장하지 않는 비연결형적인 특징을 가짐
- 대표적인 프토로콜: IP, ARP

# 링크 계층

- 링크 계층은 전선, 광섬유, 무선으로 네트워크 장비(스위치, 라우터)를 연결해 실질적으로 데이터를 전송하는 계층
- 대표적인 프로토콜: Ethernet, Token-Ring

# 참고

- [The Secret Security Wiki](https://doubleoctopus.com/security-wiki/protocol/secure-socket-shell/)