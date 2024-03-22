---
layout: post
title:  '[Backend Thoery] 페이지네이션'
description: 
date:   2023-12-15 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 페이지네이션

- 페이지네이션이란 전체 데이터중에 일정한 개수만큼을 특정 기준에 따라 가져오는 기법을 말한다
- 특정 기준이 오프셋(offset)인 경우 오프셋 기반 페이지네이션이라 하고, 커서(curosr)인 경우 커서 기반 페이지네이션이라 한다
  - 오프셋(offset): 각 페이지의 첫 번째 데이터 인덱스
  - 커서(cursor): 유저가 가장 최근에 받은 데이터

## 오프셋 기반 페이지네이션

- SQL의 `OFFSET` 쿼리를 사용하여 페이지 단위로 데이터를 가져오는 방식
- 오프셋: `(페이지 숫자 - 1) * 한 페이지에 포함된 데이터 수(N)`
- 오프셋을 `k`라 하고, 페이지에 포함된 데이터 수를 `N`이라 하면, 데이터베이스의 테이블에서 `0`부터 `k-1`개의 row를 스킵(skip)하고 `k`부터 `k+N-1` 개의 row를 가져온다
- ex. 한 페이지당 5개씩 가져온다고 하면, [0 ~ 4], [5 ~ 9], [10 ~ 14] 가 될 것이다
- 사용자 중심이 아니라 데이터베이스 중심이기 때문에 사용자 기준에서 데이터 누락/중복과 같은 문제가 생길 수 있다

|**페이지 숫자**|**식**|**오프셋**|
|1|(1 - 1) * 5 = 0|0|
|2|(2 - 1) * 5 = 5|5|
|3|(3 - 1) * 5 = 10|10|

```sql
SELECT * FROM table LIMIT 5 OFFSET 0; -- 1페이지 데이터 가져오기
SELECT * FROM table LIMIT 5 OFFSET 5; -- 2페이지 데이터 가져오기
SELECT * FROM table LIMIT 5 OFFSET 10; -- 3페이지 데이터 가져오기
...
SELECT * FROM table LIMIT (페이지 숫자 - 1) OFFSET (한 페이지에 포함된 데이터 수)
```

- 장점
  - 구현이 간단하다
- 단점
  - 매 페이지 요청마다 DB를 처음부터 스캔해서, **뒤에 있는 페이지일수록 성능이 떨어진다**
    - ex. 3페이지의 경우, 0부터 10까지 스캔 후 10번 째부터 5개의 데이터를 가져온다
    - SQL의 `LIMIT`, `OFFSET` 방식의 한계점
  - **중간에 삭제 연산 있는 경우 데이터 누락 발생한다**
    - ![](/images/backend_theory_pagination_1.png)
  - **중간에 삽입 연산 있는 경우 데이터 중복 발생한다**
    - ![](/images/backend_theory_pagination_2.png)




## 커서 기반 페이지네이션

- 사용자가 받아간 가장 최근 데이터를 기준으로 다음의 N개를 가져오는 방식을 말한다
- 주의할 점은 커서 기반 페이지네이션은 정렬 기준에 반드시 유니크한 필드가 하나 이상 포함되어야 한다는 것이다


```sql
SELECT * FROM table LIMIT 5;
SELECT * FROM table WHERE id > 4 LIMIT 5;
SELECT * FROM table WHERE id > 9 LIMIT 5;
...
SELECT * FROM table WHERE id > (사용자가 마지막으로 받은 데이터의 인덱스 (커서)) LIMIT (다음 N개);
```

- 장점
  - 커서로 사용되는 값이 인덱싱되어 있다면 임의의 위치에 있는 데이터에 대해 성능 저하가 없다
  - 데이터 누락/중복 문제가 사라진다
- 단점
  - 구현이 오프셋 기반에 비해 복잡하다
  - 오프셋 기반 처럼 페이지 숫자를 기반으로 가져올 수 없어서 [[이전], [1], [2], [3], [다음]] 이런 페이지네이션바를 구현할 수 없다. 그래서 보통 무한 스크롤, [더보기] 버튼과 같은 방식의 UI를 사용하게 된다

### 중복될 수 있는 값을 기준으로 정렬한 경우

- 위에서 정렬 기준에 반드시 유니크한 필드가 하나 이상 포함되어야 한다고 했다
- 여기서 예시를 통해 그 이유를 설명하고, 어떻게 쿼리를 작성해야 하는지 알아보자

![](/images/backend_theory_pagination_3.png)

![](/images/backend_theory_pagination_4.png)





# 참고

- [Pagination이란, 월든의 더 나은 개발하기](https://betterdev.tistory.com/17)
- [커서 기반 페이지네이션 (Cursor-based Pagination) 구현하기, minsangk](https://velog.io/@minsangk/%EC%BB%A4%EC%84%9C-%EA%B8%B0%EB%B0%98-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%84%A4%EC%9D%B4%EC%85%98-Cursor-based-Pagination-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)