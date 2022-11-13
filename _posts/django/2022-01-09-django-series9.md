---
layout: post
title:  'Django Series [Part9]: Model(2)'
description: 
date:   2022-01-09 15:01:35 +0300
image:  '/images/django_logo.png'
logo_image:  '/images/django_logo.png'
categories: web_development
tags: [Django]
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Migration

## 이전 마이그레이션으로 돌아가기

- `python3 manage.py migrate {앱 이름} {돌아갈 버전의 번호}`
- 이 후 번호 파일 삭제
- 이전으로 돌아가면 데이터도 모두 돌아간다 (다시 앞으로 돌아가도 데이터는 복구 안됨)

## 디펜던시

- 만약 번호 0005 에서 0003으로 돌아간다고 하면,
- 0005, 0004와 0005, 0004를 디펜던시로 가지는 마이그레이션도 모두 이전으로 돌아간다

## 데이터 마이그레이션

- 기존 필드 데이터로 새로운 필드 추가할 때
- 기존 테이블로 새로운 테이블 만들 때
- 데이터 마이그레이션은 직접 마이그레이션 파일 작성해야함


```
- 필드 추가할 모델 클래스에 null 허용하는 필드 하나 생성후 migrate
    - python3 manage.py makemigrations --name {마이그레이션 이름}
    - python3 manage.py migrate
- 데이터 마이그레이션을 위한 마이그레이션 빈 파일 생성
    - python3 manage.py makemigrations --empty {앱 이름} --name {마이그레이션 이름}
- 마이그레이션 파일에 적용할 함수 작성
    - apps,schema_editor를 파라미터로 갖는 함수 정의
    - operations = [] 에 migrations.RunPython({함수명}, migrations.RunPython.noop) 추가
- 데이터 마이그레이션 migrate
    - python3 manage.py migrate
```