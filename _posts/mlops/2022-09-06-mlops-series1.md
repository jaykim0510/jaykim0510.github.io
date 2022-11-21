---
layout: post
title:  'MLOps Series [Part1]: Intro'
description: 
date:   2022-09-06 15:01:35 +0300
image:  '/images/mlops_1.png'
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


![](/images/mlops_1.png)

# MLOps

- 모델 중심이 아닌 데이터가 중심이 되는 AI 시대가 오고 있다
- 체계적인 데이터 관리가 중요하다
- MLOps(ML + Operation))
  - 머신러닝 운영에 필요한 일을 일컫는 말
  - Feature extraction - Model Train - Versioning - Serving - Monitoring
- (참고, Feature engineering = Feature extraction + Feature store)

# 대표적인 기술 스택

- ML 파이프라인: scikit-learn, pyspark
- 피처 저장소: Feast
- 데이터 버저닝: dvc
- 모델 버저닝: MLflow
- 서빙: FastAPI, django
- 모니터링: Grafana
- 자동화: kubeflow

# 참고
