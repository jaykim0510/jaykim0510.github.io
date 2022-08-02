---
layout: post
title:  'Coding Test Series [Part21]: 파이썬 문법'
description: 
date:   2022-07-29 15:01:35 +0300
image:  '/images/algorithm_logo.webp'
logo_image:  '/images/algorithm_logo.webp'
categories: CS
tags: Coding_Test
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# In python, 'and' operation will not return a boolean value

- If it's true, it will return the last true value, remember is the value, not True. Otherwise, it will return the first false value.

```
'ban' and 'car' -> 'car'
0 and 'car' -> 0
'ban' and False -> False
'ban' or False -> 'ban'
```