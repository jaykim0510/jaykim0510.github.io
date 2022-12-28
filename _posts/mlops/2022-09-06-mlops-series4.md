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
- 그래서 위의 모든 요소들을 조합해 가장 높은 성능을 갖는 모델을 서빙하는 것이 머신러닝 팀의 목표이다

# MLflow

위와 같은 머신러닝 모델 개발의 전체 사이클을 원활하게 하기 위해 MLflow는 다음과 같은 요소들을 지원한다.  

![](/images/mlflow_1.png)

- Tracking: **실험 과정들을 기록**
- Projects: **어떤 환경에서든, 누구든 똑같은 실험을 다시 할 수 있도록 전체 코드를 패키징**
- Models: 다양한 환경에서 **모델을 배포**
- Registry: 팀원들이 편하게 **모델을 공유할 수 있는 저장소**

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Note
    </div>
    <div class="pen-content">
      모두 훌륭한 기능이지만, MLflow는 Artifact를 공유하는 Registry 용도로 가장 많이 사용된다. Tracking은 wandb로 많이 대체되는 편이다.
    </div>
</div>

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

- MLflow offers tools for tracking metrics, artifacts, and metadata.

- MLflow Tracking is an API-based tool for logging metrics, parameters, model versions, code versions, and files. MLflow Tracking is integrated with a UI for visualizing and managing artifacts, models, files, etc.  

- MLflow Tracking allows you to generate runs through MLflow’s Python, R, Java, and REST APIs. By default, the runs are stored in the directory where the code session is executed. However, MLflow also allows storing artifacts on a local or remote server.  

### Experiment와 Run

- 하나의 experiment는 여러개의 run을 가질수 있다  

- experiment: 기능 단위로 분리 (또는 모델)
  - `mlflow.create_experiment()`: 새로운 experiment 생성
  - `mlflow.set_experiment()`: 이미 존재하는 experiment를 active로 설정
  - `mlflow.get_experiment_by_name(exp_name)`: exp_name 이라는 이름의 experiment가 있는 지 검색해서 있으면 리턴

- run: 하이퍼 파라미터 단위로 분리
  - `mlflow.start_run(run_name=name)`: name라는 run을 생성해 학습 메트릭, 파라미터 등 관련 인자를 관리
  - `mlflow.end_run()`:  현재 실행되고있는 run을 종료

### Log

- MLflow에서는 자동 로깅을 권장한다

```py
# 파라미터, 아티팩트를 자동으로 로깅해준다
mlflow.sklearn.autolog()

# 파라미터 아티팩트, 메트릭, 태그까지 자동으로 로깅해준다
mlflow.autolog()
```

- 자기가 커스텀 하고 싶은 로깅에 대해서만 추가적으로 `log_param`, `log_metric을` 쓰도록 한다

```py
# 파라미터 로깅
mlflow.log_param("alpha", alpha)
mlflow.log_param("l1_ratio", l1_ratio)

# 메트릭 로깅
mlflow.log_metric("rmse", rmse)
mlflow.log_metric("r2", r2)
```

### 예제 코드

```py
import numpy as np
import pandas as pd
import mlflow
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


# 뭔가 커스텀 하고 싶은 메트릭 있을 때만 이렇게 정의 하면 된다. 없으면 autolog()
def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2

if __name__ == "__main__":

    data = pd.read_csv("http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv", sep=";")
    
    train, test = train_test_split(data)
    
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]

    lr = ElasticNet(random_state=42)

    mlflow.autolog()

    with mlflow.start_run() as run:
        
        lr.fit(train_x, train_y)
        predict = lr.predict(test_x)
```

- MLflow를 본격적으로 사용하기 전에 짚고 넘어갈 중요한 설정이 있다.
- `mlflow.set_tracking_uri()`
- 메트릭, 파라미터, 아티팩트와 같은 로그 정보를 어디에 저장할지에 관한 설정이다

```py
# 아무 설정도 하지 않는 경우
# mlruns/experiment id/run id/ 폴더에 artifacts, params, metrics 등이 저장된다

# 특정 폴더(ex. tracking)를 지정하는 경우
# tracking/experiment id/run id/ 폴더에 artifacts, params, metrics 등이 저장된다
mlflow.set_tracking_uri(f"{os.getcwd()}/tracking")

# DB를 지정하는 경우
# (먼저 빈 DB 생성: sqlite3 db.sqlite3 "VACUUM;")
# artifact는 mlruns에 저장, 나머지 params, metrics 등은 DB에 저장
mlflow.set_tracking_uri("sqlite:///db.sqlite3")

# localhost:8000 (웹서버)로 지정하는 경우
# 웹서버를 띄울 때 설정한대로 저장된다
# artifact는 AWS S3에 저장, params, metrics는 DB에 저장
mlflow.set_tracking_uri("localhost:8000")
mlflow server -h 0.0.0.0 -p 8000 --backend-store-uri sqlite:///db.sqlite3 --default-artifact-root s3://jay-ml-models
```

### 실제로 적용한 코드

```py
import pandas as pd
import mlflow
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import train_test_split


MODEL_NAME = "ElasticNet"
EXPERIMENT_NAME = f"recommand/{MODEL_NAME}"

RUN_ARGUMENTS = {"tags": {"model": "ElasticNet"}, "description": "this is second test"}

TRACKING_PATH = "http://localhost:8000"

mlflow.set_tracking_uri(TRACKING_PATH)

mlflow.set_experiment(EXPERIMENT_NAME)

if __name__ == "__main__":

    data = pd.read_csv("http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv", sep=";")
    
    train, test = train_test_split(data)
    
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]

    lr = ElasticNet(random_state=42)

    mlflow.autolog()

    with mlflow.start_run(**RUN_ARGUMENTS) as run:
        
        lr.fit(train_x, train_y)
        predict = lr.predict(test_x)

        mlflow.sklearn.log_model(sk_model=lr, artifact_path="model", registered_model_name=MODEL_NAME)
```

```
mlflow server -h 0.0.0.0 -p 8000 --backend-store-uri sqlite:///db.sqlite3 --default-artifact-root s3://jay-ml-models
```

![](/images/mlflow_10.png)

![](/images/mlflow_11.png)

![](/images/mlflow_12.png)

![](/images/mlflow_13.png)

- 이제 AWS S3를 이용해 우리의 모델을 포함한 artifact를 공유할 수 있게 되었다
- 여기까지가 Tracking과 Registry에 관한 내용이었다

## MLflow Models

### Model Loading

- 공유한 모델을 사용하는 방법은 간단하다

```py
import mlflow

model_path = 's3://jay-ml-models/1/006d75d20d9847a4af884bca40e2a66e/artifacts/model/'

loaded_model = mlflow.sklearn.load_model(model_path)

loaded_model.predict(data)
```

### Model Serving

- 저장된 모델을 간단하게 서빙할 수 있다

```sh
# 모델을 저장해둔 S3의 URI를 복사했다
# 나의 로컬서버 9999번으로 입력 데이터를 전달하면, inference 해준다
mlflow models serve -m s3://jay-ml-models/1/ee8b2fb611744d49a674603c120fc092/artifacts/model/ -p 9999
```

```sh
# 테스트 인풋

curl -X POST http://127.0.0.1:9999/invocations -H 'Content-Type: application/json' -d '{"dataframe_split": {"columns":["alcohol", "chlorides", "citric acid", "density", "fixed acidity", "free sulfur dioxide", "pH", "residual sugar", "sulphates", "total sulfur dioxide", "volatile acidity"],"data":[[12.8, 0.029, 0.48, 0.98, 6.2, 29, 3.33, 1.2, 0.39, 75, 0.66]]}}'
------------------------------------------------------------------------------------------------------------------------
{"predictions": [5.827915454317569]}%
```


## MLflow Project

- MLflow Project는 내가 **사용한 환경(ex. 도커, 파이썬, 아나콘다), 코드, 명령어** 등을 통째로 패키징함으로써,
- 다른 팀원들도 같은 실험을 돌려볼 수 있다.
- 환경, 코드 등과 같은 설정은 `MLProject` 라는 YAML 형태의 파일로 정의할 수 있다.


The key features for the implementation of the model are specified in the MLProject file. These include:  

- the input parameters that the model receives, 
- the data type of the parameters, 
- the command for executing the model, and 
- the environment in which the project runs. 

```
package_example
├── MLProject
├── python_env.yaml
├── load_model.py
└── requirements.txt
```

```yaml
# MLProject
name: tutorial
python_env: python_env.yaml

entry_points:
  main:
    command: "python3 load_model.py"
```

```py
# load_model.py
import mlflow
import pandas as pd
from sklearn.model_selection import train_test_split

model_path = 's3://jay-ml-models/1/006d75d20d9847a4af884bca40e2a66e/artifacts/model/'

loaded_model = mlflow.sklearn.load_model(model_path)


data = pd.read_csv("http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv", sep=";")

train, test = train_test_split(data)

test_x = test.drop(["quality"], axis=1)

input_x = test_x.head(3)
print(loaded_model.predict(input_x))
```

```yaml
# python_env.yaml
python: 3.8.13
build_dependencies:
- pip==22.3
- setuptools==56.0.0
- wheel
dependencies:
- -r requirements.txt
```

```sh
# requirements.txt
mlflow
cloudpickle==2.2.0
psutil==5.9.3
scikit-learn==1.1.2
typing-extensions==4.4.0
boto3
```

```sh
# mlflow run <MLProject가 포함된 폴더> -e <엔트리 포인트> -P <key>=<value>
mlflow run package_example -e main
ex. (mlflow run sklearn_logistic_regression -e main -P alpha=0.1 -P l1_ratio=0.5)
```

By default, a run like the one shown in the example will store the artifacts in the `.mlruns` directory.  




# 참고

- [MLflow Documentation](https://mlflow.org/docs/latest/index.html){:target="_blank"}
- [pajamacoder, [mlflow ] mlflow 소개와 사용 이유 (1/3)](https://pajamacoder.tistory.com/32){:target="_blank"}
- [KD nuggets, How to Package and Distribute Machine Learning Models with MLFlow](https://www.kdnuggets.com/2022/08/package-distribute-machine-learning-models-mlflow.html){:target="_blank"}
- [Petra KAFERLE DEVISSCHERE, MLflow tutorial: an open source Machine Learning (ML) platform](https://www.adaltas.com/en/2020/03/23/mlflow-open-source-ml-platform-tutorial/){:target="_blank"}
- [하나씩 점을 찍어 나가며, MLflow - MLflow Projects](https://dailyheumsi.tistory.com/263){:target="_blank"}
- [noodle.ai, Introduction to MLflow for MLOps Part 3: Database Tracking, Minio Artifact Storage, and Registry](https://blog.noodle.ai/introduction-to-mlflow-for-mlops-part-3-database-tracking-minio-artifact-storage-and-registry/){:target="_blank"}