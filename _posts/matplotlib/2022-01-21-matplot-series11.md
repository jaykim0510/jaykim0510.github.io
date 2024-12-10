---
layout: post
title:  'Matplotlib Series [Part11] Box and Whisker Plot'
description: 
date:   2022-01-21 15:01:35 +0300
image:  '/images/matplotlib_logo.png'
logo_image:  '/images/matplotlib_logo.png'
categories: data_analytics
tags: matplotlib
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 



```py
n_data = 40

math_score = np.random.normal(60, 20, (n_data, 1))
eng_score = np.random.normal(85, 12, (n_data, 1))
sci_score = np.random.normal(70, 5, (n_data, 1))

data = np.hstack((math_score, eng_score, sci_score))

fig, ax = plt.subplots(figsize=(12, 4))
medianprops = {'linewidth':2, 'color':'red'}
whiskerprops = {'linewidth':1, 'color':'skyblue', 'linestyle':'--'}
capprops = {'linewidth':1.5, 'color':'blue'}
ax.boxplot(data, labels=['math', 'english', 'science'], medianprops=medianprops, whiskerprops=whiskerprops, capprops=capprops);
```

![](/images/matplot_48.png)