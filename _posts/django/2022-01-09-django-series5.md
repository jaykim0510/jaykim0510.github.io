---
layout: post
title:  'Django Series [Part5]: Model(1)'
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

- 모델의 역할은 데이터를 정의하고, 데이터베이스와 소통하는 것이다

# 모델 정의

- 모델을 통해 데이터를 정의해보자

```py
# models.py

class Post(models.Model):
    title = models.CharField(max_length=50)
    content = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # 객체를 하나의 문자열로 표현
    def __str__(self):
        return self.name
```

- 새로 생성된 모델, 변경된 모델은 장고에 반영해야 한다

```sh
python3 manage.py makemigrations

python3 manage.py makemigrations --name "{마이그레이션 파일명 (커밋 로그 같은 느낌)}"

python3 manage.py makemigrations {앱 이름}

python3 manage.py migrate

python3 manage.py migrate {앱 이름}
```

![](/images/django_5.png)

```sh
python3 manage.py showmigrations

python3 manage.py showmigrations {앱 이름}

python3 manage.py showmigrations {앱 이름} {번호}
```


```sh
python3 manage.py sqlmigrate {앱 이름} {번호}
python3 manage.py sqlmigrate posts 0001
--------------------------------------------------
BEGIN;
--
-- Create model Post
--
CREATE TABLE "posts_post" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "title" varchar(50) NOT NULL, "content" varchar(100) NOT NULL, "created_at" datetime NOT NULL, "modified_at" datetime NOT NULL);
COMMIT;
```

```sh
# json 파일로 데이터 삽입

python3 manage.py loaddata {json 파일명}
```

```sh
# 장고 셸
python3 manage.py shell

>>> from {앱 이름}.models import {모델명}
>>> {모델명}.objects.all()
```

## 모델 필드

![](/images/django_6.png)

## 필드 옵션

![](/images/django_7.png)


# CRUD

## Create

```py
# 데이터 생성과 동시에 데이터베이스에 반영
data_model = Menu.objects.create(price=10000)

# 데이터 생성과 데이터베이스에 반영 분리
data_model = Menu(price=10000)
data_model.save()
```

## Read

```py
from foods.models import Menu

# 모든 데이터 조회
Menu.objects.all()

# 모든 데이터의 값까지 조회
Menu.objects.all().values()

# 모든 데이터의 특정 field값 조회
Menu.objects.all().values('price')

# 모든 데이터를 특정 field값 기준으로 정렬해서 조회
Menu.objects.order_by('price')

#  내림차순
Menu.objects.order_by('-price')

# 특정조건을 만족하는 하나의 데이터를 조회
# 조건을 만족하는 데이터가 2개 이상인 경우 오류 발생
Menu.objects.get({필드명}__조건키워드="조건")

# 오류 발생할 가능성 높다
Menu.objects.get(name__contains="코")

# 주로 이런 id값을 통해 접근할 때 많이 사용된다
Menu.objects.get(id=1)

# 특정조건을 만족하는 여러 데이터를 조회
Menu.objects.filter({필드명}__조건키워드="조건")

Menu.objects.filter(name__contains="코")
Menu.objects.filter(price__range=(2000, 10000))
```

```
# 조건 키워드
__contains, __icontains, __in, __gt, __gte, __lt, __lte,
__startswith, __istatswith, __endswith, __iendswith, __range, __isnull
```

## Update

```py
data = Menu.objects.get(id=1)

# 데이터 수정
data.name = '가나다'

# 데이터 저장
data.save()
```

## Delete

```py
data = Menu.objects.get(id=3)

# 데이터 삭제
data.delete()
```

# 모델 API 정리

## Queryset을 반환하는 API (여러개의 데이터)

![](/images/django_8.png)

## 하나의 데이터 객체를 반환하는 API

![](/images/django_9.png)


## 그 외 API

![](/images/django_10.png)

# 관리자 도구(Admin) 사용하기

- 관리자 도구가 모델을 관리할 수 있도록 모델 추가

```py
# admin.py

# 추가해줄 모델 가져오기
from foods.models import Menu

# 모델 등록
admin.site.register(Menu)
```

# View에서 모델 사용하기

```py
# Create
def post_create(request):
    if request.method == 'GET':
        post_form = PostForm()
        context = {'form': post_form}
        return render(request, template_name='posts/post_form.html', context=context)
    
    elif request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']

        # Post 데이터 생성
        new_post = Post(title=title, content=content)
        new_post.save()

        return redirect(to='posts/post_detail', post_id=new_post.id)

# Delete
def post_delete(request, post_id):
    post = Post.objects.get(id=post_id)

    # Post 데이터 삭제
    post.delete()
    return redirect('posts/post_list.html')
```

# Template에서 모델 사용하기

- View에서 context에 전달해준 딕셔너리의 키(key)를 통해 데이터에 접근할 수 있다

```html

{% for post in posts %}
    <h3>{{post.id}}</h3>
    <h3>{{post.title}}</h3>
    <h3>{{post.content}}</h3>
{% endfor %}

```

# db.sqlite3

## VSCode의 SQLite Viewer 익스텐션

- 테이블 이름은 {앱이름}_{모델명} 이런식으로 되어있다

## DB shell

- `python manage.py dbshell`
- 각 DB에 해당하는 쉘 제공