---
layout: post
title:  '[Backend Thoery] 메세지 큐'
description: 
date:   2023-12-21 15:01:35 +0300
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

# 메세지 큐

- 프로세스간 통신(IPC: Inter Process Communication) 방법 중 하나다
- 메세지(데이터)를 임시 또는 영구적으로 보관하고 있는 버퍼 역할을 한다

![](/images/backend_theory_mq_1.png)
*[출처: memphis.dev](https://memphis.dev/blog/what-is-a-message-queue/)*

# 메세지 큐의 특징

- 프로듀서(발신자)는 메세지를 컨슈머(수신자)에게 <span class='very__important'>직접 전송하지 않고, 큐에 저장</span>한다
- 컨슈머(수신자)는 자신이 필요로 할 때 큐에서 데이터를 읽어가면 된다
- 프로듀서와 컨슈머는 서로를 직접 알 필요가 없다
- 프로듀서는 컨슈머가 메세지를 수신할 준비가 되었는지 알 필요없이 자신이 원할 때 메세지를 보내면 된다
- 컨슈머 또한 프로듀서가 메세지를 보냈는지 알 필요없이 자신이 원할 때 메세지를 읽어가면 된다

![](/images/backend_theory_mq_2.png)

# 메세지 큐의 장점

- 비동기 통신을 제공하며 결과적으로 프로세스간의 **결합 의존도를 낮춘다**
- 프로듀서와 컨슈머가 **각자 자신의 속도에 맞게 메세지를 송수신**할 수 있다
- **시스템 확장성이 높아진다**
- **독립적인 개발∙운영**을 가능하게 한다

<br>

- 여기까지만 보면 단순 버퍼와 다를게 없어 보인다
- 하지만 메세지 큐 역할을 도구들(ex. RabbitMQ, Kafka 등)은 단순 버퍼 외에도 추가적으로 다양한 기능을 제공해준다
  - 분산 시스템의 이점
  - 정확히 한 번 전송 알고리즘

# 메세지 큐 사용 예시

- 어떤 상황에 메세지 큐가 유용할까?
  - 마이크로서비스 아키텍처에서 프로세스간 통신
  - 데이터를 보낸 즉시 받는 쪽에서 처리하지 않아도 되는 작업
  - 일시적으로 작업을 모아뒀다 일괄적으로 처리해도 되는 작업
  - 데이터의 저장과 그 순서가 보장되고, 정확히 한 번 전송이 보장되어야 하는 작업