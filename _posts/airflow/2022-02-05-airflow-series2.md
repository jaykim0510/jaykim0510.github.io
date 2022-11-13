---
layout: post
title: 'Airflow Series [Part2]: Airflow example'
description: 
date: 2022-02-05 15:01:35 +0300
image: '/images/airflow_logo.png'
logo_image: '/images/airflow_logo.png'
categories: data_engineering
tags: Airflow
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

```
airflow db init
```

```sh
airflow users create --email ziont0510@naver.com --firstname jay --lastname kim --role Admin --password admin --username admin
```


```
airflow scheduler
```

```
airflow webserver -p 8080
```