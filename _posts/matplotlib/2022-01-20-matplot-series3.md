---
layout: post
title:  'Matplotlib Series [Part3] Text'
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

# Text Examples

```py
ax.set_title("Ax title", fontsize=30, fontfamily='serif')

ax.set_xlabel('X label', fontsize=20, color='darkblue', alpha=0.7)
ax.set_ylabel('Y label', fontsize=20)

ax.text(x=0.5, y=0.5, va='center', ha='center', s ='Hello', fontsize=30, color='green')
ax.text(x=1, y=0, va='bottom', ha='right', s ='Hello', fontsize=30, color='red')
ax.text(x=0, y=0, va='bottom', ha='left', s ='Hello', fontsize=30, color='blue')

```

![](/images/matplot_13.png)


# Text Properties


```
# 자주 사용되는 특성

alpha: 텍스트 투명도
color: 텍스트 색깔
fontfamily: 텍스트 폰트
fontsize: 텍스트 크기
ha: 수평 기준
va: 수직 기준
rotation: 각도
```


# Font Dict

- 특성을 적용하는 방법을 알아보자

```py
# 하나씩 나열하는 방법
ax.set_title("Ax title", fontsize=30, fontfamily='serif')

# fontdict 파라미터에 딕셔너리 형태로 전달하는 방법
title_font = {"fontsize": 30, "fontfamily": "serif"}
ax.set_title("Ax title", fontdict=title_font)
```












