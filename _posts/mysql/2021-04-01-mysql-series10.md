---
layout: post
title:  'MySQL Series [Part10] 데이터베이스 모델링'
description: 
date:   2021-04-01 15:01:35 +0300
image:  '/images/sql_13.png'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 데이터베이스 모델링

데이터베이스에 데이터를 어떤 식으로 저장할지 계획하는 것은 굉장히 중요합니다. 데이터베이스를 제대로 설계하지 않으면 데이터 삽입, 업데이트, 삭제시 이상 문제가 생길 수 있습니다.  

```
삽입: 새로운 데이터를 자연스럽게 저장할 수 없는 문제 (ex. 유저테이블의 주소지 추가)
업데이트: 업데이트할 때 정확성을 지키기 어려워지는 문제
삭제: 원하는 데이터를 자연스럽게 삭제할 수 없는 문제
```

데이터베이스에 이런 이상 문제가 생기게 되면 새로운 데이터베이스로 데이터를 옮겨야 하는 상황이 발생하게 되고, 이런 문제는 비용적인 부담이 발생하는 일이기 때문에 최대한 사전에 방지하는 것이 좋습니다.  

데이터베이스 모델링은 크게 세 가지 단계로 구분할 수 있습니다.  

```
비즈니스 모델링: 비즈니스 룰을 정의한다 (ex. 유저는 하나의 주문에 하나의 리뷰만 달 수 있다)
논리적 모델링: 어떤 것을 테이블 하고, 컬럼으로 하고 테이블끼리 어떻게 관계를 지을지 정의한다
물리적 모델링: 테이블명, 컬럼명, 데이터 타입, 제약조건을 정의한다
```

# ERM: Entity Relationship Model

데이터베이스를 모델링할 때에는 기존의 익숙한 모델 구조인 관계형 모델(Relational Model) 보다는 개체 관계 모델(ERM)을 주로 사용합니다. ERM의 예시는 아래와 같습니다.  

![](/images/sql_13.png)

ERM은 기존 관계형 모델의 로우(Row)를 엔티티(Entity), 컬럼을 어트리뷰트(Attribute)로 표현하고 테이블간의 관계를 릴레이션쉽(Relationship)으로 나타냅니다.  

두 엔티티간의 관계를 정의하는 방법에는 다음과 같은 경우가 있습니다.

![](/images/sql_14.png)

예시는 다음과 같습니다.  

![](/images/sql_16.png)

# 데이터베이스 모델링 단계

데이터베이스를 모델링 하는 단계는 다음과 같습니다.  

```
1. 비즈니스 룰을 정한다
2. Entity, Attribute, Relationship이 될 수 있는 후보를 정한다
3. 비즈니스 룰을 통해 Entity간 관계를 파악한다
4. 정규화한다
5. 네이밍, 데이터 타입, 제약조건을 정한다
6. ERM으로 나타낸다
```

예시를 가지고 데이터베이스를 처음부터 간단하게 모델링 해보도록 하겠습니다.  

## 비즈니스 룰

## Entity, Attribute, Relationship 후보 파악

## Entity간 관계 파악

## 정규화

데이터베이스에서 데이터를 삽입/업데이트/삭제할 때 생길 수 있는 문제를 사전에 방지하기 위해 실시하는 작업  

```
1NF: 모든 컬럼 값은 나눌 수 없는 단일값이 되어야 한다
2NF: 1NF + 모든 non-prime attribute는 candidate key 전체에 함수 종속성이 있어야 한다
    (Non-prime attrbute중 2NF를 만족하지 않는 속성은 테이블에서 분리한다)
3NF: 2NF + 모든 attribute는 오직 primary key에 대해서만 함수 종속성을 가져야 한다
    (모든 attribute는 직접적으로 테이블 엔티티에 대한 내용이어야 한다)
    (이행적 함수종속성을 없애야 한다)
```

- 1NF
  - 어떤 채용 공고글에서 요구하는 스킬이 리스트 형태([MySQL, Python, Pytorch]로 되어 있으면 skiils를 새로운 테이블로 만들자
  ![](/images/sql_43.png)
  ![](/images/sql_42.png)
- 2NF
  - 함수 종족성: x, y 속성이 있을 때, y = f(x)라는 관계가 성립하는 경우
  - Candidate Key: 하나의 로우를 특정 지을 수 있는 속성(attribute)들의 최소 집합
  - Prime Attribute: Candidate Key에 포함되는 모든 속성
  ![](/images/sql_44.png)
  ![](/images/sql_45.png)

- 3NF
  - 모든 attribute는 직접적으로 테이블 엔티티에 대한 내용이어야 한다

## 물리적 모델링(네이밍, 데이터 타입, 제약조건)

## ERM으로 표현

