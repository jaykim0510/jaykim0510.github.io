---
layout: post
title: "Django Series [Part10]: 장고의 이것저것"
description:
date: 2022-01-10 15:01:35 +0300
image: "/images/django_logo.png"
logo_image: "/images/django_logo.png"
categories: web_development
tags: [Django]
---

---

**Table of Contents**
{: #toc }

- TOC
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
# posts/post_list.html {% raw %}{% if page.object_list %}{% endraw %} {% raw
%}{% for post in page.object_list %}{% endraw %}
<h2>{% raw %}{{post.title}}{% endraw %}</h2>
... {% raw %}{% endfor %}{% endraw %} # 페이지네이터

<div>
  <a href="?page" ="1">first</a>
  {% raw %}{% if page_obj.has_previous %}{% endraw %}
  <a href="?page={% raw %}{{ page_obj.previous_page_number }}{% endraw %}"
    >prev</a
  >
  {% raw %}{% endif %}{% endraw %}
  <span
    >{% raw %}{{ page_obj.number }}{% endraw %} of {% raw %}{{
    page_obj.paginator.num_pages }}{% endraw %}</span
  >

  {% raw %}{% if page_obj.has_next %}{% endraw %}
  <a href="?page={% raw %}{{ page_obj.next_page_number }}{% endraw %}">next</a>
  {% raw %}{% endif %}{% endraw %}
  <a href="?page={% raw %}{{ page_obj.paginator.num_pages }}{% endraw %}"
    >last</a
  >
</div>

{% raw %}{% endif %}{% endraw %}
```

# User

## 패키지

- `django.contrib.auth`: 장고에 기본적으로 설치된 패키지 ([소스코드 참고](https://github.com/django/django/tree/main/django/contrib/auth))
- `django-allauth`: 별도로 설치해야 하는 패키지 ([소스코드 참고](https://github.com/pennersr/django-allauth/tree/master/allauth/account))

- 보통 모델만 `django.contrib.auth` 에서 가져오고,
- 나머지 url, view, form과 관련된 기능들은 `django-allauth`에서 가져온다
- `django-allauth`는 이메일 존재여부 확인, SNS 아이디를 통한 로그인과 같은 기능들을 제공해준다
- 또 django.contrib.auth는 view를 직접 구현해야하지만, django-allauth는 간단한 설정으로 가능하다

📦 **django-allauth 설치**

- [공식문서 참고](https://django-allauth.readthedocs.io/en/latest/installation.html)
- `pip install django-allauth`

```py
# settings.py

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]

# https://django-allauth.readthedocs.io/en/latest/configuration.html 참고
ACCOUNT_SIGNUP_REDIRECT_URL = '<회원가입 후 리다이렉트할 url>'
LOGIN_REDIRECT_URL = '<로그인 후 리다이렉트할 url>'
ACCOUNT_LOGOUT_ON_GET = True

INSTALLED_APPS = [
    # The following apps are required:
    'django.contrib.auth',
    'django.contrib.messages',
    'django.contrib.sites',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',]

SITE_ID = 1
```

```py
# urls.py

urlpatterns = [
    ...
    path('accounts/', include('allauth.urls')),
    ...
]
```

```
python3  manage.py migrate
```

```
python3 manage.py runserver
```

```
localhost:8000/accounts/login
```

## 유저 모델

- `django.contrib.auth` 에는 기본유저 모델도 제공해주고, 상속 받아서 쓸 수 있는 추상클래스 모델도 제공해준다
- 기본유저 모델: `User` (나중에 필드 추가하기 어려워지기 때문에 장고에서 권장하지 않음)
- 추상클래스 모델: `AbstractUser`, `AbstractBaseUser`
- (`AbstractUser`는 기본적으로 username, email 등과 같은 필드가 설정되어 있음)

```py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
```

```py
# settings.py

# 유저 모델 정의한 앱이름.모델명
AUTH_USER_MODEL = 'users.User'
```

```sh
python3 manage.py makemigrations
python3 manage.py migrate
```

```py
# admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# 이렇게 UserAdmin을 붙여주면, 어드민 페이지에서 User를 위한 편리한 인터페이스를 제공
admin.site.register(User, UserAdmin)
```

- 필드 추가

```py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    nickname = models.CharField(max_length=15, unique=True, null=True)
```

```py
# admin.py

# 별도로 추가한 필드는 추가 등록해줘야 인터페이스에 보인다
# Custom fields 라는 섹션에 nickname 필드 추가
UserAdmin.fieldsets += ("Custom fields", {"fields": ("nickname",)})
```

```py
# forms.py

# django-allauth 에서 기본적으로 제공하는 회원가입 폼이 있다
# 하지만 보통 회원가입 폼은 커스텀하는 경우가 많다
# 폼은 아래와 같이 커스터마이징 할 수 있다
from django import forms
from .models import User

class SignUpForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['nickname'] # 별도로 추가한 필드만 적어주면 된다. 없으면 fields = '__all__'

    def signup(self, request, user):
        user.nickname = self.cleaned_data['nickname']
        user.save()
```

```py
# settings.py

ACCOUNT_SIGNUP_FORM_CLASS = 'users.forms.SignUpForm'
```

## 유저 접근

- View: `request.user`

```
request.user
request.user.email
request.user.is_authenticated
```

- Template: `{% raw %}{{ user }}{% endraw %}`

```
{% raw %}{% if user.is_authenticated %}{% endraw %}
    <a href="{% raw %}{% url 'account_logout' %}{% endraw %}">로그아웃</a>
{% raw %}{% else %}{% endraw %}
    <a href="{% raw %}{% url 'account_login' %}{% endraw %}">로그인</a>
    <a href="{% raw %}{% url 'account_signup' %}{% endraw %}">회원가입</a>
{% raw %}{% endif %}{% endraw %}

```

## 세션 설정

- 세션: 웹 서버에 저장된 유저의 방문 기록
- 보통 브라우저 탭을 닫으면 로그인 풀림 (쿠키에 저장된 session id가 삭제되기 때문)
- 이를 설정을 통해 제어할 수 있음

```py
# settings.py

# 탭 닫아도 쿠키가 바로 삭제 되지 않음 -> 로그인 유지시킬 수 있음
ACCOUNT_SESSION_REMEMBER = True

# 쿠키 생명주기 설정 (기본값은 2주)
SESSION_COOKIE_AGE = 3600 # (1시간)
```

- 웹 서버에는 세션 정보가 삭제되지 않고 계속 쌓임
- 이를 중간중간 삭제해줄 필요가 있음

```sh
python3 manage.py clearsessions
```

## django-allauth URL

|URL 경로|URL 명|설명|
|'signup/'|'account_signup'|회원가입 페이지|
|'login/'|'account_login'|로그인 페이지|
|'logout/'|'account_logout'|로그아웃 페이지 (ACCOUNT_LOGOUT_ON_GET = True 사용시 바로 로그아웃)|
|'confrim-email//'|'account_confirm_email'|이메일 인증 페이지(ACCOUNT_CONFIRM_EMAIL_ON_GET = True 사용시 바로 인증 완료 됩니다.)|
|'password/change/'|'account_change_password'|비밀번호 변경 페이지|
|'password/reset/'|'account_reset_password'|비밀번호 찾기 페이지 (비밀번호 재설정 링크를 받을 이메일을 입력하는 페이지)|
|'password/reset/done/'|'account_reset_password_done'|비밀번호 재설정 이메일 전송 완료 페이지|
|'password/reset/key//|'account_reset_password_from_key'|비밀번호 재설정 페이지 (새 비밀번호를 설정하는 페이지)|
|'password/reset/key/done/|'account_reset_password_from_key_done'|비밀번호 재설정 완료 페이지|

## django-allauth 유용한 설정값

|변수|가능한 값|기본값|설명|
|ACCOUNT_AUTHENTICATION_METHOD|"username" , "email" , "username_email"|"username"|로그인 방법을 설정합니다. "username": 유저네임 사용, "email": 이메일 사용, "username_email": 둘 다 사용 가능|
|ACCOUNT_CONFIRM_EMAIL_ON_GET|True , False|False|True: 이메일 인증 링크를 클릭하면 바로 인증이 됩니다, False: 이메일 인증 링크를 클릭하면 인증 confirmation 페이지로 갑니다.|
|ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL|URL (URL 경로, URL 네임 모두 가능)|LOGIN_URL (아래 참고)|로그인이 안된 상태로 인증을 완료했을 때 리디렉트되는 URL.|
|ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL|URL (URL 경로, URL 네임 모두 가능)|LOGIN_REDICRECT_URL (아래 참고)|로그인이 된 상태로 인증을 완료했을 때 리디렉트되는 URL.|
|ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS|이메일 인증 링크 만료 기간 (단위: 일)|3|이메일 인증 링크 만료 기간|
|ACCOUNT_EMAIL_REQUIRED|True , False|False|회원가입 시 이메일을 꼭 입력해야 하는지를 결정합니다. True: 이메일을 꼭 입력해야 합니다, False: 이메일 필드는 옵셔널 필드입니다.|
ACCOUNT_EMAIL_VERIFICATION|"mandatory" , "optional" , "none"|"optional"|이메일 인증 필요 여부를 설정합니다. "mandatory": 회원가입 시 인증 이메일이 발송되고, 인증을 완료해야만 로그인을 할 수 있습니다, "optional": 회원가입 시 인증 이메일이 발송되지만, 인증이 필수는 아닙니다, "none": 인증 이메일이 발송되지 않습니다.|
|ACCOUNT_LOGIN_ATTEMPTS_LIMIT|최대 로그인 실패 횟수|5|최대 로그인 실패 횟수|
|ACCOUNT_LOGIN_ATTEMPTS_TIMEOUT|로그인이 잠기는 기간 (단위: 초)|300|로그인 시도가 ACCOUNT_LOGIN_ATTEMPTS_LIMIT을 초과하면 설정하는 시간만큼 로그인이 잠깁니다.|
|ACCOUNT_LOGOUT_ON_GET|True , False|False|True: 로그아웃 링크를 클릭하면 바로 로그아웃이 됩니다, False: 로그아웃 링크를 클릭하면 로그아웃 confirmation 페이지로 갑니다.|
|ACCOUNT_LOGOUT_REDIRECT_URL|URL (URL 경로, URL 네임 모두 가능)|"/"|로그아웃 시 리디렉트되는 URL
|ACCOUNT_PASSWORD_INPUT_RENDER_VALUE|True , False|False|폼 유효성 검사를 실패할 경우, 입력했던 비밀번호가 채워진 상태로 폼이 돌아오는지를 설정합니다.|
|ACCOUNT_SESSION_REMEMBER|None , True , False|None|브라우저를 닫으면 유저를 로그아웃 시킬지를 결정합니다. None: 유저가 체크박스를 통해 선택하게 합니다, True: 브라우저를 닫아도 로그인을 유지합니다, False: 브라우저를 닫으면 유저를 로그아웃 시킵니다.|
|ACCOUNT_SIGNUP_EMAIL_ENTER_TWICE|True , False|False|회원가입시 이메일을 두 번 입력해야 하는지를 설정합니다.|
|ACCOUNT_SIGNUP_FORM_CLASS|폼 클래스 (e.g. 'myapp.forms.SignupForm')|None|회원가입 페이지에서 추가 정보를 받아야 할 때, 사용할 폼 클래스를 지정해 줍니다.|
|ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE|True , False|False|회원가입 시 비밀번호를 두 번 입력해야 하는지를 설정합니다.|
|ACCOUNT_SIGNUP_REDIRECT_URL|URL (URL 경로, URL 네임 모두 가능)|LOGIN_REDIRECT_URL (아래 참고)|회원가입 성공 시 리디렉트되는 URL|
|ACCOUNT_USERNAME_REQUIRED|True , False|True|회원가입 시 유저네임을 입력해야 하는지를 결정합니다. True: 유저네임을 입력해야 합니다, False: 유저네임을 입력받지 않습니다.|
|LOGIN_REDIRECT_URL|URL (URL 경로, URL 네임 모두 가능)|'/accounts/profile/'|성공적인 로그인 시 리디렉트되는 URL|
|LOGIN_URL|URL (URL 경로, URL 네임 모두 가능)|'/accounts/login/'|웹사이트의 로그인 URL|
|PASSWORD_RESET_TIMEOUT|비밀번호 재설정 링크 만료 기간 (단위: 초)|259200 (3일)|비밀번호 재설정 링크 만료 기간 (Django 3.1 이후 버전에서만 지원)|
|PASSWORD_RESET_TIMEOUT_DAYS|비밀번호 재설정 링크 만료 기간 (단위: 일)|3|비밀번호 재설정 링크 만료 기간 (Django 3.0 이전 버전에서만 지원)|
|SESSION_COOKIE_AGE|세션 쿠키 만료 기간 (단위: 초)|1209600 (2주)|세션 쿠키 만료 기간 (로그인을 얼마나 오랫동안 유지할 것인지)|

## 접근 제어

- 로그인을 해야 글을 작성할 수 있다
- 내가 작성한 글만 수정/삭제 할 수 있다
- Function Based View 라면 데코레이터(Decorator)를 통해서,
- Class Based View 라면 믹스인(MixIn)을 통해서 구현할 수 있다

### Mixin 방식

- Mixin을 제공해주는 패키지: `django.contrib.auth`, `django-braces`
  - `django.contrib.auth`: 내장된 패키지이지만, 원하는 로직을 직접 구현하기 힘들다
  - `django-braces`: 접근 제어와 관련된 `Access Mixin` 제공

```
pip install django-braces
```

```py
from braces.views import LoginRequiredMixIn

# LoginRequiredMixIn 클래스가 먼저 나와야함
class ReviewCreateView(LoginRequiredMixIn, CreateView):
    ...
```

```py
# settings.py

# 로그인 화면 URL을 명시해야 LoginRequiredMixin 클래스가 안내해준다
LOGIN_URL = 'account_login'
```

- 자신이 작성한 글에만 수정/삭제 버튼 보이도록 하기

```html
{% raw %}{% if post.author == user %}{% endraw %}
<a href="{% raw %}{% url 'post-update' post.id %}{% endraw %}">수정</a>
<a href="{% raw %}{% url 'post-delete' post.id %}{% endraw %}">삭제</a>

{% raw %}{% endif %}{% endraw %}
```

💊 **Mixin**

- Mixin은 파이썬의 일반적인 개념인데, 기존의 클래스에 어떤 기능을 더해줄 때 쓰인다
- (여기서는 뷰 클래스에 접근 제어 기능을 더해줬다)

### Decorator 방식

```py
# views.py

from django.contrib.auth.decorators import login_required

@login_required
def my_view(request):
    ...
```

# 모델의 다양한 필드

```py
# models.py

class Review(models.Model):
    titile = models.CharField(max_length=30)
    name = models.CharField(max_length=20)
    link = models.URLField()

    RATING_CHOICES = [
        # (모델필드에 들어갈 값, 화면에 보일 값)
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    ]

    rating = models.IntegerField(choices=RATING_CHOICES)

    image = models.ImageField()
    content = models.TextField()
    dt_created = models.DataTimeField(auto_now_add=True)
    dt_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```

# 정적 파일과 미디어 파일

- 정적 파일
  - 웹 개발에서 사용한 파일
    - ex. CSS, 웹 사이트를 꾸미기 위해 사용한 고정된 이미지
  - 미디어 파일
    - ex. 사용자가 생성/등록한 프로필 사진

```html
<head>
  <link
    rel="stylesheet"
    type="text/css"
    href="{% raw %}{% static '<정적 파일 경로>' %}{% endraw %}"
  />
</head>
```

```py
# settings.py

# 미디어 파일의 루트 디렉터리 위치를 명시한다
MEDIA_ROOT = os.path.join(BASE_DIR, '<미디어 파일 폴더명> ex.media')

# 미디어 파일을 URL로 표시할 때 사용할 경로 (그냥 아무렇게나 적어도 상관없다)
# 나중에 템플릿 파일에서 사용할 때 중요한 값은 MEDIA_ROOT/<upload_to에서 설정한 경로> 이다
# upload_to 는 밑에서 배울 ImageField 의 파라미터로, MEDIA_ROOT 아래에 사진이 저장될 디렉터리를 적으면 된다
# 템플릿에서는 <img src="{{object.movie_image.url}}"> 이런식으로 .url로 접근하면 된다
MEDIA_URL = '/uploads'
```

# ImageField

- 이미지 필드에 미디어 파일 URL 주소를 저장하면,
- 폼으로 들어온 이미지를 미디어 파일 디렉터리에 저장해준다
- 이미지 필드를 사용하려면 pillow 패키지를 설치해야함

```
pip install pillow
```

```py
# models.py

class Review(models.Model):
    ...
    image = models.ImageField(upload_to='<media 폴더 안에 저장할 폴더명 ex. review_pics>')

    # 만약 이미지를 최소 1장 최대 3장 등록할 수 있도록 하려면,
    image1 = models.ImageField(upload_to='review_pics')
    image2 = models.ImageField(upload_to='review_pics', blank=True)
    image3 = models.ImageField(upload_to='review_pics', blank=True)

```

```
결론적으로,
미디어 파일은 <MEDIA_ROOT>/<upload_to> 디렉터리에 저장되고,
템플릿에서 이미지를 사용할 때는 {% raw %}{{ object.image.url }}{% endraw %} 이런식으로 사용하면 된다
```
