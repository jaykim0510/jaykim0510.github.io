---
layout: post
title:  '[Network] 네트워크 활용편(3) Linux Network 관련 명령어'
description: 
date:   2022-07-15 15:01:35 +0300
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

# 네트워크 관련 리눅스 명령어

ifconfig, ip, netstat, ss, iptables, ping, ssh, telnet, route, curl, wget

## ifconfig

- 네트워크 인터페이스의 활성/비활성 여부, ip 관련 정보를 확인할 수 있음

```
ifconfig
----------------
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
...
inet <ip주소> netmask <서브넷 마스크> broadcast <브로드캐스트 주소>
status: active
```


## netstat

- Print network connections, routing tables, interface statistics, masquerade connections, and multicast memberships

- mac에서 netstat은 ubuntu, redhat 계열과는 가지고 있는 옵션이 다름
  - -a 기본 출력에 포함되지 않은 netstat의 출력에 서버 포트를 포함합니다.
  - -g 멀티 캐스트 연결과 관련된 정보를 표시합니다.
  - -I interface는 지정된 인터페이스에 대한 패킷 데이터를 제공합니다. 사용 가능한 모든 인터페이스는 -i 깃발이지만 en0 일반적으로 기본 발신 네트워크 인터페이스입니다. (소문자에 유의하십시오.)
  - -n 이름이있는 원격 주소의 레이블을 억제합니다. 이것은 제한된 정보만을 희생시키면서 netstat의 출력 속도를 크게 향상시킵니다.
  - -p 프로토콜은 특정 네트워킹 프로토콜과 관련된 트래픽을 나열합니다. 전체 프로토콜 목록은 / etc / protocols,하지만 가장 중요한 것은 udp 와 TCP.
  - -r 네트워크에서 패킷이 라우팅되는 방식을 보여주는 라우팅 테이블을 표시합니다.
  - -s 활성 여부에 관계없이 모든 프로토콜에 대한 네트워크 통계를 표시합니다.
  - -v 특히 각 열린 포트와 연관된 프로세스 ID (PID)를 표시하는 열을 추가하여 자세한 정보를 제공합니다.
  - 자주 사용하는 예시
    ```
    netstat -avp tcp

    # 포트 열고 LISTEN 하고 있는 네트워크 엔드포인트
    netstat -a | grep -i LISTEN
    ```
- ubuntu 계열
  - 자주 사용하는 예시
    ```
    netstat -nlp
    ```
    ![](/images/network_40.png)

## iptables

- administration tool for IPv4 packet filtering(방화벽) and NAT


## ping

- 특정 서버가 켜져있는지/접근 가능한지 확인
  ```
  ping <ip>

  ping -c <ping날릴 횟수> <ip>
  ```
- 포트 번호를 지정하고 싶은 경우에는 tcping 라는 커맨드 툴 설치해야함
  ```
  brew install tcping

  tcping <ip> <port>
  ```

## wget

- network downloader
- 기본적으로 다운이 디폴트
  ```
  wget <URL>
  ```
  ![](/images/network_44.png)



## curl

- 다양한 통신 프로토콜(HTTP, FTP, LDAP 등)을 지원하여 데이터를 전송할 수 있는 도구
- 기본적으로 터미널 화면에 출력이 디폴트
  ```
  curl <URL>

  curl <URL> > <원하는 파일명>

  curl -o <원하는 파일명> <URL>

  curl -O <URL>/<원하는 파일명>
  ```
  ![](/images/network_45.png)

- 뭔가 curl은 파일의 다운로드 경로를 넣어줘도 HTML 코드가 출력된다 (파일을 다운로드하고자 할 때는 wget인건가 무조건?)
- 서버에 REST API 형태로 HTTP Request를 전송할 수도 있다
  ```sh
  curl -X POST -H <헤더> <URL> -d <전송할 데이터>
  curl -X GET <URL>
  ```

## ssh

- remote login program
  ```
  ssh -i <pem파일> <username>@<host>
  ```
- 어플리케이션 계층에서 제공  


# 참고

- [kibua20, 자주 사용하는 curl 명령어 옵션과 예제](https://kibua20.tistory.com/148)
- 