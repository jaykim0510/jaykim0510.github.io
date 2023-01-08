---
layout: post
title:  'Matplotlib Series [Part8] Pie Plot'
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
import matplotlib.cm as cm

n_can = 5
votes = np.random.randint(100, 1000, (n_can, ))

cans = np.array(['A', 'B', 'C', 'D', 'E'])

total_vote = np.sum(votes)
percentages = votes/total_vote*100
```

# 파이 그래프 기본

```py
fig, ax = plt.subplots(figsize=(3, 3), facecolor='lightsteelblue')

ax.pie(percentages)
```

![](/images/matplot_34.png)

# 퍼센티지 표기

```py
fig, ax = plt.subplots(figsize=(3, 3), facecolor='lightsteelblue')

ax.pie(percentages, autopct='%1.1f%%', textprops={'fontsize': 8, 'color': 'w'})
```

![](/images/matplot_35.png)

# 파이 정렬

```py
sorted_idx = np.argsort(percentages)[::-1]
sorted_percentages = percentages[sorted_idx]
sorted_legend = np.array(cans)[sorted_idx]

fig, ax = plt.subplots(figsize=(5, 5), facecolor='lightsteelblue')

ax.pie(sorted_percentages, counterclock=False, startangle=-270)
ax.legend(sorted_legend)
```

![](/images/matplot_36.png)


# 도넛 그래프

```py
wedgeprops = {'width': 0.6, 'edgecolor': 'skyblue', 'linewidth': 1}

fig, ax = plt.subplots(figsize=(5, 5), facecolor='lightsteelblue')

ax.pie(sorted_percentages, counterclock=False, startangle=-270, autopct='%1.1f%%', wedgeprops=wedgeprops, pctdistance=0.8)
ax.legend(sorted_legend)
```

![](/images/matplot_37.png)

```py
cmap = cm.get_cmap(name='Set2', lut=20) 
outer_colors = [cmap(4*i) for i in range(5)]


wedgeprops = {'width': 0.6, 'edgecolor': 'skyblue', 'linewidth': 1}

fig, ax = plt.subplots(figsize=(5, 5), facecolor='lightsteelblue')

ax.pie(sorted_percentages, counterclock=False, startangle=-270, autopct='%1.1f%%', \
       wedgeprops=wedgeprops, pctdistance=0.8, colors=outer_colors)
ax.legend(sorted_legend)

```

![](/images/matplot_38.png)














































