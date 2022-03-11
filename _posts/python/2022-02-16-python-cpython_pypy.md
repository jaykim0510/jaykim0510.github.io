---
layout: post
title:  'Python Advanced Series [Part1]: 파이썬 코드 동작 원리(Feat.CPython, PyPy)'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2022-02-16 15:01:35 +0300
image:  '/images/python_advanced_logo.png'
logo_image: '/images/python_advanced_logo.png'
categories: programming_language Development_knowledge
tags: Python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 파이썬 언어의 특징


파이썬(Python)은 1980년대 후반 귀도 반 로섬이 개발하고 1991년에 출시한 high-level 범용 프로그래밍 언어입니다. 동적 타입 언어이므로 변수의 타입을 선언할 필요가 없으며, 코드가 실행되어 메모리 관리가 자동으로 수행됩니다.  

이번 포스트에서는 파이썬 코드를 실행할 때 어떤 동작이 내부적으로 일어나는지 알아보도록 하겠습니다.  

저희가 CLI 환경에서 파이썬 코드를 실행하는 경우를 생각해봅시다.  

```sh
python my_code.py
```

여기서 `python`은 바로 파이썬 인터프리터 프로그램을 의미합니다. 따라서 파이썬 코드는 파이썬 인터프리터를 통해 실행하는 것입니다.  [**(Python Interpreter - Stanford Computer Science 참고)**](https://cs.stanford.edu/people/nick/py/python-interpreter.html){:target="_blank"}  

# 파이썬은 인터프린터 언어?

위에서 파이썬 인터프리터를 통해 파이썬 코드를 실행한다고 했습니다. 그러면 파이썬은 인터프리터 언어일까요? 과거에 C는 컴파일 언어이고, 쉘 프로그래밍 언어는 인터프리터 언어였기 때문에 이 경계가 비교적 명확했지만, 비교적 최근에 나온 언어들은 그 경계가 모호합니다.  

파이썬 또한 어느 정도의 컴파일 언어적 특성과, 인터프리터 언어의 특성을 모두 가지고 있어서 이분법적으로 나누기가 힘들지만 프로그래밍 언어의 대표인 C언어가 완전한 컴파일 언어이기 때문에 이와 구분하기 위해 그냥 편하게 인터프리터 언어라고 하는 것 같습니다. 정리하면 **파이썬은 컴파일 언어이기도 하면서 인터프리터 언어**이기도 합니다.  

# 컴파일 언어
먼저 간단하게 컴파일 언어의 뜻과 컴파일 언어가 코드를 실행하는 과정에 대해 살펴보겠습니다.  

- 컴파일은 소스코드를 다른 타겟 언어(기계어, 자바, C, 파이썬)로 변환하는 과정을 의미
- 코드를 실행할 때 코드 전체를 인풋으로 사용
- 코드는 컴파일 단계에서 한 번 기계어로 변환되어 저장되고 나면 언제든 바로 실행가능
- 컴파일러는 실행하는 역할이 아니고 기계어로 변환하는 역할

![](/images/python_4.png)

# 인터프리터 언어

- 인터프리터 언어는 소스 코드를 바로바로 실행하게 됩니다.
- 인터프리터는 코드를 한 줄씩 입력으로 사용해 실행합니다.  
- 인터프리터에는 종류마다 다른 실행 방법이 있습니다.  
    A. 소스 코드를 파싱해서 설정한 방법에 따라 실행  
    B. 소스 코드를 먼저 중간 단계의 바이트 언어로 변환하고 A의 과정을 수행  
    C. 컴파일러에 의해 먼저 변환된 코드를 이용해 1의 과정을 수행    

![](/images/python_7.png)  

![](/images/python_5.png)  

파이썬 인터프리터는 이 중 B에 해당합니다.  

```
1. 소스 코드를 컴파일러를 이용해 중간 단계의 바이트 언어의 파일(.pyc)로 변환
2. Python Virual Machine 위에서 바이트 언어 파일 한 줄씩 실행  
```

![](/images/python_6.png)  

# 파이썬 인터프리터의 종류

## CPython

![](/images/python_8.png)  

## Jython

![](/images/python_9.png)  

## PyPy
PyPy는 파이썬 언어(RPython: 파이썬의 일부)로 작성된 인터프리터입니다. 디폴트인 CPython과의 호환성을 유지하면서도 CPython 보다 속도가 빠르다고 알려져있습니다.  

![](/images/python_10.png)  

# 참고
- [Shalini Ravi, How Does Python Code Run: CPython And Python Difference](https://www.c-sharpcorner.com/article/why-learn-python-an-introduction-to-python/){:target="_blank"}
- [elhay efrat, Python >> CPython](https://medium.com/@e{:target="_blank"}lhayefrat/python-cpython-e88e975e80cd){:target="_blank"}
- [geeksforgeeks, Difference between various Implementations of Python](https://www.geeksforgeeks.org/difference-various-implementations-python/){:target="_blank"}
- [파이썬 언어의 특징](https://jjinfotech.tistory.com/21){:target="_blank"}
- [파이썬 인터프리터 고르기](https://python-guide-kr.readthedocs.io/ko/latest/starting/which-python.html){:target="_blank"}
- [Wireframe: 파이썬은 인터프리터언어입니까?](https://soooprmx.com/파이썬은-인터프리터언어입니까/){:target="_blank"}
