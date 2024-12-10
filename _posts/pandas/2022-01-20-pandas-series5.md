---
layout: post
title:  'Pandas Series [Part5] 판다스 그루핑'
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

# 그룹별 집계 연산

![](/images/pd_41.png)

```py
df.groupby('PER_group').agg(
    {
        '매출액(억원)': ['mean', 'min'],
        '순이익률(%)': 'mean'
    }
)
```

![](/images/pd_42.png)

- 아래와 같은 방법도 가능하지만, 위 방식이 가장 자유도가 높다

```py
# df.groupby('PER_group')[['매출액(억원)', '순이익률(%)']].mean()
# df.groupby('PER_group')[['매출액(억원)', '순이익률(%)']].agg(['mean', 'min'])
```

# 그룹 만들기

## 그룹간 범위 직접 정하기

```py
pd.cut(x=df['PER(배)'], 
       bins=[-np.inf, 10, 20, np.inf],
       labels=['저평가주', '보통주', '고평가주'])
```

![](/images/pd_43.png)

```py
df['PER_group'] = pd.cut(x=df['PER(배)'], 
                       bins=[-np.inf, 10, 20, np.inf],
                       labels=['저평가주', '보통주', '고평가주'])
```

![](/images/pd_44.png)


## 그룹 균등하게 정하기

```py
df['PER_group_2'] = pd.qcut(x=df['PER(배)'],
                            q=5,
                            labels=['유망', '추천', '안전', '위험', '고위험'])
```

![](/images/pd_45.png)

```py
df['PER_group_2'].value_counts()
```

![](/images/pd_46.png)


# 그룹 정보

```py
df.groupby(['PER_group', 'PER_group_2']).groups.keys()
------------------------------------------------------------------------------------------------------------
dict_keys([('고평가주', '고위험'), ('고평가주', '위험'), ('보통주', '안전'), ('보통주', '위험'), ('저평가주', '안전'), ('저평가주', '유망'), ('저평가주', '추천'), (nan, nan)])
```

```py
df.groupby(['PER_group', 'PER_group_2']).size().to_frame()
```

![](/images/pd_47.png)











