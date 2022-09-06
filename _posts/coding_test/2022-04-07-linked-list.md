---
layout: post
title:  'Coding Test Series [Part1]: 링크드 리스트(Linked List)'
description: 
date:   2022-04-07 15:01:35 +0300
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

# 링크드 리스트

- 포인터를 기반으로 원소들이 서로 연결되어 있다
- 메모리 공간에서 원소들이 서로 흩어져 있다 => 임의의 원소에 접근하는데 O(n)의 시간복잡도가 걸린다
- 정적 배열과 같이 가용용량을 미리 정의할 필요가 없다
- 동적 배열과 같이 가용용량이 꽉 찼을 때 다른 메모리 공간으로 옮기고 더블링할 필요도 없다
- 하지만 일반적으로 접근/삽입/삭제 연산의 시간복잡도가 모두 O(n)이다

하지만 특정 상황에서 유용한 경우가 있다. 시간 복잡도를 조금 더 세분화 해서 살펴보자.  

|**연산**|**배열**|**싱글 링크드 리스트**|**더블리 링크드 리스트**|
|맨 앞 삽입| O(n) | O(1) | O(1) |
|맨 앞 삭제| O(n) | O(1) | O(1) |
|맨 뒤 삽입| O(1) | O(1) | O(1) |
|맨 뒤 삭제| O(1) | O(n) | O(1) |

스택(Stack)과 큐(Queue)는 맨 앞/뒤 삽입/삭제 연산이 활발하다.  

- 스택은 맨 뒤 삽입/삭제가 중요한데, 이는 배열로도 O(1)의 시간 복잡도를 얻을 수 있다
- 큐는 맨 뒤 삽입, 맨 앞 삭제가 중요한데 이 때는 링크드 리스트가 필요하다
- (참고로 트리도 포인터 기반으로 노드를 서로 연결하지만, 링크드 리스트랑은 크게 관련이 없다. 그냥 포인터 기반 방식이어서 서로 비슷하게 보이는 점이 있을 뿐이다)

**그럼에도 링크드 리스트를 쓰는 경우는?**  

이렇게 보면 링크드 리스트는 큐를 구현하기 위한 경우 말고는 크게 필요가 없어보인다.  

하지만 실제로는 배열의 임의의 위치에 삽입/삭제할 때 발생하는 shift, copy, resizing이, 링크드 리스트의 search하는 과정보다 컴퓨팅 리소스에 더 크게 부담이 가고, 삽입/삭제의 소요 시간이 훨씬 크고 불안정하다.  

(단순히 크기에 비례한다는 의미의 O(n)만 놓고 보면 둘 다 O(n)이기 때문에 똑같다 생각할 수 있다. 하지만 원소 한 개를 처리하는데 1초가 걸리는 O(n)은 n초가 걸리지만, 원소 한 개를 처리하는데 3초가 걸리는 O(n)은 3n초가 걸린다.)  


# 링크드 리스트와 관련된 이용하는 몇 가지 중요한 문제


- [Insertion of a node in Linked List (On the basis of some constraints)](https://www.geeksforgeeks.org/given-a-linked-list-which-is-sorted-how-will-you-insert-in-sorted-way/){:target="_blank"}
- [Delete a given node in Linked List (under given constraints)](https://www.geeksforgeeks.org/delete-a-given-node-in-linked-list-under-given-constraints/){:target="_blank"}
- [Compare two strings represented as linked lists](https://www.geeksforgeeks.org/compare-two-strings-represented-as-linked-lists/){:target="_blank"}
- [Add Two Numbers Represented By Linked Lists](https://www.geeksforgeeks.org/sum-of-two-linked-lists/){:target="_blank"}
- [Merge A Linked List Into Another Linked List At Alternate Positions](https://www.geeksforgeeks.org/merge-a-linked-list-into-another-linked-list-at-alternate-positions/){:target="_blank"}
- [Reverse A List In Groups Of Given Size](https://www.geeksforgeeks.org/reverse-a-list-in-groups-of-given-size/){:target="_blank"}
- [Union And Intersection Of 2 Linked Lists](https://www.geeksforgeeks.org/union-and-intersection-of-two-linked-lists/){:target="_blank"}
- [Detect And Remove Loop In A Linked List](https://www.geeksforgeeks.org/detect-and-remove-loop-in-a-linked-list/){:target="_blank"}
- [Merge Sort For Linked Lists](https://www.geeksforgeeks.org/merge-sort-for-linked-list/){:target="_blank"}
- [Select A Random Node from A Singly Linked List](https://www.geeksforgeeks.org/select-a-random-node-from-a-singly-linked-list/){:target="_blank"}


# 참고

- [RealPython, Python's deque: Implement Efficient Queues and Stacks](https://realpython.com/python-deque/){:target="_blank"}
- [Naukri, Queue Data Structure: Types, Implementation, Applications](https://www.naukri.com/learning/articles/queue-data-structure-types-implementation-applications/){:target="_blank"}
- [stackoverflow, What is the best data structure to implement a queue?](https://stackoverflow.com/questions/30516897/what-is-the-best-data-structure-to-implement-a-queue){:target="_blank"}
- [stackoverflow, When to use a linked list over an array/array list?](https://stackoverflow.com/questions/393556/when-to-use-a-linked-list-over-an-array-array-list)