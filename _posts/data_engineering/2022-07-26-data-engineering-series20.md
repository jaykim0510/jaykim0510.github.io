---
layout: post
title:  'Data Engineering Series [Part20]: 시스템 디자인(1) Intro + Architecture'
description: 
date:   2022-07-26 15:01:35 +0300
image:  '/images/system_design_logo.png'
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
# Intro

## High Level System Design

- **Overall architecture**: 확장성, 지연률 등 여러 성능에 관한 요구사항을 고려하며 시스템을 설계해야 한다
- **Components and services**: 어떤 시스템도 결국은 서비스들의 집합이고, 이러한 서비스들은 서로 상호 작용하게 된다. 이러한 시스템을 서비스들의 집합 관점 (ex. 마이크로서비스)에서 살펴보자
- **Interaction between the systems**: 서비스들간의 통신을 설계할 때 어떤 프로토콜을 사용할 것인지, 동기, 비동기중 어떤 방식으로 통신할 것인지 등을 시스템 요구사항에 맞게 설계해야 한다
- **Databases**: 서비스 요구사항에 맞는 데이터베이스를 선택해야 한다

## Low Level System Design (Code Quality)

- **API**: API를 잘 설계하자
- **Test Code**: 동작 코드 말고도, 테스트 코드를 작성해 점검하자
- **Modular**: 잘 모듈화하여 확장성을 높이자

# Application Architecture

## Monolithic Architecture

- 인터넷이 막 도입되었을 때에는 대부분의 서비스가 정적 컨텐츠를 제공하는 것이었다
- 유저를 위해 서비스의 흐름을 제어하는 방법이 복잡하지 않았기 때문에 보통 하나의 애플리케이션이 모든 역할을 담당했다
- 이 후 SNS, E-커머스, 온라인 게임 등의 등장으로 하나의 웹 서비스는 이전과 비교해 규모가 훨씬 크고 복잡해졌다
- 모든 기능을 제공하는 코드를 하나의 애플리케이션에 작성하는 것은 매우 복잡하고 기능을 확장하기가 힘들었다

![](/images/system_design_1.png)  

## Microservice Architecture

![](/images/system_design_2.png)

- 그래서 마이크로서비스 아키텍처는 하나의 서비스를 제공하기 위해 필요한 여러 가지 기능들을 세분화해서 설계하는 것이 목적이다
- 그리고 이렇게 세분화된 기능들은 서로 REST APIs 또는 RPC 통신을 통해 서로 상호 작용한다

**Benefits of Microservice Architecture**  

- 각각의 기능들은 서로 다른 언어로 개발할 수도 있고, 다른 데이터베이스를 사용할 수도 있다
- 각각의 역할에 해당하는 코드에만 집중하여 개발할 수 있다
- 배포, 테스트가 간편해진다
- 새로운 기능을 추가하는 것이 간단해진다
- 기능들을 서로 독립적으로 Scale-Up 할 수 있다 -> 다른 기능들의 동작에 영향을 주지 않으며, 자원 최적화도 된다

**Disadvantage of Microservice Architecture**  

- 보통 함수 호출이 API 호출보다 빠르다. 그래서 모놀리틱 구조가 더 빠를 수 밖에 없다. 하지만 대부분의 서비스에서는 이 차이를 유저가 느끼기 어렵다. ms 단위의 응답을 요구하는 서비스(ex. 게임, 실시간 분석)에서는 모놀리틱 구조가 좋을 수도 있다. 그리고 API 호출에는 네트워크적인 요소가 추가되기 때문에, 네트워크 장애도 고려해야 하고, 에러 핸들링이 조금 더 복잡하다
- 하나의 서비스에서 새로운 파라미터를 추가했고, 다른 서비스에서는 이에 맞게 변화되지 않았다면 에러가 발생하게 되는데, 문제는 이 에러가 컴파일 단계가 아니라 런타임 단계에서 발생한다는 것이다. 그래서 테스트 코드를 작성하는 것이 중요한 것이다
- 로그가 여러 서비스에서 분산 저장되면, 로그를 분석하기가 어렵다. 그래서 보통 로그를 하나의 통합된 장소에 저장하는게 낫다
