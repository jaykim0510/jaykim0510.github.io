---
layout: post
title:  'Tech Interview Series [Part2]: Algorithm'
description: 
date:   2022-09-01 15:01:35 +0300
image:  '/images/tech_interview_logo.png'
logo_image:  '/images/tech_interview_logo.png'
categories: tech_interview
tags: tech_interview
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 정렬 알고리즘(Sorting Algorithm)

## 버블 정렬(Bubble Sort)

- 첫 번쨰 for문에서 위치(i)를 정한다
- 두 번째 for문에서 i에 있는 값과 비교해 바꾼다

```python
def bubble_sort(x: List, order="asc"):
    for i in range(len(x)):
        for j in range(i + 1, len(x)):
            if order == "asc":
                if x[i] > x[j]:
                    x[i], x[j] = x[j], x[i]
            elif order == "desc":
                 if x[i] < x[j]:
                    x[i], x[j] = x[j], x[i]               
    return x


x = [3, 5, 1, 2, 3, 4, 5, 6, 12, 23, 25, 32, 3, 8, 14]
print(bubble_sort(x))
----------------------------------------------------
[1, 2, 3, 3, 3, 4, 5, 5, 6, 8, 12, 14, 23, 25, 32]

print(bubble_sort(x, "desc"))
----------------------------------------------------
[32, 25, 23, 14, 12, 8, 6, 5, 5, 4, 3, 3, 3, 2, 1]
```

## 선택 정렬(Selection Sort)

- 버블 정렬과 거의 유사하다. 차이점은 바로 바꾸지 않고 변수에 저장해둔다
- 첫 번째 for문에서 위치(i)를 정한다
- 두 번째 for문에서 해당 위치에 올 값을 찾는다
- 두 번째 for문이 끝나면 찾아둔 값과 i위치의 값을 바꾼다

```python
def selection_sort(x: List):
    for i in range(len(x)):
        min_idx, min_num = i, float('inf')
        for j in range(i, len(x)):
            if min_num > x[j]:
                min_idx, min_num = j, x[j]
        x[i], x[min_idx] = x[min_idx], x[i]
    return x
```


## 삽입 정렬(Insertion Sort)

- 첫 번째 for문의 값을 삽입할 위치를 찾는다
- 두 번째 for문을 첫 번째 for문의 왼쪽으로 이동하면서, 삽입될 수 있는 가장 작은 인덱스를 찾는다

```python
def insertion_sort(x: List):
    for i in range(1, len(x)):
        min_idx = i
        for j in range(i - 1, -1, -1):
            if x[i] < x[j]:
                min_idx = j
        if min_idx != i:
            x.insert(min_idx, x.pop(i))
    return x
```

## 퀵 정렬(Quick Sort)
## 병합 정렬(Merge Sort)
## 힙 정렬(Heap Sort)
## 팀 정렬(Tim Sort)


# 탐색 알고리즘

## Binary Search
## 탐욕 알고리즘(Greedy Algorithm)
## 동적 프로그래밍(Dynamic Programming)
## 분할 정복(Divide and Conquer)
## Binary Search Tree
## DFS
## BFS
## Dijkstra
## Kruskal
## 최장 증가 수열(LIS)
## 최소 공통 조상(LCA)

# 참고
- [JaeYeopHan/Interview_Question_for_Beginner](https://github.com/JaeYeopHan/Interview_Question_for_Beginner){:target="_blank"}
- [WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview){:target="_blank"}
- [gyoogle, Tech Interview 준비](https://gyoogle.dev/blog/guide/%EB%A9%B4%EC%A0%91%20%EC%A4%80%EB%B9%84.html){:target="_blank"}
- [배진오, 신입 개발자 기술면접 준비하기](https://blex.me/@baealex/%EC%B7%A8%EC%A4%80%EC%83%9D%EC%9D%B4-%EC%83%9D%EA%B0%81%ED%95%98%EB%8A%94-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EA%B8%B0%EC%88%A0%EB%A9%B4%EC%A0%91-%EC%A4%80%EB%B9%84){:target="_blank"}
- [[PYTHON] Python 면접 예제 2편](https://dingrr.com/blog/post/python-python-%EB%A9%B4%EC%A0%91-%EC%98%88%EC%A0%9C-2%ED%8E%B8){:target="_blank"}
- [exp_blog, 데이터베이스 직무 면접 질문](https://syujisu.tistory.com/entry/%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%A7%81%EB%AC%B4-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B8?category=871132){:target="_blank"}
- [망나니 개발자 CS 준비](https://mangkyu.tistory.com/88){:target="_blank"}
