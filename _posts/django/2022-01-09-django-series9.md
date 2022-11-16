---
layout: post
title:  'Django Series [Part9]: View(2) Generic Based View'
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


# 클래스형 뷰(Class-Based Views)  
- 개발자들이 자주 쓸만한 view를 클래스로 만들어 둔 것  
- 장고는 CRUD 각각을 위한 클래스형 뷰를 제공

```python
# views.py

from django.views import View

class PostCreateView(View):
    def get(self, request):
        post_form = PostForm()
        return render(request, 'posts/post_form.html', {'form': post_form})

    def post(self, request):
        post_form = PostForm(request.POST)
        if post_form.is_valid():
            new_post = post_form.save()
            retrn redirect('post-detail', post_id=new_post.id)
```  

```python
# urls.py

urlpatterns = [

    path('posts/new/', views.PostCreateView.as_view(), name='post-create')
]
```  

## 제네릭 뷰(Generic View)  
- 개발자들이 자주 쓸만한 view를 <u>하나의 형태</u>로 만들어 둔 것  
- 자주 사용하는 기능이 미리 구현되어 있어 제네릭 뷰를 상속하면 빠르게 제작 가능  


```python
# views.py

from django.views.generic import CreateView
from django.urls import reverse

class PostCreateView(CreateView):
    model = Post
    form_class = PostForm
    template_name = 'posts/post_form.html'

    def get_success_url(self):
        return reverse('post-detail', kwargs={'post_id': self.object.id})
```  

🔔 reverse()  
: 인자로 받은 url name으로 부터 거슬러 올라가서 url을 찾는 함수

### 제네릭 뷰의 예: 포스트 목록을 위한 뷰  

```python
# views.py

from django.views.generic import ListView
from django.urls import reverse

class PostListView(ListView):
    model = Post
    form_class = PostForm
    template_name = 'posts/post_list.html'
    context_object_name = 'posts'
    ordering = ['dt_created'] # 오름차순
    paginate_by = 6
    page_kwarg = 'page'
```  

```python
# urls.py

urlpatterns = [

    path('posts/', views.PostListView.as_view(), name='post-list')
]
```  

```html
# post_list.html

{% raw %}{% extends './base.html' %}{% endraw %}
{% raw %}{% load static %}{% endraw %}

{% raw %}{% block css %}{% endraw %}
    <link rel="stylesheet" href="{% raw %}{% static 'posts/css/post_list.css' %}{% endraw %}">
{% raw %}{% endblock css %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
    <div class="btn_post">
        <a href="{% raw %}{% url 'post-create'%}{% endraw %}">글쓰기</a>
    </div>
    {% raw %}{% if page_obj.object_list %}{% endraw %}
        <div class="post_container">
            {% raw %}{% for post in page_obj.object_list %}{% endraw %}
                <div class="post"><a href="{% raw %}{% url 'post-detail' post.id %}{% endraw %}">         
                    <h2 class="title">{% raw %}{{post.title}}{% endraw %}</h2>
                    <p class="date">{% raw %}{{post.dt_created}}{% endraw %}</p>
                    <p class="text">{% raw %}{{post.content|slice:":100"}}{% endraw %}</p>
                </a></div>
            {% raw %}{% endfor %}{% endraw %}
        </div>
        <div class="paginator">
            {% raw %}{% if page_obj.has_previous %}{% endraw %}
                <a href="?page=1" class="first">first</a>
                <a href="?page={% raw %}{{page_obj.previous_page_number}}{% endraw %}" class="prev">prev</a>
            {% raw %}{% endif %}{% endraw %}
        
            <span class="page">
                <p>{% raw %}{{page_obj.number}}{% endraw %} of {% raw %}{{page_obj.paginator.num_pages}}{% endraw %}</p>
            </span>

            {% raw %}{% if page_obj.has_next %}{% endraw %}
                <a href="?page={% raw %}{{page_obj.next_page_number}}{% endraw %}" class="next">next</a>
                <a href="?page={% raw %}{{page_obj.paginator.num_pages}}{% endraw %}" class="last">last</a>
            {% raw %}{% endif %}{% endraw %}
        </div>
    {% raw %}{% else %}{% endraw %}
        <div class="blank">
            <p>보여줄 글이 없어요.<br>첫 글을 작성해보면 어떨까요?</p>
        </div>
    {% raw %}{% endif %}{% endraw %}
{% raw %}{% endblock content %}{% endraw %}

```  

## 제네릭 뷰 정리  

### 1) Basic Views  
> 템플릿을 랜더해서 결과로 돌려주거나 다른 URL로 리디렉션 하는등의 기본적인 기능을 하는 뷰

#### TemplateView  
- TemplateView는 주어진 템플릿을 렌더링해서 보여주는 기능을 합니다.  

![](/images/d_generic_2.png){: width="100%"}  

#### RedirectView  
- RedirectView는 들어온 요청을 새로운 URL로 이동시키는 기능을 합니다.  

![](/images/d_generic_3.png){: width="100%"}  

### 2) Display Views  
> 데이터를 보여주는 기능을 하는 뷰  

#### ListView  
- ListView는 여러 데이터를 보여주는 기능을 합니다. 우리가 같이해봤던 '목록 보기'를 생각하면 됩니다.  

![](/images/d_generic_4.png){: width="100%"}  

#### DetailView  
- DetailView는 하나의 데이터를 보여주는 기능을 합니다. 우리가 같이해봤던 '상세 보기'를 생각하면 됩니다.  

![](/images/d_generic_5.png){: width="100%"}  

### 3) Edit Views  
> 데이터 생성, 수정, 삭제등의 기능을 하는 뷰  

#### FormView  
- FormView는 Form을 렌더링해서 보여주는 기능을 하는 뷰입니다.  

![](/images/d_generic_6.png){: width="100%"}  

#### CreateView  
- Createview는 새로운 데이터를 생성을 위한 뷰입니다.  

![](/images/d_generic_7.png){: width="100%"}  

#### UpdateView  
- UpdateView는 기존 데이터 개체의 수정을 위한 뷰입니다.  

![](/images/d_generic_8.png){: width="100%"}  

#### DeleteView  
- DeleteView는 기존 데이터를 삭제하는 기능을 위한 뷰입니다.  

![](/images/d_generic_9.png){: width="100%"}  

### 4) Date Views  
> 날짜를 중심으로 데이터를 조회하는 기능을 하는 뷰  

# 제네릭 뷰의 Context  
- Context는 View에서 Template으로 전달되어 렌더링시 사용할 수 있는 사전형 데이터 변수로, render 함수의 세 번째 파라미터로 넘겨서 사용합니다.  
- Django의 Generic 뷰는 이러한 Context를 각각의 기능에 맞게 자동으로 Template에 전달합니다.  
- 하나의 데이터를 다루는 View는 하나의 데이터를 'object'라는 키워드로 전달하고 여러개의 데이터를 다루는 View는 'object_list'라는 키워드로 전달합니다.  
- 같은 데이터를 'model' 클래스 변수에 명시한 Model을 보고 소문자로 변형해 함께 전달합니다.  

## 예시: DetailView  

```python
from django.views.generic import DetailView
from .models import Post

class PostDetailView(DetailView):
    model = Post
    ...
```
DetailView는 하나의 데이터를 다루는 로직을 수행합니다. 그래서 위처럼 model 클래스 변수를 지정하면 자동으로 ‘object’라는 키워드로 데이터베이스에서 조회한 하나의 Post 데이터를 Template에 전달합니다. 그러면 Template에서는 템플릿 변수를 사용해서 {{object.title}} 같은 형태로 접근할 수 있는거죠. 그리고 이 object와 똑같은 데이터를 모델명을 소문자로 쓴 형태인 post로도 Template에 함께 전달합니다. 그러니까 같은 데이터가 object와 post 두 개의 키워드로 전달되는거죠. 이렇게 되면 우리는 Template에서 조금 더 직관적인 {{post.title}} 같은 형태로 사용할 수 있습니다.  

## 예시: ListView

```python
from django.views.generic import ListView
from .models import Post

class PostListView(ListView):
    model = Post
    ...
```
이번에는 ListView를 예로 들어볼게요. ListView는 여러 데이터를 다루는 로직을 수행하죠? 그래서 model 클래스 변수를 지정하면 자동으로 데이터베이스에서 조회한 Post 데이터 목록을 object_list라는 키워드로 Template에 전달합니다. 그리고 이때 똑같은 데이터를 model 키워드 변수에 명시된 모델을 참고하여 소문자로 쓴 형태인 <model_name>_list 즉 post_list 키워드로도 context를 전달합니다. 그러니까 Template에서는 object_list와 post_list 두 개의 키워드로 Post 데이터 목록에 접근할 수 있는겁니다.  

## context_object_name  

- generic 뷰가 자동으로 모델을 보고 생성하는 context 키워드를 변경해 주는 것이 바로 context_object_name 입니다.  
- context 중 바로 모델명을 보고 유추하는 <model_name> 또는 <model_name>_list 같은 이름들을 바꿔주는 것 입니다. Django가 알아서 모델명을 보고 유추해서 넘겨주는 context 이름을 커스터마이징 할 수 있습니다.  

```python
from django.views.generic import ListView
from .models import Post

class PostListView(ListView):
    model = Post
    context_object_name = 'posts'
    ...
```
context_object_name을 위와 같이 명시해주면 post_list 가 posts로 변경되어 전달됩니다. 그러니까 Post 데이터목록이 object_list와 posts 두 개의 키워드로 전달되게 되는거죠. 이렇게 generic 뷰가 자동으로 모델을 보고 생성하는 context 키워드를 변경해 주는 것이 바로 context_object_name 입니다.  

![](/images/d_generic_10.png){: width="100%"}  