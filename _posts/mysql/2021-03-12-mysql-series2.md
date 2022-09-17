---
layout: post
title:  'MySQL Series [Part2] DML(2): SELECT 중급 JOIN, SUBQUERY'
description: 
date:   2021-03-12 15:01:35 +0300
image:  '/images/join_logo.png'
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

# JOIN Statement

여러 테이블을 합쳐서 하나의 테이블인 것처럼 보는 행위를 '조인(join)'이라고 합니다. 실무에서는 이 조인을 잘해야 제대로된 데이터 분석을 할 수 있습니다. 조인은 SQL을 얼마나 잘 쓰는지 판단하는 척도 중 하나일만큼 정말 중요한 개념입니다.  


# INNER JOIN

![](/images/sql_7.png)  

- JOIN의 조건(USING 또는 ON)을 만족하는 레코드가 두 테이블에 모두 있는 경우에만 조인된 결과를 레코드로 제공
- MySQL에서는 INNER JOIN, JOIN, 콤마(,) 모두 INNER JOIN을 뜻함
- 조인 조건(USING, ON)없이 사용하는 경우를 Cartesian Product(곱집합) 이라고 함
- ex. A: {1, 2, 3}, B: {x, y}일 때 FROM A, B를 하면 -> {[1, x], [1, y], [2, x], [2, y], [3, x], [3, y]}
- INNER JOIN은 인덱스 유무에 따라 옵티마이저가 알아서 기준 테이블(Driving table)과 대상 테이블(Driven table)을 정함
- 드리븐 테이블이 성능 부하가 많은 편이라 인덱스가 있는 테이블을 드리븐 테이블로 사용해, 최대한 드리븐 테이블의 성능 부하를 낮춘다
- 핵심은 INNER JOIN은 MySQL의 성능 최적화 측면에서 제약 조건을 하나 줄여주는 셈 -> OUTER JOIN 보다 성능이 좋다

```sql
-- 정석적인 작성법
SELECT u.userid, u.name 
FROM usertbl AS u INNER JOIN buytbl AS b 
ON u.userid=b.userid 
WHERE u.userid="111"

-- 축약 작성법
SELECT u.userid, u.name 
FROM usertbl u, buytbl b 
WHERE u.userid=b.userid AND u.userid="111"

/*
내 생각에 위의 방법은 딱 교집합인 결과에서 WHERE 조건절로 필터링
아래 방법은 곱집합으로 len(u) * len(b)만큼의 결과에서 WHERE 조건절 사용 -> 훨씬 느릴것 같다
*/
```

참고로 JOIN이 있는 쿼리문의 실행 순서는 다음과 같다.  

```
1. FROM
2. ON
3. JOIN
4. WHERE
5. GROUP BY
6. HAVING
7. SELECT
8. ORDER BY
9. LIMIT
```

# OUTER JOIN

![](/images/sql_5.png)  

![](/images/sql_6.png)  

- LEFT JOIN, RIGHT JOIN
- LEFT는 첫 번째 테이블을 기준으로 두 번째 테이블을 조인, RIGHT는 두 번째 테이블이 기준
- 그래서 OUTER JOIN은 순서가 중요 -> 결과 자체의 측면과 성능적 측면 두 가지가 있음
  - 우선 성능을 따지기 전에 결과 자체가 우리가 원하는 결과가 나와야 함 -> 모든 레코드가 나와야 하는 테이블을 기준 테이블
  - 순서에 상관없이 결과가 같다고 판단되는 경우 성능을 따져야함 -> 인덱스가 있는 테이블을 드리븐 테이블로 쓰자(LEFT면 두 번째)
- 만약 OUTER JOIN, INNER JOIN 어떤 것을 써도 된다면 옵티마이저가 드라이빙 테이블을 선택할 수 있는 INNER JOIN이 나음

```sql
SELECT STUDENT.NAME, PROFESSOR.NAME 
FROM STUDENT LEFT OUTER JOIN PROFESSOR
ON STUDENT.PID = PROFESSOR.ID 
WHERE GRADE = 1
```

# JOIN 최적화

인덱스 레인지 스캔은 인덱스를 탐색(Index Seek)하는 단계와 인덱스를 스캔(Index Scan)하는 과정으로 구분해 볼 수 있다. 일반적으로 인덱스를 이용해서 쿼리하는 작업에서는 가져오는 레코드의 건수가 소량(전체 데이터 크기의 20% 이내)이기 때문에 인덱스 스캔 작업은 부하가 작고, 특정 인덱스 키를 찾는 인덱스 탐색 작업이 부하가 높은 편이다.  

JOIN 작업에서 드라이빙 테이블을 읽을 때는 인덱스 탐색 작업을 단 한 번만 수행하고, 그 이후부터는 스캔만 실행하면 된다.  

하지만 드리븐 테이블에서는 인덱스 탐색 작업과 스캔 작업을 드라이빙 테이블에서 읽은 레코드 건수만큼 반복한다.  

드라이빙 테이블과 드리븐 테이블이 1:1 조인되더라도 **드리븐 테이블을 읽는 것이 훨씬 더 큰 부하를 차지**한다.  

그래서 옵티마이저는 항상 드라이빙 테이블이 아니라 드리븐 테이블을 최적으로 읽을 수 있게 실행 계획을 수립한다.  

```sql
SELECT *
FROM employees e, dept_emp de
WHERE e.emp_no=de.emp_no
```
여기서 각 테이블의 emp_no 컬럼에 인덱스가 있을 때와 없을 때 조인 순서가 어떻게 달라지는 한 번 살펴보자.  

- 두 컬럼 모두 인덱스가 있는 경우
  - 어느 테이블을 드라이빙으로 선택하든 인덱스를 이용해 드리븐 테이블의 검색 작업을 빠르게 처리할 수 있다
  - 보통의 경우 어느 쪽 테이블이 드라이빙 테이블이 되든 옵티마이저가 선택하는 방법이 최적일 때가 많다
- employees 테이블에만 인덱스가 있는경우
  - 이 때는 employees 테이블을 드리븐 테이블로 선택한다
  - 드리븐 테이블을 읽는 것이 훨씬 더 큰 부하를 차지하기 때문에 드리븐 테이블에서 인덱스를 활용하는 것이 중요한다


INNER JOIN은 조인 대상 테이블 모두에 해당하는 레코드만 반환한다. 이같은 특성 때문에 OUTER JOIN으로만 조인을 실행하는 쿼리들도 자주 보인다. 하지만 대개의 경우 OUTER JOIN은 대상 테이블들의 데이터가 일관되지 않은 경우에만 필요하다.  

MySQL 옵티마이저는 OUTER JOIN시 조인 되는 테이블(FROM A LEFT JOIN B에서 B)을 드라이빙 테이블로 선택하지 못하기 때문에 무조건 앞에 등장하는 테이블을 드라이빙 테이블로 선택한다. 그 결과 인덱스 유무에 따라 조인 순서를 변경함으로써 얻게 되는 최적화의 이점을 얻지 못하기 때문에 쿼리 성능이 나빠질 수 있다. 그래서 꼭 필요한 경우가 아니라면 INNER JOIN을 사용하는 것이 쿼리의 성능에 도움이 된다.  

 JOIN의 순서  

 - INNER JOIN인 경우
   - 어차피 A and B and C 이기 때문에 A JOIN B JOIN C이든 B JOIN A JOIN C이든 같다.
 - LEFT JOIN의 경우 결과도 성능도 달라진다. 
   - 일단 가장 먼저 등장하는 테이블이 드라이빙 테이블이 된다 -> 이 말은 뒤에 따라오는 테이블은 드리븐 테이블이 된다는 말이다 -> 드리븐 테이블은 인덱스가 없으면 성능이 떨어진다 -> 뒤에 조인되는 테이블의 인덱스 유무에 따라 쿼리 성능이 달라진다
   - 결과 자체도 맨 앞에 등장하는 테이블의 모든 레코드가 기준이 되기 때문에 순서에 따라 달라진다
 - INNER JOIN과 OUTER JOIN이 결합되는 경우
   - 가능하다면 INNER JOIN이 앞에 오도록 하는 것이 좋다








# UNION

![](/images/sql_8.png)  

![](/images/sql_9.png)  

- 같은 구조를 가지는 테이블을 합치는 것
- UNION은 두 테이블이 같은 데이터를 가질 경우 한 개만 최종 테이블에 반영되도록 함 (중복 허용 X)
- UNION ALL은 두 테이블이 같은 레코드를 가지더라도 합칠 경우 둘 다 최종 테이블에 반영(중복 허용)

```sql
SELECT 필드이름 FROM 테이블이름
UNION
SELECT 필드이름 FROM 테이블이름
```

# Subquery

- 서브쿼리(subquery)는 다른 쿼리 내부에 포함되어 있는 SELETE 문을 의미
- 서브쿼리는 괄호()로 감싸서 표현
- 메인쿼리 실행 중간에 서브쿼리 실행. 서브쿼리 종료 후, 메인쿼리도 실행 모두 마치고 종료
- 메인쿼리 실행 되면 먼저 FROM으로 메인 테이블 불러오기 때문에, 서브쿼리는 메인쿼리의 컬럼 사용 가능
- 서브쿼리는 가독성이 좋다는 장점이 있지만 JOIN 보다 성능이 느림 -> 둘다 가능한 경우 JOIN 사용
- (최신 MySQL은 내부적으로 서브쿼리문을 실행할 때 조인문으로 변환)

## 서브쿼리를 사용할 수 있는 위치

```sql
SELECT 
FROM
WHERE
HAVING
INSERT
UPDATE
```

# 참고

- [인파, [MYSQL] 📚 서브쿼리 개념 & 문법 💯 정리](https://inpa.tistory.com/entry/MYSQL-%F0%9F%93%9A-%EC%84%9C%EB%B8%8C%EC%BF%BC%EB%A6%AC-%EC%A0%95%EB%A6%AC?category=890808){:target="_blank"} 
- [Navicat, Joins versus Subqueries: Which Is Faster?](https://www.navicat.com/en/company/aboutus/blog/1704-joins-versus-subqueries-which-is-faster){:target="_blank"} 