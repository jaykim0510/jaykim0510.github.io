---
layout: post
title:  'MongoDB Series [Part1]: MongoDB Intro'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2022-01-04 15:01:35 +0300
image:  '/images/mongodb_logo.png'
categories: DE
tags: MongoDB
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# From MongoDB to S3
boto3 라이브러리 사용하면 내가 저장할 파일의 경로를 이용해서 s3에 저장 가능한데 몽고db는 뭔가 저장 포맷이 디코딩이 쉽지 않아 보인다. 그래서 다른 방법을 써야할 것 같다.  
(https://towardsdatascience.com/data-lake-in-s3-from-mongodb-addd0b9f9606)    

mongodb to s3 로 옮기는 좋은 방법은 airflow의 Operator 쓰는 것 같다  
(https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/operators/transfer/mongo_to_s3.html)  
(https://apache.googlesource.com/airflow/+/refs/tags/1.10.15/docs/installation.rst)  

그 밖에 가운데 스파크를 사용하는 방법도 있는 것 같다 (mongodb - spark - s3)  
(https://medium.com/@akash.kumar_5441/migrate-data-from-mongodb-into-s3-64838b2fc46e)  

# From Kafka to S3

sink connector  


# 참고

- [프로그래머 YD: Docker - 도커로 MongoDB 컨테이너 설치하는 방법을 알아보자](https://7942yongdae.tistory.com/131){:target="_blank"}
- [프리킴: [MongoDB] 몽고DB 기본 명령어](https://freekim.tistory.com/13){:target="_blank"}
- [Confluent hub: Debezium MongoDB CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-mongodb){:target="_blank"}