---
layout: post
title: 'Airflow Series [Part1]: What is Airflow'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/airflow_logo.png'
logo_image: '/images/airflow_logo.png'
category: data_engineering
tag: airflow
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

```
DAGs, Operators, Tasks, Sensors, Executor, Scheduler
```

# Airflow란?

- 2014년 에어비앤비(Airbnb)에서 시작되어, 현재 아파치(Apache) 재단 탑레벨 프로젝트
- Airflow는 Python 코드로 워크플로우(workflow)를 작성하고, 스케줄링, 모니터링 하는 플랫폼
- Airflow를 통해서 데이터엔지니어링의 ETL 작업을 자동화하고, DAG(Directed Acyclic Graph) 형태의 워크플로우 작성이 가능
- AWS, GCP 모두 Airflow managed service를 제공할 정도로 널리 사용

![](/images/airflow_2.png)

# Airflow 배경

- 개인, 기업을 넘어 공공기관까지 일상적 비즈니스의 일부로 데이터 파이프라인을 도입하고 있다
- Airflow는 데이터 파이프라인중 배치 태스크에 중심을 둔 **Batch-Oriented Framework** 이다

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Airflow가 적합하지 않은 경우
    </div>
    <div class="pen-content">
      <li>스트리밍 워크플로</li>
      <li>추가 및 삭제 태스크가 빈번한 동적 파이프라인</li>
    </div>
</div>

# Airflow 구조

![](/images/airflow_1.png)

- Scheduler:
  - DAG Directory에 저장된 DAG(=workflow)를 트리거
  - DAG에 저장된 태스크를 인스턴스화하여 Executer에게 전달
- Executer:
  - 전달받은 태스크를 Worker에게 전달
- Worker:
  - 태스크를 실행
- Web Server:
  - User Interface를 통해 접근해 쉽게 Airflow를 동작시키기 위한 웹서버
- DAG Directory:
  - 한 개 이상의 DAG를 정의해놓은 디렉터리
- Metadata DB:
  - DAG 저장
  - 태스크 결과 저장
- airflow.cfg: 
  - Airflow 설정값을 포함하는 파일

# Airflow 동작원리

![](/images/airflow_3.png)

1. 유저가 DAG로 워크플로 작성
2. 유저가 정의한 DAG는 DAG Directory에 저장
3. Scheduler는 DAG Directory의 모든 DAG를 확인하고 파싱, 태스크를 대기열에 추가  
    - 3-1. 파일로부터 DAG를 확인 (태스크, 의존성, 스케줄 주기)   
    - 3-2. 예약된 시간이 지난 태스크의 의존성을 확인하고, 이전 태스크가 모두 해결되었으면 대기열에 추가  
4. Worker는 예약된 태스크를 실행하고 그 결과를 Metadata DB에 저장
5. 저장된 태스크 결과를 Web Server가 읽어감


# DAG

- DAG(Directed Acyclic Graph): 워크플로우를 파이썬 언어로 코드화한 것
- Airflow의 핵심은 DAG를 잘 작성하는 것
- DAG는 크게 DAG 선언, Operator, Sensor, Operator간 의존성 주입


<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>DAG가 절차적 스크립트 파이프라인과 다른 점
    </div>
    <div class="pen-content">
      <li>DAG는 독립적인 태스크의 경우 병렬로 실행할 수 있다</li>
      <li>DAG는 중간 태스크가 실패했을 때, 실패한 부분부터 다시 시작할 수 있다</li>
    </div>
</div>

```python
with DAG("my-dag") as dag:
    ping = SimpleHttpOperator(endpoint="http://example.com/update/")
    email = EmailOperator(to="admin@example.com", subject="Update complete")

    ping >> email
```

## Operators

- DAG에 작업(Task)을 템플릿 형태로 미리 정의해둔 것 (Operator, Sensor를 클래스, Task를 객체로 생각할 수 있음)
- 에어플로우 설치시 함께 제공되는 built-in Operator와, 필요할 때 별도로 설치 가능한 Operator가 있음

```
# built-in

BashOperator: 쉘 커맨드 실행
PythonOperator: 파이썬 함수 호출
EmailOperator: 이메일 전송
```

```
# providers

SimpleHttpOperator: HTTP 메세지 전송
MySqlOperator: SQL문 실행
PostgresOperator
JdbcOperator
DockerOperator
HiveOperator
S3FileTransformOperator
PrestoToMySqlOperator
SlackAPIOperator
```

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>오퍼레이터와 태스크의 차이점
    </div>
    <div class="pen-content">
      <li>Airflow 문서 전반에 걸쳐 오퍼레이터와 태스크를 같은 의미로 사용</li>
      <li>사용자는 오퍼레이터 작성에 집중</li>
      <li>Airflow는 오퍼레이터의 올바른 실행을 보장하기 위해 태스크로 래핑(wrapping)</li>
    </div>
</div>

## Sensors

- Operator의 특별한 타입
- 특정 이벤트가 일어나길 기다렸다가, 발생하면 다음 태스크를 진행
- 기다리는 이벤트가 단순히 시간 기반일 수도 있고, 아니면 어떤 파일이 될 수도 있음

## DAG 만들어보기

### DAG 정의할 때 자주 사용하는 파라미터
- 전체 파라미터는 [**공식문서 참고**](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html){:target="_blank"}
- **dag_id**: The id of the DAG
- **schedule_interval**: Defines how often that DAG runs
- **start_date**: The timestamp from which the scheduler will attempt to backfill
- **default_args**: A dictionary of default parameters to be used as constructor keyword parameters when initialising operators. 
- **catchup**: Perform scheduler catchup (or only run latest)? Defaults to True
- **tags**: List of tags to help filtering DAGs in the UI.

### DAG를 선언하는 3가지 방법

- `with` 컨텍스트 매니저
  ```python
  with DAG(
    "my_dag_name", start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    schedule_interval="@daily", catchup=False
  ) as dag:
    op = EmptyOperator(task_id="task")
  ```
- DAG 인스턴스를 Operator에 직접 전달
  ```python
  my_dag = DAG("my_dag_name", start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
             schedule_interval="@daily", catchup=False)
  op = EmptyOperator(task_id="task", dag=my_dag)
  ```
- `@dag` 데코레이터
  ```python
  @dag(start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
     schedule_interval="@daily", catchup=False)
  def generate_dag():
    op = EmptyOperator(task_id="task")

  dag = generate_dag()
  ```

### DAG 작성 예시

```python
from datetime import datetime
from airflow import DAG
from airflow.operators.bash import BashOperator

default_args = {
    'start_date': datetime(2022, 7, 19)
}

with DAG(dag_id='recruitment-airflow',
        schedule_interval='@daily',
        default_args=default_args,
        tags=['recruitment'],
        catchup=False) as dag:
    crawling = BashOperator(
        task_id='crawling',
        bash_command='python /opt/pipeline/script/crawlingToMongo.py'
    )
    MongoDBToKafka = BashOperator(
        task_id='MongoDBToKafka',
        bash_command='python /opt/pipeline/script/MongoDBToKafka.py'
    )
    KafkaToS3 = BashOperator(
        task_id='KafkaToS3',
        bash_command='python /opt/pipeline/script/KafkaToS3.py'
    )
    S3ToElasticsearch = BashOperator(
        task_id='S3ToElasticsearch',
        bash_command='python /opt/pipeline/script/S3ToElasticsearch.py'
    )
    S3ToMySQL = BashOperator(
        task_id='S3ToMySQL',
        bash_command='python /opt/pipeline/script/S3ToMySQL.py'
    )

    crawling >> MongoDBToKafka >> KafkaToS3 >> [S3ToElasticsearch, S3ToMySQL]
```

![](/images/airflow_4.png)

# Task

![](/images/airflow_11.png)

The possible states for a Task Instance are:  

- **none**: The Task has not yet been queued for execution (its dependencies are not yet met)
- **scheduled**: The scheduler has determined the Task’s dependencies are met and it should run
- **queued**: The task has been assigned to an Executor and is awaiting a worker
- **running**: The task is running on a worker (or on a local/synchronous executor)
- **success**: The task finished running without errors
- **shutdown**: The task was externally requested to shut down when it was running
- **restarting**: The task was externally requested to restart when it was running
- **failed**: The task had an error during execution and failed to run
- **skipped**: The task was skipped due to branching, LatestOnly, or similar.
- **upstream_failed**: An upstream task failed and the Trigger Rule says we needed it
- **up_for_retry**: The task failed, but has retry attempts left and will be rescheduled.
- **up_for_reschedule**: The task is a Sensor that is in reschedule mode
- **deferred**: The task has been deferred to a trigger
- **removed**: The task has vanished from the DAG since the run started


# Dashboard

- DAGs를 한 눈에 볼 수 있다

![](/images/airflow_5.png)

- DAG 하나에 대해서는 그래프로 볼 수도 있다

![](/images/airflow_6.png)

- DAG에서 각각의 태스크가 시간이 얼마나 걸리는지 파악할 수도 있다

![](/images/airflow_7.png)


# 참고

- [Airflow 공식문서](https://airflow.apache.org/docs/apache-airflow/stable/concepts/index.html){:target="_blank"}
- [버킷플레이스 Airflow 도입기](https://www.bucketplace.com/post/2021-04-13-%EB%B2%84%ED%82%B7%ED%94%8C%EB%A0%88%EC%9D%B4%EC%8A%A4-airflow-%EB%8F%84%EC%9E%85%EA%B8%B0/){:target="_blank"}
- [까치의 일상 노트, [Airflow 기본 내용] Airflow란? 구성요소, 구동원리, 개념, 용어 정리](https://magpienote.tistory.com/192){:target="_blank"}
- [[AirFlow] AirFlow 용어 정리](https://velog.io/@makengi/AirFlow-AirFlow-%EC%9A%A9%EC%96%B4-%EC%A0%95%EB%A6%AC){:target="_blank"}
- [](){:target="_blank"}
- [](){:target="_blank"}