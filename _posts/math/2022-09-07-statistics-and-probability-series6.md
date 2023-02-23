---
layout: post
title:  '통계를 이용한 데이터 분석 [Part1]: Intro'
description: 
date:   2022-09-07 15:01:35 +0300
image:  '/images/probability_logo.jpeg'
logo_image:  '/images/probability_logo.jpeg'
categories: Math
tags: Statistics
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 통계를 배우는 이유

데이터를 분석함에 있어 통계적 지식이 필요한 이유는 무엇일까?  

우리가 통계를 배우는 이유는,  

1. 데이터를 수치적으로 요약할 수 있다
2. 주어진 데이터를 이용해 미래를 수학적으로 예측할 수 있다

통계가 주는 이점은 우리가 데이터를 분석하는 이유와 잘 맞아떨어진다.  

우리가 데이터를 분석하는,

1. 이용자들에게 데이터를 수치, 시각적으로 요약해 정보를 제공한다
2. 이용자들의 데이터를 통해 기호에 맞는 상품을 추천한다
3. 미래의 주가를 예측해 이용자에게 더 나은 선택을 유도한다


# 통계적 분석 과정 

그럼 우리는 어떤 과정을 통해 통계적 분석을 진행 할 수 있을까?  

1. DDA
2. EDA
3. CDA
4. PDA

## DDA(Descriptive Data Analysis)

- 무슨 일이 생겼는지 알아보는 단계
- 기술 통계에서 봤던 Central tendency, Dispersion, Distribution 을 확인한다

## EDA(Exploratory  Data Analysis)

- 무슨 이유로 생겼는지 알아보는 단계
- 어떤 일이 발생한 원인을 파악
- 변수간 상관관계를 파악
- 데이터를 탐색하고 논리적으로 가설을 세우고 가설을 검정할 수 있도록 데이터를 가공


## CDA(Confirmatory Data Analysis)

- 알아본 이유에 대해 가설을 세우고 검정해보는 단계
- t검정, 분산분석(ANOVA) 등이 있다

```
가설 예시

- 비즈니스 의사결정
    - A 가격보다 B 가격으로 했을 때 매출이 더 올랐다
    - A, B, C, D 화면중에서 A 화면일 때 사용자들의 클릭률이 가장 높았다

- 피처 엔지니어링
    - 변수 A가 타겟 T에 영향을 준다
    - 변수 A의 Null 값은 의미가 없다

```

## PDA(Predictive  Data Analysis)

- 검정 결과에 기반해 행동하는 단계
- ex. 비즈니스 의사결정을 내린다
- ex. 피처 엔지니어링을 파이프라인화하고 데이터를 모델링한다
- ex. 머신러닝을 모델링 한다
