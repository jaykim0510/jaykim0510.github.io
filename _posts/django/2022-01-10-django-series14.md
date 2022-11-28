---
layout: post
title:  'Django Series [Part14]: Django CRUD'
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


# View에서 활용하는 경우

- 장고에서 CRUD와 같은 로직은 뷰(View)에서 처리한다
- `Skill` 이라는 모델을 예시로 든다

## Create

- `create()`
- 필수가 아닌 필드나 자동으로 채워지는 필드 (예: id)는 값을 주지 않아도 된다

```py
Skill.objects.create(title='파이썬', summary='쉽고 재밌는 프로그래밍 언어')
```

## Read

- `all()`
- 모델에 해당하는 모든 오브젝트를 쿼리셋(QuerySet)이라는 객체에 담아 리턴한다

```py
Skill.objects.all()
```

- `filter()`
- 필터 조건에 해당하는 오브젝트들을 담은 쿼리셋을 리턴한다
- `.filter()`와 `.all()`은 항상 쿼리셋을 리턴한다. (결과가 0개 또는 1개여도 쿼리셋을 리턴)

```py
Skill.objects.filter(id=3)
Skill.objects.filter(title__startswith='파')
```

- `get()`
- 조건에 해당하는 오브젝트 1개를 가져온다
- (하나도 해당되지 않거나, 여러 개가 해당되면 에러가 난다)
- 오브젝트 자체를 리턴

```py
skill = Skill.objects.get(id=1)
```

## 삭제

- `delete()`
- 데이터를 삭제하려면 먼저 삭제할 데이터를 가져와서 `.delete()` 메소드를 호출해 줘야 한다

```py
skill = Skill.objects.get(id=6)

# 삭제
skill.delete()
```

# Template에서 활용하는 경우

- 템플릿에서도 CRUD 연산을 할 수 있지만 제한적이다
  - Read 정도만 가능하다
  - `<Model>.objects`로 시작하는 연산을 사용할 수 없다
  - 파라미터가 들어가는 메소드도 사용할 수 없다
- 파라미터가 들어가지 않는 `.all()`, `.count()` 같은 메소드는 호출할 수 있다
  - (`{{ objects.all }}`, `{{ skills.count }}`)
- 어떤 파라미터를 전달해줘야 하거나 하는 경우에는 View에서 결과를 만들고 `extra_context` 같은 방법을 사용해 전달해야한다

# 관계를 사용한 CRUD

```py
# 1. user가 작성한 리뷰들 필터
Review.objects.filter(author=user)

# 2. id 1을 가지고 있는 유저가 작성한 리뷰들 필터
Review.objects.filter(author__id=1)

# 3. jonghoon이라는 닉네임을 가지고 있는 유저가 작성한 리뷰들 필터
Review.objects.filter(author__nickname="jay")

# 4. 이메일이 naver.com으로 끝나는 유저들이 작성한 리뷰들 필터
Review.objects.filter(author__email__endswith='naver.com')

# 5. Comment 모델 -> Review 모델 -> User 모델 -> User 모델의 nickname 속성
Comment.objects.filter(review__author__nickname='jay')
```