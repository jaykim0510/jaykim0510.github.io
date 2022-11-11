---
layout: post
title:  'Django Series [Part2]: URL'
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

# Journey of URL

```py
# mydjango/setting.py

# 서버가 URL 요청을 받으면 가장 먼저 참조하는 파일을 설정할 수 있다
ROOT_URLCONF = 'mydjango.urls'
```

```py
# mydjango/urls.py

from django.urls import path, include

urlpatterns = [

    # post/ 에 매칭되는 모든 URL 요청은 post.urls 모듈을 참고해라
    path('post/', include('post.urls'))
]
```

```py
from django.urls import path
from . import views

urlpatterns = [

    # post/index/ 에 매칭되는 모든 URL 요청은 views 모듈의 index 함수를 호출해라
    # 두 번째 인자가 callable 하면 항상 request를 인자로 전달해준다
    path('index/', views.index)
]
```

```py
# post/views.py

from django.http import HttpResponse

# 모든 View는 request를 인자로 받는다
def index(request):
    return HttpResponse("<h2>Hello, Django !</h2>")
```

# 장고의 Elegant URL

- URL 을 우리가 원하는 형태로 구성
- 이해하기 쉬운 직관적인 구조

```py
# 동적 URL

from django.urls import path
from . import views

urlpatterns = [
    path('index/', views.index),

    # post/comedy
    # post/action 등에 모두 매칭된다
    path('<str:category>/', views.category_detail),
]
```

```py
# post/views.py

from django.shortcuts import render


def category_detail(request, category):
    context = {'category': category}
    return render(request, 'post/category_detail.html', context=context)
```

```html
# post/templates/post/category_detail.html

<h2>Category: {{ category }}</h2>
```

![](/images/django_3.png)

## Path Converter

- `str` : 경로 구분 기호(/)를 제외한 모든 문자열과 매칭
- `int` : 0 또는 양의 정수와 매칭
- `slug` : 문자, 숫자, 하이픈(-), 밑줄(_)로 구성된 문자열과 매칭
- `uuid` : 범용 고유 식별자(UUID)와 매칭
- `path` : 경로 구분 기호(/)를 포함한 모든 문자열과 매칭

```py
# <[converter]:[넘겨줄 인자명]>
# converter와 넘겨줄 인자명 사이는 띄어쓰면 안됨
path('<str:category>/', views.category_detail),
```

# URL 관련 함수

- **path(route, view, name=None)**
  - route: URL 패턴을 가진 문자열
  - view
    - route에 매핑될 호출 가능한 객체(일반적으로 함수 또는 클래스) (include를 사용해 다른 URLconf 모듈로 연결할 수도 있음)
    - request를 첫 번째 인수, route 에서 캡처한 path converter를 키워드 인수로 전달 받음
  - name: URL 명명

- **re_path()**

- **include(module)**
  - URL을 계층적으로 관리할 때 사용하는 함수

- **reverse()**

- **render(request, template_name, context=None, content_type=None, status=None, using=None)**
  - 템플릿을 렌더링하는 함수
  - request: 요청에 포함된 정보
  - template_name: 렌더링할 html 파일 경로
  - context: View 에서 사용하던 데이터를 Template으로 넘겨준다
  
- **redirect(to, permanent=False)**
  - 다른 URL 경로로 이동하는 함수
  - to: 어느 URL로 이동할지 (절대경로, 상대경로, 명명한 URL)

# 참고

- [django 공식문서, URL dispatcher](https://docs.djangoproject.com/en/4.1/topics/http/urls/){:target="_blank"}
- [[Django] URL 매핑 - include를 이용한 url 계층 관리](https://danhandev.tistory.com/entry/Django-URL-%EB%A7%A4%ED%95%91-include%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-url-%EA%B3%84%EC%B8%B5-%EA%B4%80%EB%A6%AC){:target="_blank"}
- [3.django urls include를 여러개 써서 효율적인 관리](https://velog.io/@ddusi/django-2){:target="_blank"}