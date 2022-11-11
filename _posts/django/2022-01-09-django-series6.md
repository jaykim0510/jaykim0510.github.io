---
layout: post
title:  'Django Series [Part6]: Template'
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


- 템플릿은 동적으로 화면을 렌더링 해준다
- 기존의 HTML 언어에 템플릿 언어가 녹아있다
- 템플릿과 폼 파일은 `templates/<앱이름>` 디렉터리에 저장한다
- css, js, png, font 와 같은 정적 파일은 static 디렉터리에 저장한다

- 정적 파일을 템플릿에 사용하고자 할 때는 다음과 같이 적어준다

```
 # index.html
{% raw %}{% load static %}{% endraw %}
```

- `{% raw %}{% load static %}{% endraw %}` 이런 것을 템플릿 언어(Template language) 중에서 템플릿 태그라고 한다

# 템플릿 언어

- HTML에 **동적인 능력을 부여**
- 템플릿 언어는 크게 **템플릿 변수**, **템플릿 태그**, **템플릿 필터**, **템플릿 주석**이 있다

## 템플릿 변수

- View에서 넘겨받은 Model 데이터를 변수로 사용할 수 있다
- `{% raw %}{{ 변수명 }}{% endraw %}` 이런식으로 사용한다

## 템플릿 필터

- 변수에 필터를 적용할 수 있다
- `{% raw %}{{ 변수명|필터 }}{% endraw %}`
- (ex. `{% raw %}{{ post.title|upper }}{% endraw %}`)

## 템플릿 태그

- 템플릿에 로직을 적용할 수 있다
- `{% raw %}{% static <정적파일 경로> %}{% endraw %}`, `{% raw %}{% for %}{% endfor %}{% endraw %}`, `{% raw %}{% if %}{% else %}{% endif %}{% endraw %}`, `{% raw %}{% block %}{% endblock %}{% endraw %}` 등이 있다


```
# 정적 파일 경로에 문자열이 아니라 변수를 주고 싶은 경우,

# 이런식으로 쓰면 안된다
{% raw %}{% static {{ 변수명 }} %}{% endraw %}

# 올바른 방법
{% raw %}{{% get_static_prefix %}{{img_path}}{% endraw %}

<img src={% raw %}{% get_static_prefix %}{{img_path}}{% endraw %}>
```

# 템플릿 상속

- 템플릿 안에 다른 템플릿을 가져와서 포함시킬 수 있다
- 또 다른 템플릿을 상속받을 수도 있다

```html
# base.html (부모 템플릿)  

<html lang="en">
{% raw %}{% include 'head.html' %}{% endraw %}

<body>

    {% raw %}{% include 'header.html' %}{% endraw %}

    {% raw %}{% block content %}{% endraw %}
    {% raw %}{% endblock %}{% endraw %}

    {% raw %}{% include 'footer.html' %}{% endraw %}

</body>
</html>
```

```html
# create.html (자식 템플릿)  

{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}

{% raw %}{% block content %}{% endraw %}

  <div>
      <form action="{% raw %}{% url 'accountapp:create' %}{% endraw %}" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" class="btn btn-dark rounded-pill col-6 mt-3">
      </form>
  </div>

{% raw %}{% endblock %}{% endraw %}
```