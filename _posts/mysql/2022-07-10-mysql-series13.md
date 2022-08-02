---
layout: post
title:  'MySQL Series [Part13] SQL을 이용한 데이터 분석에서 겪었던 다양한 경험들'
description: 
date:   2022-07-10 15:01:35 +0300
image:  '/images/mysql_logo.webp'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# JOIN과 SUBQUERY 둘 다 사용할 수 있다면 어떤 것을 쓰는게 좋을까  

1. Sub-query solution

```sql
SELECT Name as Employee FROM Employee e
WHERE Salary > (
    Select Salary FROM Employee m WHERE m.Id = e.ManagerId
)
```

**Advantages Of Subquery**  

- Complex query can be broken down into a series of logical steps.
- Subquery is easy to read, understand and maintain.
- It allow to use the results of another query in the outer query.


**Disadvantages of Subquery**  

- Execution is slower than JOIN.
- We cannot modify a table and select from the same table within a subquery in the same SQL statement.

2. JOIN solution

```sql
SELECT
     a.NAME AS Employee
FROM Employee AS a JOIN Employee AS b
     ON a.ManagerId = b.Id
     AND a.Salary > b.Salary
```

**Advantage of a JOIN**  

- Execution and retrieval time faster than subqueries.


**Disadvantages Of JOIN**  

- Database server has to do more work when it comes to a lot of joins in a query => more time consuming to retrieve data
- Developer can be confused to choose the appropriate type among many types of joins.

3. Conclusion

- Most developers prioritize speed optimizing while others prioritize logic. It ups to you in your specific case.

# LEFT OUTER JOIN을 사용할 때 조건을 만족하는 행이 2개인 경우

문제 [Consecutive Available Seats](https://leetcode.com/problems/consecutive-available-seats/){:target="_blank"}  

여기서 나는 LEFT OUTER JOIN을 2번 썼다. [현재 좌석, 이전 좌석, 이후 좌석] 이런식으로.  

정답은 맞았지만 이렇게 조인을 2번이나 써야하나 라는 생각에 다른 사람들의 풀이를 구경해봤다.  

풀이 중에  

```sql
select distinct a.seat_id
from cinema a
join cinema b
on abs(a.seat_id - b.seat_id) = 1
and a.free=true and b.free=true
order by a.seat_id;
```
을 봤다. 조인을 1번만 쓰고 있다. 근데 이 방법은 ON절에 사용된 조건이 driving table 행에 조인되는 derived table의 행이 2개가 조인되는 결과를 가져오게 될 것 같았다. 그래서 이러한 경우에는 결과 테이블이 어떻게 될지 궁금해 검색해봤다.  

[haerong22, LEFT OUTER JOIN 의 함정](https://velog.io/@haerong22/LEFT-OUTER-JOIN-%EC%9D%98-%ED%95%A8%EC%A0%95)

위 블로그 내용을 보니  

![](/images/sql_30.png)

이렇게 id 값이 중복되는 데이터 뻥튀기(?) 현상이 일어났다.  

이 때는  

- 테이블간 제약 조건을 명확히 한다.
- 조인 조건을 추가
- distinct 사용
- group by 사용
- top 1, limit 사용

와 같은 방법을 이용해 해결할 수 있다. 위의 풀이에서는 distinct를 추가했다.  

# FROM에서 콤마(,)가 사용된 경우

FROM 절에서 여러 테이블을 함께 사용할 때 사람들마다 쿼리 작성법이 조금씩 달랐다. 표기법의 차이일 뿐 다음은 같은 역할을 한다.  

- INNER JOIN = JOIN = ,
- LEFT OUTER JOIN = LEFT JOIN
- RIGHT OUTER JOIN = RIGHT JOIN

# 날짜 관련 함수

- DATE_SUB()
- DATE_FORMAT()

# ROW_NUMBER()

- Assigns a sequential integer to every row within its partition
- We will show you how to add a sequential integer to each row or group of rows in the result set.
- ROW_NUMBER() is a [**window function**](https://www.mysqltutorial.org/mysql-window-functions/){:target="_blank"} that returns a sequential number for each row, starting from 1 for the first row.

# 윈도우 함수
- 특정 범위마다 함수를 적용하는 것을 윈도우 함수라고 함
- MySQL에서 제공하는 윈도우 함수라고 따로 정의해둔 윈도우 함수 묶음이 있음
  ![](/images/mysql_45.png)
- 집계 함수도 OVER절을 이용해 범위를 정의하면 윈도우 함수로 사용할 수 있음(Most aggregate functions also can be used as window functions, [MySQL 공식문서](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html){:target="_blank"})
- 사용 방법: [윈도우 함수] + [OVER 절] or [집계 함수] + [OVER 절]
- 범위마다 함수를 적용한다는 점에서 GROUP BY와 비슷하게 느껴지지만, GROUP BY는 집계된 결과를 테이블로 보여주는 반면, 윈도우 함수는 집계된 결과를 기존 테이블에 하나의 열로 추가하여 결과를 볼 수 있음
  ![](/images/mysql_46.png)




# OVER()
- If you want to learn window functions in MySQL, you need to understand the OVER clause
- In 2018, MySQL introduced a new feature: window functions, which are accessed via the OVER clause. Window functions are a super powerful resource available in almost all SQL databases. They perform a specific calculation (e.g. sum, count, average, etc.) on a set of rows; this set of rows is called a “window” and is defined by the MySQL OVER clause.
- OVER clause which has three possible elements: partition definition, order definition, and frame definition.
  ```
  [window_function(expression)][aggregation_function(expression)] OVER ( 
   [partition_defintion]
   [order_definition]
   [frame_definition]
  )
  ```
- PARTITION BY: 윈도우 범위 결정
- ORDER BY: 순서대로 **누적**하여 계산

# CTE(Common Table Expression)

- 문제: All People Report to the Given Manager
- In MySQL every query generates a temporary result or relation. In order to give a name to those temporary result set, CTE is used.
- A CTE is defined using WITH clause
- A recursive CTE is a subquery which refer to itself using its own name
  - The recursive CTEs are defined using WITH RECURSIVE clause
  - There should be a terminating condition to recursive CTE.
  - The recursive CTEs are used for series generation and traversal of hierarchical or tree-structured data

```sql
WITH RECURSIVE CTE AS (
    SELECT employee_id
    FROM Employees
    WHERE manager_id = 1 AND employee_id != 1
    UNION ALL
    SELECT e.employee_id
    FROM CTE c INNER JOIN Employees e ON c.employee_id = e.manager_id
)
SELECT employee_id
FROM CTE
ORDER BY employee_id
```

# 참고

- [MySQL tutorial: MySQL ROW_NUMBER, This is How You Emulate It](https://www.mysqltutorial.org/mysql-row_number/){:target="_blank"}
- [SQL OVER 절](https://velog.io/@wltn716/SQL-Over-%EC%A0%88){:target="_blank"}
- [[MySQL] 윈도우함수(Window Function)](https://mizykk.tistory.com/121){:target="_blank"}
- [MySQL 공식문서: 12.21.1 Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html){:target="_blank"}
- [LearnSQL: What Is the MySQL OVER Clause?](https://learnsql.com/blog/over-clause-mysql/){:target="_blank"}
- [GeeksforGeeks: MySQL Recursive CTE (Common Table Expressions)](https://www.geeksforgeeks.org/mysql-recursive-cte-common-table-expressions/){:target="_blank"}
- [horang, [MySQL] 계층 쿼리 - WITH, WITH RECURSIVE 사용법](https://horang98.tistory.com/10){:target="_blank"}