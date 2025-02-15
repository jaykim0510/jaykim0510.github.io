---
layout: post
title:  'Statistics and Probability Series [Part7]: 베이지안 통계'
description: 
date:   2022-09-06 15:01:35 +0300
image:  '/images/probability_logo.jpeg'
logo_image:  '/images/probability_logo.jpeg'
category: data_analytics
tag: statistics
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- 우리는 중요한 회의가 있을 때, 교통 체증을 대비해 더 일찍 출발한다. 이러한 점으로 볼 때 우리는 불확실성을 다루는 방법에 타고난 감각을 가지고 있다
- 이런 불확실성을 수치화한다면 이를 바탕으로 조금 더 논리적인 의사결정을 할 수 있다
- 지금까지 앞에서 살펴본 내용은 빈도 통계학(frequentist statistics)을 기반으로 했다

# 빈도주의와 베이지안 주의

## 빈도주의

- 빈도주의는 연역적 사고에 기반한다
- 발생할 수 있는 모든 경우를 확률 변수에 매핑해 확률분포, 평균, 분산 등을 구한다

## 베이지안주의

- 베이지안주의는 귀납적 사고에 기반한다
- 내가 세운 가설에 대한 확률 P(H)를 정의하고, 이 후 관찰되는 데이터를 통해 가설에 대한 확률 P(HㅣD)를 업데이트 한다


# 베이지안 통계

- 데이터는 절대적이며, 가설은 데이터에 가까워지도록 업데이트 된다
- 베이즈 정리에서 알고 싶은 것은 P(H(가설)ㅣD(데이터)) 이다. 이를 사후확률 이라고 한다


## 사후확률 구하기

- 사후확률은 다음과 같은 방법으로 구한다

![](/images/statistics_51.png)












# A/B Test