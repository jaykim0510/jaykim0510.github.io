---
layout: post
title:  'Python Basic Series [Part6]: 코딩테스트를 위한 파이썬의 유용한 내장 모듈 collections'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2021-04-01 15:01:35 +0300
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
## 1. 딕셔너리 자료형의 특징

딕셔너리 자료형은 **순서가 없는 시퀀스형** 자료형입니다.  
key, value를 쌍으로 갖고 있습니다.  
key값은 중복이 불가능하고 value값은 중복이 가능합니다.  

## 2. 딕셔너리 생성
딕셔너리 형태의 데이터를 생성하는 방법을 알아보도록 하겠습니다.  
만드는 방법도 여러가지가 있기 때문에 하나씩 살펴보도록 하겠습니다.  

### 2-1 딕셔너리 객체 생성 후 값을 넣어주는 방법
```python
>>> dict1 = dict()
>>> a['a'] = 'apple'
>>> a['b'] = 'banana'
>>> a['c'] = 'car'
```

### 2-2 중괄호를 사용하는 방법
```python
>>> dict1 = {'a':'apple', 'b':'banana', 'c':'car'}
```

### 2-3 딕셔너리 객체 생성 후 (key, value)쌍을 넣어주는 방법
```python
>>> dict1 = dict([('a', 'apple'), ('b', 'banana'), ('c', 'car')])
```

### 2-4 내장함수 zip()을 사용해 (key, value)쌍을 넣어주는 방법
```python
>>> dict1 = dict(list(zip(['a', 'b', 'c'], ['apple', 'banana', 'car'])))
```

🔔 딕셔너리는 key값은 중복이 안되고 value는 중복이 가능합니다
```python
>>> dict1 = dict([('a', 'apple phone'), ('a', 'apple car'), ('b', 'banana'), ('c', 'banana')])
>>> dict1
{'a': 'apple car', 'b': 'banana', 'c': 'banana'} #key값 'a'는 중복이 불가, value값 'banana'는 중복 가능
```
🔔 key값을 통해 value 값을 접근하고 수정하는 것은? 가능하다
```python
dict1['a'] = 'apple pods'
```  
🔔 value값을 통해 key 값에 접근하고 수정하는 것은? 간단하지 않다  

딕셔너리의 자료구조 특성(해시테이블)상 key를 통한 value의 접근은 O(1), 그 반대는 O(n)  

```python
for i in range(len(dict1)):
    if 'car' in list(dict1.items())[i]:
        wanted_key = list(dict1.items())[i][0]
a.pop(wanted_key)
a['c_new'] = 'car'
```

## 3. 딕셔너리 메소드

```python
>>> dict1 = {'a': 'apple', 'b': 'banana', 'c': 'car'}
>>> dir(dict1)
['__class__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', 
'__getattribute__', '__getitem__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__',  
'__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__setitem__', '__sizeof__', '__str__',  
'__subclasshook__', 'clear', 'copy', 'fromkeys', 'get', 'items', 'keys', 'pop', 'popitem', 'setdefault', 'update', 'values']
```

### 3-1 확인하기: .keys(), .values(), .items()
* .keys()  
  딕셔너리의 key값들을 보여주는 dict_keys객체를 생성합니다. 이는 메모리 낭비를 방지하기 위함 입니다.  
  값 하나하나를 읽어오기 위해서는 list로 형 변환 시켜줘야 합니다.  
  ```python
  >>> dict1.keys()
  dict_keys(['a', 'b', 'c'])
  >>> list(dict1.keys())
  ['a', 'b', 'c']
  ```

* .values()  
  딕셔너리의 value들을 보여줍니다.
  마찬가지로 값을 하나씩 읽어오기 위해서는 list로 형 변환 시켜줍니다.  
  ```python
  >>> d = {'a': 'apple', 'b': 'banana', 'c': 'car', 'd': 'dragon', 'e': 'epsilon'}
  >>> d.values()
  dict_values(['apple', 'banana', 'car', 'dragon', 'epsilon'])
  ```

* .items()  
  딕셔너리의 (key, value)쌍들을 보여줍니다.
  ```python
  >>> dict1.items()
  dict_items([('a', 'apple'), ('b', 'banana'), ('c', 'car')])
  ```

### 3-2 제거하기: .pop(), .popitem()
* .pop()  
  없애고자 하는 (key, value)쌍의 key값을 입력해주면 value값을 리턴하고 해당하는 쌍을 pop해줍니다  
  ```python
  >>> d = {'a': 'apple', 'b': 'banana', 'c': 'car', 'd': 'dragon', 'e': 'epsilon'}
  >>> d.pop('a')
  'apple'

  >>> d
  {'b': 'banana', 'c': 'car', 'd': 'dragon', 'e': 'epsilon'}
  ```

* .popitem()  
  한 번 실행할 때 마다 가장 뒤에 저장된 (key, value)쌍을 리턴하고 딕셔너리에서 pop해줍니다.  
  (딕셔너리는 순서가 없는데 어떤 쌍이 가장 뒤에 있는 값인지 어떻게 알까?-> 파이썬 3.x 버전 업데이트 이후로는 순서대로 저장된다)

### 3-3 복사하기: .copy()

* .copy() (얕은 복사)
  딕셔너리와 같은 데이터를 갖는 새로운 딕셔너리를 생성해줍니다.  얕은 복사이므로 딕셔너리의 값이 mmutable한 경우 문제가 된다.  
  🔔 이 밖에도 변수를 이용한 복사, 깊은 복사가 있습니다. [(복사에 관한 포스팅)](../python-data-type-intro/ "마우스를 올려놓으면 말풍선이 나옵니다.")


### 3-4 결합하기: .update(), {**dict1, **dict2}  

```python
>>> a = dict()
>>> a.update({'a':'apple'})
>>> a
{'a':'apple'}

>>> b = dict()
>>> b.update({'b':'banana'})
>>> b
{'b':'banana'}

>>> c = {**a, **b}
>>> c
{'a':'apple', 'b':'banana'}

>>> {**{'a':'apple', 'b':'banana'}, **{'c':'car', 'd':'dragon', 'e':'epsilon'}}
{'a': 'apple', 'b': 'banana', 'c': 'car', 'd': 'dragon', 'e': 'epsilon'}
```  

## KeyError를 막기 위한 3가지 방법: get(), setdefault(), defaultdict()  

KeyError를 해결하기 위해 try, except구문을 써도 되지만 다음과 같은 방법으로 코드를 더 간결하게 작성할 수 있습니다.  

### get(key, default)  

딕셔너리 자료형의 get() 메소드는 원하는 key값의 value를 조회할 때, key값이 없을 경우 default 값을 주어 KeyError를 해결합니다.  

```python
dic = {'a': 1, 'b': 2, 'c': 3}

# 일반적인 값 조회
dic['a']
-------------
1

# 일반적인 값 조회는 key값이 없으면 오류가 발생
dic['d']
-------------
KeyError


# get메소드 이용
dic.get('d')
-------------
None

# get메소드의 default 인자 이용
dic.get('d', 0)
-------------
0

```


### setdefault(key, default)  

setdefault는 get과 거의 비슷해 보이지만 제가 알고있는 한 가지 다른점은 없는 key값의 default값을 리턴만 하는 get()메소드와는 다르게, setdefault()메소드는 key값이 없으면 딕셔너리에 저장도 해준다는 것입니다. 바로 예시를 보겠습니다.  

```python
dic = {'a': 1, 'b': 2, 'c': 3}

# get메소드는 default갑 리턴만 해줍니다
dic.get('d', 0)

dic
--------------------
{'a': 1, 'b': 2, 'c': 3}

# setdefault메소드는 저장도 합니다.
dic.setdefault('d', 0)

dic
--------------------
{'a': 1, 'b': 2, 'c': 3, 'd': 0}

# key값이 없으면 defalut인 빈 리스트를 값으로 생성 
dic = {'a': ['apple'], 'b': ['banana', 'bulgaria'], 'c': ['car']}

dic.setdefault('a', []).append('alphago')

dic
---------------------------------------------------------------
{'a': ['apple', 'alphago'], 'b': ['banana', 'bulgaria'], 'c': ['car']}

dic.setdefault('d', []).append('dog')

dic
--------------------------------------------------------------
{'a': ['apple', 'alphago'],
 'b': ['banana', 'bulgaria'],
 'c': ['car'],
 'd': ['dog']}
```

### defaultdict(자료형)

defaultdict는 collections모듈에 있는 함수로 default를 가지는 `딕셔너리를 생성`할 때 활용됩니다.  

```python
from collections import defaultdict

dic = defaultdict(int)

dic['a']
-------------
0


dic
-------------
{'a': 0}
```  


```python
dic = defaultdict(list)

dic['a']
------------
[]

dic['b'].append('banana')

dic
-----------
{'a':[], 'b':['banana']}


# 여기서 setdefault를 이용할 수도 있습니다.
dic.setdefault('c', 0)

dic
-------------------
{'a': [], 'b': ['banana'], 'c': 0}

# 이렇게 dic의 default가 list였음에도 int형 0을 default로 할 수 있습니다.  
```