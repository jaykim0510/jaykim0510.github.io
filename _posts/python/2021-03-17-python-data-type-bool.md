---
layout: post
title:  Python data type number
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2020-04-23 15:01:35 +0300
image:  '/images/15.jpg'
tags:   [python, backend]
---


## 1. 숫자 자료형의 종류

파이썬에는 세 가지 다른 숫자 형이 있습니다: 정수 (integers), 실수 (floating point numbers), 복소수 (complex numbers)  
또한 최댓값, 최솟값이 없고 자동으로 메모리를 할당해줍니다. 그래서 사용하기에는 간편하지만 다른 언어에 비해서는 조금 비효율적이라고 할 수 있겠습니다. 
(C++과 비교해 약 10배 정도 느리다고 합니다)

## 2. 파이썬의 특별한 점

* 느린 실행 속도를 보완하고자 파이썬에서는 1~256의 값을 메모리에 static하게 저장합니다. 따라서 1~256 사이의 값을 어떤 변수에 할당할 경우, 새로운 메모리를 할당하지 않고 기존에 저장된 값의 주소를 변수가 가리키도록 합니다.  
![](/assets/images/number_1.png){: width="70%" height="70%"}  
