---
layout: post
title: 'Hadoop Series [Part10]: HDFS에서 Spark 사용하기'
description: 
date: 2022-02-06 15:01:35 +0300
image: '/images/hadoop_logo.png'
logo_image: '/images/hadoop_logo.png'
categories: data_engineering
tags: Hadoop
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

```sh
# Name node

# 폴더 생성
hdfs dfs -mkdir /foo

# 로컬의 bar.txt 데이터를 /foo 폴더로 복사
# (dfs.datanode.data.dir에 명시된 경로에 저장됨)
# (나의 경우 file:/opt/hadoop/data/hdfs/datanode 로 지정함)
hdfs dfs -put ./bar.txt /foo/
```

![](/images/hadoop_20.png)

![](/images/hadoop_21.png)

![](/images/hadoop_22.png)

![](/images/hadoop_23.png)


```py
# 스파크 마스터 컨테이너에서,

from pyspark.sql import SparkSession

spark = SparkSession.builder.master("spark://spark-master:7077").appName("hdfs_test").getOrCreate()

myText = spark.read.text("hdfs://hdfs-name-node:8020/foo/bar.txt")
myText.show()
----------------------------------------------------------------------------------------------------------------
+-------------+
|        value|
+-------------+
|Hello Hadoop!|
+-------------+
```

- 지금 머릿속에서 헷갈리는 부분은, 나중에 스파크 어플리케이션을 실행할 때 jar 파일이 필요할 때는 어떻게 해야할까
- 내가 알기로는 submit 하는 곳, 마스터, 워커쪽에 다 jar 파일이 있어야 한다
- 이러한 점도 hdfs를 쓰는 이유중 하나라고 생각한다
- 근데 나는 지금 스파크 마스터는 네임 노드도 워커 노드도 아니다
- => 확인 결과, 네임노드도 워커노드도 아니어도 hdfs-site.xml 에 잘 정의만 해두면, 네임노드, 워커노드와 HDFS를 함께 공유할 수 있다

![](/images/hadoop_24.png)


- 그럼 이제 HDFS에 jar 파일과 데이터 잘 올려두면 스파크 어플리케이션 잘 실행할 수 있을 것 같다