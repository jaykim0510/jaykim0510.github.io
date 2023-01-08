---
layout: post
title:  'Matplotlib Series [Part6] Bar Plot'
description: 
date:   2022-01-20 15:01:35 +0300
image:  '/images/matplotlib_logo.png'
logo_image:  '/images/matplotlib_logo.png'
categories: data_analytics
tags: Matplotlib
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 


```py
import numpy as np
import matplotlib.pyplot as plt

data = [1, 4, 3, 2]
x_label = ['a', 'b', 'c', 'd']
```

# 기본 막대


```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.bar(x_label, data)
```

![](/images/matplot_19.png)

# 막대 꾸미기

```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.bar(x_label, data, facecolor='skyblue', edgecolor='darkblue', hatch='/')
```

![](/images/matplot_20.png)


# 정렬하기

```py
fig, ax = plt.subplots(figsize=(4, 3))

sorted_x_idx = np.argsort(data)
sorted_x_label = np.array(x_label)[sorted_x_idx]
sorted_data = np.array(data)[sorted_x_idx]

ax.bar(sorted_x_label, sorted_data)
```

![](/images/matplot_21.png)

# 여러 막대 그래프

```py
fig, ax = plt.subplots(figsize=(4, 3))

WIDTH = 0.4

x_idx = np.arange(len(data))
data_1 = [1, 4, 6, 2]
data_2 = [4, 2, 1, 7]


ax.bar(x_idx - WIDTH/2, data_1, width=WIDTH)
ax.bar(x_idx + WIDTH/2, data_2, width=WIDTH)

ax.set_xticks(x_idx)
ax.set_xticklabels(['a', 'b', 'c', 'd'])
```

![](/images/matplot_22.png)

```py
fig, ax = plt.subplots(figsize=(6, 3))

WIDTH = 0.2

x_idx = np.arange(len(data))
data_1 = [1, 4, 6, 2]
data_2 = [4, 2, 1, 7]
data_3 = [2, 5, 6, 8]


ax.bar(x_idx - WIDTH, data_1, width=WIDTH)
ax.bar(x_idx, data_2, width=WIDTH)
ax.bar(x_idx + WIDTH, data_3, width=WIDTH)

ax.set_xticks(x_idx)
ax.set_xticklabels(['a', 'b', 'c', 'd'])
```

![](/images/matplot_25.png)

# 막대에 텍스트 넣기

```py
fig, ax = plt.subplots(figsize=(4, 3))

rects = ax.bar(x_label, data)

for rect_idx, rect in enumerate(rects):
    x = rect.get_x()
    width = rect.get_width()
    height = rect.get_height()
    ax.text(x + width/2, height + 0.05, str(round(data[rect_idx])),
    rotation=20, ha='center', fontsize=10)
```

![](/images/matplot_23.png)



# 수평 막대

```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.barh(x_label, data)
```

![](/images/matplot_24.png)

```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.barh(x_label, data)
ax.invert_yaxis()
```

![](/images/matplot_26.png)








