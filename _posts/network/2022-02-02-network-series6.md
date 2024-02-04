---
layout: post
title:  'Network Series [Part6]: 네트워크 프로토콜(3) IP'
description: 
date:   2022-02-03 15:01:35 +0300
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
# IP(Internet Protocol)

IP는 네트워크 상에서 데이터를 목적지로 보내는 역할을 하는 인터넷 계층에서 사용하는 프로토콜  

![](/images/ip_1.png)

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
    - `1.0.0.0` ~ `126.0.0.0` 까지로 규정 (0 시작과 127 시작은 제외) -> 126개의 네트워크, 각각의 네트워크는 라우터 없이 통신
    - 호스트는 2의 24승 - 2개(모두 0인 경우, 모두 1인 경우) = 16,777,214개 -> 16,777,214개의 호스트가 하나의 네트워크에 연결
    - 따라서 IP 주소를 모두 클래스 A로만 구성한다면 -> 126개의 네트워크 * 16,777,214개의 호스트
  - 클래스 B는 맨 앞이 10으로 시작
    - 앞의 16비트가 네트워크 부분
    - `128.0.0.0` ~ `191.255.0.0` 까지로 규정
  - 클래스 C는 맨 앞이 110으로 시작
    - 앞의 24비트가 네트워크 부분
    - `192.0.0.0` ~ `223.255.255.0` 까지로 규정

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
- 클래스 A의 기본 서브넷 마스크는 `255.0.0.0`, B는 `255.255.0.0`, C는 `255.255.255.0`
- 서브넷 마스크는 IP주소의 어디까지가 네트워크 부분이고, 어디까지가 호스트 부분인지를 나타내는 역할을 함
- 서브넷 마스크의 이진수 1은 네트워크 부분, 이진수 0은 호스트 부분을 의미함
- 즉, 서브넷 마스킹은 기존 IP 주소의 호스트 부분의 일부를 네트워크 부분으로 바꾸는 작업

```
기존 네트워크: 150.150.100.1 => 1001 0110 1001 0110 0110 0100 0000 0001 => 클래스 B => 150.150.0.0이 네트워크를 의미
서브넷 마스크: 255.255.255.0 => 1111 1111 1111 1111 1111 1111 0000 0000 => 네트워크 자리가 16자리에서 24자리 까지로 늘림 (호스트를 8자리로 줄임)
------------------------------------------------------------------------------------------------------------------------------
서브넷: 150.150.100.0 => 1001 01110 1001 01110 01110 0100 0000 0000 => 최종적으로 서브넷 네트워크가 150.150.100.0가 됨
```

- 참고로 호스트 부분이 0인 주소는 호스트 주로로 사용하지 못함. PC에서 사용하는 주소가 아니라 네트워크 자체를 의미
- 또 호스트 부분이 255인 주소 역시 호스트 주소로 사용할 수 없음. 브로드캐스트 주소 (모든 호스트에게 메시지 보낼 때 사용하는 주소)


## IP 주소 예시

- 나의 IP 주소가 `150.150.100.1`이라고 해보자. 
- 그러면 내가 부여받은 IP 주소의 네트워크 주소는?
  - 이 물음에 대답하려면 먼저 내 IP주소의 클래스가 뭔지 알아야 한다.
  - 150.*.*.*는 클래스 B에 속한다 -> 앞의 16자리가 네트워크 주소이다
  - 즉 네트워크 주소는 `150.150.0.0`이다
- 만약 내가 AWS의 VPC와 같은 서비스를 이용해 가상 네트워크를 부여 받았는데 그 값이 `150.150.0.0`이라 해보자
- `150.150.0.0`의 나머지 16비트를 이용해 호스트에게 IP 주소를 부여할 수 있다. -> 2^16개이므로 65,536개. 여기서 2개를 빼면 65,534개를 호스트에 부여할 수 있다
- 여기서 10비트를 더 사용해 서브네팅해보자.

![](/images/subnet_1.png)

![](/images/subnet_2.png)

- 여기서 IP주소를 하나 가져와보자. `150.150.252.211/26`을 예로 들어보자. 이 IP주소를 보고 가질 수 있는 물음은 다음과 같다
  - **이 IP주소의 네트워크 주소는?**
    - 26비트가 네트워크 주소이므로, 24자리 150.150.252까지는 당연하고, 
    - 나머지 211을 이진수로 나타내면 1101 0011인데 이중 왼쪽 2자리까지가 네트워크 주소에 포함되므로,
    - `150.150.252.192.0`이 서브넷 네트워크 주소가 된다
  - **이 IP주소의 기본 서브넷 사용시 네트워크 주소는?**
    - `150.150.252.211/26`는 클래스 B이므로 기본 서브넷은 16비트일 것이다
    - 그러면 기본 네트워크 주소는 `150.150.0.0`이 될 것이다
  - **이 IP주소는** `150.150.255.193`**과 같은 서브넷 안에 있는가? (라우팅 없이 통신이 가능한가?)**
    - 라우팅 없이 통신이 가능한지 보려면 같은 네트워크 주소가 같은지 확인해보면 된다
    - `150.150.252.211/26`는 `150.150.252.192.0`였고,
    - `150.150.255.193`는 `150.150.255.192`이므로 서로 다른 네트워크 상에 있다 -> 라우터가 있어야 한다
  - **이 IP주소가 속한 네트워크의 브로드캐스트 주소는?**
    - 이를 구하려면 나의 IP주소 중 호스트 부분을 모두 1로 바꾸면 된다
    - `150.150.252.255/26`가 될 것이다
    - 주의할 점은 브로드캐스트 주소는 무조건 끝자리가 255로 끝나지는 않는다. 
      - 이를 확인하기 위해 `150.150.0.130/26`가 있는 네트워크 상의 브로드캐스트 주소를 한 번 구해보자
      - 이는 2진수로 1001 0110. 1001 0110. 0000 0000. 1000 0010인데 여기서 호스트 부분이 오른쪽 6자리를 1로 바꿔보자
      - 1001 0110. 1001 0110. 0000 0000. 1011 1111 -> `150.150.0.191/26`이 브로드캐스트 주소가 된다


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

![](/images/network_46.png)

- 서버든 라우터든 패킷을 보내기 위해서는 일단 라우팅 테이블을 참조함
- 라우팅 테이블을 보니 라우팅 엔트리는 `1.1.1.0/24`, Gateway는 없음 -> 목적지 주소가 나와 같은 네트워크에 존재함을 확인
  ![](/images/network_47.png)
- 이제 Server1은 목적지 주소 `1.1.1.20`에 대한 MAC 주소를 알기위해 자신의 ARP 테이블을 참조함
- 그런데 ARP 테이블이 비어있음 -> ARP miss
  ![](/images/network_48.png)
- Server1은 Server2(`1.1.1.20`)의 MAC 주소를 알아내기 위해 lan1 포트로 ARP request 패킷을 보냄
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
- Server1은 목적지 주소 `1.1.1.20`에 대한 MAC 주소를 ARP 테이블에서 얻어오고 이동해야할 포트 번호를 MAC 테이블을 통해 확인
- 이 패킷은 fe2 포트를 통해 나가고, Server2가 패킷을 수신

## 게이트웨이  
다른 네트워크로 가기위한 통로  

A traditional "gateway" can mean a device that (sometimes) is able to route traffic, but
whose primary goal is to *translate* from one protocol to another. For example- I would
use a "gateway" if I wanted to send packets from my IPv4 network to/from a IPv6 network,
or maybe an AppleTalk network to/from a Token Ring network.  

게이트웨이는 개념적인 용어, 라우터는 장비   

네트워크 구성환경에 따라 라우터가 게이트웨이 역할을 할 수도 있고, 다른 장비나 소프트웨어가 게이트웨이 역할을 할 수도 있다.    

더 깊게 들어가면 L3 장비들인데요.  Layer3 는 IP를 와 연관되어 있습니다.  
source: 192.168.1.10 / destination : 8.8.8.8   

source 가 되는 PC에도 routing table 이 있습니다. (cmd - route print)  
여기에 목적지 정보가 없으면 무조건 gateway 로 패킷을 보냅니다.  
즉, 어떤 host 에게 Gateway 란건 내 패킷을 무조건 라우팅 시켜줄 통로입니다.  

gateway 가 되는 장비들이 L3 장비들이고 Router 가 되겠죠.  

공유기는 간단히 표현하면 Router + DHCP + NAT 역할을 합니다  
방화벽은 간단히 표현하면 Router + ACL + Firewall 등등의 기능을 합니다.  

다시 정리하자면.. Gateway 는 개념이지 장비명이 아닙니다.  

결론적으로 말하자면 cisco에서 얘기하는 게이트웨이 모드는 간단하게 얘기했을 때 우리가 흔히 말하는 공유기처럼 NAT가 활성화된 상태를 말하고, 라우터 모드는 NAT가 비활성화된 상태를 말합니다.   

사실 게이트웨이라는 것은 라우터와 구분되는 개념이 아니라, 라우터 중에서 관문(gateway) 역할을 하는 라우터를 게이트웨이 라우터라고 하는데 이를 그냥 게이트웨이라고 짧게 부르는 것 뿐입니다.  

고속도로로 비유한다면 게이트웨이가 아닌 라우터는 JC이고 게이트웨이인 라우터는 IC라고 볼 수 있겠네요. 둘다 도로와 도로를 이어주는 역할을 수행하지만(routing) IC는 특히 일반도로에서 고속도로로 진입하는 관문(gateway) 역할을 하는 점에서 생각해보면 될 것 같습니다.  

네트워크와 네트워크 사이를 이어주는 역할을 하는 것이 라우터이고, 그 중에서도 가장 끄트머리에 위치한 네트워크(가정이나 회사)를 중앙(인터넷 등)으로 연결해주는 라우터를 그저 좀 특별하게 부르는 것이 게이트웨이인 것입니다.  

방화벽 그자체의 의미로는 라우팅의 개념은 전혀 없고 단지 조건에 따라 패킷을 걸러주는 역할을 하는 것 뿐입니다. 방화벽 장비 중에 라우팅 역할도 하는 장비가 있을 뿐이지요.  

# 참고
- [Microsoft, Understand TCP/IP addressing and subnetting basics](https://docs.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting){:target="_blank"}
- [groom, 서브넷과 Broadcast 주소](https://velog.io/@dnstlr2933/%EC%84%9C%EB%B8%8C%EB%84%B7%EA%B3%BC-Broadcast-%EC%A3%BC%EC%86%8C){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (1편: Ethernet 스위칭)](https://www.netmanias.com/ko/?m=view&id=blog&no=5501){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (2편: IP 라우팅)](https://www.netmanias.com/ko/?m=view&id=blog&no=5502){:target="_blank"}