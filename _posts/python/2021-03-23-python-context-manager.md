---
layout: post
title:  'Python Basic Series [Part8]: 파이썬의 컨텍스트 매니저'
description:
date:   2021-03-23 15:01:35 +0300
image:  '/images/python_logo.jpg'
logo_image: '/images/python_logo.jpg'
categories: programming_language
tags: Python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Context Manager

- `__enter__()`와 `__exit__()` 메서드를 구현한 객체
  - `__enter__()`: 획득한 자원에 대한 디스크립터를 리턴하는 역할
  - `__exit__(`): 획득한 자원에 대한 락을 풀어주는 역할
  - 디스크립터(descriptor): 요청된 자원에 대해 접근하기 위해 필요한 OS에서 제공해주는 핸들
- 자원 관리, 예외 처리와 같은 것들이 필요한 코드를 더 깔끔하고, 버그 발생 가능성을 줄이기 위해 사용
- `__enter__()`, `__exit__()`를 정의만 하는 것은 반쪽짜리 결과. 이것들이 자동적으로 호출되어야 진정한 의미가 있음 -> `with`문

```python
class MyContextManager:
    def __enter__(self):
        print("컨텍스트 매니저가 만들어졌습니다")
        self.x = "자원 관리를 필요로 하는 디스크립터"
        return self.x
    
    def __exit__(self, exc_type, ex_value, ex_traceback):
        print("컨텍스트 매니저를 삭제합니다")


cm = MyContextManager()

# 이것만으로는 아무런 의미가 없음
# with문으로 자동적으로 호출되도록 해야 의미가 있음
```

# with statement

- 컨텍스트 매니저의 `__enter__()`와 `__exit__()`를 자동으로 호출
- 컨텍스트 매니저가 자신의 역할을 하기 위해 반드시 사용해야 하는 문

```python
class MyContextManager:
    def __enter__(self):
        print("컨텍스트 매니저가 만들어졌습니다")
        self.x = "자원 관리를 필요로 하는 디스크립터"
        return self.x
    
    def __exit__(self, exc_type, ex_value, ex_traceback):
        print("컨텍스트 매니저를 삭제합니다")



with MyContextManager() as f:
    print(f)
--------------------------------------------------------------------
컨텍스트 매니저가 만들어졌습니다
자원 관리를 필요로 하는 디스크립터
컨텍스트 매니저를 삭제합니다
```

# open()

- `open()` 함수는 컨텍스트 매니저가 될 수 있는 파일 디스크립터를 리턴
- 파일을 다 사용하고 난 후에는 반드시 닫아주는 것이 좋음
  - 이를 위해 직접 `f.close()` 하지말고 `with`문으로 알아서 열고 종료하도록 권장하기 위해 `__enter__()`와 `__exit__()`를 구현해놓음

```python
with open('python_test/test.txt', 'w') as f:
    f.write('Hello world!')
```

```txt
# test.txt

Hello world!
```

![](/images/context_manager_1.png)

# 참고

- [Jay's Blog, Context manager](https://kimziont.github.io/intermediate/python-intermediate-context_manager/){:target="_blank"}
- [GeeksforGeeks, with statement in Python](https://www.geeksforgeeks.org/with-statement-in-python/){:target="_blank"}
