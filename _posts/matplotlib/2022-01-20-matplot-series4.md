---
layout: post
title:  'Matplotlib Series [Part4] Color'
description: 
date:   2022-01-20 15:01:35 +0300
image:  '/images/matplotlib_logo.png'
logo_image:  '/images/matplotlib_logo.png'
category: data_analytics
tag: matplotlib
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

--- 

# Named Color

![](/images/color_1.png)


# Colormap

![](/images/color_3.png)

![](/images/matplot_14.png)

```py
pastel_cmap = cm.get_cmap('Pastel1') # matplotlib.colors.ListedColormap (불연속)

tab10_cmap = cm.get_cmap('tab10') # matplotlib.colors.ListedColormap (불연속)

ylorbr_cmap = cm.get_cmap('YlOrBr') # matplotlib.colors.LinearSegmentedColormap (연속)
```


```py
# 불연속한 경우 cmap.colors 를 통해 리스트를 얻을 수 있다
fig, ax = plt.subplots(figsize=(10, 5))
ax.set_ylim([-1, len(tab10_cmap.colors)])
for i in range(len(tab10_cmap.colors)):
    ax.text(0.5, i, "color="+str(tab10_cmap(i)), color=tab10_cmap(i), ha='center')
```

![](/images/matplot_15.png)

```py
# 연속할 경우 리스트를 얻을 수 없다
fig, ax = plt.subplots(figsize=(10, 5))
ax.set_ylim([-1, 100])
for i in range(100):
    ax.text(0.5, i, "color="+str(ylorbr_cmap(i)), color=ylorbr_cmap(i), ha='center')
```

![](/images/matplot_16.png)


# Style

- 색깔을 테마 정하듯이 자동으로 지정할 수도 있다

```py
# 가능한 스타일
plt.style.available
-------------------------------------
['Solarize_Light2',
 '_classic_test_patch',
 '_mpl-gallery',
 '_mpl-gallery-nogrid',
 'bmh',
 'classic',
 'dark_background',
 'fast',
 'fivethirtyeight',
 'ggplot',
 'grayscale',
 'seaborn-v0_8',
 'seaborn-v0_8-bright',
 'seaborn-v0_8-colorblind',
 'seaborn-v0_8-dark',
 'seaborn-v0_8-dark-palette',
 'seaborn-v0_8-darkgrid',
 'seaborn-v0_8-deep',
 'seaborn-v0_8-muted',
 'seaborn-v0_8-notebook',
 'seaborn-v0_8-paper',
 'seaborn-v0_8-pastel',
 'seaborn-v0_8-poster',
 'seaborn-v0_8-talk',
 'seaborn-v0_8-ticks',
 'seaborn-v0_8-white',
 'seaborn-v0_8-whitegrid',
 'tableau-colorblind10']
```

```py
plt.style.use('seaborn-pastel')
```

- 적용 전

![](/images/matplot_17.png)

- 적용 후

![](/images/matplot_18.png)








