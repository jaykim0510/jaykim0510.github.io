---
layout: post
title:  'Django Series [Part8]: Model(2)'
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

# Modeling

## 일대일 관계

- 데이터가 서로 일대일 관계인 경우
- ex. 유저와 프로필: 유저당 프로필은 한 개만 만들 수 있고, 프로필도 하나의 유저에만 속할 수 있다
- `user = models.OneToOneField(<모델명>, on_delete=models.CASCADE)` 이런식으로 작성한다
- 두 모델중 나중에 생성되는 모델에 만들어준다 (ex. 유저가 생기고 프로필이 생기므로, 프로필에 만들어준다)

```python
class User:
    ...

class Profile:
    ...
    user = models.OneToOneField(User, on_delete=models.CASCADE)
```

## 일대다 관계

- 데이터가 일대다 관계인 경우
- ex. 유저와 리뷰: 하나의 유저는 여러 개의 리뷰를 가질 수 있고, 리뷰 한 개는 하나의 유저에만 속할 수 있다
- `user = models.ForeignKey(User, on_delete=models.CASCADE)` 이런식으로 작성한다
- 두 모델중 Many에 해당하는 모델에 만들어준다 (ex. 리뷰가 Many에 해당하므로, 리뷰 모델에 만들어준다)

```python
class User:
    ...

class Review:
    ...
    user = models.ForeignKey(User, on_delete=models.CASCADE)
```

## 다대다 관계

- 데이터가 다대다 관계인 경우
- ex. 유저와 유저간의 팔로잉: 하나의 유저는 여러 유저를 팔로잉할 수 있고, 다른 유저도 여러 유저를 팔로잉 할 수 있다
- ex. 포스트와 태그의 관계: 하나의 포스트는 여러 태그를 가질 수 있고, 하나의 태그에는 여러 포스트가 있을 수 있다
- `tag = models.ManyToMany(Tag)` 이런식으로 작성한다
- 일대일, 일대다, 다대다에서 안에 모델을 인자로 줄 때 `Tag` 이렇게 줘도 되고, `'Tag'` 이렇게 문자열로 줘도 된다. 순서상 뒤에 정의되는 모델을 인자로 주면 정의되지 않은 클래스라고 빨간줄이 표시되기 때문에 문자열로 많이 표시한다
- 어느쪽에 정의해도 상관 없다
- 유저간의 팔로잉은 서로 대칭적이지 않다 (내가 BTS를 팔로잉 한다고 해서, BTS가 나를 팔로잉 하지는 않는다)
  - `user = models.ManyToMany('User', symmetrical=False)` 이렇게 해준다
- 유저간의 팔로잉은 두 모델 모두 `User`이다
  - `user = models.ManyToMany('self', symmetrical=False)` 이렇게 `self`로 적기도 한다

## 역관계

- 유저와 리뷰는 일대다 관계이기 때문에 리뷰 모델에, 
- `user = models.ForeignKey(User, on_delete=models.CASCADE)` 이렇게 작성했다
- 그러면 리뷰에서 해당 리뷰를 작성한 유저를 알고 싶을 때,
- `Review.objects.get(user=5)` 또는 템플릿 언어에서 `review.user` 이런식으로 접근이 가능하다

- **반대로 유저가 작성한 리뷰를 알고싶을 때는 그러면 어떻게 해야할까?**
- 만약 일대다 관계(ForeignKey)로 작성한 경우에는, `user.review_set` 이런식으로 접근 가능하다
- 만약 원투원 관계(OneToOne)으로 작성한 경우에는, `user.review` 이런식으로 접근 가능하다
- 만약 다대다 관계(ManyToMany)으로 작성한 경우에는, `user.review_set` 이런식으로 접근 가능하다

- **이름이 마음에 안들면?**
- `user.review_set`이 아니라, `user.reviews` 라고 하고 싶은 경우가 있다
- (ex. 나를 팔로우하고 있는 사람들을 알고 싶을 때: `user.user_set`이 아니라, `user.followers`)
- `user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews)` 이런식으로 작성해주면 된다. (`OneToOne`, `ManyToMany` 도 마찬가지로 똑같이 할 수 있다)

# CRUD

# Database

## MySQL

- `pip install mysqlclient`

```py
# settings.py

DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME': 'dbname',
       'HOST': 'localhost',
       'PORT': '3306',
       'USER': 'username',
       'PASSWORD': 'password',
   }
}

```

- `python manage.py migrate`


## PostgresSQL

- `pip install psycopg2`

```py
# settings.py

DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': 'dbname',
       'HOST': 'localhost',
       'PORT': '5432',
       'USER': 'username',
       'PASSWORD': 'password',
   }
}

```

- `python manage.py migrate`



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
