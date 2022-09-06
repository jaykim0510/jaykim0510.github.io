---
layout: post
title:  'Data Engineering Series [Part28]: 데이터 파이프라인과 장애'
description: 
date:   2022-09-06 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 데이터 파이프라인의 안정성을 높이려면

- 모니터링할 수 있어야 한다(에러 로그 + 컴퓨팅 자원 시각화한 대시보드)
- 장애를 감지할 수 있어야 한다 + 알람 기능  
- CI/CD하는 과정에서 테스트 하는 과정이 수반되어야 한다
- 각 컴포넌트 + 유저단에서 데이터 유효성 검사가 필요하다 (데이터 타입, 제약사항 준수여부, 데이터 품질)
- 장애 복구가 가능해야 한다  
- 위의 과정들이 구조화/자동화 되어야 한다

# 필요한 것

- Prometheus, Grafana
- Pytest
- Airflow
- Jenkins
- Slack

# 모니터링

# 감지 + 알람

# CI/CD

# 유효성 검사

# 자동화

# 그럼에도 장애가 발생했다면

# 참고


- [bmc blogs, 3 Keys to Building Resilient Data Pipelines](https://www.bmc.com/blogs/resilient-data-pipelines/){:target="_blank"}
- [Youtube, Testing data pipelines](https://www.youtube.com/watch?v=7GI6LHZsUX0){:target="_blank"}
- [How to add tests to your data pipelines](https://www.startdataengineering.com/post/how-to-add-tests-to-your-data-pipeline/){:target="_blank"}
- [moey920.log, 안정적인 운영을 완성하는 모니터링, 프로메테우스와 그라파나](https://velog.io/@moey920/%EC%95%88%EC%A0%95%EC%A0%81%EC%9D%B8-%EC%9A%B4%EC%98%81%EC%9D%84-%EC%99%84%EC%84%B1%ED%95%98%EB%8A%94-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.-%ED%94%84%EB%A1%9C%EB%A9%94%ED%85%8C%EC%9A%B0%EC%8A%A4%EC%99%80-%EA%B7%B8%EB%9D%BC%ED%8C%8C%EB%82%98){:target="_blank"}