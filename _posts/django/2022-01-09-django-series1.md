---
layout: post
title:  'Django Series [Part1]: Intro'
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

- 장고를 설치한다
- 장고 설치는 간단하다. django 프레임워크를 제공하는 라이브러리를 설치하면 된다
- 보통 별도의 가상 환경에서 설치를 진행한다

```sh
# 가상 환경에 장고 설치
python3 -m pip install django==3.2
```

- 맨 처음 원하는 위치(디렉터리)에서 프로젝트를 생성한다
- 프로젝트명은 예를 들면 youtube, instagram, facebook 처럼 하나의 서비스 이름으로 하면 된다

```sh
# 프로젝트 생성
django-admin startproject <프로젝트명>
```

- 프로젝트 구조는 다음과 같다

```sh
mydjango # 프로젝트 최상위 디렉터리
├── db.sqlite3 # 데이터베이스 파일
├── manage.py # 앱, 데이터베이스, 개발 서버와 같은 프로젝트 관리를 위한 다양한 명령어 지원
└── mydjango # 기본으로 생성되는 앱 (이 앱의 이름은 함부로 수정하면 안된다)
    ├── __init__.py
    ├── asgi.py
    ├── settings.py # 경로, 데이터베이스, 시간대 등 설정 관련 파일
    ├── urls.py # 최상위 URL 설정
    └── wsgi.py # 실서비스에서의 웹서비스 진입점
```

- 프로젝트 생성만 해도 기본적으로 개발 서버를 실행할 수 있다

```sh
# 개발 서버 실행
cd <프로젝트명>
python3 manage.py runserver
```

![](/images/django_1.png)

- 이제 앱을 하나 만들어보자
- 앱의 기준은 정의하기 나름이다
- 하나의 앱에 모든 기능을 구현해도 된다
- 하지만 장고의 설계 철학은 앱은 하나의 기능만을 담당함으로써 여러 프로젝트에 사용될 수 있도록 앱을 만들기를 지향한다
- 그래서 예를 들어 유저(User), 포스트(Post), 댓글(Comment) 등과 같은 기능을 하나의 앱으로 설계하는 것이 좋다
- 앱의 이름은 보통 복수형으로 생성한다 (ex. users, posts comments 등)

```sh
python3 manage.py startapp <앱 이름>
```

- 앱을 만들면 디렉터리가 생기는데 해당 앱 이름으로 디렉터리가 생긴다
- 대개의 경우 앱에 `urls.py` 파일을 하나 추가한다
- 구조는 아래와 같다

```sh
mydjango
├── db.sqlite3
├── manage.py
├── mydjango
└── posts # posts 앱
    ├── __init__.py
    ├── admin.py # 앱을 Django 관리자와 연동하기 위해 필요한 설정 파일
    ├── apps.py # 앱에 대한 설정을 넣어두는 파일
    ├── migrations # 데이터베이스의 변경 사항 히스토리를 누적해두는 파일
    ├── models.py # 앱에서 사용할 데이터 모델을 정의하는 파일
    ├── views.py # 앱의 메인 로직 처리와 관련된 파일
    ├── urls.py # 앱 내에서 API를 매핑하기 위한 파일
    └── tests.py # 테스트 코드를 작성하는 파일
```

- 그리고 장고에서 앱으로 인식할 수 있도록 `mydjango/settings.py` 의 `INSTALLED_APPS` 에 앱 이름을 추가한다

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'posts', # 추가
]
```

- 마지막으로 간단하게 post 앱으로 API 를 매핑해, HTML 파일을 렌더링 해보자
- 가장 먼저 URL 요청을 가장 먼저 받아들이는 urls.py 파일에 경로를 추가하자
- 아래 코드는 `posts/` 를 포함한 경로는 `posts/urls.py` 파일로 요청을 전달한다는 의미다

```py
# mydjango/urls.py
from django.urls import path, include

urlpatterns = [
    path('posts/', include('posts.urls'))
]
```

- post 앱의 `urls.py` 에서는 이전까지의 경로 `localhost:8000/post/` 이후의 경로를 설정한다
- 아래는 `localhost:8000/posts/index/` 라는 경로로 요청이 들어오면 `posts/views.py` 에 `index` 함수를 호출한다는 의미다

```py
# posts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('index/', views.index)
]
```

```py
# posts/views.py

from django.http import HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("<h2>Hello, Django !</h2>")
```

![](/images/django_2.png)

# 참고

- [](){:target="_blank"}