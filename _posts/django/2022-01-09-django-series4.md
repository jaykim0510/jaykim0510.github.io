---
layout: post
title:  'Django Series [Part4]: View(1) Function Based View'
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

- View 를 작성할 때는 크게 함수 기반과 클래스 기반이 있다
- View 코드에는 일정한 패턴이 있다
- -> 개발자들이 쉽게 작성할 수 있도록 클래스를 만들어뒀다
- -> Django는 CRUD 각각을 위한 클래스형 뷰를 제공

- Function Based View가 의미 없는 것은 아니다
- FBV를 잘 공부하면 CBV도 쉽게 이해할 수 있다
- View를 커스텀할 때 FBV를 쓰기도 한다

- 보통 앱 하나에 최소 5개 정도의 View가 필요하다

```
- Create Post (GET, POST)
- Read Post (GET)
- Read Post List (GET)
- Update Post (POST)
- Delete Post (POST)

```

- 우선 각각에 매핑되는 URL을 작성한다
- (아래 작성 방식은 RESTful한 방법은 아니다)

```py
# posts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('posts/', views.post_list),
    path('posts/<int:post_id>/', views.post_detail),
    path('posts/<int:post_id>/edit', views.post_update),
    path('posts/<int:post_id>/delete', views.post_delete),
]
```

- Function Based View 를 작성해보자

```py
# posts/views.py

from django.shortcuts import render, redirect
from .forms import PostForm
from .models import Post

# Index
def index(request):
    return render(request, template_name='posts/index.html')

# Create
def post_create(request):
    if request.method == 'GET':
        post_form = PostForm()
        context = {'form': post_form}
        return render(request, template_name='posts/post_form.html', context=context)
    
    elif request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']

        new_post = Post(title=title, content=content)
        new_post.save()

        return redirect(to='posts/post_detail', post_id=new_post.id)

# Read List
def post_list(request):
    context = {'posts': ['post1', 'post2', 'post3']}
    return render(request, template_name='posts/post_list.html', context=context)

# Read Detail
def post_detail(request, post_id):
    context = {'post': f'post{post_id}'}
    return render(request, template_name='posts/post_detail.html', context=context)

# Update
def post_update(request, post_id):
    post = Post.objects.get(id=post_id)

    if request.method == 'GET':
        post_form = PostForm(instance=post)
    
    elif request.method == 'POST':
        post_form = PostForm(request.POST, instance=post)
        if post_form.is_valid():
            post_form.save()
            return redirect('posts/post_detail.html', post_id=post.id)
    
    context = {'form': post_form}
    return render(request, 'posts/post_form.html', context=context)

# Delete
def post_delete(request, post_id):
    post = Post.objects.get(id=post_id)
    post.delete()
    return redirect('posts/post_list.html')

```

- 부가적으로 Model 정의, Form 정의
- 또 `list.html`, `detail.html`, `form.html` 템플릿이 필요하다
- 이 부분에 대해서는 다음 포스트에서 다시 알아보자