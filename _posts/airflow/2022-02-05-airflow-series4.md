---
layout: post
title: 'Airflow Series [Part4]: 에어플로우 도입 사례'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/airflow_logo.png'
logo_image: '/images/airflow_logo.png'
category: data_engineering
tag: airflow
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---



# 참고

- [Socar Tech Blog, 전사 구성원들이 사용하는 배치 데이터 플랫폼 만들기 - Airflow Advanced](https://tech.socarcorp.kr/data/2022/11/09/advanced-airflow-for-databiz.html){:target="_blank"}
- [오늘의 집, 버킷플레이스 Airflow 도입기](https://www.bucketplace.com/post/2021-04-13-%EB%B2%84%ED%82%B7%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4-airflow-%EB%8F%84%EC%9E%85%EA%B8%B0/){:target="_blank"}
- [뤼이드, Airflow2를 이용한 데이터 파이프라인 구성기](https://medium.com/riiid-teamblog-kr/airflow2%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%EC%84%B1%EA%B8%B0-ab1ff1471546){:target="_blank"}
- [KWANGSIK LEE’s log, 금융권 사내 ETL 처리에 Airflow를 도입하기](http://www.kwangsiklee.com/2022/01/%EA%B8%88%EC%9C%B5%EA%B6%8C-%EC%82%AC%EB%82%B4-etl-%EC%B2%98%EB%A6%AC%EC%97%90-airflow%EB%A5%BC-%EB%8F%84%EC%9E%85%ED%95%98%EA%B8%B0/){:target="_blank"}
- [Line, Kubernetes를 이용한 효율적인 데이터 엔지니어링(Airflow on Kubernetes VS Airflow Kubernetes Executor) - 1](https://engineering.linecorp.com/ko/blog/data-engineering-with-airflow-k8s-1/){:target="_blank"}
- [mightytedkim, Pipeline 관련/Airflow Airflow) 'Custom Operator' 실무 적용하기_s3,hook](https://mightytedkim.tistory.com/150){:target="_blank"}
- [복잡한 스케줄 Airflow로 쉽게 관리하기](https://blog.kmong.com/%EB%B3%B5%EC%9E%A1%ED%95%9C-%EC%8A%A4%EC%BC%80%EC%A4%84-airflow%EB%A1%9C-%EC%89%BD%EA%B2%8C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0-71ccf026b5fe){:target="_blank"}