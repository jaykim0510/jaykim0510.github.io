---
layout: post
title:  '[Data Structure] Hash table: 해시테이블'
description: 
date:   2024-03-06 15:01:35 +0300
image:  '/images/data-structure_logo.png'
logo_image: '/images/data-structure_logo.png'
category: CS
tag: Data-Structure
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

## 해시테이블의 시간 복잡도

해시테이블은 탐색/삽입/삭제 연산이 모두 최악의 경우에는 O(n)이지만, **평균적으로는 모두 O(1)**이다.  
