---
layout: post
title:  'Matplotlib Series [Part8] Histogram Plot'
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

n_data = 1000
data = np.random.normal(0, 1, (n_data,))
```

# 히스토그램 기본

```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.hist(data)
```

![](/images/matplot_27.png)

```py
ax.hist(data, bins=20)
```

![](/images/matplot_28.png)

# 히스토그램 꾸미기

```py
ax.hist(data, facecolor='skyblue', edgecolor='darkblue', hatch='/')
```

![](/images/matplot_29.png)



# 여러 개의 히스토그램


```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.hist(data, facecolor='skyblue', edgecolor='darkblue', hatch='/')
ax.hist(data, bins=20, facecolor='coral', edgecolor='red', linewidth=3)
```

![](/images/matplot_30.png)

```py
fig, ax = plt.subplots(figsize=(4, 3))

ax.hist(data, bins=10, align='mid', alpha=0.5)
ax.hist(data, bins=20, facecolor='coral', align='left', alpha=0.5)
ax.hist(data, bins=20, facecolor='skyblue', align='right', alpha=0.5)
```

![](/images/matplot_31.png)


```py
n_class = 3
n_data = 300

data = np.random.normal(0, 1, (n_data, n_class))

fig, ax = plt.subplots(figsize=(14, 10))
ax.hist(data)
```

![](/images/matplot_32.png)



# 텍스트 넣기

```py
n_data = 1000
data = np.random.normal(0, 1, (n_data,))

fig, ax = plt.subplots(figsize=(6, 4))

freqs, bin_edges, rects = ax.hist(data, edgecolor='darkblue')

for idx, rect in enumerate(rects):
    width = rect.get_width()
    x_pos = rect.get_x()
    y_pos = rect.get_height()
    ax.text(x_pos + width/2, y_pos + 2, int(freqs[idx]), ha='center', fontsize=8)
```

![](/images/matplot_33.png)


