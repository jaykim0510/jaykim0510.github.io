---
layout: post
title:  'Coding Test Series [Part10]: 분할 정복(Divide and Conquer)'
description: 
date:   2022-07-05 15:01:35 +0300
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

[**정렬 알고리즘 애니메이션 참고**](https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html){:target="_blank"}   

# 분할 정복
- Divide: 부분 문제로 나눈다
- Conquer: 부분 문제의 답을 구한다
- Combine: 부분 문제의 답을 합친다
- 부분 문제의 답을 구하는 Conquer가 다시 (Divide, Conquer, Combine)으로 나눠짐


1~100까지의 합을 분할 정복으로 풀면 다음과 같다.  

![](/images/div_con_1.png)

```python
def merge_sum(x: List):
    def divide(a, pivot):
        return a[:pivot], a[pivot:]


    def conquer(a):
        pivot = len(a) // 2
        if pivot == 0:
            return a[0]
        else:
            left, right = divide(a, pivot)
            return combine(conquer(left), conquer(right))

    def combine(left, right):
        return left + right
            
    return conquer(x)


x = list(range(101))
print(merge_sum(x))
------------------------
5050
```

# 병합 정렬(Merge Sort)

- 분할 정복을 활용한 정렬(sorting) 알고리즘


```python
def merge_sort(x: List):
    def divide(a, pivot):
        return a[:pivot], a[pivot:]


    def conquer(a):
        pivot = len(a) // 2
        if pivot == 0:
            return a
        else:
            left, right = divide(a, pivot)
            return combine(conquer(left), conquer(right)


    def combine(left_list, right_list):
        i = j = 0
        merged_list =[]
        while i < len(left_list) and j < len(right_list):
            if left_list[i] > right_list[j]:
                merged_list.append(right_list[j])
                j += 1
            else :
                merged_list.append(left_list[i])
                i += 1
        if i == len(left_list):
            merged_list += right_list[j:]
        else:
            merged_list += left_list[i:]
        return merged_list


    return conquer(x)
```

보면 분할 정복 알고리즘은  

- `divide`는 단순히 나누는 역할을 담당하고
- `conquer`는 `divide`, `conquer`, `combine`을 재귀적으로 호출 하는 역할,
- `combine`은 분할된 두 리스트를 하나로 합치는 역할을 한다

![](/images/div_con_2.png)

# 퀵 정렬(Quick Sort)
- 퀵 정렬은 divide 함수가 복잡한 편이다
- `divide`: 피봇(pivot)을 기준으로 피봇보다 작은 값은 왼쪽, 큰 값은 오른쪽에 둔다 -> 이 과정을 파티션(partition)이라고도 한다
- `conquer`: 재귀적으로 `divide`, `conquer`를 호출하며 왼쪽과 오른쪽을 각각 정렬한다

**파티션 하는 방법**  

- 리스트에서 임의의 값 하나를 피봇으로 사용한다 (여기서는 가장 끝 값을 피봇으로 사용하겠다)  
- 변수 i로 비교하며, 피봇값이 더 크다면 i를 +1, 피봇값이 더 작다면 피봇값과 b의 값을 서로 바꾼 뒤, b와 i를 각각 + 1 해준다

![](/images/div_con_3.png)

![](/images/div_con_4.png)

![](/images/div_con_5.png)

```python

```