---
layout: post
title:  'Network Series [Part6]: 네트워크 프로토콜(3) IP'
description: 
date:   2022-02-03 15:01:35 +0300
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
# IP(Internet Protocol)

IP는 네트워크 상에서 데이터를 목적지로 보내는 역할을 하는 인터넷 계층에서 사용하는 프로토콜  

## IP 주소
IP 주소는 인터넷에 연결하고자 하는 **디바이스가 가지고 있는 NIC(Network Interface Controller)의 고유한 주소**를 뜻합니다. 편지를 주고 받기 위해서는 서로의 주소가 필요한 것처럼 디바이스간 통신을 위해서는 IP주소가 필요합니다. IP주소는 **네트워크 번호와 호스트 번호로 이루어진 32비트 숫자**입니다.(IPv4 기준)  


## 서브넷 마스크(Subnet Mask)

# DNS(Domain Name System) 서버  
DNS 서버는 도메인 네임을 IP주소로 매핑하여 보관하고 있는 서버입니다. 하지만 모든 도메인 정보를 저장할 수는 없고 저장한다고 해도 IP주소를 가지고 오는데 많은 시간이 소요됩니다. 이를 해결하기 위해 DNS 서버를 계층적으로 구성해 IP 주소를 가져오도록 했으며 한 번 가져온 정보는 캐시에 저장해둡니다. 하지만 캐시에 저장된 후 정보가 변경될 수 있기 때문에 캐시에 저장된 정보는 유효기간이 지나면 캐시에서 삭제됩니다.  

![](../../images/network_4.png)  

# 라우팅

목적지 IP 주소를 찾아가는 과정  

## 라우팅 테이블

MAC addresses are determined for a device when it is manufactured. They don't change wherever you go. So assume MAC addresses as your name(assume it's unique).  

Ip addresses are assigned(by your ISP) when your machine connects to the network. It depends on your location. So assume it as your address.  

If someone needs to send you a post, if they use your unique name, then routing that post to you will be difficult. Now if they use your address, routing becomes easier.  

That's why IP addresses are used. Routing a packet to a IP address is easier than routing it to a MAC address.  

The routing table is used to find out if a packet should be delivered locally, or routed to some network interface using a known gateway address.


MAC addresses are layer-2 addresses, IP addresses are layer-3 addresses, and ports are layer-4 addresses.  

MAC addresses are not in the packet headers, they are in the frame headers. Only layer-3 addresses are in the packet headers. Ports are in the segment headers.  

MAC addresses are only significant on a LAN. They are in the frame headers, and frames are stripped at layer-3 boundaries (routers). The routers then use the layer-3 headers with the layer-3 address to forward a packet to the next interface, where  

## 게이트웨이  

# 참고
- [스위칭과 라우팅... 참 쉽죠잉~ (1편: Ethernet 스위칭)](https://www.netmanias.com/ko/?m=view&id=blog&no=5501){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (2편: IP 라우팅)](https://www.netmanias.com/ko/?m=view&id=blog&no=5502){:target="_blank"}