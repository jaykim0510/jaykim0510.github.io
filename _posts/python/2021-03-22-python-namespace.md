---
layout: post
title:  'Python Basic Series [Part6]: 파이썬의 네임스페이스와 스코프'
description:
date:   2021-03-21 15:01:35 +0300
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

# 파이썬의 네임스페이스

> Python uses namespaces to implement scoping.
> A namespace is a mapping from names to objects

파이썬의 모든 것은 객체다. 파이썬에서는 객체에 접근하기 위해 객체를 참조하는 참조 변수를 사용한다. a = [1, 2, 3]에서 a를 참조 변수라고 한다.  

이러한 참조 변수와 그 변수가 참조하는 객체를 매핑해놓은 일종의 딕셔너리이다.  
(내가 생각하기에 파이썬은 컴파일 단계에서 코드를 보고 네임스페이스를 파이썬의 딕셔너리 객체로 만든 후 런타임 단계에서 계속 업데이트 하는 것 같다)    
(파이썬 공식문서: A namespace is a mapping from names to objects. Most namespaces are currently implemented as Python dictionaries)  
(RealPython: These have differing lifetimes. As Python executes a program, it creates namespaces as necessary and deletes them when they’re no longer needed)  

네임스페이스는 크게 두 가지 목적 때문에 필요하다.  

1. 독립된 공간에서는 변수명이 중복 사용될 수 있어야 한다. 변수명이 프로그램 전체에서 유일해야 한다면 변수명 짓는 것 부터 너무 어려워 질 것이다.
2. 코드 위치마다 정의된 변수의 수명이 달라야 한다. 잠깐 사용할 목적의 변수명은 사용 후 삭제되도록 하는 것이 좋다.

파이썬에는 이러한 네임스페이스를 크게 4가지 종류로 분류한다.  

- Built-In
- Global
- Enclosing
- Local

## Built-In

- 파이썬에서 미리 찜해놓은 키워드(`return`, `def`, `class` 등), 내장 함수(`abs()`)와 같은 것들을 의미한다
- 파이썬 코드 어디서든 적용된다 -> 가장 적용되는 범위가 넓다
- Built-In 네임스페이스는 인터프리터가 시작하는 시점에 만들고 종료될 때 까지 계속 가지고 있는다

```python
print(dir(__builtins__))
----------------------------------------------------------------------------------------------------
['ArithmeticError', 'AssertionError', 'AttributeError', ..., '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__', '__spec__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool', ..., 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
```

## Global

- 파이썬의 메인에서 정의된 식별자(identifier 또는 name으로 변수명, 함수명, 클래스명 등을 뜻한다)
- 코드 가장 바깥 부분에서 정의된 것들을 뜻함
- 그 밖에 `import`해온 모듈, 함수도 포함

```python
print(globals())
----------------------------------------------------------------------------------------------------
{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x1051b13a0>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/Users/peter/algo_folder/python_test/test_scope.py', '__cached__': None}
```

## Enclosing과 Local

- Local은 블록된 코드 내에서 정의된 식별자. 블록은 클래스, 함수 등이 될 수 있음

```python
class Test:
    a = 1
    
    def __init__(self) -> None:
        self.a = 10
        print(locals())

    print(locals())

t = Test()
----------------------------------------------------------------------------------------------------
{'__module__': '__main__', '__qualname__': 'Test', 'a': 1, '__init__': <function Test.__init__ at 0x104da6310>}
{'self': <__main__.Test object at 0x104d90fd0>} # self.a라고 따로 안되고, self라고만 뜨네.. self안에 내포되서 안보이는 건가?
```

- Enclosing은 Local을 감싸는 Local 네임스페이스를 의미한다 (함수 안에 정의된 함수)
- (메서드를 감싸는 클래스는 Enclosing 취급을 받지 못한다. 이유는 잘 모르겠다..)

```python
class Test:
    a = 1
    
    def __init__(self) -> None:
        nonlocal a # SyntaxError: no binding for nonlocal 'a' found
        a = 100
t = Test()
------------
SyntaxError: no binding for nonlocal 'a' found
```

```python
s = "Global"

def outer():
    s = "Outer"

    def inner():
        nonlocal s
        tmp = s
        s = "Change to Inner"
        print(f"{tmp} -> {s}")

    inner()

outer()
------------------------
Outer -> Change to Inner
```

```python
s = "Global"

def outer():
    s = "Outer"

    def inner():
        global s
        tmp = s
        s = "Change to Inner"
        print(f"{tmp} -> {s}")

    inner()

outer()
--------------------------------
Global -> Change to Inner
```

- 함수가 한겹으로만 되어 있으면 바로 위의 Global 네임스페이스를 `nonlocal`로 가져올 수 있을까? -> 안된다
- 파이썬의 객체지향적 특성을 최대한 지키기 위해 파이썬은 함수 내부에서 Global 네임스페이스의 영역을 침범하는 것을 굉장히 꺼린다
- 그래서 `nonlocal`이라는 것을 python3에서 부터 지원하기 시작한 것이고, 
- `nonlocal`을 사용하는 것은 Global 네임스페이스가 침범되는 염려로부터 해방시켜 준다

```python
s = "Global"

def func():
    nonlocal s # SyntaxError: no binding for nonlocal 's' found
    s = "Func"

func()
------------------------------------------------
SyntaxError: no binding for nonlocal 's' found
```

# 파이썬 스코프

> scope of identifier is the region of a program in which that identifier has meaning. The interpreter determines this at runtime based on where the identifier definition occurs and where in the code the identifier is referenced

- 스코프는 어떤 식별자가 의미를 가지는 영역을 뜻한다
- 런타임 시점에 파이썬 인터프리터는 이 식별자가 어디서 정의되고, 어디서 참조되었는지 판단한다
- 인터프리터는 실행 도중 식별자를 만나면, Local -> Enclosing -> Global -> Built-In 순으로 네임스페이스를 탐색한다

![](/images/python_scope_1.png)

# 다양한 사용 예시

- 함수 내부에서도 외부 스코프의 네임스페이스에 정의된 참조 변수를 이용해 객체를 읽을 수 있다

```python
def func1():
    print(x)


x = "Global variable"
func1()
print(x)
----------------------
Global variable
Global variable
```

- 불변 객체는 내부 스코프에서 외부 스코프의 객체를 수정할 수 없다
- 불변 객체는 항상 수정할 때 할당(Assignment)이라는 과정을 거치게 되는데, 내부 스코프에서 할당하는 식(x = "Local variable")을 쓰면, 파이썬은 컴파일 단계에서 이를 내부 스코프의 네임스페이스에 x라는 참조 변수를 새로 만든다

```python
def func1():
    x = "Local variable"
    print(x)


x = "Global variable"
func1()
print(x)
----------------------
Local variable
Global variable
```

- 가변 객체는 `global`이나 `nonlocal`같은 키워드 없이도 외부 스코프의 객체를 수정할 수 있다

```python
def func1():
    x.append(4)
    print(x)


x = [1, 2, 3]
func1()
print(x)
----------------------
[1, 2, 3, 4]
[1, 2, 3, 4]
```

- 외부 스코프의 불변 객체를 함수 내부에서 수정하려면 `global` 또는 `nonlocal`과 같은 키워드를 사용한다
- `global x`라고 쓰게되면 그 다음에 나오는 할당하는 코드(`x = "Local variable"`)가 내부 스코프의 네임스페이스에 있는 참조변수 `x`가 아니라, 글로벌 네임스페이스(Global namespace)에 있는 참조변수 `x`라는 것을 파이썬 인터프리터가 알게된다

```python
def func1():
    global x
    x = "Local variable"
    print(x)


x = "Global variable"
func1()
print(x)
----------------------
Local variable
Local variable
```

```
global nonlocal 키워드는 글로벌 네임스페이스 또는 외부 스코프의 네임스페이스의 참조 변수라는 것을 인터프리터에 알린다
그러면 인터프리터는 컴파일 단계에서 내부 스코프의 네임스페이스에 새로운 참조 변수를 생성하는 것이 아니라, 외부 스코프의 네임스페이스에 있는 참조 변수로 인식한다
```



```python
def func1(x):
    x.append(4)
    print(x)


x = [1, 2, 3]
func1(x)
print(x)
----------------
[1, 2, 3, 4]
[1, 2, 3, 4]
```

```python
def func1(k):
    k.append(4)
    print(k)

x = [1, 2, 3]
func1(x)
print(x)
----------------
[1, 2, 3, 4]
[1, 2, 3, 4]
```

```python
def func1(k):
    print(k)

x = "Global variable"
func1(x)
print(x)
---------------------
Global variable
Global variable
```

```python
def func1(k):
    k = "Local variable"
    print(k)

x = "Global variable"
func1(x)
print(x)
---------------------
Local variable
Global variable
```

- 함수에 매개변수(Parameter)로 `k`를 정의하고, 함수에 인자(Argument)로 `x`를 넣어주면,
- 함수 안에서 `k = "Global variable"`를 할당하는 것과 같다

```python
def func1(k):
    print(k)
    k = "Local variable"
    print(k)

x = "Global variable"
func1(x)
print(x)
---------------------
Global variable
Local variable
Global variable
```

- 만약 함수에서 `x`를 매개변수로 정의하고, `global x`를 선언하면, `SyntaxError: name 'x' is assigned to before global declaration`라는 컴파일 에러가 뜬다

```python
def func1(x):
    global x # SyntaxError: name 'x' is assigned to before global declaration
    print(x)
    x = "Local variable"
    print(x)

x = "Global variable"
func1(x)
print(x)
```

- 이 문제를 해결하려면 매개변수를 `x`가 아닌 다른 문자로 사용하면 된다.

```python
def func1(k):
    print(k)
    global x 
    x = "Local variable"
    print(x)

x = "Global variable"
func1(x)
print(x)
---------------------
Global variable
Local variable
Local variable
```

```
함수의 매개변수에 인자를 전달하는 것은 함수 내부에서 매개변수를 선언하는 것이다
```

# 참고

- [Real Python, Namespaces and Scope in Python](https://realpython.com/python-namespaces-scope/)
- [홍러닝, 파이썬의 Namespace와 Scope](https://hongl.tistory.com/260?category=928855)