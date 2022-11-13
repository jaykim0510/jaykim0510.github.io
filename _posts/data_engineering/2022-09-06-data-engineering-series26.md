---
layout: post
title:  'Data Engineering Series [Part26]: Google Bigquery'
description: 
date:   2022-09-06 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: data_engineering
tags: DE
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

# 테이블 세트

- 테이블을 저장하고 있는 폴더

# 테이블

- 다른 DB의 테이블과 같은 개념
- Bigquery에 저장한 테이블 뿐만 아니라, 
- 구글 클라우드 스토리지나 스프레드 시트와 같은 외부에 저장된 데이터도 바로 접근해서 사용 가능
- 용도에 맞게 샤딩, 파티셔닝, 클러스터링 할 수 있음
- (샤딩: 하나의 테이블을 물리적으로 여러 서버에 분산 저장)
- (파티셔닝: 하나의 테이블을 논리적으로 특정 컬럼 값을 기준으로 여러 개의 파티션으로 분할해서 저장)
- (클러스터링: 하나의 테이블을 여러 컬럼 값을 기준으로 정렬해서 여러 서버에 분산 저장)

# Validator

- 내가 입력한 쿼리의 유효성, 예상 비용을 알 수 있음









# 참고

- [T academy 유튜브, Google Bigquery ](https://www.youtube.com/watch?v=MILy4dzSGk4&list=PLghTMrY7fIM5fupKwEHQxw9ihqQAXeo3-){:target="_blank"}
- [minwoooo 노션, BigQuery 시작하기](https://minwoooo.notion.site/BigQuery-2a4012d6cb2a466fa71c0345da7898d4#8b6c70978dbc4b81b97affa3afe9844d){:target="_blank"}