---
layout: post
title:  'Pandas Series [Part7] 판다스 시계열 데이터'
description: 
date:   2022-01-20 15:01:35 +0300
image:  '/images/pandas_logo.png'
logo_image:  '/images/pandas_logo.png'
category: data_analytics
tag: pandas
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 

# Time Series

- Timestamp
    - Timestamp 는 넘파이의 datetime64 기반
    - 파이썬의 datetime 보다 더 높은 정밀도
- DatetimeIndex
    - 다수의 Timestamp 를 하나의 object로 관리해주는 클래스


## to_datetime

```py
dt = datetime(2021, 1, 12, 23)

pd.Timestamp(dt)
pd.Timestamp("2021-1-12")

pd.to_datetime(dt)
pd.to_datetime("2021-1-12")
------------------------------------------
Timestamp('2021-01-12 23:00:00')
Timestamp('2021-01-12 00:00:00')
Timestamp('2021-01-12 23:00:00')
Timestamp('2021-01-12 00:00:00')
```

```py
dt_list = [datetime(2021, 1, 12), datetime(2022, 5, 11)]
pd.DatetimeIndex(dt_list)

pd.to_datetime(dt_list)
------------------------------------------------------------------------------
DatetimeIndex(['2021-01-12', '2022-05-11'], dtype='datetime64[ns]', freq=None)
DatetimeIndex(['2021-01-12', '2022-05-11'], dtype='datetime64[ns]', freq=None)
```

## date_range

```py
pd.date_range(start='2021-05-02', end='2021-05-08')
----------------------------------------------------------------------------
DatetimeIndex(['2021-05-02', '2021-05-03', '2021-05-04', '2021-05-05',
               '2021-05-06', '2021-05-07', '2021-05-08'],
              dtype='datetime64[ns]', freq='D')

```

```py
pd.date_range(start='2021-05-02', periods=4, freq='5H')
----------------------------------------------------------------------------
DatetimeIndex(['2021-05-02 00:00:00', '2021-05-02 05:00:00',
               '2021-05-02 10:00:00', '2021-05-02 15:00:00'],
              dtype='datetime64[ns]', freq='5H')
```

```py
pd.date_range(start='2021-05-02', end='2021-05-04', freq='12H')
----------------------------------------------------------------------------
DatetimeIndex(['2021-05-02 00:00:00', '2021-05-02 12:00:00',
               '2021-05-03 00:00:00', '2021-05-03 12:00:00',
               '2021-05-04 00:00:00'],
              dtype='datetime64[ns]', freq='12H')
```


```py
pd.date_range(start='2022-01-01', end='2022-10-31', freq='M')
----------------------------------------------------------------------------
DatetimeIndex(['2022-01-31', '2022-02-28', '2022-03-31', '2022-04-30',
               '2022-05-31', '2022-06-30', '2022-07-31', '2022-08-31',
               '2022-09-30', '2022-10-31'],
              dtype='datetime64[ns]', freq='M')
```


## period_range


```py
pd.period_range(start='2022-01-01', end='2022-10-31', freq='M')
----------------------------------------------------------------------------
PeriodIndex(['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06',
             '2022-07', '2022-08', '2022-09', '2022-10'],
            dtype='period[M]')
```


```py
pd.period_range(start='2022-01-01', end='2022-7-15', freq='Q')
----------------------------------------------------------------------------
PeriodIndex(['2022Q1', '2022Q2', '2022Q3'], dtype='period[Q-DEC]')
```

```py
x = [0, 1, 4, 2, 5, 6, 2 ,3, 3, 1, 5, 6, 1]
ts = pd.date_range(start='2022-01-01', periods=len(x), freq='D')
pd.Series(x, index=ts).to_frame()
----------------------------------------------------------------------------
```

![](/images/pd_60.png)


































