---
layout: post
title:  '[Data Structure] Binary tree (1): 이진 트리'
description: 
date:   2024-03-08 15:01:35 +0300
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

# 이진 트리

- 트리는 노드들 간에 계층관계를 가지는 계층적 자료구조이다
- 상위 노드에서 하위 원소로 내려가면서 확장되는 Tree모양의 구조이다
- 이진트리는 모든 부모 노드의 자식 노드가 최대 2개만 가지고 있는 트리를 뜻한다

![](/images/data-structure_tree_1.png)


# 이진 트리의 종류

- **포화 이진 트리(Perfect binary tree)**: 모든 레벨이 꽉 찬 이진 트리
- **완전 이진 트리(Complete binary tree)**: 위에서 아래로, 왼쪽에서 오른쪽으로 순서대로 차곡차곡 채워진 이진 트리
- **정 이진 트리(Full binary tree)**: 모든 노드가 0개 혹은 2개의 자식 노드만을 갖는 이진 트리

![](/images/data-structure_tree_2.png)




# 이진 탐색 트리 (BST)

- 임의의 노드를 기준으로 왼쪽 자식 노드는 더 작고 오른쪽 자식 노드는 더 크도록 정렬 되어 있는 이진 트리
- 모든 노드의 키 값을 유일해야 한다

## 이진 탐색 트리의 시간 복잡도

- 이진 탐색 트리의 탐색/삽입/삭제 시간 복잡도는 O(h)이다
- h는 트리의 높이를 말한다
- O(h)는 일반적으로 O(log(n)), 트리가 한쪽으로 모두 치우친 최악의 경우 O(n) 이다

|연산|시간 복잡도|
|:---|:---|
|탐색|O(h)|
|삽입|O(h)|
|삭제|O(h)|

## Red Black Tree

- 배열보다 많은 메모리를 사용하며 데이터를 저장했지만 탐색에 필요한 시간 복잡도가 같게 되는 비효율적인 상황이 발생한다
- 이를 해결하기 위해 Rebalancing 기법이 등장하였다
- 균형을 잡기 위한 트리 구조의 재조정을 Rebalancing이라 한다
- 이 기법을 구현한 트리에는 여러 종류가 존재하는데 그 중에서 하나가 뒤에서 살펴볼 Red-Black Tree이다

