---
layout: post
title:  'Data Engineering Series [Part26]: Google Bigquery'
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

# Bigquery

- 데이터 웨어하우스 (Google Bigquery, AWS Redshift, Snowflake 등)
- GCP가 자동으로 관리
- 분산형 분석 엔진 (테라바이트급 쿼리를 초단위로 실행)
- 분석에 필요한 기능들 제공(머신러닝, BI 등)
- CLI 또는 Python, Java와 같은 언어에서 API로도 사용 가능

# 가격 정책

- 분석(SELECT 비용)
  - 쿼리를 처리할 때 발생하는 비용 (쿼리, 스크립트, DDL, DML 등)
  - 5$/조회 용량 TB
  - 매월 1TB는 무료
- 수집(INSERT 비용)
  - 데이터를 입력하는데 드는 비용
  - 일괄 로드: 무료
  - 스트리밍 로드: 0.01$/200MB
- 추출(READ)
  - 일괄 내보내기: 무료
  - 스트리밍 내보내기: 1.1$/1TB
- 저장(스토리지 비용)
  - 활성 스토리지: 0.02$/1GB
  - 장기 스토리지: 0.01$/1GB
  - 매월 10GB는 무료









# 참고

- [T academy 유튜브, Google Bigquery ](https://www.youtube.com/watch?v=MILy4dzSGk4&list=PLghTMrY7fIM5fupKwEHQxw9ihqQAXeo3-){:target="_blank"}
