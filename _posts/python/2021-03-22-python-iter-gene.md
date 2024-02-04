---
layout: post
title:  'Python Basic Series [Part6]: 파이썬의 이터레이터와 제너레이터'
description:
date:   2021-03-22 15:01:35 +0300
image:  '/images/python_logo.png'
logo_image: '/images/python_logo.png'
category: language
tag: python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 이터레이터(Iterator)

- 이터레이터 객체는 컨테이너 객체가 가지고 있는 원소들을 순회(iterate)하도록 해준다.
- 이터레이터 객체는 `__iter__` 메서드와, `__next__` 메서드를 가지고 있다
- 이터레이터 객체는 보통 이터러블(iterable)한 객체가 `__iter__` 메서드를 호출함으로써 생성된다

이터러블 객체와 이터레이터 객체를 정리하면 다음과 같다    

- **iterable**: an object that has the `__iter__` method defined
- **iterator**: an object that has both `__iter__` and `__next__` defined where `__iter__` will return the iterator object and `__next__` will return the next element in the iteration.  

![](/images/it_gen_1.png)

참고로, 보통 많이 사용하는 `list`, `tuple`, `str`, `dict`, `set` 등 대부분이 `__contains__`와, `__iter__`를 가지는 이터러블 객체이다.  

```
# Container 객체
Containers are any object that holds an arbitrary number of other objects. Generally, containers provide a way to access the contained objects and to iterate over them.

Examples of containers include tuple, list, set, dict; these are the built-in containers. More container types are available in the collections module.
```

그러면 이제 이터레이터 객체를 생성하고, 원소들을 순회해 보자.  

## 이터레이터 객체 생성

- 이터레이터 객체는 크게 두 가지 방법으로 생성한다
- 1. 이터레이터 객체가 `__iter__` 메서드를 호출해 자기 자신(`self`)을 리턴한다
- 2. 이터러블 객체가 `__iter__` 메서드를 호출해 별도로 정의된 이터레이터 객체를 리턴한다.  
- 보통 직접 클래스를 만들 때는 1번 방법을 많이 사용하고, 내장된 데이터 타입(tuple, list, str 등)은 2번을 사용한다

```python
# 직접 이터레이터 클래스 정의
class SequenceOfNumbers:

    def __init__(self, start=0):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        current = self.current
        self.current += 1
        return current


seq = SequenceOfNumbers()
seq_iterator = seq.__iter__() # 또는 iter(seq)

print(seq_iterator.__next__()) # 또는 next(seq_iterator)
print(seq_iterator.__next__())
print(seq_iterator.__next__())
---------------------------------
0
1
2
```

```python
# 내장된 이터러블 객체
x = [1, 2, 3]

print(next(x)) # 참고로 이렇게 이터러블 객체 자체는 next메서드가 없기 때문에 이런식으로 순회(iterate)가 안된다
--------------------------------------------
TypeError: 'list' object is not an iterator


x_iterator = x.__iter__() # 또는 iter(x)

print(x_iterator.__next__()) # 또는 next(x_iterator)
print(x_iterator.__next__())
print(x_iterator.__next__())
---------------------------------------------------
1
2
3
```

```
iterable객체와 iterator객체의 관계: iter(iterable객체) -> iterator객체
```

## 반복문

- 반복문은 알아서 `__next__`함수를 호출해준다
- 만약 이터러블 객체(list, tuple 등)라면 알아서 `__iter__`함수를 호출해 이터레이터 객체로 만들어준다
- 순회(iterate)가 끝나면 알아서 `StopIteration` 예외를 발생시키고 순회를 종료해준다
- 참고로 반복문은 꼭 __next__만으로 순회를 하지는 않는다. `__getitem__`과 `__len__`으로도 순회할 수 있다


# 제너레이터

- 제너레이터도 일종의 이터레이터
- 함수로 구현한다 -> 이터레이터보다 구현이 간단하다 (이터레이터는 클래스 정의, `__iter__`, `__next__` 메서드를 정의해줬어야 했다)
- 함수가 호출되면 함수는 제너레이터(이터레이터) 객체를 반환하고, 제너레이터 객체 내부에 `__iter__`, `__next__`가 구현되어 있다
- 코드의 원래 흐름에서 제너레이터 객체의 `__next__` 함수를 호출하면, 제너레이터 함수가 제어권을 가지고 함수 내부의 코드를 실행한다
- 실행 도중 `yield`문을 만나면 `yield`에 정의된 값을 `__next__` 함수를 호출한 곳에 값을 반환하고, 일시적으로 제어권을 넘겨준다
- `yield`문이 제너레이터의 핵심이다
- `yield`문은 처음부터 모든 데이터를 메모리에 올려두지 않아도 된다 -> 그때 그때 필요한 값만 돌려주면 된다 -> 메모리 절약의 이점이 있다
- 하지만 어떤 시퀀스의 임의의 지점에 값을 가져오려면 시간 복잡도가 O(n)이다
- 제너레이터는 코루틴을 구현할 때 항상 사용된다

## yield

- `yield`문이 포함된 함수는 `return`문을 가지는 일반적인 함수와 다른 점이 있다
- 일반적인 함수는 호출되면 자신의 함수에 정의된 코드를 처음부터 끝까지 실행하고, `return`문을 통해 값을 리턴한 후 함수의 실행을 아예 종료한다
- `yield`문이 포함된 함수는 호출되면 함수 내부의 코드를 처음부터 실행하다가 `yield`문을 만나면 `yield`문을 통해 값을 리턴하고, 종료하지 않고 대기한다
- 다시 말해, 제너레이터는 실행부터 종료가 한 번에 이루어지는 것이 아니라, 계속 일시적으로 제어의 흐름이 왔다 갔다 하는 것이다

![](/images/it_gen_2.png)

## 제너레이터 코드

```python
def doubler_generator():
    number = 2
    while True:
        yield number
        number *= number


doubler = doubler_generator()
print (next(doubler))
print (next(doubler))
print (next(doubler))
print (type(doubler))
------------------------------------
2
4
16
<class 'generator'>
```

```python
def silly_generator():
    yield "Python"
    yield "Rocks"
    yield "So do you!"


gen = silly_generator()
print (next(gen))
print (next(gen))
print (next(gen))
print (next(gen))
-----------------------------------
Python
Rocks
So do you!
Traceback (most recent call last):
  File "main.py", line 15, in <module>
    print (next(gen))
StopIteration
```

# 참고

- [Jay's Blog, Iterable, Iterator, Generator, 그리고 for문](https://kimziont.github.io/intermediate/python-intermediate-iter_gener/){:target="_blank"}
- [stackoverflow, What exactly are "containers" in python? (And what are all the python container types?)](https://stackoverflow.com/questions/11575925/what-exactly-are-containers-in-python-and-what-are-all-the-python-container){:target="_blank"}