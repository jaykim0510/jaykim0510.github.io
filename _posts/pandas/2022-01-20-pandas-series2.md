---
layout: post
title:  'Pandas Series [Part2] 판다스 EDA'
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

# Exploratory Data Analysis

## 데이터 샘플

```py
df.head(3)
```

![](/images/pd_1.png)

```py
df.sample(3)
```

![](/images/pd_2.png)


## 데이터 길이

```py
len(df)
```

## 데이터 컬럼별 특성

```py
df.info()
```

![](/images/pd_3.png)

## 데이터 통계적 특성

```py
df.describe()
```

![](/images/pd_4.png)


```py
df.describe(include=['object', pd.Categorical])
```

![](/images/pd_5.png)

```py
df.describe(percentiles=[0.01, 0.5, 0.99])
```

![](/images/pd_6.png)

## 데이터 유니크

```py
df.nunique()
```

![](/images/pd_7.png)

```py
df['ticker'].nunique()
------------------------
681
```

```py
df['ticker'].unique()
```

![](/images/pd_8.png)


## 데이터 빈도수

```py
df.head(10)
```

![](/images/pd_9.png)


```py
df['Sector'].value_counts()
```

![](/images/pd_10.png)

```py
df['Sector'].value_counts(normalize=True)
```

![](/images/pd_11.png)


## 데이터 정렬

```py
df.head(3)
```

![](/images/pd_1.png)


```py
# 매출액(억원) 에 대해서 가장 큰 값 5개를 desceding order로 추출 (전체를 정렬하지 않음)
df.nlargest(5, '매출액(억원)')
```

![](/images/pd_12.png)

```py
# 5개에서 PER(배) 가장 작은 값 3개를 desceding order로 추출
df.nlargest(5, '매출액(억원)').nsmallest(3, 'PER(배)')
```

![](/images/pd_13.png)

```py
# 매출액(억원)에 대해서 전체 데이터 정렬
df.sort_values('매출액(억원)', ascending=False).head(3)
```

![](/images/pd_14.png)

```py
# 매출액(억원)에 대해서 내림차순 정렬한 후, 그 상태에서 매출액(억원)이 같은 데이터끼리 PER(배)에 대해 오름차순 정렬
# 이런 여러 컬럼에 대한 정렬이 의미를 가지려면 정렬하는 앞의 컬럼들이 범주형 데이터여야 한다
# ex. [계열사, 매출액] 이런식으로
df.sort_values(['매출액(억원)', 'PER(배)'], ascending=[False, True]).head(3)
```

![](/images/pd_15.png)

```py
df.sort_index(inplace=True).head(3)
```

![](/images/pd_16.png)

```py
df.index.is_monotonic_increasing
----------------------------------
True
```



