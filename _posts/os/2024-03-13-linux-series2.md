---
layout: post
title:  'Linux Series [Part2]: 리눅스 프로세스 관리'
description: 
date:   2024-03-13 15:01:35 +0300
image:  '/images/linux_logo.png'
logo_image:  '/images/linux_logo.png'
category: CS
tag: OS
related_tags: [Linux]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# 프로세스와 스레드

- 프로세스
  - 실행중인 프로그램
  - 커널 공간에서는 프로세스 디스크립터

![](/images/os_58.png)

- 스레드
  - 프로세스 내의 실행 흐름 (프로세스당 최소 1개 이상의 스레드가 존재)
  - 리눅스에서는 스레드를 경량 프로세스라고도 함 -> 리눅스에서는 스레드 단위로 스케줄링
  - 스레드는 주소 공간이나 열린 파일 등 여러 자원을 공유할 수 있음 -> 공유자원을 접근할 때 동기화 요구됨

![](/images/os_59.png)

# 프로세스 관련 명령어

## ps

- 프로세스 상태 모니터링
- ps aux
- a: 모든 프로세스, u: 사용자 지향적 출력, x: 터미널이 없는 프로세스도 표시

![](/images/os_60.png)

## htop

- 3초 동안 수집한 리눅프 프로세스 정보를 지속적으로 제공
- top 명령어도 있으나 htop이 더 나은 인터페이스 제공
- ps, htop과 같은 명령어는 `/proc/` 에서 커널 정보를 가져옴

![](/images/os_61.png)

## kill

- 프로세스 종료
- kill -번호 pid
- ex. kill -15 4324
- 번호는 시그널 의미
  - 15 (SIGTERM): 실행을 완전하게 종료하라는 요청
  - 9 (SIGKILL): 프로세스를 커널 수준에서 종료
  - 2 (SIGINT): 터미널에 Ctrl + C 와 같이 인터럽트 요청
  - 15번 우선적으로 사용. 안되면 9번