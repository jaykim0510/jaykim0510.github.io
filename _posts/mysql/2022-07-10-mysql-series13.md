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