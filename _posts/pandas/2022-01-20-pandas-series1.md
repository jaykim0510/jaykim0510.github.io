---
layout: post
title:  'Pandas Series [Part1] 판다스 기초'
description: 
date:   2022-01-20 15:01:35 +0300
image:  '/images/pandas_logo.png'
logo_image:  '/images/pandas_logo.png'
categories: data_analytics
tags: Pandas
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 


# Series

- index가 있는 ndarray
- Series 안에 data type은 모두 같아야함 (다르게 하면 에러가 나지는 않지만 타입 변환이 일어난다)
- Series의 data type에 따라 여러 기능들을 제공한다 (ex. df['종목명'].str.contains('삼성'))
- Series 간의 연산은 index 기준
- int형 타입에 하나라도 nan이 있으면 float형이 됨
- nan > 0 -> False, nan <= 0 -> False : nan 은 0보다 큰 범위에도 속하지 않고, 같거나 작은 범위에도 속하지 않는다 => nan 처리가 중요하다
- s = pd.Series(data, index, dtype)

```py
pd.Series([3, 4, 5])
----------------------
0    3
1    4
2    5
dtype: int64

pd.Series([3, 4, 5], dtype='float')
--------------------------------------
0    3.0
1    4.0
2    5.0
dtype: float64

pd.Series([3, 4, 5], index=['a', 'b', 'c'])
--------------------------------------------
a    3
b    4
c    5
dtype: int64

pd.Series({'a': 3, 'b': 4, 'c': 5})
--------------------------------------
a    3
b    4
c    5
dtype: int64
```


```py
x = pd.Series([3, 4, 5, np.nan])

len(x)
x.size
x.count()
------------
4
4
3
```

```py
x = pd.Series([3, 4, 5, np.nan])

# unique() 에 nan 도 포함된다
x.unique()
----------------------------------
array([ 3.,  4.,  5., nan])

x.value_counts()
--------------------
3.0    1
4.0    1
5.0    1
dtype: int64
```

```py
x = pd.Series([1, 2, 3, 4], index = ['a', 'b', 'c', 'd'])
y = pd.Series([5, 6, 7, 8], index = ['d', 'c', 'b', 'a'])

x + y
----------------------------------
a    9
b    9
c    9
d    9
dtype: int64


x = pd.Series([1, 2, 3, 4], index = ['a', 'b', 'c', 'd'])
y = pd.Series([5, 6, 7, 8], index = ['c', 'd', 'e', 'f'])

x + y
----------------------------------
a     NaN
b     NaN
c     8.0
d    10.0
e     NaN
f     NaN
dtype: float64

# Series의 add 메서드를 사용하면 fill_value 파라미터를 이용해 더하기 연산을 하기 전에 Nan값을 채울 수 있다
x.add(y, fill_value=0)
----------------------------------
a     1.0
b     2.0
c     8.0
d    10.0
e     7.0
f     8.0
dtype: float64
```

# DataFrame

- 여러 Series를 index 기준으로 align 시킨 자료형
- {'컬럼1': Series1, '컬럼2': Series2}


```py
pd.DataFrame({'col1': pd.Series([1, 2, 3], index=['a', 'b', 'c']), 
              'col2': pd.Series([4, 5, 6], index=['a', 'b', 'c'])})
--------------------------------------------------------------------------
   col1  col2
a     1     4
b     2     5
c     3     6


pd.DataFrame(data={'col1': [1, 2, 3], 'col2': [4, 5, 6]}, 
             index=['a', 'b', 'c'])
----------------------------------------------------------
   col1  col2
a     1     4
b     2     5
c     3     6

# 단일 리스트는 열이 된다
pd.DataFrame([1, 2, 3, 4], columns=['col1'])
------------------------------------------------
   col1
0     1
1     2
2     3
3     4


# 리스트 안의 리스트는 행이 된다
pd.DataFrame(data=[[1, 4], [2, 5], [3, 6]], 
             columns=['col1', 'col2'], 
             index=['a', 'b', 'c'])
----------------------------------------------
   col1  col2
a     1     4
b     2     5
c     3     6
```

```py
# index 기준으로 align 한다

x = pd.Series([1, 2, 3], index=['a', 'b', 'c'])
y = pd.Series([4, 5, 6], index=['b', 'c', 'd'])

pd.DataFrame({'col1': x, 'col2': y})
------------------------------------------------
   col1  col2
a   1.0   NaN
b   2.0   4.0
c   3.0   5.0
d   NaN   6.0
```

# Index

## 인덱스 설정하기

```py
x = pd.Series([1, 2, 3])
x.index = ['a', 'b', 'c']
---------------------------
a    1
b    2
c    3
```



```py
df = pd.DataFrame([['a', 1, 4], ['b', 2, 5], ['c', 3, 6]], columns=['col1', 'col2', 'col3'])
df
----------------------------------------------------------------------------------------------
  col1  col2  col3
0    a     1     4
1    b     2     5
2    c     3     6
```

## 컬럼을 인덱스로 만들기

```py
df.set_index('col1', inplace=True)
------------------------------------
      col2  col3
col1
a        1     4
b        2     5
c        3     6
```

```py
df.set_index('col2', inplace=True, append=True)
------------------------------------------------
           col3
col1 col2
a    1        4
b    2        5
c    3        6
```

## 인덱스를 컬럼으로 만들기

```py
df.reset_index(level='col1', inplace=True)
------------------------------------------------
     col1  col3
col2
1       a     4
2       b     5
3       c     6
```

## 인덱스 재배열

```py
df = pd.DataFrame({'col': pd.Series([1, 2, 3], index=['b', 'c', 'd']), 'col2': pd.Series([4, 5, 6], index=['c', 'd', 'e'])})
------------------------------------------
   col  col2
b  1.0   NaN
c  2.0   4.0
d  3.0   5.0
e  NaN   6.0
```

```py
df.reindex(['a', 'b', 'c', 'd', 'e', 'f'])
------------------------------------------
   col  col2
a  NaN   NaN
b  1.0   NaN
c  2.0   4.0
d  3.0   5.0
e  NaN   6.0
f  NaN   NaN

df.reindex(['a', 'b', 'c', 'd', 'e', 'f'], fill_value=0)
----------------------------------------------------------
   col  col2
a  0.0   0.0
b  1.0   NaN
c  2.0   4.0
d  3.0   5.0
e  NaN   6.0
f  0.0   0.0

# 일부 남아있는 NaN은 reindex로 인한 NaN이 아니라 처음부터 있던 NaN이기 때문에 안 채워진다
# 이런값들은 fillna 로 해결해야 한다
```


## 인덱스명 바꾸기

```py
df = pd.DataFrame({'col1': [1, 2, 3], 'col2': [4, 5, 6]}, index=['a', 'b', 'c'])
----------------------------------------------------------------------------------
   col1  col2
a     1     4
b     2     5
c     3     6
```

```py
df.index.rename('my_index', inplace=True)
------------------------------------------
          col1  col2
my_index
a            1     4
b            2     5
c            3     6
```

```py
# 인덱스에 대해 정렬
df.sort_index(inplace=True)
df.index.is_monotonic_increasing
```

# 행/열 데이터 추가

## 행 데이터 추가

- `append`와 `concat`이 있지만, `append`는 deprecated 됐다


```py
df1 = pd.DataFrame([['mike', 15], ['carl', 21], ['bob', 25]], columns=['name', 'age'])
df2 = pd.DataFrame([['steven', 32], ['joey', 24], ['monica', 45]], columns=['name', 'age'])

df1
df2
```

![](/images/pd_48.png)


```py
pd.concat([df1, df2])
```

![](/images/pd_49.png)

```py
pd.concat([df1, df2], ignore_index=True)
```

![](/images/pd_50.png)

```py
pd.concat([df1, df2], keys=['1기', '2기'], names=['기수', 'id'])
```

![](/images/pd_51.png)


## 열 데이터 추가

```py
df1 = pd.DataFrame([['mike', 15], ['monica', 21], ['bob', 25]], columns=['name', 'age'])
df1.set_index('name', inplace=True)

df2 = pd.DataFrame([['bob', 'M'], ['mike', 'M'], ['monica', 'F']], columns=['name', 'gender'])
df2.set_index('name', inplace=True)

df1
df2
```


![](/images/pd_52.png)

```py
pd.concat([df1, df2], axis=1)
```


![](/images/pd_53.png)

```py
df1 = pd.DataFrame([['mike', 15], ['carl', 21], ['bob', 25]], columns=['name', 'age'])
df2 = pd.DataFrame([['steven', 32], ['joey', 24], ['monica', 45]], columns=['name', 'age'])

pd.concat([df1, df2], axis=1, keys=['1기', '2기'])
```


![](/images/pd_54.png)




