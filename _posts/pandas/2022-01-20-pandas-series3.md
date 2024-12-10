---
layout: post
title:  'Pandas Series [Part3] 판다스 데이터 부분 추출'
description: 
date:   2022-01-20 15:01:35 +0300
image:  '/images/pandas_logo.png'
logo_image:  '/images/pandas_logo.png'
categories: data_analytics
tags: pandas
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 

# 샘플 데이터

![](/images/pd_1.png)


# By Column

- DataFrame 에 대괄호는 컬럼 기준으로 인덱싱한다
- 대괄호 안에 컬럼명을 넣으면 Series 리턴
- 대괄호 안에 다시 대괄호로 리스트를 넘기면 DataFrame 리턴

```py
x = df['ticker']

type(x)
--------------------------
pandas.core.series.Series
```

![](/images/pd_17.png)


```py
x = df[['ticker']]

type(x)
----------------------------
pandas.core.frame.DataFrame
```

![](/images/pd_18.png)



```py
df.filter(like='(배)').head(3)
```

![](/images/pd_19.png)

```py
df.filter(regex='\([배원]\)').head(3)
```

![](/images/pd_20.png)


# By Type

```py
df.select_dtypes(include=['object']).head(3)
```

![](/images/pd_21.png)

# By Row

```py
df.set_index('ticker', inplace=True)
df.index.name = '종목명'
```

![](/images/pd_22.png)

```py
# 숫자(순서) 이용 -> 잘 안쓰임
df.iloc[[0, 1], 0:5]
df.iloc[[0, 1], [0, 3, 5]]
```

![](/images/pd_23.png)
![](/images/pd_24.png)


```py
# loc
df.loc[['AK홀딩스', '삼성전자'], ['매출액(억원)', '순이익률(%)']]
```

![](/images/pd_25.png)


```py
df.sort_index(ascending=True, inplace=True)

# 인덱스를 정렬하고 나면 '삼성' 처럼 '삼성'이 없어도 범위 인덱싱을 지원
df.loc['삼성':'삼성생명']
```

![](/images/pd_26.png)


# By At


```py
%timeit df.loc[100, '순이익률(%)']
----------------------------------------------------------------------------
3.73 µs ± 4.38 ns per loop (mean ± std. dev. of 7 runs, 100,000 loops each)
```

```py
# df.at 이 2배 이상 빠르다
%timeit df.at[100, '순이익률(%)']
------------------------------------------------------------------------------
1.73 µs ± 2.25 ns per loop (mean ± std. dev. of 7 runs, 1,000,000 loops each)
```



# By Boolean

```py
condition = df['순이익률(%)'] > 20

df[condition].head(3)
```

![](/images/pd_27.png)

```py
print(f'순이익률이 20%를 넘는 회사의 수: {condition.sum()}개')
print(f'순이익률이 20%를 넘는 회사의 비율: {condition.mean()*100:.1f}%')
-----------------------------------
순이익률이 20%를 넘는 회사의 수: 22개
순이익률이 20%를 넘는 회사의 비율: 3.2%
```


```py
# loc 안에도 Boolean Series 넣을 수 있다
df.loc[condition].head(3)
```

![](/images/pd_28.png)

```py
# 다양한 조건 예시
condition1 = df['순이익률(%)'] > 20
condition2 = df['ticker'] == '현대건설'
condition3 = df['ticker'].isin(['삼성전자', 'LG디스플레이'])
condition4 = df['매출액(억원)'].isin([1389.7075])
condition5 = df['ticker'].str.contains('LG')
condition6 = condition3 & condition5
```

```py
# 모든 값이 조건을 만족하면 True
(df['순이익률(%)'] > 20).all()
----------------------------------
False


# 조건을 만족하는 값이 하나라도 있으면 True
(df['순이익률(%)'] > 20).any()
----------------------------------
True
```



