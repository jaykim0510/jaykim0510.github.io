---
layout: post
title:  'Django Series [Part10]: 장고의 이것저것'
description: 
date:   2022-01-10 15:01:35 +0300
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

# Seeding

- 사용할 데이터를 데이터베이스에 추가하는 것
- 테스트를 위해서, 혹은 초기에 필요한 데이터를 데이터베이스에 입력해야할 때

```sh
python3 manage.py loaddata <json파일>
```

# Pagination

```python
from django.core.paginator import Paginator

posts = Post.objects.all()

pages = Paginator(posts, 6)

page = pages.page(1)

page.object_list

page.has_next()
page.has_previous()

page.next_page_number()
```

```python
# Function Based View

def post_list(request):
    posts = Post.objects.all()

    pages = Paginator(posts, 6)
    cur_page_num = request.GET.get('page')
    if cur_page_num is None:
        cur_page_num = 1
    page = pages.page(cur_page_num)

    return render(request, 'posts/post_list.html', {'page': page})

```

```python
# Class Based View

class PostListView(ListView):
    ...
    paginate_by = 6
    page_kwarg = 'page'

```

```html
# posts/post_list.html

{% raw %}{% if page.object_list %}{% endraw %}
    {% raw %}{% for post in page.object_list %}{% endraw %}
        <h2>{% raw %}{{post.title}}{% endraw %}</h2>
        ...
    {% raw %}{% endfor %}{% endraw %}

    # 페이지네이터

    <a href=?page=1>first</a>
    {% raw %}{% if page.has_previous %}{% endraw %}
        <a href="?page={% raw %}{{ page.previous_page_number }}{% endraw %}">prev</a>
    {% raw %}{% endif %}{% endraw %}

    <span>
        <p>{% raw %}{{ page.number }}{% endraw %} of {% raw %}{{ page.paginator.page_number }}{% endraw %}</p>
    </span>

    {% raw %}{% if page.has_next %}{% endraw %}
        <a href="?page={% raw %}{{ page.next_page_number }}{% endraw %}">next</a>
    {% raw %}{% endif %}
    <a href="?page={% raw %}{{ page.paginator.page_number }}{% endraw %}">last</a>

{% raw %}{% endif %}{% endraw %}

```


# User

