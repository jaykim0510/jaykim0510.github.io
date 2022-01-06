---
layout: post
title:  Python data type number
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2020-04-23 15:01:35 +0300
image:  '/images/15.jpg'
tags:   [python, backend]
---

## 1. 문자열 자료형의 특징

문자열 자료형은 **순서가 있는 시퀀스형** 자료형입니다. 그렇기 때문에 인덱싱, 슬라이싱을 통해 데이터의 일부분을 추출할 수 있습니다.  
데이터 관련 분야에서 일을 하다 보면 문자열 자료형 데이터를 목적에 맞게 다듬거나 또는 다른 자료형으로 변환해 사용하는 일이 많기 때문에 
자료형 중에서도 비중이 높은 편입니다.  
🔔 문자열은 immutable하기 때문에 값을 변경할 수 없다. (리스트로 형변환 해야한다.)

## 2. 문자열 데이터 만들기

문자열 데이터를 생성하는 방법은 다음과 같습니다. 
* '원하는 문자열'
* "원하는 문자열"
* '''원하는 문자열'''
* """원하는 문자열"""

```python
>>> a = 'Hello world'
'Hello world'
>>> b = "Hello world"
'Hello world'
>>> c = '''Hello world'''
'Hello world'
>>> d = """Hello world"""
'Hello world'
```
어떤 따옴표로 묶어도 저장된 값이 모두 같습니다. 그렇다고 해서 아무런 의미가 없지는 않습니다.  
예를 들어 세 번째와 네 번째의 ''' ''', """ """은 여러줄에 걸쳐있는 문자열을 하나로 담을 수 있습니다.  
('', ""으로 작성하면 오류가 난다)

```python
>>> a = '''Hello world!
Nice to meet you
I wish you to be happy!'''
>>> print(a)
Hello world!
Nice to meet you
I wish you to be happy!
```
'와 " 가 굳이 존재하는 이유는 문자열 안에 ' 또는 "이 포함된 경우가 있기 때문입니다.  
```python
>>> a = "I'd like to eat something"
# a = 'I'd like to eat something' 으로 하면 'I' 까지만 문자열로 인식합니다
```
```python
>>> a = 'He said "I love you"'
```
만약 문자열에 '와 "가 둘다 사용된다면 어떻게 해야할까요? (ex. He said "I'd like to eat something")  
이 때는 이스케이프 문자를 사용해야 합니다. 즉 ''안에 '가 들어가는 경우에는 역슬래쉬(백스페이스 밑에 있음)를 앞에 적어줍니다.
```python
>>> a = 'He said "I\'d like to eat something"'
```
## 3. 인덱싱, 슬라이싱
이번에는 위에서 만들어진 문자열 데이터를 가지고 원하는 부분만 가져올 수 있도록 해주는 인덱싱, 슬라이싱에 대해 알아보겠습니다.
```python
>>> a = "Hello world"
"""인덱싱"""
>>> a[0]
H

>>> a[2]
l

"""슬라이싱"""
>>> a[0:5] # 0에서 부터 5앞까지 -> 인덱스 0~4
Hello

>>> a[:]
Hello world!

>>> a[::]
Hello world!

>>> a[::-1] #처음부터 끝까지 거꾸로 슬라이싱 (중요)
!dlrow olleH
```
## 4. 문자열 포맷팅
문자열을 내가 원하는 형식에 맞춰 출력하는 방법에 대해 알아보겠습니다.
1. print("{}".format())
```python
>>> a = 'banana', b = 'apple', c = 'lemon'
>>> print('I like {}, {} and {}'.format(a, b, c))
'I like banana, apple and lemon'
```

2. f-string 포맷
```python
>>> print(f'I like {a}, {b} and {c}')
```  

    🔔 자릿수를 지정하는 방법
    ```python
    for i in range(1, 100):
        for j in range(1, 100):
            print(f'{i} * {j} = {i*j}')
    ```
    이렇게 하면 99*99단 표를 만들 수 있지만 자릿수가 서로 달라 보기 안좋아진다.  
    이럴때 자릿수를 지정하게 되면 훨씬 깔끔한 출력문을 얻을 수 있다.
    ```python
    print(f'{i:2} * {j:2} = {i*j:4}')
    99 *   9 =   891
    99 *  10 =   990
    99 *  11 =  1089
    ```

## 5. 문자열 메소드
문자열 데이터는 프로그래밍을 하다보면 정말 자주 만나게 되는 자료형 중에 하나입니다.  
그렇기 때문에 문자열 객체의 메소드를 잘 활용할 줄 아는 것이 굉장히 중요합니다.  
먼저 어떤 메소드가 있는지 확인해 보겠습니다.
```python
>>> a = "Hello world"
>>> dir(a)
['__add__', '__class__', '__contains__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getnewargs__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mod__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__rmod__', '__rmul__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'capitalize', 'casefold', 'center', 'count', 'encode', 'endswith', 'expandtabs', 'find', 'format', 'format_map', 'index', 'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit', 'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace', 'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans', 'partition', 'replace', 'rfind', 'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split', 'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate', 'upper', 'zfill']
```
여기 있는 메소드들을 반드시 머릿속에 모두 외우고 있을 필요는 없습니다. ~~그렇게 하기도 힘들구요. 왜냐하면 저희가 문자열 데이터만 사용하는 것도 아니고 여러 형태의 객체가 갖는 메소드를 생각해보면 그 수가 엄청나니까요.~~  
실제로 코딩을 하실 때는 기억이 안나면 그 때마다 **dir()** 함수를 사용해 어떤게 있는지 살펴보면 됩니다. 그러다 익숙해지면 머릿속에 저장되겠지요.

### 5-1 .split()
인자(여기서는 쉼표)를 기준으로 나누어 리스트에 저장하여 리턴합니다
```python
>>> a = 'Banana, Apple, Lemon, Grape'
>>> a.split(", ")
['Banana', 'Apple', 'Lemon', 'Grape']
```
### 5-2 .strip()
양 쪽 화이트 스페이스를 제거한 값을 리턴해줍니다
```python
>>> a = '         Apple          '
>>> a.strip()
'Apple'

>>> '!!!@@@   apple  @!@@!#$'.strip('!')
'@@@   apple  @!@@!#$'
```  
🔔 문자, 화이트 스페이스를 지정하지 않고  제거할 수 있는 방법  
```python
import string

>>> string.whitespace
' \t\n\r\x0b\x0c'

>>> string.punctuation
'!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

>>> '!@#$!@#      Oh #### is it ok!@#!@#!@#^^?'.strip(string.whitespace+string.punctuation)
'Oh #### is it ok'
```  

### 5-3 .replace()
인자1로 받은 값을 인자2로 바꾸어줍니다.
```python
>>> a = 'I like Apple'
>>> a.replace("Apple", "Banana")
'I like Banana'

>>> 'I love banana!!!!'.replace('!', '')
'I love banana'
```
### 5-4 .join()
인자로 받은 iterable한 데이터(문자열, **리스트**, 튜플, 딕셔너리, 세트)를 내가 지정한 문자열을 이용해  
하나의 문자열로 이어지도록 합니다.
```python
>>> a = ['apple', 'banana']
>>> ", ".join(a)
'apple, banana'
>>> b = ['I', 'like', 'coffee']
>>> " ".join(b)
I like coffee
>>> c = 'Who do you love?'
>>> "#".join(c)
'W#h#o# #d#o# #d#o# #y#o#u# #l#o#v#e#?'
```
### 5-5 .zfill(), .index(), .find(), .count(), .endswith(), .lower()
* .zfill()  
인자로 넣어준 값만큼 문자열 길이를 맞춰주고 남는 부분을 숫자 0으로 메꾼다.
```python
>>> a = 'I like Lemon'
>>> a.zfill(20)
'00000000I like Lemon'
```
비트를 자릿수에 맞춰 나타내고 싶을 때 사용되고는 합니다
```python
>>> a = 15
>>> str(bin(a)[2:]).zfill(8)
'00001111'
```

* .index() 와 .find()  
둘 다 인자로 넣은 문자열이 위치한 인덱스를 리턴해줍니다.  
(차이점은 .index()는 없으면 오류, .find()는 없으면 -1리턴)
```python
>>> a = 'I like Iron man, Spider man and Hulk'
>>> a.index('Spider man')
17
>>> a.index('Bat man')
오류
>>> a.find('Bat man')
-1
```
* .count()  
인자로 받은 문자열이 등장하는 횟수를 리턴해줍니다  
```python
>>> 'ASAP is abbreviation of as soon as possible'.count('A')
2
```

* .endswith()  
인자로 받은 문자열로 끝나면 True, 아니면 False를 리턴해줍니다  
```python
>>> 'what?'.endswith('?')
True
```

* .lower()  
인자로 받은 문자열을 모두 소문자로 만들어 리턴해줍니다  
```python
>>> 'I love New York'.lower()
'i love new york'
```


