---
layout: post
title:  'Linux Series [Part1]: 리눅스 커널'
description: 
date:   2022-06-17 15:01:35 +0300
image:  '/images/linux_logo.png'
logo_image:  '/images/linux_logo.png'
categories: CS
tags: OS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---
# 리눅스

- 전 세계적으로 약 300여 가지의 리눅스 배포판이 존재

## 3개의 주요 리눅스 계열

- Debian
  - Debian, Ubuntu, Mint Linux
  - 오픈 소스, 안정성에 초점
- Red Hat/Fedora
  - Fedora, Red Hat, CentOS, Amazon Linux
  - 엔터프라이즈 서버 환경을 타겟
- openSUSE
  - openSUSE, SUSE LInux Enterprise Server
  - 오픈소스, 안정성에 초점


# 리눅스 커널

- 커널: 컴퓨터 운영 체제의 핵심이 되는 컴퓨터 프로그램
- 운영 체제의 다른 부분, 응용 프로그램에 필요한 여러 가지 서비스를 제공 (open, read, write, close, wait, fork, exec 등)
- 응용 프로그램이 하드웨어에 직접 접근하도록 허용하는 것은 위험 -> 커널이 중간에서 그 역할을 담당
- 오픈 소스 유닉스 계열의 모놀리틱 구조

![](/images/os_52.png)

## 리눅스 커널 구조

![](/images/os_51.png)

- 모노리틱 커널
  - 장점: 구현이 간단하다. 성능이 좋다(커널 문맥에서 많은 부분이 처리되어 시스템 자원을 효율적으로 사용)
  - 단점: 커널 코드에 오류가 생기면 시스템 전체에 영향을 끼친다

# 리눅스 커널의 핵심 역할

- 하드웨어 관리 및 추상화
- 프로세스와 스레드 관리
- 메모리 관리
- I/O 관리

## 하드웨어 관리 및 추상화

- 서버 관리자 입장에서는 응용 프로그램이 서버의 하드웨어에 직접 접근하지 못하기 때문에 하드웨어 관리에 대한 부담이 없음
- 사용자 프로그램은 데이터가 디스크의 어느 위치에 있는지 몰라도 됨. 어떤 디바이스(HDD, SSD, USB 등)를 사용하는지 걱정하지 않아도 됨

## 프로세스와 스레드 관리

- 프로세스(또는 스레드)에 CPU 사용 시간을 적절히 할당해 줌으로써 멀티 태스킹을 가능하게 함

## 메모리 관리

- 개별 프로세스에 가상의 연속된 메모리 공간을 제공
- 물리 메모리봅다 더 큰 크기의 프로그램을 실행 가능하도록 해줌

## I/O 관리

- 모든 것은 파일(파일 디스크립터)이다
- VFS -> 하부 시스템 구성에 상관없이 파일 입출력 제어 가능

![](/images/os_53.png)

![](/images/os_54.png)

# 컨테이너 기술을 위한 커널의 핵심 기능

- cgroups
- namespaces
- union file system

## cgroup

- 프로세스들이 사용하는 시스템 자원을 제한
- 제한 가능한 자원: CPU, Memory, Network, Block I/O
- 활용 예시: runc, YARN

![](/images/os_55.png)

## namespace

- 프로세스별로 커널이 사용하는 공간을 분할
- 논리적 구분 공간 -> 볼 수 잇는 범위를 제한

![](/images/os_56.png)

## union file system

- 하나의 디렉토리 위치에 여러 개의 디렉토리를 마운트 -> 하나의 통합된 디렉토리를 제공
- CoW(Copy-on-write): 파일 변경이 생기면 새로운 파일을 복사해서 쓴다

![](/images/os_57.png)