---
layout: post
title: 'Airflow Series [Part6]: 템플릿 변수'
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

# 템플릿 변수

- 템플릿 변수: 런타임 시에 동적으로 할당되는 변수
- 이중 중괄호를 사용해 표현 (ex. {% raw %}{{ execution_date }}{% endraw %})

# 주요 템플릿 변수

|키|설명|
|:---:|:---:|
|conf|Airflow 구성에 대해 접근할 수 있도록 도와줌|
|dag|현재 DAG 객체|
|execution_date|태스크 스케줄 간격의 시작 날짜/시간|
|ds|execution_date의 %Y-%m-%d 포맷|
|next_execution_date|태스크의 다음 스케줄 간격의 시작 날짜/시간 (=현재 스케줄 간격의 끝)|
|next_ds|next_execution_date의 %Y-%m-%d 포맷|
|prev_execution_date|태스크 이전 스케줄 간격의 시작 날짜/시간
|prev_ds|prev_execution_date의 %Y-%m-%d 포맷|
|run_id|DagRun의 run_id|
|task|현재 오퍼레이터|


```py
with DAG(...) as dag:
    get_data = BashOperator(
        task_id="get_data",
        bash_command=("curl -o /tmp//wikipageviews.gz "
        "https://dumps.wikimedia.org/other/pageviews/"
        "{% raw %}{{ execution_date.year }}{% endraw %}/"
        "{% raw %}{{ '{:02}'.format(execution_date.month) }}{% endraw %}")
    )

    get_data
```

# 사용 가능한 템플릿 변수 리스트 출력

```py
from airflow import DAG
from airflow.operators.python import PythonOperator

def _print_context(**context):
    print(context)
    print(context["execution_date"])
    print(context["next_execution_date"])

with DAG(...) as dag:
    print_context = PythonOperator(
        task_id="print_context",
        python_callable=_print_context
    )
```



# 참고
