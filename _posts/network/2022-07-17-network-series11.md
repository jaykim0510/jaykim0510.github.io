---
layout: post
title:  'Network Series [Part11]: 네트워크 용어(1): NAT, DHCP'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/nat_dhcp_logo.png'
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

# NAT

## NAT란 무엇인가

> NAT stands for network address translation. It’s a way to map multiple local private addresses to a public one before transferring the information. Organizations that want multiple devices to employ a single IP address use NAT, as do most home routers.  

- Network Address Translation의 줄임말
- 사설 IP 주소를 가지는 여러 대의 로컬 장비를 하나의 공인 IP 주소로 변환해 외부 네트워크와 통신하도록 해준다

![](/images/nat_1.png)

## NAT를 사용하는 이유

IP NAT(Network Address Translation)는 원래 제한된 수의 인터넷 IPv4 주소 문제를 해결하기 위해 개발되었습니다. 여러 디바이스에서 인터넷에 액세스해야 하지만 하나의 IP 주소만 ISP(인터넷 서비스 공급자)에 의해 할당되는 경우 NAT가 필요합니다. NAT는 로컬 호스트가 공용 인터넷에 액세스할 수 있게 하고 외부에서는 직접 액세스할 수 없도록 보호합니다.  

### IP 주소 절약

- NAT를 이용하면 여러 대의 장비를 하나의 공인 IP주소를 사용해 인터넷과 연결시킬 수 있다
- 공유기가 대표적으로 이러한 NAT 기능을 탑재하고 있다

### 보안

- 외부 네트워크와 통신하기 위해 사설 IP를 알려주지 않아도 된다

## NAT의 종류

### Static NAT

- 사설 IP주소와 공인 IP주소를 1:1로 매핑
- 이 경우에는 IP주소 절약 효과는 없음
- 서버의 여러 포트로 포트포워딩하는 목적으로 사용

### Dynamic NAT

- 사설 IP주소와 공인 IP주소를 N:M로 매핑 (N > M)
- 공인 IP주소로 데이터가 들어오면 NAT가 적절한 사설 IP주소로 변환해 준다

### PAT(Port Address Translation)

- [GeeksforGeeks, Port Address Translation (PAT) mapping to Private IPs](https://www.geeksforgeeks.org/port-address-translation-pat-mapping-to-private-ips/){:target="_blank"}

## NAT의 동작 원리

![](/images/nat_2.png)

한 가지 궁금한 것은 NAT가 무엇을 이용해 공인 IP주소를 N개의 사설 IP주소중 하나로 변환할까?  

As a NAT network address translation example, an inside host may want to communicate with a destination network address translation web server address in the outside world. For further communication, it will send a data packet to the network’s NAT gateway router.  

The NAT gateway router determines whether the packet meets the condition for translation by learning the source IP address of the packet and looking it up in the table. It can locate authenticated hosts for the internal network translation purposes on its access control list (ACL), and then complete the translation, producing an inside global IP address from the inside local IP address.  

Finally, the NAT gateway router will route the packet to the destination after saving the translation in the NAT table. The packet reverts to the global IP address of the router when the internet’s web server reverts to the request. Referring back to the NAT table, the router can determine which translated IP address corresponds to which global address, translate it to the inside local address, and deliver the data packet to the host at their IP address. The data packet is discarded if no match is found.  


# DHCP

IP 주소를 할당하기란 쉽지 않은 일입니다. 특히 IP 주소 할당 과정에서 문제가 생기면 누군가의 인터넷 연결이 끊어질 수도 있습니다. 이때 DHCP를 이용하면 IP 주소 할당을 더욱 수월하게 진행할 수 있습니다.  

DHCP는 ‘Dynamic Host Configuration Protocol(동적 호스트 구성 프로토콜)’의 약자로, IP 네트워크에 사용되는 네트워크 프로토콜입니다. DHCP는 IP 주소 및 기타 통신 매개변수를 네트워크에 연결된 장치에 자동으로 할당합니다. 대부분의 가정용 네트워크에서는 라우터가 IP 주소를 장치에 할당하는 DHCP 서버의 역할을 합니다.  

DHCP는 네트워크 관리자가 해야 할 작업을 간소화합니다. DHCP 사용 없이는 수동으로 IP 주소를 할당해야 합니다. DHCP 설정 없이 수동으로 IP 주소를 할당하면 비효울적이고 시간이 지나치게 많이 소요되며 오류가 발생할 가능성이 높습니다.  

이제 DHCP 동작 과정에 대해 알아보겠습니다. 장치는 네트워크에 연결 시 IP 주소를 요청합니다. 요청은 DHCP 서버로 전달되며, 서버는 주소를 할당하고 주소의 이용을 모니터링하며 장치의 연결이 해제되면 주소를 다시 가져옵니다. 해당 IP 주소는 다른 장치에 재할당할 수 있으며, 장치는 IP 주소를 이용해 내부 및 공용 네트워크와 통신할 수 있습니다.  

DHCP 서버는 DHCP 매개변수(DHCP 옵션)를 제공합니다. DHCP 매개변수에서는 IP 주소의 다양한 정보(사용 가능 시간)를 확인할 수 있습니다. DHCP 옵션에서는 보통 다음 내용이 포함됩니다.  

- 현지 네트워크와 인터넷 사이의 데이터를 라우팅하는 기본 게이트웨이
- IP 주소 내의 호스트 주소와 네트워크 주소를 분리하는 서브넷 마스크
- IP 주소의 이름을 사람이 기억할 수 있는 이름으로 변환하는 DNS 서버


DHCP의 IP 주소 할당 방식은 다음과 같습니다.  

- 동적 할당(Dynamic Allocation): 관리자가 DHCP에 IP 주소를 유보해놓는 경우에 동적 할당 방식이 활용됩니다. 로컬 네트워크에 있는 DHCP 클라이언트는 네트워크 초기화 단계에서 DHCP 서버 로부터 IP를 요청합니다. 이 모든 과정은 DHCP 서버가 이용되지 않은 IP 주소를 다시 클레임하고 다시 할당할 수 있는 시간 동안 진행됩니다.
- 자동 할당(Automatic allocation): DHCP 서버는 관리자가 정한 규칙에 따라 IP 주소를 클라이언트에 영구 할당하는 방식입니다. 자동 할당 방식은 DHCP 서버에 이전 IP 주소 할당 데이터가 있고 동일한 IP 주소를 동일한 클라이언트에게 재할당할 수 있다는 점에서 동적 할당과는 다릅니다.
- 수동 할당(Manual allocation): 관리자가 각 클라이언트에 대한 고유한 식별자를 IP 주소에 수동 할당하는 방식입니다. DHCP 서버는 DHCP 서버에 연결할 수 없을 때 다른 할당 방식으로 전환하도록 구성되어 있습니다.

# 참고

- [NordVPN, DHCP의 정의와 DHCP를 이용해야 하는 이유](https://nordvpn.com/ko/blog/what-is-dhcp/){:target="_blank"}
- [Microsoft, NAT(Network Address Translation) 소개](https://docs.microsoft.com/ko-kr/azure/rtos/netx-duo/netx-duo-nat/chapter1){:target="_blank"}
- [STEVEN J.LEE, NAT이해하기](https://www.stevenjlee.net/2020/07/11/%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-nat-network-address-translation-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%A3%BC%EC%86%8C-%EB%B3%80%ED%99%98/){:target="_blank"}
- [CompTIA, What Is NAT?](https://www.comptia.org/content/guides/what-is-network-address-translation){:target="_blank"}
- [GeeksforGeeks, Network Address Translation (NAT)](https://www.geeksforgeeks.org/network-address-translation-nat/){:target="_blank"}
- [AVI Networks, Network Address Translation Definition](https://avinetworks.com/glossary/network-address-translation/){:target="_blank"}
- [GeeksforGeeks, Port Address Translation (PAT) mapping to Private IPs](https://www.geeksforgeeks.org/port-address-translation-pat-mapping-to-private-ips/){:target="_blank"}