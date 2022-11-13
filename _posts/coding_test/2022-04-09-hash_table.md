---
layout: post
title:  'Coding Test Series [Part3]: 해시테이블(Hash Table)'
description: 
date:   2022-04-09 15:01:35 +0300
image:  '/images/algorithm_logo.webp'
logo_image:  '/images/algorithm_logo.webp'
categories: computer_science
tags: Coding_Test
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# 해시테이블

- 해시 테이블은 **키-값을 쌍으로 저장해둔 자료구조**로 값(value)에 해당하는 키(key)가 무엇인지만 알면 어디에 위치한 값(value)이든 평균적으로 O(1)으로 값을 찾을 수 있다. 
- 키 값이 해시 함수를 통과해 해시값이 되면, 이 해시값을 인덱스로 하는 배열에 키-값 쌍을 저장한다.  
- 인덱스가 저장되는 자료구조가 배열이기 때문에, 인덱스만 알면 평균적으로 O(1)에 키-값 쌍에 접근이 가능하다.  
- 평균적으로 O(1)인 이유는 해시 함수의 한계로 인해 해시값 충돌이 불가피하기 때문이다.  
- 해시값 충돌이 발생했을 때 이를 해결하는데 시간이 걸림 -> 분할 상환 분석에 기반해 O(1)

![](/images/hash.png)

## 해시 충돌 해결

![](/images/collision.png)  

충돌은 크게 두 가지 방법으로 해결한다.  

한 가지는 충돌이 발생했을 때, 두 쌍을 서로 체이닝 하여 저장하는 것이다. 이를 체이닝(Chaining) 방식이라고 한다.  

두 번째는 충돌이 발생했을 때, 배열의 다른 빈공간을 찾는 것이다. 빈공간을 찾는데에는 선형 방식과 제곱 방식이 있다. 이러한 충돌 해결 방식을 개방주소법(Open Addressing) 방식이라고 한다

## 시간복잡도

해시테이블은 탐색/삽입/삭제 연산이 모두 최악의 경우에는 O(n)이지만, 평균적으로는 모두 O(1)이다.  

# 딕셔너리

파이썬에서 해시 테이블로 구현된 자료형은 **딕셔너리**입니다.  

딕셔너리는 **대부분의 연산을 O(1)**으로 처리할 수 있다는 점에서 성능이 매우 우수합니다.  

|**연산**|**시간복잡도**|
|len(a)|O(1)|
|a[key]|O(1)|
|key in a|O(1)|

파이썬에서는 이외에도 딕셔너리에서 자주 사용되는 성질들을 편하게 사용하는 기능을 제공해주는 다양한 모듈들을 가지고 있습니다. 대표적으로 `collections.defaultdict()`, `collections.Counter()`가 있습니다.  



# 참고

- [JaeYeopHan/Interview_Question_for_Beginner](https://github.com/JaeYeopHan/Interview_Question_for_Beginner){:target="_blank"}
- [Jay's Blog  [Data_structure] 해시 테이블](https://kimziont.github.io/data_structure/data-structure-data-structure-hash-table/){:target="_blank"}