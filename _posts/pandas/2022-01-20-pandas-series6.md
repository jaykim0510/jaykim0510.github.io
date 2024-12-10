---
layout: post
title:  'Pandas Series [Part6] 판다스 조인'
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


```py
df1 = pd.DataFrame([['A0', 'B0'], ['A1', 'B1'], ['A2', 'B2']], 
                   columns=['A', 'B'], 
                   index=['K0', 'K1', 'K2'])

df2 = pd.DataFrame([['C0', 'D0'], ['C2', 'D2'], ['C3', 'D3']], 
                   columns=['C', 'D'], 
                   index=['K0', 'K2', 'K3'])

df1
df2
```

![](/images/pd_55.png)


```py
# 기본적으로 left join
df1.join(df2)

# how='inner'
df1.join(df2, how='inner')

# how='outer'
df1.join(df2, how='outer')
```

![](/images/pd_56.png)


## 컬럼에 대해 조인

- `join` 을 사용할 때: 드리븐(driven) 데이터프레임(=df2) 의 인덱스를 조인하려는 컬럼으로 바꿔야 한다

```py
df1 = pd.DataFrame([['A0', 'B0'], ['A1', 'B1'], ['A2', 'B2']], 
                   columns=['A', 'B'], 
                   index=['K0', 'K1', 'K2'])

df2 = pd.DataFrame([['B0', 'C0'], ['B2', 'C2'], ['B3', 'C3']], 
                   columns=['B', 'C'], 
                   index=['K0', 'K2', 'K3'])

df1
df2
```

![](/images/pd_57.png)

```py
# 컬럼에 대해 조인하려면 드리븐(driven) 데이터프레임(=df2) 의 인덱스를 조인하려는 컬럼으로 바꿔야 한다
df2.set_index('B', inplace=True)
df2

df1.join(df2, on='B')
```

![](/images/pd_58.png)


- `merge` 를 사용할 때: 컬럼을 각각 원하는대로 지정할 수 있다

```py
# merge 는 둘다 컬럼 사용할 때 굉장히 편하다
# 심지어 컬럼이름이 다를 때도 가능하다 left_on='B_left', right_on='B_right' 이런식으로
pd.merge(left=df1, right=df2, on='B')
pd.merge(left=df1, right=df2, on='B', how='left')
pd.merge(left=df1, right=df2, on='B', how='outer')
```

![](/images/pd_59.png)


