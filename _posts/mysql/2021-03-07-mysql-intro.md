---
layout: post
title:  '[MySQL] Intro'
description: 데이터베이스를 체계적으로 작동할 수 있도록 돕는 소프트웨어가 나오게 되었으며 이를 DBMS라고 한다
date:   2021-03-07 15:01:35 +0300
image:  '/images/mysql_logo.png'
logo_image: '/images/mysql_logo.png'
category: data_engineering
tag: mysql
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# DBMS  
빅 데이터 시대에서 데이터 저장은 가장 중요한 부분 중 하나입니다. 힘들게 얻은 데이터를 저장하지 않는다면 큰 자원 낭비겠죠. 하지만 중요한 것은 단순히 저장에 그치는 것이 아니라, **어떤 식으로 저장해 그 후 데이터를 추가, 갱신, 삭제 할 때 문제(NULL, 중복 등)가 생기지 않도록 할 것인지에 대한 고민**도 이루어져야 한다는 것 입니다. 이번 MySQL 시리즈에서 이런 문제들을 어떻게 해결할 것인지에 대해 공부해보도록 하겠습니다.  

## Database
데이터베이스는 **데이터의 집합** 또는 **데이터 저장소**라고 정의할 수 있습니다.  

## DBMS
데이터베이스를 보통 직접적으로 접근하지는 않습니다. 사용자들이 데이터베이스를 그냥 접근한다면 데이터의 일관성도 떨어질 것이고, 관리도 쉽지 않을 것 입니다. 이러한 이유로 **데이터베이스를 체계적으로 작동할 수 있도록 돕는 소프트웨어가 나오게 되었으며 이를 DBMS(DataBase Management System)**이라고 합니다.  

DBMS는 데이터베이스를 구축하는 틀을 제공하고, 효율적으로 데이터를 검색하고 저장하는 기능을 제공합니다. 또한 응용 프로그램들이 데이터베이스에 접근할 수 있는 인터페이스를 제공하고, 장애에 대한 복구 기능, 사용자 권한에 따른 보안성 유지 기능 등을 제공합니다.  

## SQL
DBMS를 이용해 데이터베이스를 사용하게 됩니다. 그렇다면 저희는 DBMS와 소통하는 방법을 알아야 합니다. 여기서 DBMS와 소통하기 위한 언어를 SQL(Structured Query Language)라고 합니다. SQL을 이용하면 데이터베이스 조작에 필요한 모든 명령어를 DBMS에 전달함으로써 수행할 수 있습니다.  

## MySQL  
처음 SQL이라는 언어는 IBM이라고 하는 회사에서 System/R이라는 DBMS와, 이것을 사용하기 위해 필요한 언어인 SEQUEL을 만들면서 처음 등장했습니다. 그런데 SEQUEL(Structured English Query Language)은 그 단어가 이미 다른 곳에서 사용되고 있다는 문제(상표권 문제) 때문에 그 이름이 SQL(Structured Query Language)로 변경되었습니다. 그러다가 1987년, 국제 표준화 기구(ISO)에서 SQL에 관한 국제 표준(ISO 9075:1987)이 제정되었습니다.  

하지만 우리가 실제로 사용하는 SQL은 이 국제 표준에 완벽히 부합하지는 않습니다. Oracle, Microsoft SQL Server, MySQL 등의 DBMS에서 지원되는 SQL이 표준을 완벽히 준수하지는 않는다는 뜻입니다. 그 이유는 다양하지만 일단 많은 DBMS 회사들이 성능 향상과 더 다양한 기능 제공을 위해서, 차라리 표준을 일부 벗어나는 것을 택하는 경우가 많기 때문입니다.  

MySQL은 가장 처음 MySQL AB라고 하는 스웨덴 회사에서 개발되었습니다. 현재는 인수 과정을 거쳐 Oracle의 소유입니다. 이로 인해 지금 Oracle에는 Oracle(회사명과 같은 DBMS)과 MySQL이라는 서비스를 함께 제공하고 있습니다.  

두 DBMS의 시장에서의 쓰임새를 보면 약간의 차이가 있습니다. 은행, 거래소 등과 같이 데이터 처리의 정확성, 운영의 안정성 등이 엄격하게 요구되는 분야에서는 오라클이 주로 사용되고 있고, 우리가 흔히 쓰는 앱, 웹 사이트 같은 서비스를 만들 때는 MySQL을 쓰는 경우가 많습니다.  

## DBMS의 종류  
위와 같이 많은 회사에서 성능 향상과 목적에 맞게 SQL이라는 언어를 조금씩 변형, 개선하여 새로운 DBMS로 개발해왔습니다. 이러한 이유로 MySQL과 같이 ~SQL이라는 용어도 사실상은 그 언어를 지원하는 DBMS 자체를 의미하게 되었습니다. 그래서 약간 헷갈리지만 관계형 데이터를 위한 DBMS의 경우 RDBMS, 비 관계형 데이터를 위한 DBMS의 경우 NoSQL이라고 하게 되었습니다.  

**RDBMS**: MySQL, Oracle, MariaDB(MySQL 개발자들이 만든 오픈소스), PostgreSQL 등  
**NoSQL**: MongoDB, ElasticSearch, Cassandra 등

## DBMS의 구조  

![](/images/mysql_1.png)  

- **client(클라이언트 프로그램)**: 유저의 데이터베이스 관련 작업을 위해, SQL을 입력할 수 있는 화면 등을 제공하는 프로그램  
- **server(서버 프로그램)**: client로부터 SQL 문 등을 전달받아 데이터베이스 관련 작업을 직접 처리하는 프로그램

MySQL에서 서버 프로그램의 이름은 `mysqld`, 클라이언트 프로그램 이름은 `mysql`입니다. mysql은 보통 CLI 환경에서 사용하는 프로그램입니다. CLI 환경이 아니라 GUI 환경에서 mysql을 사용하려면 mysql을 GUI 환경에서 사용할 수 있도록 해주는 프로그램을 사용하면 됩니다. 대표적으로 Oracle이 공식적으로 제공하는 `MySQL Workbench`라는 프로그램이 있습니다. 

# SQL의 분류

![](/images/sql_category.png)

## DCL

- Data Control Language
- 데이터베이스 접근 권한과 관련한 명령어
- `GRANT`, `REVOKE`, `DENY`

## DDL

- Data Definition Language
- 테이블과 같은 데이터 구조를 정의하는데 사용되는 명령어
- `CREATE`, `ALTER`, `RENAME`, `DROP`, `TRUNCATE`

## DML

- Data Manipulation Language
- 데이터 조회/삽입/수정/삭제와 관련한 명령어
- `SELECT`, `INSERT`, `UPDATE`, `DELETE`

## TCL

- Transaction Control Language
- 데이터를 트랜잭션 단위로 처리하는데 필요한 명령어
- `COMMIT`, `ROLLBACK`, `SAVEPOINT`
