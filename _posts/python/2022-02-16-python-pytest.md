---
layout: post
title:  'Python Advanced Series [Part3]: 파이썬을 위한 테스트 도구(feat. pytest)'
description: 메모리를 효율적으로 사용하는 프로그램/어플리케이션을 만들기 위해서는 메모리 할당에 대해 이해해야합니다.
date:   2022-02-16 15:01:35 +0300
image:  '/images/python_advanced_logo.png'
logo_image: '/images/python_advanced_logo.png'
categories: programming_language
tags: Python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

![](/images/pytest_logo.png)

이번 글에서는 pytest를 알아보고자 합니다.  

pytest란 무엇인가? 정말 이름 그대로 py(thon)을 test 하는 프레임워크를 의미합니다.  
 
> pytest is a mature full-featured Python testing tool that helps you write better programs.

Python testing tool로써 좋은 프로그램을 작성하도록 도와준다라, 이걸 이해하기 위해서는 왜 테스트가 존재해야 하는가에 대해 생각할 필요가 있습니다  

# TDD
최근 많이 주목받고 있는 TDD (Test Driven Development)를 아시나요? 짧게 설명드리면 본격적인 개발에 들어가기 전에 테스트 계획 및 코드를 작성하는 것을 의미합니다. 테스트가 개발을 이끌어 나가는 것이 되는 것이죠.  

그럼, 왜 TDD 같은 테스트가 우선시 되는 개발이 나오게 되었고, 주목받고 있는 것일까요?  

자, 개발 중 에러 및 오류가 발생했다고 합시다.  

이 상황이 정말 작은 소규모 개발 중에 일어난 것이라면 사실 큰 문제가 되지 않습니다. 개발한 모듈간에 연결성도 적을 뿐 아니라, 코드 양이 방대하지 않을 것이기 때문에 바로 찾아 문제를 해결할 수 있을 것입니다.  

하지만 아주 대규모의 개발 상황이라고 가정해봅시다. 수 많은 모듈, 함수간 종속성과 매우 많은 코드 양이 있기 때문에 오류 및 에러를 잡는데 많은 시간과 인력을 투입하게 될 것입니다. 이러한 상황은 비즈니스적으로도 효율적이지 못하겠죠? 당연히 안정적인 프로그램을 개발해 나가는데도 많은 걸림돌이 될 것입니다.  

# pytest

이러한 문제를 해결하기 위해 TDD. 즉, 테스트 주도 개발이 나오게 된 것입니다. 그리고 Python에서 TDD를 하기 위해 나온 프레임워크가 pytest입니다.  

## pytest 맛보기

```sh
.
├── py_test_1.py
└── py_test_2.py
```

```python
# py_test_1.py
# 테스트를 해보고 싶은 함수
def func(x):
    return x + 1

# 테스트 함수
def test_answer():
    assert func(3) == 5
```

```python
# py_test_2.py
class TestClass:
    def test_one(self):
        x = "Hello, hi"
        assert "h" in x

    def test_two(self):
        x = "what"
        assert hasattr(x, "who")
```

```sh
python -m pytest py_test_1.py # 특정 파일을 테스트할 때
```

![](/images/pytest_1.png)

```sh
python -m pytest *.py # 테스트 폴더 안의 모든 파일을 테스트할 때
```

![](/images/pytest_2.png)

## pytest 디렉토리 구조

지금까지는 Command line에서 pytest 명령어를 통해 테스트를 실행했고, 또한 한 파일에 일반 함수와 테스트 코드들이 공존했습니다.  

하지만 실제로 프로젝트에서 활용되는 데 있어서는 테스트 코드를 따로 관리하고, 이에 맞게 끔 구조를 구성해놓는 것이 효율적입니다.  

그래서 테스트 코드는 프로젝트 코드들과 다르게 tests 라는 디렉토리를 통해서 관리를 합니다.  

전체적으로 디렉토리 트리를 보면 다음과 같습니다.  

```
project/
    core_code/
        __init__.py
        sample_code1.py
        sample_code2.py
        sample_code3.py
    tests/
        test_sample1.py
        test_sample2.py
        test_sample3.py
```

## pytest fixtures
 
pytest의 특징중 하나인 fixture는 다음과 같은 의미를 가집니다.  

- 시스템의 필수조건을 만족하는 테스팅 프로세스를 설정하는 것 (A software test fixture sets up a system for the software testing process by initializing it, thereby satisfying any preconditions the system may have.)
- 같은 설정의 테스트를 쉽게 반복적으로 수행할 수 있도록 도와주는 것 (The advantage of a test fixture is that it allows for tests to be repeatable since each test is always starting with the same setup. Test fixtures also ease test code design by allowing the developer to separate methods into different functions and reuse each function for other tests.)

간략하게 말하면 수행될 테스팅에 있어 필요한 부분들을 가지고 있는 코드 또는 리소스라고 말할 수 있습니다.    

```py
import pytest
from src.calculator import Calculator

@pytest.fixture
def calculator():
    calculator = Calculator()
    return calculator

def test_add(calculator):
    assert calculator.add(1, 2) == 3
    assert calculator.add(2, 2) == 4

def test_subtract(calculator):
    assert calculator.subtract(5, 1) == 4
    assert calculator.subtract(3, 2) == 1

def test_multiply(calculator):
    assert calculator.multiply(2, 2) == 4
    assert calculator.multiply(5, 6) == 30
```

보시다시피, 먼저 `@pytest.fixture`를 통해 fixture를 선언합니다. 그리고 fixture function을 정의할 수 있습니다.
이렇게 정의된 fixture function를 parameter로 사용하여 테스트를 위한 클래스를 가져올 수 있는 것입니다. 이렇게 되면 중복코드는 물론이고, 계속해서 필요한 모듈, 클래스가 있을 때마다 선언을 하기보다 간단히 parameter를 통해 가져올 수 있습니다.  

이렇게 보니, 앞서 정의된 test fixture에 대한 정의가 와닿지 않나요?  

사실 fixture에 대한 것은 이게 끝이 아닙니다.  

'대규모의 프로젝트인 경우엔 테스트마다 필요한 모듈, 클래스 등 리소스 및 코드들이 달라 필요한 fixture의 양이 매우 많아질 것입니다.  

또한, 테스트 코드(py)마다 중복되는 fixture도 있을 겁니다. 예를 들어, A 테스트 코드에서도 계산기 클래스가 필요한데, B 테스트 코드에서도 계산기 클래스가 필요한 경우 말이죠. 지금까지의 경우로 보자면 두 테스트 코드 파일 위에 fixture를 따로 선언한 후 사용했어야 했습니다.  

이러한 문제를 해결하기 위해 conftest.py를 사용합니다.
fixture 코드들은 conftest.py에 선언해두면, 모든 테스트 코드에서는 해당 fixture들을 공유하여 사용할 수 있습니다. 알아서 pytest에서 공유해주는 마법!  

```sh
# Directory tree
src/
  __init__.py
  calculator.py
tests/
  conftest.py
  test_code1.py
  test_code2.py
  test_code3.py
```

```py
# conftest.py
import pytest

import sys
sys.path.append('/Users/peter/algo_folder') # src 폴더가 tests 밖에 있기 때문에, 그냥 이름으로 import 안됨
from src.calculator import Calculator

@pytest.fixture
def calculator():
    calculator = Calculator()
    return calculator
```

```py
# test_code.py
def test_add(calculator):
    """Test functionality of add."""
    assert calculator.add(1, 2) == 3
    assert calculator.add(2, 2) == 4
    assert calculator.add(9, 2) == 11

def test_subtract(calculator):
    """Test functionality of subtract."""
    assert calculator.subtract(5, 1) == 4
    assert calculator.subtract(3, 2) == 1
    assert calculator.subtract(10, 2) == 8

def test_multiply(calculator):
    """Test functionality of multiply."""
    assert calculator.multiply(2, 2) == 4
    assert calculator.multiply(5, 6) == 30
    assert calculator.multiply(9, 3) == 27
```

![](/images/pytest_3.png)

# 참고 
- [KimDoubleB, [pytest] python 코드를 테스트 해봅시다](https://binux.tistory.com/47){:target="_blank"}
- [Real Python, Effective Python Testing With Pytest](https://realpython.com/pytest-python-testing/){:target="_blank"}