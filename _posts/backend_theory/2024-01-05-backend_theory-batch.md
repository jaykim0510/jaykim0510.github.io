---
layout: post
title:  '[Backend Thoery] 배치 처리'
description: 
date:   2024-01-05 15:01:35 +0300
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

# 배치 처리

- 일련의 작업을 모아서 특정 시점에 일괄적으로 처리하는 것을 말한다

# 배치 스케줄러

- 배치 처리는 다양한 방식으로 실행될 수 있다
- **특정 시각**: ex. 03:00시
- **특정 주기**: ex. 매일, 매주 
- **특정 이벤트**: ex. 푸시 명령이 발생 했을 때

# 배치 처리 시점

- 사람의 개입 없이 반복적인 태스크를 처리할 수 있다
- 배치 처리 시점을 사용자들이 적은 시간대로 설정함으로써 서버의 리소스를 최대한 활용할 수 있다

# 배치 처리 예시

- 쿠폰 발행
- 랭킹 산출
- 상품 목록 인덱싱
- 주기적인 정산

# 배치 처리 도구

- Cron, Crontab
- Airflow


# 참고

- [[Nest.js] 태스크 스케줄링, grace's dev_note](https://meercat.tistory.com/418)
