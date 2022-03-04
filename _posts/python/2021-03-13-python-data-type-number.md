---
layout: post
title:  'Python Basic Series [Part2]: 파이썬 숫자 자료형'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2021-03-13 15:01:35 +0300
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

## 1. 숫자 자료형의 종류

파이썬에는 세 가지 다른 숫자 형이 있습니다: 정수 (integers), 실수 (floating point numbers), 복소수 (complex numbers)  
또한 최댓값, 최솟값이 없고 자동으로 메모리를 할당해줍니다. 그래서 사용하기에는 간편하지만 다른 언어에 비해서는 조금 비효율적이라고 할 수 있겠습니다. 
(C++과 비교해 약 10배 정도 느리다고 합니다)

## 2. 파이썬의 특별한 점

* 느린 실행 속도를 보완하고자 파이썬에서는 1~256의 값을 메모리에 static하게 저장합니다. 따라서 1~256 사이의 값을 어떤 변수에 할당할 경우, 새로운 메모리를 할당하지 않고 기존에 저장된 값의 주소를 변수가 가리키도록 합니다.  
![](/assets/images/number_1.png){: width="70%" height="70%"}  

  ```python
  a = 1
  b = 1
  c = 4
  a == b # true (값을 비교한다)
  a is b # true (주소를 비교한다)
  b = b + 3
  b == c # true (값을 비교한다)
  b is c # true (주소를 비교한다)
  -------------------------------
  a = 260
  b = 260
  a == b # ture
  a is b # false (값이 같더라도 256이 넘는 숫자에 대해서는 새로운 메모리가 할당된다)
  ------------------------------
  id(a) = 2592314943888
  id(b) = 2592314943824
  ```  

* 파이썬2에서는 int의 크기는 CPU에 따라 32비트나 64비트로 제한되었습니다. long은 64비트까지 허용하는 정수형 데이터 타입이었습니다. 그러나 파이썬 3에서는 long이 사라지고, int가 arbitrary precision을 지원하여 오버플로우가 생기지 않습니다.  
🔔 arbitrary-precision은 사용할 수 있는 메모리양이 정해져 있는 기존의 fixed-precision과 달리, 현재 남아있는 만큼의 가용 메모리를 모두 수 표현에 끌어다 쓸 수 있는 형태를 이야기하는 것 같다. 예를 들어 특정 값을 나타내는데 4바이트가 부족하다면 5바이트, 더 부족하면 6바이트까지 사용할 수 있게 유동적으로 운용한다는 것이다.  
![](/assets/images/number_2.png){: width="70%" height="70%"}  

## 3. 2진법, 8진법, 16진법

bin(), oct(), hex() 함수를 이용하면 정수형 자료를 2진법, 8진법, 16진법으로 표현된 문자열을 리턴해 줍니다.
```python
>>> bin(15)
'0b1111'

>>> oct(23)
'0o27'

>>> hex(13)
'0xd'
```
앞의 표기법을 제외한 값만을 얻고 싶을 때는 문자열 슬라이싱을 이용하면 됩니다.
```python
>>> bin(15)[2:]
1111
>>> oct(23)[2:]
27
```
반대로 2, 8, 16진법으로 표기된 숫자를 10진법으로 바꾸고 싶을 때는 다음과 같은 방법을 이용할 수 있습니다.
```python
>>> int(bin(15), 2)
15
>>> int(oct(23), 8)
23
```
2, 8, 16진법으로 표기된 숫자를 사칙연산 하는 방법으로는 10진법으로 변환하여 사칙연산을 한 뒤 다시 해당하는 진법으로 변환합니다.
```python
bin(int(bin(15), 2) + int(oct(23), 8)) # 0b1111 + 0o27 을 계산하여 bin() 으로 감싸 결과를 2진법으로 변환한다
```
## 4. 부동 소수점 연산 오류
1부터 10까지 정수는 10개지만 실수는 무한히 많습니다.  
컴퓨터에서는 숫자를 비트로 표현하는데 실수는 유한개의 비트로 정확하게 표현할 수가 없습니다.  
따라서 실수는 유한개의 비트를 사용하여 근삿값으로 표현합니다.  
파이썬에서 0.1 + 0.2의 값은 0.3이 나올 것 같지만 실제로는 0.30000000000000004가 나옵니다.  
두 실수가 같은지 판단할 때는 ==을 사용하면 안 됩니다. 
```python
>>> 0.1 + 0.2 == 0.3
False
```
Python 3.5 이상부터 math.isclose() 함수를 사용하여 두 실수가 같은지 확인할 수 있습니다.
```python
>>>import math
>>>math.isclose(0.1 + 0.2, 0.3)
True
```

## 5. 숫자 자료형 관련 메소드

dir() 내장 함수를 이용하면 해당 객체가 갖고 있는 변수와 메소드를 보여줍니다.  
(익숙하지 않은 객체를 사용해야할 경우 먼저 dir() 내장 함수를 통해 변수와, 메소드를 살펴볼 수 있어 굉장히 유용합니다.)  
```python
>>> dir(a)

['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__',  '__eq__', '__float__',  
 '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__',  
 '__init_subclass__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__or__',  
 '__pos__',  '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__',  
 '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__',  
 '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag',  
 'numerator', 'real', 'to_bytes']
```

이 중에 double undermethod ( ex). \__abs__)를 제외한 속성에 유의해서 살펴보면 됩니다.  
예를 들어 bit_length 메소드의 경우 객체의 비트 길이를 리턴해줍니다.
```python
>>> a = 11
>>> a.bit_length()
4
```

