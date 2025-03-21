---
layout: post
title:  '[Data Structure] Binary tree (3): 힙(Heap)'
description: 
date:   2024-03-10 15:01:35 +0300
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

# 힙

> In many CS applications, we only need to access the largest or smallest element in the dataset. how do we efficiently access the largest or smallest element in the current dataset? The answer would be heap!

## 우선순위 큐

- 힙과 우선순위 큐는 다른 의미
- 힙은 데이터 구조(low-level), 우선순위 큐는 추상 자료형(high-level)
- 힙은 우선순위 큐를 구현하는 한 가지 방법
- 힙 말고도 배열, 링크드 리스트로 우선순위 큐를 구현할 수 있음(물론 시간 복잡도 차이 있음)

## 힙

- 힙은 **완전 이진 트리**의 특별한 케이스
  - 완전 이진 트리: 이진 트리 + 리프 노드가 왼쪽부터 채워짐
- 각 노드들은 자식 노드보다 크다 (최대힙) (최소힙은 반대)

# Heap 관련 연산

- 삽입 연산: O(logN)
- 삭제 연산: O(logN)
- 최대값/최소값 얻기: O(1)
- element가 힙에서 삽입/삭제되어도 계속 힙 성질이 유지되어야함
    - heapify 연산으로 힙 성질을 유지함
    - 한 번 삽입/삭제 연산이 일어날 때마다 heapify 실행
    - heapify: 부모 노드와 자식 노드의 값을 계속 비교하며 스왑

## 힙에 삽입이 발생한 경우

- 삽입된 노드는 리프 노드에 추가 -> 추가된 리프 노드에서 부터 heapify

## 힙에 삭제가 발생한 경우

- 삭제는 항상 루트 노드에서 발생 -> 루트 노드의 빈자리는 리프 노드가 채움 -> 루트 노드에서 부터 heapify

# Heap 구현

## 파이썬의 heapq 모듈

- 힙을 파이썬에서 사용할 때는 간단히 heapq 모듈을 이용해 사용 가능
  ```python
  import heapq

  heap_list = []

  # Insert
  heapq.heappush(heap_list, 5)
  assert heap_list == [5]

  heapq.heappush(heap_list, 1)
  assert heap_list == [1, 5]

  # Get
  heap_list[0]

  # Delete
  heapq.heappop(heap_list)

  # List를 힙으로 만들 떄
  tmp_list = [5, 4, 6, 1, 0, 10]
  heapq.heapify(tmp_list)
  assert tmp_list == [0, 1, 6, 5, 4, 10]
  ```

## 파이썬 리스트를 이용해 직접 구현

- 힙을 직접 구현할 때는 리스트를 사용함
  - 완전 이진 트리의 성질을 가지도록 하기 위해 부모 노드와 자식 노드의 관계를 정의해야함
    ```
    root node: 1
    parent node: n
    left child node: 2*n
    right child node: 2*n + 1
    ```
- heapify
  ```python
    # 추출, 힙리스트, 힙정렬 모든 곳에 쓰임
    # O(logN)
    def heapify(myheap, idx, order=None):
        size = len(myheap)
        while idx <= size // 2:
            left, right = idx * 2, idx * 2 + 1
            smallest_idx = idx
            if 0 < left < size and myheap[smallest_idx] > myheap[left]:
                smallest_idx = left
            if 0 < right < size and myheap[smallest_idx] > myheap[right]:
                smallest_idx = right
            if idx != smallest_idx:
                myheap[idx], myheap[smallest_idx] = myheap[smallest_idx], myheap[idx]
                idx = smallest_idx
            else:
                break


    # heap에 원소 삽입
    # O(logN)
    def heap_push(myheap, elem):
        myheap.append(elem)
        idx = len(myheap) - 1
        while idx > 1:
            parent = idx // 2
            if myheap[parent] > myheap[idx]:
                myheap[parent], myheap[idx] = myheap[idx], myheap[parent]
                idx = parent
            else:
                break


    # heap에서 루트 노드를 추출
    # O(logN)
    def heap_pop(myheap):
        if len(myheap) < 2:
            print("There is no element to pop")
            return
        pop_elem = myheap[1] # 8
        new_root = myheap.pop() # 9
        if len(myheap) >= 2:
            myheap[1] = new_root
            heapify(myheap, 1)
        return pop_elem

    # 임의의 heap으로 만든다
    # O(NlogN)
    def heap_list(mylist):
        myheap = [None] + mylist
        for i in range(len(myheap) - 1, 0, -1):
            heapify(myheap, i)
        return myheap

    # heap을 입력 받아서 정렬된 리스트를 리턴
    # O(NlogN)
    def heap_sort(x: List):
        answer = []
        len_heap = len(x) - 1
        for _ in range(len_heap):
            answer.append(heap_pop(x))
        return answer

    x = [1, 5, 3, 7, 4, 9, 1, 8]
    heap_x = heap_list(x)
    print(f"주어진 힙: {heap_x[1:]}")
    print(f"정렬된 리스트: {heap_sort(heap_x)}")
    -----------------------------------------------------
    주어진 힙: [1, 4, 1, 7, 5, 9, 3, 8]
    정렬된 리스트: [1, 1, 3, 4, 5, 7, 8, 9]
  ```

# Heap 활용

- 힙 정렬

- Top-K 문제

- K-th 요소