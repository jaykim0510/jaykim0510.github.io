---
layout: post
title:  'MLOps Series [Part3]: Feast'
description: 
date:   2022-09-06 15:01:35 +0300
image:  '/images/mlops_logo.png'
logo_image:  '/images/mlops_logo.png'
categories: data_engineering
tags: MLOps
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# 언제 Feature Store가 필요한가

- 필요 없는 경우
  -  All of our data points are independent, stateless, from client-side and there is no entity that has changing features over time
- 필요한 경우
  - when we need to have up-to-date features for an entity that we continually generate predictions for. For example, a user's behavior (clicks, purchases, etc.) on an e-commerce platform or the deliveries a food runner recently made in the last hour, etc

# Feature Store의 핵심 구성 요소

- digest: 여러 데이터 소스에서 데이터를 읽어올 수 있어야함
- definition: feature를 정의할 수 있어야함
- offline: 모델 훈련을 위해 적절한 feature를 제공할 수 있어야함
- online: 추론을 위해 낮은 지연률로 feature를 제공할 수 있어야함

# Feature Store

- Feast, Hopsworks, Tecton, Rasgo, etc
- AWS의 Sagemaker, GCP의 Vertex AI

# What is Feast

# Why Feast

- Online store를 통해 실시간 예측을 위한 과정을 자동화해준다
- 모델을 훈련할 때 사용하는 데이터와 추론할 때 사용하는 데이터간의 일관성을 지켜준다

```
- Is Feast a database?: No. Feast is a tool that manages data stored in other systems (e.g. BigQuery, Cloud Firestore, Redshift, DynamoDB). It is not a database, but it helps manage data stored in other systems.

- 
```


<div class="fire-para">
    <div class="fire-bar"><i class="fas fa-fire"></i> Popular tools</div>
    <div class="fire-content">Popular data ingestion tools include Fivetran, Airbyte, Stitch, etc.</div>
</div>

<div class="pen-para">
    <div class="pen-bar"><i class="fas fa-pen"></i> Popular tools</div>
    <div class="pen-content">Popular data ingestion tools include Fivetran, Airbyte, Stitch, etc.</div>
</div>

# 참고

- [Feast.dev](https://feast.dev/){:target="_blank"}
- [Feast, What is a Feature Store?](https://feast.dev/blog/what-is-a-feature-store/){:target="_blank"}
- [Feast Python API Documentation](https://rtd.feast.dev/en/master/#)
- [Youtube Prodramp, An AI Engineer technical guide to Feature Store with FEAST](https://www.youtube.com/watch?v=p2cuq4eJ2BY&list=LL&index=4&t=561s){:target="_blank"}
