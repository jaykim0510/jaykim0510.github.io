---
layout: post
title: 'Airflow Series [Part5]: 스케줄링'
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

# 정기적으로 실행하기

- DAG를 초기화할 때 `schedule_interval` 인수를 설정해 스케줄 간격을 정의할 수 있음 (디폴트는 `None`)

```py
dag = DAG(
            dag_id=...,
            schedule_interval="@daily", # 매일 00시 00분 00초에 실행된다
            start_date=datetime.datetime(2023, 1, 1)
        )
```

## 스케줄 간격 정의하기

- **Airflow는 정의된 간격 후에 태스크가 시작된다** (Airflow executes the DAG after `start_date + interval (daily)`)
- 위의 예시의 경우, 2023년 1월 1일 00시 00분 00초에 처음으로 태스크가 실행될 것 같지만, 2023년 1월 2일 00시 00분 00초에 처음 실행된다
- 표현 방법은 크게 @로 시작하는 프리셋, cron 표현식, datetime.timedelta를 이용한 빈도 기반 방법이 있다 

|프리셋 이름|의미|
|:------:|:---:|
|@once|1회만 실행한다|
|@hourly|매시간 실행한다|
|@daily|매일 자정에 실행한다|
|@weekly|매주 일요일 자정에 실행한다|
|@monthly|매달 자정에 실행한다|
|@yearly|매년 1월 1일 자정에 실행한다|


```
*(분) *(시) *(일) *(월) *(요일)
```


|크론 표현식|의미|
|:------:|:---:|
|* * * * *|매분마다 실행한다
|0 2 * * *|매일 새벽 2시마다 실행한다|
|* 2 * * *|매일 새벽 2시에 1분마다 실행한다|
|0 0 * * 0|매주 일요일마다 자정에 실행한다|
|0 0,12 * * *|매일 00시 12시에 실행한다|

```py
schedule_interval=datetime.timedelta(days=3) # 3일마다
schedule_interval=datetime.timedelta(minutes=1) # 1분마다
schedule_interval=datetime.timedelta(seconds=1) # 1초마다
```


# 참고
