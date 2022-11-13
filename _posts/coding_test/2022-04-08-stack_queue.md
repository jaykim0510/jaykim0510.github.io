---
layout: post
title:  'Coding Test Series [Part2]: 스택(Stack)과 큐(Queue)'
description: 
date:   2022-04-08 15:01:35 +0300
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

# 스택
스택은 가장 나중에 들어간 요소가 가장 먼저 나온다는 **LIFO(Last In First Out)**의 성질을 가지는 자료구조입니다. 이런 특징은 함수 호출과 같은 프로그래밍 세계에서 굉장히 자주 사용되기 때문에 중요합니다.  

스택에서 가장 중요한 것은 `append`와 `pop`을 얼마나 빨리 처리할 수 있냐입니다. 그렇기 때문에 이러한 기능을 O(1)의 시간복잡도로 제공해주는 동적배열(파이썬에서는 리스트)을 통해 스택을 구현할 수 있습니다.

# 큐
큐는 가장 먼저 들어간 요소가 가장 먼저 처리되는 **FIFO(First In First Out)**의 성질을 가지는 자료구조입니다.  

큐에서는 `append`와 `pop(0)`을 얼마나 빨리 처리할 수 있냐가 중요합니다. 동적배열에서 가장 앞 원소를 제거하는 pop(0) 연산의 시간 복잡도가 O(n)이기 때문에 파이썬에서는 리스트가 아닌 `deque`(데크)라는 별도의 자료형을 사용합니다.  

🦊 **데크(deque)**  
데크는 더블 엔디드 큐(Double-Ended Queue)의 줄임말로, 글자 그대로 양쪽 끝을 모두 추출할 수 있는 추상자료형으로 큐와 스택의 역할을 모두할 수 있습니다. 데크는 이중 연결 리스트로 구현되어 있습니다.  

큐는 큐 그자체로 보다는 **우선순위 큐**라는 변형된 방법으로 조금 더 많이 사용됩니다.  