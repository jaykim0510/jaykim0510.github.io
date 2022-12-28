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


# What is Feast

![](/images/feast_3.png)

> Feast standardize the definition, storage and access of features for training and serving. It acts as a bridge between data engineering and machine learning.

머신러닝 시스템을 운영하게 되면 피처 데이터를 모델을 훈련시키고 프로덕션 환경에서 서비스하기 위해 여러 팀에서 사용하게 된다. 그렇기 때문에 피처 데이터는 일관적으로 유지되어야 한다. 이를 위해 구글에서는 Feast라는 피처 저장소를 오픈 소스로 발표했다.  

Feast는 피처를 정의하고 일관되게 유지시켜주는 통합된 저장소로, 결과적으로 여러 팀 그리고 프로젝트에서 재사용 가능하도록 해준다.  

# Feature Store의 핵심 구성 요소

![](/images/feast.png)

- digest: 여러 데이터 소스에서 데이터를 읽어올 수 있어야함
- definition: feature를 정의할 수 있어야함
- offline: 모델 훈련을 위해 적절한 feature를 제공할 수 있어야함
- online: 추론을 위해 낮은 지연률로 feature를 제공할 수 있어야함

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Feature Store
    </div>
    <div class="pen-content">
      <li>Feast, Hopsworks, Tecton, Rasgo, etc</li>
      <li>AWS의 Sagemaker, GCP의 Vertex AI</li>
    </div>
</div>


# Why Feast

- Discoverability and reuse of features: A centralized feature store allows organizations to build up a foundation of features that can be reused across projects. Teams are then able to utilize features developed by other teams, and as more features are added to the store it becomes easier and cheaper to build models.

- Access to features for training: Feast allows users to easily access historical feature data. This allows users to produce datasets of features for use in training models. ML practitioners can then focus more on modelling and less on feature engineering.

- Access to features in serving: Feature data is also available to models in production through a feature serving API. The serving API has been designed to provide low latency access to the latest feature values.

- Consistency between training and serving: Feast provides consistency by managing and unifying the ingestion of data from batch and streaming sources, using Apache Beam, into both the feature warehouse and feature serving stores. Users can query features in the warehouse and the serving API using the same set of feature identifiers.

- Standardization of features: Teams are able to capture documentation, metadata and metrics about features. This allows teams to communicate clearly about features, test features data, and determine if a feature is useful for a particular model.


<div class="fire-para">
    <div class="fire-bar"><i class="fas fa-question"></i>Is Feast a database?</div>
    <div class="fire-content">No. Feast is a tool that manages data stored in other systems (e.g. BigQuery, Cloud Firestore, Redshift, DynamoDB). It is not a database, but it helps manage data stored in other systems.</div>
</div>

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-question"></i>When do we need Feature Store?
    </div>
    <div class="pen-content">
      <li>We don't need Feast when all of our data points are independent, stateless, from client-side and there is no entity that has changing features over time</li>
      <li>We need Feast when we need to have up-to-date features for an entity that we continually generate predictions for. For example, a user's behavior (clicks, purchases, etc.) on an e-commerce platform or the deliveries a food runner recently made in the last hour, etc</li>
    </div>
</div>


# Feast 실습

![](/images/feast_2.png)

## Initialization

```sh
pip install feast
```

```sh
feast init --minimal --template local feast_project
------------------------------------------------------------------------
Creating a new Feast repository in /Users/peter/feast_project.
```

```
mkdir -p ~/feast_project/store

touch ~/feast_project/feature_repo/features.py
```

```sh
feast_project
├── feature_repo
│   └── feature_store.yaml # configuration
│   └── features.py # feature definitions
└── store
```

We're going to configure the locations for our registry and online store (SQLite) in our `feature_store.yaml` file.  

- registry: contains information about our feature repository, such as data sources, feature views, etc. Since it's in a DB, instead of a Python file, it can very quickly be accessed in production.
- online store: DB (SQLite for local) that stores the (latest) features for defined entities to be used for online inference.

If all our feature definitions look valid, Feast will sync the metadata about Feast objects to the registry. The registry is a tiny database storing most of the same information you have in the feature repository. This step is necessary because the production feature serving infrastructure won't be able to access Python files in the feature repository at run time, but it will be able to efficiently and securely read the feature definitions from the registry.  

```yaml
# feature_store.yaml

project: feature_project
registry: ../store/registry.db
provider: local
online_store:
    path: ../store/online_store.db

```

## Data Ingestion

The first step is to establish connections with our data sources (databases, data warehouse, etc.). Feast requires it's data sources to either come from a file (Parquet), data warehouse (BigQuery) or data stream (Kafka / Kinesis).  

여기서는 DataOps에서 `.parquet` 파일의 형태로 feature를 제공한다고 하겠습니다.  

## Feature Definition

```py
# features.py

from datetime import datetime
from pathlib import Path
from feast import Entity, Feature, FeatureView, ValueType
from feast.data_source import FileSource
from google.protobuf.duration_pb2 import Duration

# Read data
# (feature 데이터 읽어오기)
START_TIME = "2020-02-17"
project_details = FileSource(
    path=str(Path(DATA_DIR, "features.parquet")),
    event_timestamp_column="created_on",
)

# Define an entity
# (데이터를 고유하게 식별할 수 있는 컬럼)
project = Entity(
    name="id",
    value_type=ValueType.INT64,
    description="project id",
)

# Define a Feature View for each project
# (읽어온 feature 데이터를 뷰로 만든다 => 특정 컬럼, 특정 시간대)
project_details_view = FeatureView(
    name="project_details",
    entities=["id"],
    ttl=Duration(
        seconds=(datetime.today() - datetime.strptime(START_TIME, "%Y-%m-%d")).days * 24 * 60 * 60
    ),
    features=[
        Feature(name="text", dtype=ValueType.STRING),
        Feature(name="tag", dtype=ValueType.STRING),
    ],
    online=True,
    input=project_details, #
    tags={},
)

```

Once we've defined our feature views, we can apply it to push a version controlled definition of our features to the registry for fast access. It will also configure our registry and online stores that we've defined in our `feature_store.yaml`.  

Feature View는 실제 데이터를 저장하는건 아니고, 어떤 메타 정보를 저장하고 있는 것이다. 실제 데이터는 로컬에 저장되어 있는 `features.parquet`이다.  

실무에서는 이런 방법보다는 Bigquery와 같은 저장소에 저장되어 있는 데이터가 더 일반적이다.  

```sh
feast apply
------------------------------------------------------------
Registered entity id
Registered feature view project_details
Deploying infrastructure for project_details
```

## Historical features

이제 ML팀에서는 등록된 뷰를 이용해 모델을 훈련시킬 수 있다.  

```py
# ex. train.py

import pandas as pd
from feast import FeatureStore


# Identify entities
project_ids = df.id[0:3].to_list()
now = datetime.now()
timestamps = [datetime(now.year, now.month, now.day)]*len(project_ids)
entity_df = pd.DataFrame.from_dict({"id": project_ids, "event_timestamp": timestamps})
entity_df.head()

------------------------
id	event_timestamp
0	6	2022-06-23
1	7	2022-06-23
2	9	2022-06-23
------------------------

# Get historical features
store = FeatureStore(repo_path="features")
training_df = store.get_historical_features(
    entity_df=entity_df,
    feature_refs=["project_details:text", "project_details:tag"],
).to_df()
training_df.head()

------------------------------------------------------------------------------------------------
        event_timestamp                  id       project_details__text                           project_details__tag
0	2022-06-23 00:00:00+00:00	6	Comparison between YOLO and RCNN on real world...	computer-vision
1	2022-06-23 00:00:00+00:00	7	Show, Infer & Tell: Contextual Inference for C...	computer-vision
2	2022-06-23 00:00:00+00:00	9	Awesome Graph Classification A collection of i...	graph-learning
------------------------------------------------------------------------------------------------

```

## Materialize

For online inference, we want to retrieve features very quickly via our online store. However, the features are not in our online store just yet, so we'll need to materialize them first.

```sh
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S")
feast materialize-incremental $CURRENT_TIME
------------------------------------------------------------------------------------------------
Materializing 1 feature views to 2022-06-23 19:16:05+00:00 into the sqlite online store.
project_details from 2020-02-17 19:16:06+00:00 to 2022-06-23 19:16:05+00:00:
100%|██████████████████████████████████████████████████████████| 955/955 [00:00<00:00, 10596.97it/s]
```

This has moved the features for all of our projects into the online store since this was first time materializing to the online store. When we subsequently run the `materialize-incremental` command, Feast keeps track of previous materializations and so we'll only materialize the new data since the last attempt.

(처음 명령어를 실행하면, 전체 feature 데이터를 온라인 저장소로 모두 옮긴다. 이 후에는 명령어를 실행할 때마다 마지막 회수된 데이터 이 후의 데이터만 가져온다)  

(Note that they may not be the most recent feature values for that entity.)  

## Online Features

Once we've materialized the features (or directly sent to the online store in the stream scenario), we can use the online store to retrieve features.  

(위와 같이 오프라인 저장소에서 materialized된 데이터를 inference에 이용할 수도 있고, 스트림 프로세싱에서 읽어온 데이터를 inference에 이용할 수도 있다)  

```py
# Get online features
store = FeatureStore(repo_path="features")
feature_vector = store.get_online_features(
    feature_refs=["project_details:text", "project_details:tag"],
    entity_rows=[{"id": 6}],
).to_dict()

feature_vector
------------------------------------------------------------------------------------------------
{'id': [6],
 'project_details__tag': ['computer-vision'],
 'project_details__text': ['Comparison between YOLO and RCNN on real world videos Bringing theory to experiment is cool. We can easily train models in colab and find the results in minutes.']}

```

# 참고

- [Feast.dev](https://feast.dev/){:target="_blank"}
- [Feast, What is a Feature Store?](https://feast.dev/blog/what-is-a-feature-store/){:target="_blank"}
- [Feast Python API Documentation](https://rtd.feast.dev/en/master/#)
- [Youtube Prodramp, An AI Engineer technical guide to Feature Store with FEAST](https://www.youtube.com/watch?v=p2cuq4eJ2BY&list=LL&index=4&t=561s){:target="_blank"}
- [Compare, find and choose the best feature store](https://www.featurestorecomparison.com/){:target="_blank"}
- [[패스트캠퍼스 챌린지 47일차] GCP - Feast Feature Store (1)](https://hotorch.tistory.com/m/192){:target="_blank"}
- [Feature Store - why?](https://velog.io/@hsh/Feature-Store-why){:target="_blank"}
- [zzsza, Machine Learning의 Feature Store란?](https://zzsza.github.io/mlops/2020/02/02/feature-store/){:target="_blank"}
- [Google cloud, Introducing Feast: an open source feature store for machine learning](https://cloud.google.com/blog/products/ai-machine-learning/introducing-feast-an-open-source-feature-store-for-machine-learning?hl=en){:target="_blank"}
- [madewithml, Feature Store](https://madewithml.com/courses/mlops/feature-store/){:target="_blank"}