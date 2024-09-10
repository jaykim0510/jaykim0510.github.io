---
layout: post
title:  '[Data Structure] Graph (2): DFS, BFS'
description: 
date:   2022-04-06 15:01:35 +0300
image:  '/images/data-structure_logo.png'
logo_image:  '/images/data-structure_logo.png'
categories: computer_science
tags: Data-Structure
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# DFS

- DFS는 그래프를 탐색하는 대표적인 알고리즘이다
- 대표적으로 두 가지 경우에 DFS가 사용된다
  - 모든 노드를 방문해야할 때 -> Brute-Force의 그래프 버전 -> 더 이상 깊이 탐색할 필요가 없는 곳은 멈추는 것이 좋다(백트래킹)
  - 두 노드간의 모든 가능한 경로를 확인해야할 때 -> 방법의 수, 최소/최대값에 많이 사용
- DFS는 재귀함수로 구현할 수도 있고, `while + stack`을 사용해 구현할 수도 있다

## Traversing all Vertices

- 모든 노드를 방문하는 경우의 경로 출력하기

```python
from collections import defaultdict

def all_node_visit(vertices):
    dic = defaultdict(list)
    for n1, n2 in vertices:
        dic[n1].append(n2)
        dic[n2].append(n1)

    def dfs(node, paths, visited):
        if len(visited) == len(dic):
            answer.append(paths)
            return
        for neighbor in dic[node]:
            if neighbor not in visited:
                tmp_visited = visited.copy()
                tmp_visited.add(neighbor)
                dfs(neighbor, paths+[neighbor], tmp_visited)
    answer = []
    dfs("A", ["A"], set("A"))
    return answer

vertices = [('A', 'B'), ('A', 'C'), ('C', 'D'), ('B', 'C'), ('B', 'D'), ('B', 'E'), ('D', 'E')]
print(*all_node_visit(vertices), sep='\n')
-----------------------------------------------------------------------------------------------------
['A', 'B', 'C', 'D', 'E']
['A', 'B', 'E', 'D', 'C']
['A', 'C', 'D', 'B', 'E']
['A', 'C', 'D', 'E', 'B']
['A', 'C', 'B', 'D', 'E']
['A', 'C', 'B', 'E', 'D']
```

## Traversing all paths between two vertices

- `src`에서 `tgt`로 가는 모든 경로 출력하기
- 모든 노드를 방문하는 알고리즘과 거의 똑같다. dfs함수를 종료하는 시점을 `node == tgt` 로 했을 뿐이다

```python
from collections import defaultdict

def all_paths_between_two_nodes(vertices, src, tgt):
    dic = defaultdict(list)
    for n1, n2 in vertices:
        dic[n1].append(n2)
        dic[n2].append(n1)

    def dfs(node, paths, visited):
        if node == tgt:
            answer.append(paths)
            return
        for neighbor in dic[node]:
            if neighbor not in visited:
                tmp_visited = visited.copy()
                tmp_visited.add(neighbor)
                dfs(neighbor, paths+[neighbor], tmp_visited)
    answer = []
    dfs(src, [src], set(src))
    return answer



vertices = [('A', 'B'), ('A', 'C'), ('C', 'D'), ('B', 'C'), ('B', 'D'), ('B', 'E'), ('D', 'E')]
src = "E"
tgt = "B"
print(*all_paths_between_two_nodes(vertices, src, tgt), sep='\n')
------------------------------------------------------------------------------------------------------
['E', 'B']
['E', 'D', 'C', 'A', 'B']
['E', 'D', 'C', 'B']
['E', 'D', 'B']
```

# BFS

- BFS도 DFS와 마찬가지로 그래프에서 모든 노드를 탐색하는 대표적인 알고리즘이다
- BFS는 너비순으로 노드를 탐색하기 때문에, 가장 짧은 경로를 찾아야 할 때 이점이 있다
  - DFS는 모든 경로를 찾아서 가장 짧은 경로를 선택해야 하지만, BFS는 제일 처음으로 찾는 경로가 가장 짧은 경로가 되므로 바로 정답으로 선택할 수 있다
- BFS는 다음과 같은 경우에 많이 사용된다
  - 모든 노드를 방문해야할 때
  - 두 노드간 가장 짧은 경로를 찾아야 할 때(경로의 가중치는 1로 모두 같다고 가정, 가중치가 다르면 Dijkstra, 음의 가중치를 가지면 Bellman-For)
- BFS는 `while + queue`로 구현할 수 있다

## Traversing all Vertices

- BFS로 모든 노드를 방문할 때의 경로 출력하기
- (결과가 신기하게도 DFS랑 순서가 똑같다)

```python
from collections import defaultdict, deque

def all_node_visit(vertices, start):
    dic = defaultdict(list)
    for n1, n2 in vertices:
        dic[n1].append(n2)
        dic[n2].append(n1)

    queue = deque([(start, {start}, [start])])
    answer = []
    while queue:
        cur_node, visited, paths = queue.popleft()
        for neighbor in dic[cur_node]:
            if neighbor not in visited:
                tmp_visited = visited.copy()
                tmp_visited.add(neighbor)
                tmp_paths = paths + [neighbor]
                if len(tmp_paths) == len(dic):
                    answer.append(tmp_paths)
                else:
                    queue.append((neighbor, tmp_visited, tmp_paths))
    return answer


vertices = [('A', 'B'), ('A', 'C'), ('C', 'D'), ('B', 'C'), ('B', 'D'), ('B', 'E'), ('D', 'E')]
print(*all_node_visit(vertices, "E"), sep='\n')
-------------------------------------------------------------------------------------
['A', 'B', 'C', 'D', 'E']
['A', 'B', 'E', 'D', 'C']
['A', 'C', 'D', 'B', 'E']
['A', 'C', 'D', 'E', 'B']
['A', 'C', 'B', 'D', 'E']
['A', 'C', 'B', 'E', 'D']
```

## Shortest Path Between Two Vertices 

- 두 노드간의 최단 경로 구하기

```python
from collections import defaultdict, deque

def all_node_visit(vertices, start, end):
    dic = defaultdict(list)
    for n1, n2 in vertices:
        dic[n1].append(n2)
        dic[n2].append(n1)

    queue = deque([(start, {start}, [start])])
    answer = []
    while queue:
        cur_node, visited, paths = queue.popleft()
        for neighbor in dic[cur_node]:
            if neighbor not in visited:
                tmp_visited = visited.copy()
                tmp_visited.add(neighbor)
                tmp_paths = paths + [neighbor]
                if neighbor == end:
                    answer.append(tmp_paths)
                else:
                    queue.append((neighbor, tmp_visited, tmp_paths))
    return answer


vertices = [('A', 'B'), ('A', 'C'), ('C', 'D'), ('B', 'C'), ('B', 'D'), ('B', 'E'), ('D', 'E')]
print(*all_node_visit(vertices, "E", "B"), sep='\n')
--------------------------------------------------------------------------------
# 확실히 거리가 짧은 순서대로 나온다
['E', 'B']
['E', 'D', 'B']
['E', 'D', 'C', 'B']
['E', 'D', 'C', 'A', 'B']

# 참고로 DFS의 결과는 다음과 같았다
['E', 'B']
['E', 'D', 'C', 'A', 'B']
['E', 'D', 'C', 'B']
['E', 'D', 'B']
```

# Backtracking

- 노드를 탐색할 때 더 이상 탐색할 필요가 없는 경로는 종료시키는 것