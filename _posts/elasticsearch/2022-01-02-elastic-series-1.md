---
layout: post
title:  'Elastic Series [Part0]: Elastic 생태계'
description: 
date:   2022-01-02 15:01:35 +0300
image:  '/images/elastic_1.png'
logo_image:  '/images/elastic_logo.png'
categories: DE
tags: Elastic
---

---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# ELK Stack

- 2004년 샤이 배논(Shay Banon)은 Compass 라는 이름의 오픈소스 검색엔진을 개발
- 처음에는 요리 공부를 시작한 아내를 위해 레시피 검색 프로그램을 만들기 위해서
- 루씬이 가진 한계를 보완하기 위해 새로 검색엔진을 만들기 위한 프로젝트를 시작한 것이 계기
- 2010년 샤이는 Compass를 Elasticsearch라고 이름을 바꾸고 프로젝트를 오픈소스로 공개
- 엘라스틱은 검색엔진을 뛰어넘는 하나의 플랫폼으로 성장하는 길을 택했다
- 그렇게 등장한 것이 Elasticsearch, Logstash, Kibana 그리고 Beats이다


![](/images/elastic_1.png)

- **Elasticsearch**: Lucene 기반의 전문 검색을 지원하는 분산 검색 엔진
- **Logstash**: 데이터를 추출하고 전처리한 후 엘라스틱서치로 전달하는 파이프라인
- **Kibana**: 엘라스틱서치에 저장된 데이터를 시각화 하는 도구
- **Beats**: 단일 목적의 데이터 수집기 무료 오픈 소스 플랫폼. 수백 수천 개의 장비와 시스템으로부터 Logstash나 Elasticsearch에 데이터를 전송

## ELK의 어원

- 초기에는 Elasticsearch + Logstash + Kibana를 줄여 ELK 스택이라고 했음
- Beats의 등장 이후 Beats + Elasticsearch + Logstash + Kibana를 ELK (Elastic Stack)이라고 하게됨
- 최근에는 데이터 용량이 커짐에 따라 버퍼, 안정성 등을 이유로 Kafka, RabbitMQ 와 같은 서비스 함께 사용
  
![](/images/elk_3.png)


## ELK의 등장배경

- 최근 마이크로서비스 형태의 패턴으로 서비스가 개발됨에 따라 중앙화된 로깅 시스템이 필요해짐
- 클라우드 기반 서비스에서는 각 노드에서의 작업량, 환경, 사용자 수에 따라 성능이 상이함
- 어플리케이션마다 발생할 수 있는 장애가 다름

## ELK 용도

- 로그 통합 모니터링/분석
- 애플리케이션 성능 분석

## ELK를 사용하는 이유

- ELK는 다양한 소스, 다양한 포맷, 검색엔진, 분석 그리고 시각화까지 중앙화된 로깅 시스템에 필요한 많은 기능을 갖추고 있음
- ELK는 비즈니스가 성장하는 규모에 맞춰 효율적으로 통합된 실시간 분석 시스템을 구축하도록 하는 도구 모음
- 오랜시간 커뮤니티에서 활발하게 사용되어 왔고, 많은 성공 사례를 가짐

# Elasticsearch

![](/images/es_main.png)

- 루씬(Lucene)의 색인 기반 검색엔진 라이브러리를 바탕으로 만든 검색 엔진 서비스
- 확장성, 가용성을 고려해 분산 시스템으로 설계
- Elastic Stack의 핵심 구성요소(Elasticsearch, Logstash, Kibana)
- 기본적으로는 검색엔진이지만, MongoDB나 HBase처럼 NoSQL로도 활용
- 보통 로그를 통합하고 분석하는 파이프라인의 구성요소로 많이 사용

## Elasticsearch 특징

- 색인 기반의 빠른 검색 엔진 기능 제공 (거의 실시간)
- 모든 요청과 응답을 REST API 형태로 제공
- 분산 시스템으로 대용량 데이터를 저장/처리할 수 있음 (샤딩)
- 서로 다른 인덱스를 하나의 질의로 묶어서 검색할 수 있는 멀티테넌시 기능 제공
- Elastic 생태계의 다른 도구와 함께 파이프라인 구축이 간단
- 자바 언어로 개발 되었고 JVM 있는 어떤 환경에서든 구동이 가능
- Java, Python, Go, Ruby 등 다양한 고수준 언어에 클라이언트 API 제공


# Logstash

- 데이터 수집과 가공 기능을 제공
- 다양한 데이터 소스로부터 데이터를 수집해서 필터링하여 정제한 후 원하는 저장소로 전달
- IP주소에서 위치 정보 좌표를 해독하고, 민감한 필드를 익명화하거나 제외시키는 등의 전반적인 작업을 쉽게 해줌
- 로그스태시는 크게 3가지 구성요소로 나뉜다
  - Input: 수집할 데이터 소스를 정의
  - Filters: 데이터를 정제하기 위한 필터
  - Output: 데이터를 전달하기 위한 저장소

## Logstash 특징

- 확장 가능한 200개 이상의 플러그인
- 배치 처리와 병렬 처리가 가능하며, 영속적인 큐를 사용해 현재 처리중인 이벤트의 최소 1회 전송을 보장
- 데이터량이 급증하는 부하 상황에서도 안정성을 보장

# Kibana

![](/images/kibana_main.webp)

- ELK에서 UI를 담당
- Elasticsearch에 저장된 도큐먼트, 집계결과를 시각화

## Kinbana 특징

- 실시간으로 인덱스에 저장된 도큐먼트를 모니터링할 수 있음
- 각종 집계 정보를 대시보드로 시각화 할 수 있음
- 엘라스틱서치 API 자동완성, 문법 체크, 구문 검사 기능 제공

# Beats

- 로그스태시와 유사하게 데이터를 수집하는 도구
- 로그스태시의 필터링과 같은 무거운 요소들을 제외한 경량 수집 도구

## Beats 특징

- Filebeat, Metricbeat 등 각각의 비트는 특정 목적에만 집중 -> 가벼움
- Go 언어로 작성 -> 가벼움
- 전세계 오픈소스 개발자들로부터 50여가지 이상의 다양한 비츠가 개발되고 있음

![](/images/beats_1.png)

# 참고

- [elastic, ELK Stack이란 무엇인가요?](https://www.elastic.co/kr/what-is/elk-stack){:target="_blank"}
- [Guru99, ELK Stack Tutorial: What is Kibana, Logstash & Elasticsearch?](https://www.guru99.com/elk-stack-tutorial.html){:target="_blank"}
- [MC+A, Why you should be using the Elastic (ELK) Stack](https://www.mcplusa.com/the-3-reasons-why-you-should-be-using-elk/){:target="_blank"}
- [logz.io, THE COMPLETE GUIDE TO THE ELK STACK](https://logz.io/learn/complete-guide-elk-stack/){:target="_blank"}

