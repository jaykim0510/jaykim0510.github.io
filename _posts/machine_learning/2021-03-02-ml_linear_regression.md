---
layout: post
title:  'Machine Learning Series [Part2]: Linear Regression'
description: 
date:   2021-03-02 15:01:35 +0300
image:  '/images/ai_logo.jpeg'
logo_image:  '/images/ai_logo.jpeg'
categories: AI
tags: Machine_Learning
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Linear Regression

![](/images/ml_11.png)

- 선형회귀 모델의 목적은 연속형 변수를 예측하는데 있다
- 입력값 X와 타겟값 y가 서로 선형관계에 있다고 생각될 때 사용한다

![](/images/ml_9.png)

# Linear Model Consumption

- 선형회귀모델을 사용할 때는 몇 가지 가정을 한다 (이러한 가정이 실제로 들어맞지 않으면 성능이 낮다)

1. Linearity: 입력과 출력은 선형관계다
2. Independency: 입력의 특성들은 서로 독립이어야 한다
3. Normality: 출력 y에 존재하는 에러는 정규분포를 따른다 

## Linearity

- 선형회귀모델이 잘 들어 맞으려면 당연히 입력과 출력이 선형관계여야 한다
- 입력변수와 파라미터가 서로 곱해지고 더해진 관계 (입력변수가 제곱되거나 하면 선형 모델이 아님)
- 입력변수와 출력 변수의 산점도를 그려보고, 상관계수를 구해보면 선형 관계를 확인할 수 있다

## Independency

- 특정 입력 변수가 다른 입력 변수에 종속된다면 올바른 파라미터를 구할 수 없다
- 공분산 행렬을 통해 확인할 수 있다

## Normality

- 우리가 모델링하고자 하는 값은 실제 현상에서 대부분 오차를 가지고 있다
- (버스 일정표에 버스가 30분 도착이라고 해도 매번 조금씩 더 빠르거나 늦게 도착한다)
- 수학자들은 실제 현상에서 일어나는 대부분의 오차가 정규 분포를 따른다고 증명했다
- 그래서 만약 우리가 모델을 정확히 예측했다면 잔차(모델의 예측값 - 실제값) 는 정규분포를 따를 것이다
- QQ-plot을 이용하면 잔차가 정규분포에 얼마나 가까운지 확인할 수 있다

![](/images/ml_10.png)

# Algorithm
- 결국 우리의 목표는 실제 데이터를 가장 잘 대표하는 직선의 기울기와 절편을 구하는 것이다
- 기울기와 절편이 곧 우리 모델의 파라미터를 의미한다

## Cost Function

![](/images/ml_12.png)

- 실제 y와의 차이를 최소로 하는 모델의 파라미터를 찾자
- MSE를 최소화하는 것이 목표
- MSE는 convex function이다. 그리고 convex function은 글로벌 해가 존재한다

- convex function의 최적해를 찾는 방법은 3가지가 있다

![](/images/ml_13.png)


## Metric

![](/images/ml_14.png)

- Metric은 훈련 데이터셋과 검증 데이터셋 둘 다 확인한다
- 훈련 데이터셋에 대한 점수가 좋아지더라도, **검증 데이터셋에 대한 점수가 나빠진다면 이는 과대적합되었다는 의미다**

# Regularization

- 모델이 주어진 데이터에 너무 오버피팅 되면 일반화 성능이 떨어진다
- 머신러닝의 주요 목표 중 하나는 **본 적 없는 데이터에 대한 예측을 잘 하는 것**이다
- 오버피팅 되었는지 판단하는 방법은 검증 데이터셋의 성능을 확인하는 것이다

![](/images/ml_15.png)

- 오버피팅을 해결하는 방법은 다음과 같은 것들이 있다

![](/images/ml_16.png)


# Statistical Model Analysis

- 학습시킨 모델을 테스트 데이터로 성능을 확인할 수도 있지만, 그 전에 통계적인 값으로 모델을 평가해 볼 수도 있다

## R-squared

- R<sup>2</sup>는 0과 1사이의 값으로, 1에 가까울수록 주어진 변수 X로 y를 잘 설명할 수 있음을 의미한다
- 이를 통해 사용하고 있는 입력 변수 X의 품질을 측정할 수 있다

## p-value

- 각각의 입력 변수에 해당하는 계수를 F-검정을 통해 p-value를 얻을 수 있다
- 계수의 p-value가 낮을수록 계수의 값이 유의미함을 뜻한다

# Polynomial Regression

![](/images/ml_17.png)