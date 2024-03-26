---
layout: post
title:  'Linux Series [Part3]: 리눅스 파일 시스템'
description: 
date:   2024-03-14 15:01:35 +0300
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

# 리눅스 파일시스템의 주요 디렉토리

- /bin: 모든 사용자에게 제공하는 명령어 바이너리 (cat, ls, cp 등)
- /sbin: 필수 시스템 바이너리 (init, ip, mount 등)
- /usr/bin: 대부분의 명령과 실행 파일
- /opt: 선택 가능한 응용 프로그램 패키지
- /usr/local: 로컬 프로그램이나 환경설정 데이터
- /etc: 시스템에 필수적인 시작 및 설정 파일
- /var/log: 시스템 로그 파일
- /tmp: 재부팅 시 삭제 될 수 있는 임시 파일

# 파일 타입

- 크게 일반 파일, 디렉토리, 하드링크, 소프트링크

- 하드링크는 디스크에 저장된 데이터를 직접 가리킴
- 소프트링크는 원본 파일의 이름을 가리키는 링크
- 파일의 수정은 원본, 하드링크, 소프트링크 어느 곳에 하더라도 다른 파일에 다 같이 적용됨
- 원본 파일의 삭제는 하드링크에는 영향을 주지 않음. 소프트링크는 더 이상 가르킬 원본 파일이 없음

![](/images/os_62.png)

# 스토리지 사용량 명령어

## df
- 디스크 여유 용량 확인
- df -h

## du
- 디스크 사용량 확인
- du -h -d 1
- h: 사람이 읽기 쉬운 방식, d: depth를 의미. 현재 위치에서 얼마나 파일을 세분화하여 볼 것인지 의미