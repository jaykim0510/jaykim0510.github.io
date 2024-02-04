---
layout: post
title:  'MySQL Command Series [Part3] DML(3): SELECT 중급 WINDOW'
description: 
date:   2021-03-13 15:01:35 +0300
image:  '/images/mysql_logo.png'
logo_image: '/images/mysql_logo.png'
category: data_engineering
tag: mysql
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 윈도우 함수

- 특정 범위마다 함수를 적용하는 것을 윈도우 함수라고 함
- MySQL에서 제공하는 윈도우 함수라고 따로 정의해둔 윈도우 함수 묶음이 있음
  ![](/images/mysql_45.png)
- 집계 함수도 OVER절을 이용해 범위를 정의하면 윈도우 함수로 사용할 수 있음(Most aggregate functions also can be used as window functions, [MySQL 공식문서](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html){:target="_blank"})
- 사용 방법: `[윈도우 함수] + OVER` or `[집계 함수] + OVER`
- 범위마다 함수를 적용한다는 점에서 GROUP BY와 비슷하게 느껴지지만, GROUP BY는 집계된 결과를 테이블로 보여주는 반면, 윈도우 함수는 집계된 결과를 기존 테이블에 하나의 열로 추가하여 결과를 볼 수 있음
  ![](/images/mysql_46.png)

# OVER절

- 윈도우 함수는 항상 OVER절과 함께 사용됨
- 2018년에 MySQL에 처음으로 윈도우 함수가 도입되었고, 윈도우 함수는 OVER절을 통해 접근할 수 있음
- 윈도우 함수는 set of rows에 특별한 함수 또는 계산을 위한 용도. 이러한 set of rows를 window라고 함
- 이러한 윈도우가 OVER절에 의해 정의됨
- OVER clause which has three possible elements: partition definition, order definition, and frame definition.
  ```
  {window_function(expression)] | [aggregation_function(expression)} OVER ( 
   [partition_defintion]
   [order_definition]
   [frame_definition]
  )
  ```
- PARTITION BY: 윈도우 범위 결정
- ORDER BY: 정렬하여 계산

# 윈도우 함수 예시

## ROW_NUMBER()

- 행 번호를 매길 수 있음

## RANK()

- 윈도우 내에서 순위를 매길 수 있음
- 공동 2등이 2명이면 다음은 4등 -> 1, 2, 2, 4

## DENSE_RANK()

- 윈도우 내에서 순위를 매길 수 있음
- 공동 2등이 2명 있더라도 다음은 3등 -> 1, 2, 2, 3

## LEAD()

- 현재 행에서 다음에 있는 행들과 관계를 맺을 수 있음

## LAG()

- 현재 행 앞에 있는 행들과 관계를 맺을 수 있음