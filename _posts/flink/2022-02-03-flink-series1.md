---
layout: post
title: 'Flink Series [Part1]: 플링크로 알아보는 스트리밍 처리 기초'
description: 
date: 2022-02-03 15:01:35 +0300
logo_image: '/images/flink_logo.png'
image: '/images/flink_logo.png'
categories: DE
tags: Flink
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Flink

플링크는 **분산 스트림 처리** 오픈소스 프레임워크입니다 플링크는 **상태가 있는 스트림 처리(Stateful Stream Processing)** 애플리케이션을 구현하는 데 필요한 다양한 API를 제공합니다. 플링크는 2014년 4월, 아파치 소프트웨어 재단의 인큐베이터 프로젝트로 시작해 2015년 1월, 아파치 최상위 프로젝트가 되었습니다. 플링크는 현재 넷플릭스, 에어비앤비, 우버 등 전 세계 많은 기업의 대규모 스트림 처리 업무에서 핵심적인 역할을 하고 있습니다. 

![](/images/flink_2.png)  

플링크가 스트림 처리를 위해 제공하는 스펙은 다음과 같습니다.  

- **Low Latency**: ms단위의 지연시간 보장
- **High Throughput**: 초당 100만 단위의 이벤트 처리
- **In-Memory Computing**: 인-메모리 컴퓨팅
- **Exactly-Once State**: 정확히 한 번 상태 보장(데이터의 중복, 유실 방지, 장애 복구 가능)
- **Out-of-Order Event Handling**: 순서가 뒤바뀐 이벤트가 들어오더라도 일관성 있는 결과 제공
- **Scale-Out Architecture**: 수 천대의 클러스터 환경으로 확장 가능

![](/images/flink_1.png)  
[**(Flink 공식문서 참고)**](https://flink.apache.org){:target="_blank"}  


# Use Cases
플링크는 스트림 처리뿐만 아니라 짧은 지연을 요구하는 다양한 어플리케이션에 사용될 수 있습니다.  

- **이벤트 기반 어플리케이션**
- **스트림 데이터 처리 및 분석 어플리케이션** 

## 이벤트 기반 아키텍처
이벤트 기반 어플리케이션은 이벤트 스트림을 입력으로 받아 특정 비즈니스 로직을 처리합니다. 비즈니스 로직에 따라 알람이나 이메일을 전송할 수도 있고, 다른 어플리케이션이 소비할 수 있도록 외부로 이벤트를 내보낼 수도 있습니다. 일반적으로 실시간 추천, 패턴 감지, 이상 탐지 SNS 웹 어플리케이션 등에 사용됩니다.  

이벤트 기반 아키텍처는 기존의 트랜잭션 처리 아키텍처와 다음과 같은 차이점이 있습니다.  

![](/images/flink_3.png)  

**트랜잭션 처리 아키텍처**  

- 컴퓨팅 계층과 데이터 스토리지 계층이 분리
- 원격(외부) 데이터베이스에서 데이터를 읽음
- REST 통신 방식으로 서로 연결

**이벤트 기반 아키텍처**  

- 로컬(메모리 내 또는 디스크 내) 데이터 액세스를 통한 빠른 처리량, 낮은 지연율 제공
- 원격 영구 스토리지에 정기적으로 체크포인트를 기록함으로써 내결함성 달성
- 이벤트 로그로 서로 연결함으로써 데이터 전송과 수신을 비동기화

이벤트 기반 아키텍처로 구현한 어플리케이션을 위해서는 정확히 한 번 수준의 상태 일관성과 수평 확장성을 요구하며 이벤트 시간 지원 여부, 상태 관리의 품질 등이 결정하게 됩니다. 플링크는 이 모든 기능을 포함하고 있기에 이벤트 기반 어플리케이션 구현을 위한 좋은 선택이 될 수 있습니다.  

## 스트림 데이터 처리 및 분석

스트림 데이터 처리 및 분석 어플리케이션이라고 해서 이벤트 기반 어플리케이션과 크게 다른 것은 아닙니다. 기본적으로 실시간으로 들어오는 스트림 이벤트 또는 데이터를 받으면 그에 맞게 저지연으로 동작하고 상태를 관리하고 결과를 내보내는 것이기 때문에 비슷한 개념입니다.  

이벤트 기반 어플리케이션이 어떤 비즈니스 로직을 처리한다면, 처리 및 분석 어플리케이션은 처리(Processing)나 분석(Analytics)을 한다는 차이만 있을 뿐입니다.  

~~(공식문서에서는 유스케이스를 이벤트 기반 어플리케이션, 데이터 파이프라인, 스트리밍 분석으로 나누어 구분하지만 이것들을 구분하는 것은 내가 느끼기에는 사소하고 괜히 구분지으려고 하는 것이 더 헷갈린다.)~~


# 결론  

결론은 플링크는 결국 실시간으로 발생하는 데이터 또는 이벤트를 **짧은 지연으로 비즈니스 로직으로 처리, 프로세싱, 분석**하기 위한 용도입니다.  

![](/images/flink_6.png)  


# 참고

- [Flink 공식문서: What is Apache Flink? — Applications](https://flink.apache.org/flink-applications.html){:target="_blank"}
- [Flink 공식문서: Stateful Stream Processing](https://nightlies.apache.org/flink/flink-docs-master/docs/concepts/stateful-stream-processing/){:target="_blank"}
- [High-throughput, low-latency, and exactly-once stream processing with Apache Flink](https://www.ververica.com/blog/high-throughput-low-latency-and-exactly-once-stream-processing-with-apache-flink){:target="_blank"}
- [What makes Flink provides low latnecy, Is Apache Flink the future of Real-time Streaming?](https://www.signifytechnology.com/blog/2019/01/is-apache-flink-the-future-of-real-time-streaming-by-anmol-sarna?source=google.co.kr){:target="_blank"}