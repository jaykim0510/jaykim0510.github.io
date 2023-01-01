---
layout: post
title:  'Django Series [Part15]: Django Logging'
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

- A Python logging configuration consists of four parts:

- Loggers
- Handlers
- Filters
- Formatters

# Loggers

- 처음 로그 메세지를 받아들이는 진입점(entry point)이다
- 각각의 로거(logger)는 로그 레벨(level)을 가진다.
- 로거는 자신보다 낮은 레벨의 메세지는 무시하고, 자신의 레벨 혹은 그 이상의 레벨을 가지는 로그 메세지를 처리한다

- **DEBUG**: 디버깅 목적의 로그. 가장 낮은 레벨
- **INFO**: 일반적인 시스템 정보
- **WARNING**: 사소한(minor) 문제에 관한 정보
- **ERROR**: 주요(major) 문제에 관한 정보
- **CRITICAL**: 심각한(critical) 문제에 관한 정보

- 처리하기로 결정된 메세지는 핸들러(Handler)에게 넘겨준다

# Handlers

- 받은 로그 메세지를 어떻게 처리할지에 관한 결정을 내리는 곳이다
- 콘솔에 출력, 파일에 쓰기, 네트워크로 전송 등
- 핸들러도 마찬가지로 로그 레벨을 가진다 (자신의 레벨 혹은 그 이상의 메세지만 처리한다)
- 하나의 로거는 다른 레벨을 가지는 여러 핸들러를 가질 수 있다 -> 중요도에 따라 다르게 처리할 수 있다
- (하나의 핸들러는 `ERROR`와 `CRITICAL`을 메일로 알림을 보낸다)
- (다른 핸들러는 `DEBUG`, `INFO`, `WARNING`, `ERROR와` `CRITIAL`를 분석을 위해 파일에 저장해둔다)

# Filters

- 핸들러가 처리한 이후의 로그 레코드를 부가적으로 제어하기 위한 용도이다
- 예를 들어, 보통 `ERROR` 를 처리하는 핸들러는 `CRITICAL` 도 처리하는데, 필터를 통해 오직 `ERROR`만 처리하도록 할 수 있다
- 또한 ERROR 로그 레코드의 레벨을 WARNING 으로 낮출 수도 있다
- 필터는 로거(Logger), 핸들러(Handler) 어디에나 올 수 있으며 여러 필터를 체이닝할 수도 있다

# Formatters

- 로그 레코드를 최종적으로 원하는 문자열로 나타내기 위한 용도이다
- 파이썬에서 제공하는 포매터를 사용할 수도 있고, 직접 커스텀 포매터를 만들어 사용할 수도 있다


# 장고 로깅

- Django’s logging module extends Python’s builtin logging
- `DEBUG=True`면, `django.server`를 제외한 모든 django hierarchy (`django`, `django.request`, `django.template`, ..)에서 `INFO` 레벨 이상의 메세지를 `console` 핸들러에 내보낸다
- `DEBUG=False`면 `django.server`를 제외한 모든 django hierarchy에서 `ERROR`, `CRITICAL` 레벨의 메세지를 `AdminEmailHandler` 핸들러로 보낸다
- `django.server`는 `DEBUG` 값에 상관없이 `INFO` 레벨 이상의 메세지를 `console` 핸들러에 내보낸다
- `django`는 루트 로거다. `django.server`를 제외한 모든 로거는 부모 로거를 거쳐 루트 로거에 까지 로깅을 전달한다. 위에서 얘기한 설명들을 따르기 위해 `django` 루트 로거에는 `console`과 `mail_admins` 핸들러가 붙어 있다

## 장고 로깅 설정

```py

LOGGING = {
    'version': 1,

    # False: 디폴트 로거를 유지하면서, 확장해나간다
    'disable_existing_loggers': False,

    # 어떻게 출력할 것인가
    # 'style': '{' => {}를 이용해 attribute를 감싼다 => {levelname}
    # attribute 종류는 https://docs.python.org/3/library/logging.html#logrecord-attributes 참고
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },

    'filters': {
        'special': {
            '()': 'project.logging.SpecialFilter',
            'foo': 'bar',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },

    # 로거로부터 받아온 메세지를 어떻게 처리할 것인가
    # 이름은 원하는대로 지어도 된다 (console을 babo로 해도 상관없다. class가 중요하다)
    # 핸들러와 로거는 many-to-many 관계이다
    # 파이썬에서 제공하는 핸들러: https://docs.python.org/3/library/logging.handlers.html
      # logging.StreamHandler, logging.FileHandler, logging.handlers.RotatingFileHandler 등
    # 장고에서 제공하는 핸들러: django.utils.log.AdminEmailHandler

    'handlers': {
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['special']
        }
    },

    # 특정 부분에서 발생한 메세지 (요청 관련, 데이터베이스 관련, 특정앱/특정 뷰 관련 등) 받아 들일지 여부 결정
    # '특정앱.특정뷰' 이런식으로 네이밍 하면, 특정앱의 특정뷰에서 발생한 메세지만 받아들인다
    # '' 이런식으로 unnamed 를 만들면, 프로젝트 전체에서 발생한 메세지 받아들인다
    # '특정앱.특정뷰' 는 '특정앱'에도 메세지를 전파(propagate)한다
    # propagate의 기본값이 True이기 때문이다. 원치 않으면 False로 한다
    # (만약 '특정앱' 로거를 따로 정의 안했으면 상관없다) ('특정앱', '특정앱.특정뷰' 둘 다 정의한 경우에만 해당한다)
    'loggers': {
        # 모든 장고 빌트인 로거의 부모 로거
        'django': {
            'handlers': ['console'],
            'propagate': True,
        },
        # 요청(request)과 관련된 로그 메세지의 진입점
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        # 렌더링 관련 로그 메세지의 진입점
        'django.template': {},

        # run 커맨드로 실행중인 서버 관련 로그 메세지의 진입점
        'django.server': {},

        # DB에 실행된 SQL문 관련 로그 메세지의 진입점
        'django.db.backend': {},

        # myapp 앱의 myview 뷰에서 발생한 로그 메세지의 진입점
        'myapp.myview': {
            'handlers': ['console', 'mail_admins'],
            'level': 'INFO',
            'filters': ['special']
        }
    }
}
```


# 참고

- [django 공식문서, Logging Overview](https://docs.djangoproject.com/en/4.1/topics/logging/#configuring-logging)
- [django 공식문서, Logging Configuration](https://docs.djangoproject.com/en/4.1/howto/logging/#logging-how-to)
- [[ Python ] logging 만들어보기 (FileHandler 와 StreamHandler 위주로)](https://data-newbie.tistory.com/248)