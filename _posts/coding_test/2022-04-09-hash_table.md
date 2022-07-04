---
layout: post
title:  'Coding Test Series [Part3]: 해시테이블(Hash Table)'
description: 
date:   2022-04-09 15:01:35 +0300
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
# 해시테이블

해시 테이블은 **키-값을 쌍으로 저장해둔 자료구조**로 값(value)에 해당하는 키(key)가 무엇인지만 알면 어디에 위치한 값(value)이든 시간 복잡도 O(1)으로 값을 찾을 수 있습니다.  

# 딕셔너리

파이썬에서 해시 테이블로 구현된 자료형은 **딕셔너리**입니다.  

딕셔너리는 **대부분의 연산을 O(1)**으로 처리할 수 있다는 점에서 성능이 매우 우수합니다.  

|**연산**|**시간복잡도**|
|len(a)|O(1)|
|a[key]|O(1)|
|key in a|O(1)|

파이썬에서는 이외에도 딕셔너리에서 자주 사용되는 성질들을 편하게 사용하는 기능을 제공해주는 다양한 모듈들을 가지고 있습니다. 대표적으로 `collections.defaultdict()`, `collections.Counter()`가 있습니다.  

