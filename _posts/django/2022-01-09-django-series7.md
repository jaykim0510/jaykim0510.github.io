---
layout: post
title:  'Django Series [Part7]: Form'
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



# 폼(Form)  
- 폼은 웹 페이지에서 사용자의 데이터를 입력받을 수 있는 입력 양식
- 사용자가 입력한 데이터를 서버로 전송하기 위한 방식  

![](/images/d_form_1.png){: width="100%"}  


-  form을 사용할 때는 사용자로부터 데이터를 입력받아서 저장, 수정 등의 데이터베이스와 관련된 로직을 많이 수행하므로, form에서는 대부분의 경우 POST를 사용한다고 생각하면 됩니다.

## 폼이 처리되는 과정  

1. 유저가 서버에게 FORM 양식 요청(GET방식)

2. 서버가 유저에게 언 바운드폼(사용자로부터 아직 데이터를 받은 것이 아니므로) 응답  

3. 유저가 서버로부터 받은 폼의 양식에 맞춰 데이터를 전송(POST방식)  

4. 서버는 유저로부터 받은 데이터를 폼에 바인딩

5. 바운드 폼의 데이터가 올바르지 않으면 다시 입력하도록 응답  

6. 입력된 데이터가 유효하면 서버는 로직을 수행(수정, 저장)한 후 유저에게 새로운 페이지 응답

폼 METHOD: GET, POST

폼 태그 안에 사용되는 TAG: INPUT, LABEL

INPUT 태그의 TYPE: EMAIL, PW, BUTTON, RADIO, CHECKBOX, DATE, FILE, SUBMIT  

![](/images/d_form_6.png){: width="60%"}  

![](/images/d_form_7.png){: width="60%"}  

![](/images/d_form_8.png){: width="60%"}  

## 폼 만들기  
- 폼을 만드는 과정은 모델과 상당히 비슷합니다.  

- 폼은 웹 페이지에서 사용자의 데이터를 입력받을 수 있는 입력 양식으로 사용자가 입력한 데이터를 서버로 전송하기 위한 방식입니다.  

- 따라서 우리는 글을 작성하기 위한 템플릿을 폼을 이용해 만들어보려고 합니다.  

```python
# urls.py  

from django.urls import path
from . import views

urlpatterns = [

    path('diary/write/', views.page_create, name='page-create'),
]
```

```python
# views.py  

def page_create(request):
    if request.method == 'POST': # 만약 요청 방식이 POST라면
        new_page = Page( # 입력된 데이터를 가져와서 Page 데이터 모델을 만들고
            title=request.POST['title'],  
            content=request.POST['content'],
            feeling=request.POST['feeling'],
            score=request.POST['score'],
            dt_created=request.POST['dt_created']
        )
        new_page.save() # 데이터베이스에 저장한 후
        return redirect('page-detail', page_id=new_page.id) # 상세 일기 보기 페이지로 안내합니다.
    
    else: # 만약 요청 방식이 GET이라면
        form = PageForm() # 새로운 form을 만들고 (빈 폼)
        return render(request, 'diary/page_form.html', {'form': form}) 
```

```py
# forms.py  

from django import forms

class PageForm(forms.Form):
    title = forms.CharField(max_length=100, label='제목')
    content = forms.CharField(widget=forms.Textarea, label='내용')
    feeling = forms.CharField(max_length=80, label='감정 상태')
    score = forms.IntegerField(label='감정 점수')
    dt_created = forms.DateField(label='작성일')
```

```html
# page_form.html

<form method="post">{% raw %}{% csrf_token %}{% endraw %}
    {% raw %}{{form.as_p}}{% endraw %}
    <input type="submit" value="작성하기">
</form>
```


🔔 크로스 사이트 요청 위조(CSRF, Cross-Site Request Forgery)  

: 웹 사이트에서 유저가 서버로 요청을 보내는 행위를 악의적으로 변경해서 요청을 전송하는 것입니다. 내가 요청하지 않은 일인데 내가 요청한 것처럼 처리되는 거죠.  
Cross-Site라는 말이 붙은 이유는 악성 사이트에서 보안이 취약한 사이트로 우회 요청을 보내기 때문입니다.
크로스 사이트 요청 위조를 방지하는 방법으로 많이 사용하는 것이 바로 CSRF 위조 방지 토큰(Cross Site Request Forgery Token)입니다. 요청 위조 방지 토큰은 서버로부터 폼을 요청할 때 발행되어 유저가 폼에 데이터를 입력하고 서버로 전송할 때 이 토큰 값을 함께 전달해서 서버에서 토큰 값을 비교한 뒤 요청을 처리하는 방식을 말합니다. 그래서 요청 검증 토큰(Request Verification Token)라고 부르기도 합니다. 이렇게 처리하면 악성 사이트가 폼을 전송할 때 이 위조 방지 토큰 값을 알 수 없기 때문에 서버에서 사용자가 직접 보낸 요청인지를 검증할 수 있게 되는 거죠.


# 모델 폼(Model Form)  
- 폼 필드를 각각 정의해 주지 않아도 모델의 필드를 보고 자동으로 장고가 유추해서 폼 필드를 만들어 준다는 것입니다.  
- 이를 위해 Meta 클래스를 이용해 사용할 모델과 입력받을 모델 필드를 명시해 주어야 합니다.  

```python
# forms.py  

from django import forms
from .models import Page # 사용할 모델을 가져옵니다.

class PageForm(forms.ModelForm):

    class Meta:
        model = Page # 모델 폼에서 사용할 모델과 필드를 명시합니다.
        fields = ['title', 'content', 'feeling', 'score', 'dt_created']
```  

```python
# views.py

def page_create(request):
    if request.method == 'POST':
        form = PageForm(request.POST) # 입력된 데이터와 폼을 합쳐서 바인딩 폼을 만듭니다.
        new_page = form.save() # 데이터 저장 및 생성된 데이터 모델 반환
        return redirect('page-detail', page_id=new_page.id)

    else: # 만약 요청 방식이 GET이라면
        form = PageForm() # 새로운 form을 만들고 (빈 폼)
        return render(request, 'diary/page_form.html', {'form': form}) 
```  


# 데이터 유효성 검증  

![](/images/d_form_9.png){: width="60%"}  

## 유효성 검증의 예
- 모든 항목을 빈칸 없이 채워주세요.  
- 제목은 50자까지만 작성해 주세요.  
- 다른 제목과 중복되지 않게 해주세요.
- 내용에는 #과 @를 쓸 수 없어요.  

🔔 blank 와 null  
- blank: 비어있는 값을 허용하면 blank=True
- null: 비어있는 값이 있는 경우 그 값을 null로 저장하려면 null=True  

## 유효성 검증할 수 있는 방법  

### 1. Field를 정의할 때 필요한 옵션을 인자로 주기  

- 모델 폼을 이용해 폼을 정의할 것이기 때문에 우리의 <u>모델에 있는 Field</u>에 유효성 검사를 위한 옵션을 인자로 주면 됩니다.  

```python
# models.py

from django.db import models

class Page(models.Model):
    title = models.CharField(max_length=100, unique=True)
    content = models.TextField()
    feeling = models.CharField(max_length=80)
    score = models.IntegerField()
    dt_created = models.DateField()

    def __str__(self):
        return self.title
```

- 그리고 입력으로 받은 데이터가 유효한지 안한지에 따라 유저에게 다른 방식으로 응답해주면 됩니다.  

```python
# views.py  

def page_create(request):
    if request.method == 'POST':
        form = PageForm(request.POST) # 입력된 데이터와 폼을 합쳐서 바인딩 폼을 만듭니다.

        if post_form.is_valid():
            new_page = form.save() # 데이터 저장 및 생성된 데이터 모델 반환
            return redirect('page-detail', page_id=new_page.id)

    else: # 만약 요청 방식이 GET이라면
        form = PageForm() # 새로운 form을 만들고 (빈 폼)

    return render(request, 'diary/page_form.html', {'form': form}) 
```

### 2. Validator 추가하기  

- 값을 받아 유효성 기준을 충족하지 않으면 ValidationError를 발생시키는 함수

- 장고에서 제공하는 Built-in Validator가 있으며 원하면 직접 정의할 수 도 있습니다.  

#### 2-1 Built-in Validator  

[장고 공식문서 참고](https://docs.djangoproject.com/en/3.2/ref/validators/)

```python
# models.py

from django.core.validators import MinLengthValidator

class Page(models.Model):

    content = models.TextField(validators=[MinLengthValidator(10, 'Too short!')])
```

#### 2-2 Custom Validator  

```python
# validators.py 파일 생성  

from django.core.exceptions import ValidationError

def validate_symbols(value):
  if ("@" in value) or ("#" in value):
    raise ValidationError('"@"와 "#"은 포함될 수 없습니다.', code='symbol-err')
```  

```python
# models.py

from django.core.validators import MinLengthValidator
from .validators import validate_symbols

class Page(models.Model):

    content = models.TextField(validators=[MinLengthValidator(10, 'Too short!'), validate_symbols])
```

🔔 폼에서 유효성 검증하기  
: 모델과 관련이 없는 데이터를 입력으로 받아야 할 때는 모델 폼이 아닌 <U>일반 폼</U>으로 작성해야 하므로 이 때의 유효성 검사는 무조건 폼에서 해야 합니다.  
작성 방법은 모델에 적용할 때와 같습니다.  


# 폼을 위한 템플릿 다루기  

앞에서는  

```html
# page_form.html

<form method="post">{% raw %}{% csrf_token %}{% endraw %}
    {% raw %}{{form.as_p}}{% endraw %}
    <input type="submit" value="작성하기">
</form>
```

이런 식으로 작성했는데 `{% raw %}{{form.as_p}}{% endraw %}` 이렇게만 나타내면 각각의 값들을 그저 <p> 태그로만 감싸게 될 뿐 너무 못생겼습니다. 그래서 조금 더 예쁘게 템플릿을 커스텀 해보겠습니다.  

```html
# page_form.html

<form method="post">{% raw %}{% csrf_token %}{% endraw %}
    <h3>제목</h3>
    <p>{% raw %}{{form.title}}{% endraw %}</p>
    {% raw %}{% for error in form.title.errors %}{% endraw %}
        <p>{% raw %}{{error}}{% endraw %}</p>
    {% raw %}{% endfor %}{% endraw %}
    <h3>내용</h3>
    <p>{% raw %}{{form.content}}{% endraw %}</p>
    {% raw %}{% for error in form.content.errors %}{% endraw %}
        <p>{% raw %}{{error}}{% endraw %}</p>
    {% raw %}{% endfor %}{% endraw %}
    <input type="submit" value="작성하기">
</form>
```

# 폼에 CSS 적용하기  

- CSS적용하고 싶은 태그에 클래스를 정의해서 그 클래스에 적용할 CSS를 담는 `form.css` 파일을 만듭니다.  

```html
# page_form.html

<form method="post">{% raw %}{% csrf_token %}{% endraw %}
    <h3>제목</h3>

    ...

        <p class="error">{% raw %}{{error}}{% endraw %}</p>
    
    ...
        <p class="error">{% raw %}{{error}}{% endraw %}</p>

    ...

    <input type="submit" value="작성하기">
</form>
```

```css
# form.css

.class {
    color: red; 
}
```

- `base.html`로 부터 상속받고 그 안에 쏙쏙 집어넣습니다.  

```html
# page_form.html

{% raw %}{% extends './base.html' %}{% endraw %}
{% raw %}{% load static %}{% endraw %}

{% raw %}{% block css %}
    <link rel="stylesheet" href="{% raw %}{% static 'posts/css/form.css %}{% endraw %}">
{% raw %}{% endblock css %}{% endraw %}

{% raw %}{% block content %}
  <form method="post">{% raw %}{% csrf_token %}{% endraw %}
      <h3>제목</h3>

      ...

          <p class="error">{% raw %}{{error}}{% endraw %}</p>
      
      ...
          <p class="error">{% raw %}{{error}}{% endraw %}</p>

      ...

      <input type="submit" value="작성하기">
  </form>
{% raw %}{% endblock content %}{% endraw %}
```  

# 필드를 가지는 데이터에 CSS 적용하기  

- 앞에서 `error`에는 그냥 <p>태그에 클래스를 바로 정의하여 CSS 적용이 가능했지만, {{form.title}}과 같은 필드를 가지는 데이터는 위와 같이 적용이 불가능합니다.   
- 그 이유는 필드를 가지는 데이터는 기본적인 디폴트 위젯을 가지고 있기 때문입니다. 따라서 클래스나 아이디를 정의하기 위해서는 위젯에 접근해야 합니다.  

![](/images/d_form_12.png){: width="60%"}  

```python
# forms.py  

from django import forms
from .models import Page # 사용할 모델을 가져옵니다.

class PageForm(forms.ModelForm):

    class Meta:
        model = Page # 모델 폼에서 사용할 모델과 필드를 명시합니다.
        fields = ['title', 'content', 'feeling', 'score', 'dt_created']

        widgets = {'title': forms.TextInput(attrs={'class':'title',
                                                    'placeholder':'제목을 입력하세요'}),
                    'content': forms.Textarea(attrs={'placeholder': '내용을 입력하세요'})
                    }
```  

`{% raw %}{{form.title}}{% endraw %}` 데이터의 클래스는 `'title'`이라고 정의했으므로 이제 CSS파일에 적당히 꾸미고자 하는 내용을 넣을 수 있다.

```css
# form.css

.title {
    width: 400px;
}
```  

# 포스트 수정(Update) 구현하기  

- 유저가 자신이 작성했던 글에 접근해 그 글을 다시 수정하는 기능을 구현해보도록 하겠습니다.  

- 여기서 핵심은 유저가 포스트를 수정할 때 빈 포스트가 아니라 작성했던 글에서 가져온다는 사실입니다.  


```python
# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('diary/page/<int:page_id>/edit/', views.page_update, name='page-update'),
]  
```   

```html
# page_detail.html

{% raw %}{% extends './base.html' %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
<div class="wrap-notetext">
    <div class="notetext">
        <div class="text-box">
           ...
            <div class="notetext-btn">
                <ul>
                    <li><a href="#">삭제하기</a></li>
                    <li><a href="{% raw %}{% url 'page-update' object.id %}{% endraw %}">수정하기</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
{% raw %}{% endblock content %}{% endraw %}
```

```python
# views.py

def page_update(request, page_id):
    object = Page.objects.get(id=page_id)
    if request.method == 'POST':
        form = PageForm(request.POST, instance=object)
        if form.is_valid():
            form.save()
            return redirect('page-detail', page_id=object.id)
    else:
        form = PageForm(instance=object)
    return render(request, 'diary/page_form.html', {'form': form})
```

Update는 새로 Page 데이터 모델을 만들어서 저장하는 것이 아니라 기존의 데이터 모델을 수정해야 하므로 PageForm의 `instance 파라미터`로 조회한 데이터 모델을 넘겨주어야 합니다.  


# 포스트 삭제(Delete) 구현하기  

```python
# urls.py

from django.urls import path
from . import views

urlpatterns = [
   
    path('diary/page/<int:page_id>/delete/', views.page_delete, name='page-delete'),
]
```

```html
# page_detail.html

<!-- page_detail.html -->
{% raw %}{% extends './base.html' %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
<div class="wrap-notetext">
    <div class="notetext">
        ...
            <div class="notetext-btn">
                <ul>
                    <li><a href="{% raw %}{% url 'page-delete' object.id %}{% endraw %}">삭제하기</a></li>
                    <li><a href="{% raw %}{% url 'page-update' object.id %}{% endraw %}">수정하기</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
{% raw %}{% endblock content %}
```

```python
# page_delete.py

def page_delete(request, page_id):
    object = Page.objects.get(id=page_id)
    if request.method == 'POST':
        object.delete()
        return redirect('page-list')
    else: # 만약 요청이 GET 방식이라면
                # page_confirm_delete.html을 랜더해서 돌려주도록 합니다.
                # 이때 삭제 확인 페이지에서 글의 제목을 보여줄 수 있도록 object를 함께 넘겨줍니다.
        return render(request, 'diary/page_confirm_delete.html', {'object': object})
```

```html
# page_confirm_delete.html

{% raw %}{% extends './base.html' %}{% endraw %}

{% raw %}{% block content %}{% endraw %}
<div class="wrap-delete">
    <div class="delete-box">
        <div class="note-info">
            <p>&#123;</p>
            <span class="note-date">{% raw %}{{object.dt_create}}{% endraw %}</span>
            <span class="note-title">{% raw %}{{object.title}}{% endraw %}</span>
            <p>&#125;</p>
        </div>
        <p>이 하루를 지울까요?</p>
        <form method='post'>{% raw %}{% csrf_token %}{% endraw %}
            <ul>
                <li><input type="submit" value="지우기"></li>
                <li><a href="{% raw %}{% url 'page-detail' object.id%}{% endraw %}">남기기</a></li> 
            </ul>
        </form>
    </div>
</div>
{% raw %}{% endblock content %}{% endraw %}
```