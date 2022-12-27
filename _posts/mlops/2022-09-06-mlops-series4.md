---
layout: post
title:  'MLOps Series [Part4]: MLflow'
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

<p style="text-align: center;"><span style="margin-right: 10px;"><a href="https://naver.com"><img src="https://img.shields.io/static/v1?label=&message=View%20On%20GitHub&color=586069&logo=github&labelColor=2f363d"></a></span> <span><a href="https://naver.com"><img src="https://colab.research.google.com/assets/colab-badge.svg"></a></span></p>


# Intuition

- 머신러닝 모델을 개발할 때는 일련의 프로세스가 있다.
- 데이터 로드 - 모델 선택 - 모델 학습 - 모델 평가 - 모델 서빙
- 어떤 데이터, 어떤 모델, 어떻게 학습, 어떻게 평가하는지에 따라 서빙 단계에서의 모델 성능은 달라지게 된다
- 그래서 위의 모든 요소들이 가질 수 있는 요소들을 조합해 가장 최적의 성능을 보여주는 모델을 서빙하는 것이 머신러닝 팀의 목표이다

# MLflow

위와 같은 머신러닝 모델 개발의 전체 사이클을 원활하게 하기 위해 MLflow는 다음과 같은 요소들을 지원한다.  

![](/images/mlflow_1.png)

- Tracking: **실험 과정들을 기록**
- Projects: **어떤 환경에서든, 누구든 똑같은 실험을 다시 할 수 있도록 전체 코드를 패키징**
- Models: **모델을 배포**할 수 있게 패키징
- Registry: 팀원들이 편하게 **모델을 공유할 수 있는 저장소**

MLflow enables Data Scientists to easily track the progress during the model development and tuning. It takes care of the packaging and deployment of models, no matter which framework or programming language was used to create it. In addition, MLflow provides a registry, where the models we want to keep or share can be safely stored and readily accessible  

We can run MLflow on our own servers and databases so there are no storage cost / limitations, making it one of the most popular options and is used by Microsoft, Facebook, Databricks and others. You can also set up your own Tracking servers to synchronize runs amongst multiple team members collaborating on the same task.  

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Other tools
    </div>
    <div class="pen-content">
      <li>Weights and Biases: Tracking에 특화된 툴</li>
      <li>BentoML: Serving에 특화된 툴</li>
    </div>
</div>


# MLflow 실습

## Initialization

```
pip install mlflow
```

```
mkdir mlflow_project
```

## MLflow Tracking

- offers tools for tracking metrics, artifacts, and metadata.

MLflow Tracking is an API-based tool for logging metrics, parameters, model versions, code versions, and files. MLflow Tracking is integrated with a UI for visualizing and managing artifacts, models, files, etc.  

Each MLflow Tracking session is organized and managed under the concept of runs. A run refers to the execution of code where the artifact log is performed explicitly.  

MLflow Tracking allows you to generate runs through MLflow’s Python, R, Java, and REST APIs. By default, the runs are stored in the directory where the code session is executed. However, MLflow also allows storing artifacts on a local or remote server.  

### Experiment와 Run

- 하나의 experiment는 여러개의 run을 가질수 있다  

- experiment: 기능 단위로 분리 (또는 모델)
  - mlflow.create_experiment(): 새로운 experiment 생성
  - mlflow.set_experiment(): 이미 존재하는 experiment를 active로 설정
  - mlflow.get_experiment_by_name(exp_name): exp_name 이라는 이름의 experiment가 있는 지 검색해서 있으면 리턴

- run: 하이퍼 파라미터 단위로 분리
  - mlflow.start_run(run_name=name): name라는 run을 생성해 학습 메트릭, 파라미터 등 관련 인자를 관리
  - mlflow.end_run():  현재 실행되고있는 run을 종료

### Log

- log_metric
- log_param
- log_model

## MLflow Project

- It also provides standard formats for packaging, distributing, and deploying models and projects. 

MLflow Projects provides a standard format for packaging, sharing, and reusing machine learning projects. Each project can be a remote repository or a local directory. Unlike MLflow Models, MLflow Projects aims at the portability and distribution of machine learning projects.  

An MLflow Project is defined by a YAML manifest called `MLProject`, where the project’s specifications are exposed.  

The key features for the implementation of the model are specified in the MLProject file. These include:  

- the input parameters that the model receives, 
- the data type of the parameters, 
- the command for executing the model, and 
- the environment in which the project runs. 

```
sklearn_logistic_regression
├── MLproject
├── conda.yaml
└── train.py
```

```yaml
# MLProject

name: tutorial
conda_env: conda.yaml
# python_env:

entry_points:
  main:
    parameters:
      alpha: {type: float, default: 0.5}
      l1_ratio: {type: float, default: 0.1}
    command: "python train.py {alpha} {l1_ratio}"
```

Likewise, MLflow provides a CLI to run projects located on a local server or a remote repository. The following code snippet shows an example of how a project is run from a local server or a remote repository:  

```sh
$ mlflow run sklearn_logistic_regression -e main -P alpha=0.1 -P l1_ratio=0.5
```

In both examples, the environment will be generated based on the `MLProject file` specification. The command that triggers the model will be executed under the arguments passed on the command line. Since the model allows input parameters, these are assigned through the `-P` flag. In both examples, the model parameter refers to the maximum depth of the decision tree.  

By default, a run like the one shown in the example will store the artifacts in the `.mlruns` directory.  

```sh
docker
├── Dockerfile
├── MLproject
├── train.py
└── wine-quality.csv
```

```dockerfile
# Dockerfile

FROM python:3.8.8-slim-buster

RUN pip install mlflow>=1.0 \
    && pip install numpy \
    && pip install pandas \
    && pip install scikit-learn
```

```yaml
# MLproject

name: docker-example

docker_env:
  image:  mlflow-docker-example

entry_points:
  main:
    parameters:
      alpha: float
      l1_ratio: {type: float, default: 0.1}
    command: "python train.py --alpha {alpha} --l1-ratio {l1_ratio}"
```

## Model loading

```py
import mlflow

model_path = 's3://jay-ml-models/1/006d75d20d9847a4af884bca40e2a66e/artifacts/model/'

loaded_model = mlflow.sklearn.load_model(model_path)

loaded_model.predict(data)
```

# 참고

- [MLflow Documentation](https://mlflow.org/docs/latest/index.html){:target="_blank"}
- [pajamacoder, [mlflow ] mlflow 소개와 사용 이유 (1/3)](https://pajamacoder.tistory.com/32){:target="_blank"}
- [KD nuggets, How to Package and Distribute Machine Learning Models with MLFlow](https://www.kdnuggets.com/2022/08/package-distribute-machine-learning-models-mlflow.html){:target="_blank"}
- [Petra KAFERLE DEVISSCHERE, MLflow tutorial: an open source Machine Learning (ML) platform](https://www.adaltas.com/en/2020/03/23/mlflow-open-source-ml-platform-tutorial/){:target="_blank"}
- [하나씩 점을 찍어 나가며, MLflow - MLflow Projects](https://dailyheumsi.tistory.com/263){:target="_blank"}
- [noodle.ai, Introduction to MLflow for MLOps Part 3: Database Tracking, Minio Artifact Storage, and Registry](https://blog.noodle.ai/introduction-to-mlflow-for-mlops-part-3-database-tracking-minio-artifact-storage-and-registry/){:target="_blank"}