---
layout: post
title:  'Kubernetes Series [Part17]: Spark on Kubernetes'
description: 
date:   2022-02-01 15:01:35 +0300
image:  '/images/kubernetes_logo.png'
logo_image:  '/images/kubernetes_logo.png'
category: devops
tag: [kubernetes]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# 참고

- [mightytedkim, Kubernetes) k8s와 Airflow 이용한 spark작업](https://mightytedkim.tistory.com/43){:target="_blank"}
- [Ramiro Alvarez Fernandez, Running Apache Spark on Kubernetes](https://medium.com/empathyco/running-apache-spark-on-kubernetes-2e64c73d0bb2){:target="_blank"}
- [Shubhomoy Biswas, Running Apache Spark with HDFS on Kubernetes cluster](https://medium.com/analytics-vidhya/running-apache-spark-with-hdfs-on-kubernetes-cluster-f98d05ac2f15){:target="_blank"}
- [Jason Heo's Blog, Spark on Kubernetes 사용법 및 secure HDFS에 접근하기](http://jason-heo.github.io/bigdata/2020/12/13/spark-on-kubernetes.html){:target="_blank"}
- [이웅규, Kubernetes를 이용한 효율적인 데이터 엔지니어링](https://deview.kr/data/deview/session/attach/1100_T3_%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%AE%E1%86%BC%E1%84%80%E1%85%B2_Kubernetes%E1%84%85%E1%85%B3%E1%86%AF%20%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%92%E1%85%A1%E1%86%AB%20%E1%84%92%E1%85%AD%E1%84%8B%E1%85%B2%E1%86%AF%E1%84%8C%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%B5%E1%86%AB%20%E1%84%83%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%90%E1%85%A5%20%E1%84%8B%E1%85%A6%E1%86%AB%E1%84%8C%E1%85%B5%E1%84%82%E1%85%B5%E1%84%8B%E1%85%A5%E1%84%85%E1%85%B5%E1%86%BC%20_Airflow%20on%20Kubernetes%20VS%20Airflow%20Kubernetes%20Executor_.pdf){:target="_blank"}