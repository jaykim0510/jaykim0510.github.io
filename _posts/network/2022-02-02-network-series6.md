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


- 내부 네트워크에 연결되는 라우터의 포트를 이더넷 인터페이스 (이더넷용 IP 주소는 내부에서 부여받은 IP 주소 중 첫 번째 주소)
- 외부(인터넷) 쪽으로 연결되는 인터페이스를 시리얼 인터페이스 (시리얼용 IP 주소는 ISP 업체의 라우터가 가지는 시리얼 인터페이스의 IP 주소)
- 위와 같은 가정에서 우리가 라우터에 부여해야 하는 IP 주소는 두 개가 됨
- IP 주소 중 네트워크 부분: 하나의 브로드캐스트 영역
  - 라우터를 거치지 않고 통신이 가능한 영역
  - 라우터가 라우팅할 때 참고하는 부분
  - 라우터는 다른 네트워크로 갈 때만 필요
- IP 주소 중 호스트 부분: 각각의 PC 또는 장비
- IP 주소의 Class에 따라 어디까지가 네트워크 부분이고, 어디까지가 호스트 부분인지가 나뉨 (네트워크의 크기가 달라짐)
  - 클래스 A는 이진수 중에서 맨 앞쪽 숫자가 항상 0으로 시작되는 것들
    - 호스트 수가 가장 많은 클래스
    - 앞의 8비트가 네트워크 부분, 나머지 24비트가 호스트 부분
    - 1.0.0.0 ~ 126.0.0.0 까지로 규정 (0 시작과 127 시작은 제외) -> 126개의 네트워크, 각각의 네트워크는 라우터 없이 통신
    - 호스트는 2의 24승 - 2개(모두 0인 경우, 모두 1인 경우) = 16,777,214개 -> 16,777,214개의 호스트가 하나의 네트워크에 연결
    - 따라서 IP 주소를 모두 클래스 A로만 구성한다면 -> 126개의 네트워크 * 16,777,214개의 호스트
  - 클래스 B는 맨 앞이 10으로 시작
    - 앞의 16비트가 네트워크 부분
    - 128.0.0.0 ~ 191.255.0.0 까지로 규정
  - 클래스 C는 맨 앞이 110으로 시작
    - 앞의 24비트가 네트워크 부분
    - 192.0.0.0 ~ 223.255.255.0 까지로 규정

- 기본 게이트웨이(Default Gateway)
  - 내부 네트워크에서는 라우터 없이도 통신이 가능
  - 내부 네트워크에 없는 IP 주소로 갈 때는 이 기본 게이트웨이를 통해 나감
  - 즉 라우터의 이더넷 인터페이스를 의미
- 라우터는 인터페이스별로 IP 주소 부여. 스위치나 허브는 장비별로 IP 주소 부여
  
## 서브넷 마스크(Subnet Mask)

- 주어진 네트워크를 가공할 때 사용
- 우리가 일단 어떤 IP 주소를 배정받게 되면 보통 이 주소를 그대로 사용하지 않고 서브넷 마스크를 조합하여 사용
- 우리가 부여받은 net을 여러개의 subnet으로 나눈다는 의미
- 서브넷마스크를 통해 나누어진 서브넷간의 통신은 라우터를 거쳐야함
- 모든 IP 주소에는 서브넷 마스크가 따라다님. 쓰지 않더라도. 그래야 지금 IP 주소가 마스킹 된건지 아닌지 알 수 있음
- 클래스 A의 기본 서브넷 마스크는 255.0.0.0, B는 255.255.0.0, C는 255.255.255.0
- 서브넷 마스크는 IP주소의 어디까지가 네트워크 부분이고, 어디까지가 호스트 부분인지를 나타내는 역할을 함
- 서브넷 마스크의 이진수 1은 네트워크 부분, 이진수 0은 호스트 부분을 의미함
- 즉, 서브넷 마스킹은 기존 IP 주소의 호스트 부분의 일부를 네트워크 부분으로 바꾸는 작업

```
기존 네트워크: 150.150.100.1 => 1001 0110 1001 0110 0110 0100 0000 0001 => 클래스 B => 150.150.0.0이 네트워크를 의미
서브넷 마스크: 255.255.255.0 => 1111 1111 1111 1111 1111 1111 0000 0000 => 네트워크 자리를 24자리 까지로 늘림 (호스트를 8자리로 줄임)
---------------------------------------------------------------------
서브넷: 150.150.100.0 => 1001 01110 1001 01110 01110 0100 0000 0000 => 최종적으로 서브넷 네트워크가 150.150.100.0가 됨
```

- 참고로 호스트 부분이 0인 주소는 호스트 주로로 사용하지 못함. PC에서 사용하는 주소가 아니라 네트워크 자체를 의미
- 또 호스트 부분이 255인 주소 역시 호스트 주소로 사용할 수 없음. 브로드캐스트 주소 (모든 호스트에게 메시지 보낼 때 사용하는 주소)

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

![](/images/network_46.png)

- 서버든 라우터든 패킷을 보내기 위해서는 일단 라우팅 테이블을 참조함
- 라우팅 테이블을 보니 라우팅 엔트리는 1.1.1.0/24, Gateway는 없음 -> 목적지 주소가 나와 같은 네트워크에 존재함을 확인
  ![](/images/network_47.png)
- 이제 Server1은 목적지 주소 1.1.1.20에 대한 MAC 주소를 알기위해 자신의 ARP 테이블을 참조함
- 그런데 ARP 테이블이 비어있음 -> ARP miss
  ![](/images/network_48.png)
- Server1은 Server2(1.1.1.20)의 MAC 주소를 알아내기 위해 lan1 포트로 ARP request 패킷을 보냄
- Switch1은 이 패킷을 수신하고, 수신 패킷의 Source MAC 주소를 배웁니다
  - (Switch1의 MAC 테이블에 Server1의 MAC주소와 Switch1의 port를 기록)
  ![](/images/netwrork_49.png)
- Switch1은 이 ARP request 패킷을 보고 Destination MAC이 브로드 캐스팅 주소임을 확인
- Switch1은 수신포트 fe1을 제외한 나머지 모든 포트로 flooding
- 라우터 R1은 패킷의 Target IP 주소를 보고 자기 것이 아닌 것을 확인하고 버림
- Server2는 자신의 IP 주소임을 확인 -> 자신의 MAC 주소를 필드에 담아 ARP reply 패킷을 lan1 포트로 보냄
- 이 패킷을 수신한 Switch1은 Source MAC Learning을 하여 MAC 테이블에 기록
  ![](/images/network_50.png)
- Server1은 자신의 ARP 테이블에 MAC 주소를 기록
  ![](/images/network_51.png)
- 이제 Server1은 Server2로 IP 패킷을 보냄
- Server1은 목적지 주소 1.1.1.20에 대한 MAC 주소를 ARP 테이블에서 얻어오고 이동해야할 포트 번호를 MAC 테이블을 통해 확인
- 이 패킷은 fe2 포트를 통해 나가고, Server2가 패킷을 수신

# 참고
- [스위칭과 라우팅... 참 쉽죠잉~ (1편: Ethernet 스위칭)](https://www.netmanias.com/ko/?m=view&id=blog&no=5501){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (2편: IP 라우팅)](https://www.netmanias.com/ko/?m=view&id=blog&no=5502){:target="_blank"}