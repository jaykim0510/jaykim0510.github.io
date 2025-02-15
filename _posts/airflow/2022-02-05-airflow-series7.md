---
layout: post
title: 'Airflow Series [Part7]: 워크플로 컨트롤'
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

# 의존성 정의하기

![](/images/airflow_12.png)

```py
# in general we recommend you use the bitshift operators, as they are easier to read in most cases

bash_start >> [bash_a, bash_b]
bash_a >> bash_c
bash_b >> bash_d
[bash_c, bash_d] >> bash_e
bash_e >> bash_f >> bash_g

```


# 브랜치 하기

![](/images/airflow_13.png)

```py
import random
from datetime import datetime
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import BranchPythonOperator

def _pick_erp_system():
    x = random.randint(1, 2)
    if x % 2 == 0:
        return "bash_a1" # 리턴할 태스크 ID. 리스트를 넘기면 여러 개의 태스크를 실행할 수도 있다
    else:
        return "bash_b1"

with DAG(
            dag_id="test_airflow",
            schedule_interval="* * * * *", # 매분마다 실행
            start_date=datetime(2023, 1, 15),
            catchup=False
        ) as dag:
    bash_pick = BranchPythonOperator( # BranchPythonOperator 사용ㄷ
        task_id="bash_pick", 
        python_callable=_pick_erp_system
    )
    bash_a1 = BashOperator(
        task_id="bash_a1", 
        bash_command="echo A1"
    )
    bash_b1 = BashOperator(
        task_id="bash_b1", 
        bash_command="echo B1"
    )
    bash_a2 = BashOperator(
        task_id="bash_a2", 
        bash_command="echo A2"
    )
    bash_b2 = BashOperator(
        task_id="bash_b2", 
        bash_command="echo B2"
    )
    bash_a3 = BashOperator(
        task_id="bash_a3", 
        bash_command="echo A3"
    )
    bash_b3 = BashOperator(
        task_id="bash_b3", 
        bash_command="echo B3"
    )


    bash_pick >> [bash_a1, bash_b1]
    bash_a1 >> bash_a2 >> bash_a3
    bash_b1 >> bash_b2 >> bash_b3
```

# 태스크 트리거

- 업스트림 태스크가 어떤 상태일 때 태스크가 실행되도록 할지 결정한다
- 디폴트는 `all_success`로, 업스트림 태스크가 모두 성공했을 때 실행된다

|트리거 규칙|동작|사용 사례|
|:------:|:---:|:---:|
|all_success|모든 상위 태스크가 성공하면 트리거 된다|일반적인 워크플로에 대한 기본 트리거 규칙|
|all_failed|모든 상위 태스크가 실패했거나, 오류가 발생한 경우 트리거 된다|오류를 처리하는 태스크의 트리거 규칙|
|all_done|결과 상태에 관계없이 모든 부모가 실행을 완료하면 트리거 된다|시스템 종료 또는 클러스터 중지하는 태스크의 트리거 규칙|
|one_success|한 부모가 성공하자마자 트리거 된다||
|one_failed|하나 이상의 상위 태스크가 실패하자마자 트리거 된다|알림 또는 롤백과 같은 일부 오류 처리 태스크의 트리거 규칙|
|none_failed|실패한 태스크 없이, 모든 상위 태스크가 성공 또는 건너뛴 경우 트리거 된다|스킵된 태스크와 성공한 태스크를 결합한 태스크의 트리거 규칙|
|none_skipped|스킵한 태스크 없이, 모든 상위 태스크가 성공 또는 실패한 경우 트리거 된다||
|dummy|업스트림 태스크의 상태와 관계없이 트리거 된다|테스트 용도|

![](/images/airflow_14.png)

```py
    bash_join = BashOperator(
        task_id="bash_join", 
        bash_command="echo JOIN",
        trigger_rule="none_failed"
    )
```


![](/images/airflow_15.png)

```py
    bash_join = BashOperator(
        task_id="bash_join", 
        bash_command="echo JOIN",
        trigger_rule="none_skipped"
    )
```

# 워크플로 트리거

- **센서**를 이용하면, 고정된 스케줄링 방식이 아닌 **특정 이벤트로 파이프라인을 트리거** 할 수도 있다
- ex. 새로운 데이터가 도착, 공유 드라이브에 파일이 업로드, 코드를 리포지터리로 푸시, Hive 테이블에 파티션이 있을 때와 같은 경우
- 센서는 오퍼레이터의 특수 타입(서브클래스)
- 센서는 특정 조건이 True인지 지속적으로 확인하고, True이면 태스크가 성공한 것으로 간주된다. False이면 True 또는 타임아웃이 될 때까지 확인

```py
from airflow.sensors.filesystem import FileSensor

wait_for_data = FileSensor(
    task_id="wait_for_data",
    filepath="/data/data.csv",
)
```

```py
from pathlib import Path
from airflow.sensors.python import PythonSensor

def _wait_for_data():
    data_path = Path("/data/data.csv")
    return data_path

wait_for_data = PythonSensor(
    task_id="wait_for_data",
    python_callable=_wait_for_data
)

```

# 참고
