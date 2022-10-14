---
layout: post
title:  'MySQL Experimental Series [Part3] 그라파나를 이용해 MySQL 서버 모니터링 하기'
description: 
date:   2022-07-03 15:01:35 +0300
image:  '/images/grafana_mysql_logo.png'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 모니터링 적용 과정

![](/images/mysql_grafana_2.png)

## 도커 컴포즈 파일에 prometheus, grafana, exporter 컨테이너를 추가한다

```yml
version: '3.2'

services:
  mysql:
    hostname: mysql
    image: ziontkim0510/mysql-server:1.2
    ports:
      - 3306:3306
    environment:
      MYSQL_USER: root
      MYSQL_ROOT_HOST: "%%"
      MYSQL_DATABASE: test
      MYSQL_ROOT_PASSWORD: passwd
    command: mysqld
      --server-id=1234
      --max-binlog-size=4096
      --binlog-format=ROW
      --log-bin=bin-log
      --sync-binlog=1
      --binlog-rows-query-log-events=ON
    volumes:
      - ./dataset:/var/lib/mysql-files

  mysqld-exporter:
    hostname: mysqld-exporter
    image: prom/mysqld-exporter
    ports:
      - 9104:9104
    environment:
      DATA_SOURCE_NAME: root:passwd@(mysql:3306)/

  prometheus:
    hostname: prometheus
    image: prom/prometheus
    ports:
      - 9090:9090
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    hostname: grafana
    image: grafana/grafana
    ports:
      - 3000:3000
```

## prometheus.yml 파일을 작성한다

- 프로메테우스가 메트릭을 읽어오도록 잡을 생성한다

```yml
global:
  scrape_interval: 15s
  scrape_timeout: 10s
  evaluation_interval: 15s

scrape_configs:
- job_name: prometheus
  metrics_path: /metrics
  static_configs:
  - targets:
    - localhost:9090

- job_name: mysql
  metrics_path: /metrics
  static_configs:
  - targets:
    - mysqld-exporter:9104
```

## localhost:3000 을 통해 그라파나 웹 UI에 접속한다

![](/images/mysql_grafana_13.png)

## 프로메테우스를 데이터 소스로 등록한다

![](/images/mysql_grafana_3.png)

![](/images/mysql_grafana_4.png)

![](/images/mysql_grafana_5.png)

## 대시보드 템플릿을 다운받는다

- [**대시보드 템플릿 제공 사이트**](https://grafana.com/grafana/dashboards/?search=mysql){:target="_blank"}

![](/images/mysql_grafana_6.png)

MySQL Overview 말고도 다양한 대시보드를 템플릿으로 제공해준다. 템플릿은 JSON 파일로 작성돼 있다.  

![](/images/mysql_grafana_7.png)

JSON 파일을 직접 다운 받아도 되고, 그냥 번호만 알고 있어도 된다.  

## 대시보드를 등록한다

![](/images/mysql_grafana_8.png)

![](/images/mysql_grafana_9.png)

나는 번호로 그냥 입력했다.  

![](/images/mysql_grafana_10.png)

![](/images/mysql_grafana_11.png)

아까 등록했던 프로메테우스를 데이터 소스로 사용한다.  

## 결과

![](/images/mysql_grafana_1.png)

아래는 MySQL InnoDB Metrics 라는 템플릿을 사용했을 때의 모습이다  

![](/images/mysql_grafana_12.png)



# 참고

- [44bits, 그라파나(Grafana)란?](https://www.44bits.io/ko/keyword/grafana){:target="_blank"}
- [How-To Geek, How to Monitor MySQL Server Activity With a Grafana Dashboard](https://www.howtogeek.com/devops/how-to-monitor-mysql-server-activity-with-a-grafana-dashboard/){:target="_blank"}
- [Grafana 공식문서, Grafana documentation](https://grafana.com/docs/grafana/latest/){:target="_blank"}
- [jssvs, 프로메테우스(prometheus) 구성 및 기본 사용법](https://jssvs.tistory.com/m/41){:target="_blank"}
- [alice_k106, 169. [Prometheus] 1편 : Prometheus (프로메테우스) 사용 방법, 기본 개념, 데이터 구조](https://blog.naver.com/alice_k106/221535163599){:target="_blank"}
- [ExporterHub, MySQL Server Exporter](https://exporterhub.io/exporter/mysql-exporter/){:target="_blank"}
- [고양이 중독, 프로메테우스 Aurora MySQL 성능 지표 모니터링 구성](https://omty.tistory.com/54){:target="_blank"}
- [대시보드 템플릿 제공 사이트](https://grafana.com/grafana/dashboards/?search=mysql){:target="_blank"}
- [Docker Hub, prom/mysqld-exporter 컬렉터 플래그 종류 알 수 있음](https://hub.docker.com/r/prom/mysqld-exporter){:target="_blank"}
