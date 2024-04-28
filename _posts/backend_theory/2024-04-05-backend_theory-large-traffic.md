---
layout: post
title:  '[Backend Thoery] 대용량 트래픽'
description: 
date:   2024-04-05 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 대용량 트래픽 처리

- 대용량 트래픽 처리란 다음과 같은 상황에 발생하는 트래픽을 어떻게 처리할 것인지에 관한 분야이다
  - 서비스 사용자의 증가로 인한 **항시적 대용량 트래픽**: ex. 사용자 수가 많은 서비스를 운영하는 경우
  - 특정 시간에 **일시적으로 급격히 증가하는 트래픽**: ex. 타임이벤트

- 대용량 트래픽을 처리하지 못하면 서비스의 가용성과 사용자 경험이 저하되며, 이는 직접적으로 서비스의 실패로 이어질 수 있다
- 따라서 대용량 트래픽을 효과적으로 처리하기 위한 백엔드 시스템 설계 전략을 이해하는 것은 매우 중요하다


# 대용량 트래픽 처리 개요

1. 트래픽을 확인할 수 있는 모니터링 시스템을 갖춘다
2. 부하가 어디서 걸리는지 병목지점을 확인한다
3. 부하 해결한다

# 서버 모니터링

- 서비스 모니터링, 시스템 모니터링
- CPU, 메모리, 디스크, 네트워크 사용량
- Traffic, Latency, Error, Saturation

# 병목지점과 해결 방법

- 코드 리팩터링
- 캐시, 메세지 큐
- DB 튜닝, 인덱스, 쿼리 성능 개선
- MSA
- 스케일-업, 스케일-아웃


# 참고

- [대용량 트래픽 처리를 위한 대규모 시스템 설계하기, Eric's DevLog](https://kyungyeon.dev/posts/96)
- [대용량 트래픽 처리를 위한 백엔드 시스템 설계 전략, f-lab](https://f-lab.kr/insight/backend-system-design-for-high-traffic)
- [신입이 어떻게 대규모 트래픽 처리 경험을 쌓아요? ,Youtube JSCODE 박재성 채널 ](https://www.youtube.com/watch?v=b4Ro_2cK9V8)