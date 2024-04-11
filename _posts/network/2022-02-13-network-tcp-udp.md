---
layout: post
title:  '[Network] 네트워크 프로토콜(2) TCP, UDP'
description: 
date:   2022-02-13 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
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
- 가상 회선 패킷 교환 방식 -> 경로가 이미 정해져 있음 -> 순서 보장

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

# TCP와 UDP
* 네트워크 계층 중 **전송 계층에서 사용하는 프로토콜**
* TCP(Transmission Control Protocol)  
    ![](/images/tcp-virtual-circuit.png)
    * 인터넷 상에서 데이터를 메세지의 형태(**세그먼트** 라는 블록 단위)로 보내기 위해 IP와 함께 사용하는 프로토콜이다.
    * TCP와 IP를 함께 사용하는데, IP가 데이터의 배달을 처리한다면 TCP는 패킷을 추적 및 관리한다.
    * **연결형 서비스로** 가상 회선 방식을 제공한다.
        * 3-way handshaking과정을 통해 연결을 설정하고, 4-way handshaking을 통해 연결을 해제한다.
    * 흐름제어 및 혼잡제어를 제공한다.
        * 흐름제어
            * 데이터를 송신하는 곳과 수신하는 곳의 데이터 처리 속도를 조절하여 수신자의 버퍼 오버플로우를 방지하는 것
            * 송신하는 곳에서 감당이 안되게 많은 데이터를 빠르게 보내 수신하는 곳에서 문제가 일어나는 것을 막는다.
        * 혼잡제어
            * 네트워크 내의 패킷 수가 넘치게 증가하지 않도록 방지하는 것
            * 정보의 소통량이 과다하면 패킷을 조금만 전송하여 혼잡 붕괴 현상이 일어나는 것을 막는다.
    * 높은 신뢰성을 보장한다.
    * UDP보다 속도가 느리다.
    * 전이중(Full-Duplex), 점대점(Point to Point) 방식이다.
        * 전이중
            * 전송이 양방향으로 동시에 일어날 수 있다.
        * 점대점
            * 각 연결이 정확히 2개의 종단점을 가지고 있다.
        * 멀티캐스팅이나 브로드캐스팅을 지원하지 않는다.
    * 연속성보다 신뢰성있는 전송이 중요할 때에 사용된다.
* UDP(User Datagram Protocol)  
    ![](/images/udp-datagram.png)
    * 데이터를 **데이터그램** 단위로 처리하는 프로토콜이다.
    * **비연결형 서비스로** 데이터그램 방식을 제공한다.
        * 연결을 위해 할당되는 논리적인 경로가 없다.
        * 그렇기 때문에 각각의 패킷은 다른 경로로 전송되고, 각각의 패킷은 독립적인 관계를 지니게 된다.
        * 이렇게 데이터를 서로 다른 경로로 독립적으로 처리한다.
    * 정보를 주고 받을 때 정보를 보내거나 받는다는 신호절차를 거치지 않는다.
    * UDP헤더의 CheckSum 필드를 통해 최소한의 오류만 검출한다.
    * 신뢰성이 낮다.
    * TCP보다 속도가 빠르다.
    * 신뢰성보다는 연속성이 중요한 서비스, 예를 들면 실시간 서비스(streaming)에 사용된다.
* 참고
  * UDP와 TCP는 각각 별도의 포트 주소 공간을 관리하므로 같은 포트 번호를 사용해도 무방하다. 즉, 두 프로토콜에서 동일한 포트 번호를 할당해도 서로 다른 포트로 간주한다.
  * 또한 같은 모듈(UDP or TCP) 내에서도 클라이언트 프로그램에서 동시에 여러 커넥션을 확립한 경우에는 서로 다른 포트 번호를 동적으로 할당한다. (동적할당에 사용되는 포트번호는 49,152~65,535이다.)

# TCP와 UDP의 헤더 분석

## TCP Header
* TCP는 상위계층으로부터 데이터를 받아 **헤더**를 추가해 IP로 전송

![](/images/tcpheader.png)

|**필드**|**내용**|**크기(bits)**|
|Source Port, Destination Port|TCP로 연결되는 가상 회선 양단의 송수신 프로세스에 할당되는 포트 주소|16|
|Sequence Number|송신자가 지정하는 순서 번호, **전송되는 바이트 수** 기준으로 증가<br/>SYN = 1 : 초기 시퀀스 번호. ACK 번호는 이 값에 + 1|32|
|Acknowledgment(ACK) Number|수신 프로세스가 제대로 **수신한 바이트의 수** 응답 용|32|
|Header Length(Data Offset)|TCP 헤더 길이를 4바이트 단위로 표시(최소 20, 최대 60 바이트)|4|
|Resv(Reserved)|나중을 위해 0으로 채워진 예약 필드|6|
|Flag Bit|SYN, ACK, FIN 등 제어 번호(아래 표 참고)|6|
|Window Size|**수신 윈도우의 버퍼 크기** 지정(0이면 송신 중지). 상대방의 확인 없이 전송 가능한 최대 바이트 수|16|
|TCP Checksum|헤더와 데이터의 에러 확인 용도|16|
|Urgent Pointer(긴급 위치)|현재 순서 번호부터 표시된 바이트까지 긴급한 데이터임을 표시, URG 플래그 비트가 지정된 경우에만 유효|16|
|Options|추가 옵션 있을 경우 표시|0~40|

  * Flag Bit

    |**종류**|**내용**|
    |URG|긴급 위치 필드 유효 여부 설정|
    |ACK|응답 유효 여부 설정. 최초의 SYN 패킷 이후 모든 패킷은 ACK 플래그 설정 필요. 데이터를 잘 받았으면 긍정 응답으로 ACK(=SYN+1) 전송|
    |PSH|수신측에 버퍼링된 데이터를 상위 계층에 즉시 전달할 때|
    |RST|연결 리셋 응답 혹은 유효하지 않은 세그먼트 응답|
    |SYN|연결 설정 요청. 양쪽이 보낸 최초 패킷에만 SYN 플래그 설정|
    |FIN|연결 종료 의사 표시|

## UDP Header
![](/images/udpheader.png)

|**필드**|**내용**|**크기(bits)**|
|Source Port, Destination Port|송수신 애플리케이션의 포트 번호|16|
|Length|헤더와 데이터 포함 전체 길이|16|
|Checksum|헤더와 데이터의 에러 확인 용도. UDP는 에러 복구를 위한 필드가 불필요하기 때문에 TCP 헤더에 비해 간단|16|

# TCP의 3 way handshake와 4 way handshake
* TCP는 장치들 사이에 논리적인 접속을 성립(establish)하기 위하여 연결을 설정하여 **신뢰성을 보장하는 연결형 서비스** 이다.
* 3-way handshake 란
  * TCP 통신을 이용하여 데이터를 전송하기 위해 네트워크 **연결을 설립(Connection Establish)** 하는 과정
  * 양쪽 모두 데이터를 전송할 준비가 되었다는 것을 보장하고, 실제로 데이터 전달이 시작하기 전에 서로 준비되었다는 것을 알 수 있도록 한다.
  * 즉, TCP/IP 프로토콜을 이용해서 통신을 하는 응용 프로그램이 데이터를 전송하기 전에 먼저 정확한 전송을 보장하기 위해 상대방 컴퓨터와 사전에 세션을 수립하는 과정을 의미한다.
      * A 프로세스(Client)가 B 프로세스(Server)에 연결을 요청
        ![](/images/3-way-handshaking.png)
        1. A -> B: SYN
            * 접속 요청 프로세스 A가 연결 요청 메시지 전송 (SYN)
            * 송신자가 최초로 데이터를 전송할 때 Sequence Number를 임의의 랜덤 숫자로 지정하고, SYN 플래그 비트를 1로 설정한 세그먼트를 전송한다.
            * PORT 상태 - B: LISTEN, A: CLOSED
        2. B -> A: SYN + ACK
            * 접속 요청을 받은 프로세스 B가 요청을 수락했으며, 접속 요청 프로세스인 A도 포트를 열어 달라는 메시지 전송 (SYN + ACK)
            * 수신자는 Acknowledgement Number 필드를 (Sequence Number + 1)로 지정하고, SYN과 ACK 플래그 비트를 1로 설정한 세그먼트를 전송한다.
            * PORT 상태 - B: SYN_RCV, A: CLOSED
        3. A -> B: ACK
            * PORT 상태 - B: SYN_RCV, A: ESTABLISHED
            * 마지막으로 접속 요청 프로세스 A가 수락 확인을 보내 연결을 맺음 (ACK)
            * 이때, 전송할 데이터가 있으면 이 단계에서 데이터를 전송할 수 있다.
            * PORT 상태 - B: ESTABLISHED, A: ESTABLISHED
* 4-way handshake 란
  * TCP의 **연결을 해제(Connection Termination)** 하는 과정
      * A 프로세스(Client)가 B 프로세스(Server)에 연결 해제를 요청
        ![](/images/4-way-handshaking.png)
        1. A -> B: FIN
            * 프로세스 A가 연결을 종료하겠다는 FIN 플래그를 전송
            * 프로세스 B가 FIN 플래그로 응답하기 전까지 연결을 계속 유지
        2. B -> A: ACK
            * 프로세스 B는 일단 확인 메시지를 보내고 자신의 통신이 끝날 때까지 기다린다. (이 상태가 TIME_WAIT 상태)
            * 수신자는 Acknowledgement Number 필드를 (Sequence Number + 1)로 지정하고, ACK 플래그 비트를 1로 설정한 세그먼트를 전송한다.
            * 그리고 자신이 전송할 데이터가 남아있다면 이어서 계속 전송한다.
        3. B -> A: FIN
            * 프로세스 B가 통신이 끝났으면 연결 종료 요청에 합의한다는 의미로 프로세스 A에게 FIN 플래그를 전송
        4. A -> B: ACK
            * 프로세스 A는 확인했다는 메시지를 전송
* 참고 - ***포트(PORT) 상태 정보***
  * CLOSED: 포트가 닫힌 상태
  * LISTEN: 포트가 열린 상태로 연결 요청 대기 중
  * SYN_RCV: SYNC 요청을 받고 상대방의 응답을 기다리는 중
  * ESTABLISHED: 포트 연결 상태
* 참고 - ***플래그 정보***
  * TCP Header에는 CONTROL BIT(플래그 비트, 6bit)가 존재하며, 각각의 bit는 "URG-ACK-PSH-RST-SYN-FIN"의 의미를 가진다.
    * 즉, 해당 위치의 bit가 1이면 해당 패킷이 어떠한 내용을 담고 있는 패킷인지를 나타낸다.
  * SYN(Synchronize Sequence Number) / 000010
    * 연결 설정. Sequence Number를 랜덤으로 설정하여 세션을 연결하는 데 사용하며, 초기에 Sequence Number를 전송한다.
  * ACK(Acknowledgement) / 010000
    * 응답 확인. 패킷을 받았다는 것을 의미한다.
    * Acknowledgement Number 필드가 유효한지를 나타낸다.
    * 양단 프로세스가 쉬지 않고 데이터를 전송한다고 가정하면 최초 연결 설정 과정에서 전송되는 첫 번째 세그먼트를 제외한 모든 세그먼트의 ACK 비트는 1로 지정된다고 생각할 수 있다.
  * FIN(Finish) / 000001
    * 연결 해제. 세션 연결을 종료시킬 때 사용되며, 더 이상 전송할 데이터가 없음을 의미한다.

**❓TCP 관련 질문 1**  

* Q. TCP의 연결 설정 과정(3단계)과 연결 종료 과정(4단계)이 단계가 차이나는 이유?
  * A. Client가 데이터 전송을 마쳤다고 하더라도 Server는 아직 보낼 데이터가 남아있을 수 있기 때문에 일단 FIN에 대한 ACK만 보내고, 데이터를 모두 전송한 후에 자신도 FIN 메시지를 보내기 때문이다.
  * [관련 Reference](http://ddooooki.tistory.com/21)

**❓TCP 관련 질문 2**  

* Q. 만약 Server에서 FIN 플래그를 전송하기 전에 전송한 패킷이 Routing 지연이나 패킷 유실로 인한 재전송 등으로 인해 FIN 패킷보다 늦게 도착하는 상황이 발생하면 어떻게 될까?
  * A. 이러한 현상에 대비하여 Client는 Server로부터 FIN 플래그를 수신하더라도 일정시간(Default: 240sec)동안 세션을 남겨 놓고 잉여 패킷을 기다리는 과정을 거친다. (TIME_WAIT 과정)
  * [관련 Reference](http://mindnet.tistory.com/entry/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-22%ED%8E%B8-TCP-3-WayHandshake-4-WayHandshake)

**❓TCP 관련 질문 3**   

* Q. 초기 Sequence Number인 ISN을 0부터 시작하지 않고 난수를 생성해서 설정하는 이유?
  * A. Connection을 맺을 때 사용하는 포트(Port)는 유한 범위 내에서 사용하고 시간이 지남에 따라 재사용된다. 따라서 두 통신 호스트가 과거에 사용된 포트 번호 쌍을 사용하는 가능성이 존재한다. 서버 측에서는 패킷의 SYN을 보고 패킷을 구분하게 되는데 난수가 아닌 순처적인 Number가 전송된다면 이전의 Connection으로부터 오는 패킷으로 인식할 수 있다. 이런 문제가 발생할 가능성을 줄이기 위해서 난수로 ISN을 설정한다.
  * [관련 Reference](http://asfirstalways.tistory.com/356)


# 참고

- [불곰, TCP, UDP 포트 (Port, OSI 4계층)](https://blog.naver.com/PostView.naver?blogId=taeheon714&logNo=222139481141&parentCategoryNo=&categoryNo=6&viewDate=&isShowPopularPosts=true&from=search){:target="_blank"}
- [What is a computer port?,Ports in networking](https://www.cloudflare.com/ko-kr/learning/network-layer/what-is-a-computer-port/){:target="_blank"}
- [곰돌이 놀이터: 소켓 통신이란?](https://helloworld-88.tistory.com/215){:target="_blank"}
- [아무거나올리는블로그: Socket Programming - Socket](https://junb51.tistory.com/2){:target="_blank"}
- [stackoverflow: difference between socket programming and Http programming](https://stackoverflow.com/questions/15108139/difference-between-socket-programming-and-http-programming/47637847#47637847){:target="_blank"}
