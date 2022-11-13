---
layout: post
title:  'Coding Test Series [Part16]: 이진 탐색(Binary Search)'
description: 
date:   2022-07-06 15:01:35 +0300
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
Binary Search is quite easy to understand conceptually. Basically, it splits the search space into two halves and only keep the half that probably has the search target and throw away the other half that would not possibly have the answer. In this manner, we reduce the search space to half the size at every step, until we find the target. Binary Search helps us reduce the search time from linear O(n) to logarithmic O(log n). But when it comes to implementation, it's rather difficult to write a bug-free code in just a few minutes. Some of the most common problems include:

- When to exit the loop? Should we use `left < right` or `left <= right` as the while loop condition?
- How to initialize the boundary variable `left` and `right`?
- How to update the boundary? How to choose the appropriate combination from `left = mid`, `left = mid + 1` and `right = mid`, `right = mid - 1`?


A rather common misunderstanding of binary search is that people often think this technique could only be used in simple scenario like "Given a sorted array, find a specific value in it". As a matter of fact, it can be applied to much more complicated situations.  

# Template

```python
def binary_search(array) -> int:
    def condition(value) -> bool:
        pass

    left, right = 0, len(array)
    while left < right:
        mid = left + (right - left) // 2
        if condition(mid):
            right = mid
        else:
            left = mid + 1
    return left
```

What's really nice of this template is that, for most of the binary search problems, we only need to modify three parts after copy-pasting this template, and never need to worry about corner cases and bugs in code any more:  

- Correctly initialize the boundary variables `left` and `right`. Only one rule: set up the boundary to include all possible elements;
- Decide return value. Is it `return left` or `return left - 1`? Remember this: after exiting the while loop, left is the minimal k satisfying the `condition` function;
- Design the `condition` function. This is the most difficult and most beautiful part. Needs lots of practice.