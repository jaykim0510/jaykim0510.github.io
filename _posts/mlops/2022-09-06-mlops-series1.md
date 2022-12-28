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
- 모델 공유: MLflow
- 서빙: FastAPI, BentoML
- 모니터링: Grafana
- 자동화: kubeflow

# 참고

- [tecton, Why We Need DevOps for ML Data](https://www.tecton.ai/blog/devops-ml-data/?__hstc=145182251.a6226b731366ba276c4a4a107187f8d0.1669033771134.1669033771134.1669033771134.1&__hssc=145182251.5.1669033771134&__hsfp=4038990400){:target="_blank"}
- [커피고래가 생각하는 MLOps](https://coffeewhale.com/what-is-mlops){:target="_blank"}