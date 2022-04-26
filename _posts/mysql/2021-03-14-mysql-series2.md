---
layout: post
title:  'MySQL을 이용한 데이터 조회 및 분석(2): 조인(JOIN)과 서브쿼리(SUBQUERY)'
description: 
date:   2021-03-14 15:01:35 +0300
image:  '/images/sql_5.png'
logo_image: '/images/mysql_logo.webp'
categories: backend
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

# 조인  
여러 테이블을 합쳐서 하나의 테이블인 것처럼 보는 행위를 '조인(join)'이라고 합니다. 실무에서는 이 조인을 잘해야 제대로된 데이터 분석을 할 수 있습니다. 조인은 SQL을 얼마나 잘 쓰는지 판단하는 척도 중 하나일만큼 정말 중요한 개념입니다.  

## 서로 구조가 다른 테이블간의 조인
- 서로 구조가 다른 테이블을 특정 컬럼을 기준으로 조인

![](/images/sql_3.png)  

```
SELECT 
    p.name
    p.team
    r.team
    r.region
FROM player AS p LEFT OUTER JOIN region AS r
ON p.team = r.team # ON 대신 USING(team) 이렇게 할 수도 있음
```  

### LEFT OUTER JOIN  

![](/images/sql_5.png)  

### RIGHT OUTER JOIN  

![](/images/sql_6.png)  

### INNER JOIN  

![](/images/sql_7.png)  

## 구조가 같은 테이블간의 조인

![](/images/sql_4.png)  

### UNION
- 중복을 허용하지 않는 합집합  


![](/images/sql_8.png)  

```
SELECT * FROM old_player
UNION
SELECT * FROM new_player;
```

### UNION ALL
- 중복을 허용하는 합집합  


![](/images/sql_9.png)  


### INTERSECT  
- 교집합  
- MySQL에서는 지원 하지 않음
- INNER JOIN으로 해결


### MINUS
- 차집합
- MySQL에서는 지원 하지 않음
- LEFT/RIGHT OUTER JOIN으로 해결


# 서브쿼리  

- SELECT문의 결과로 나온 값/열/테이블을 적재적소에 맞게 다른 SELECT문의 입력으로 사용할 수 있습니다


## 뷰

- 때에 따라 서브쿼리가 이중 중첩, 삼중 중첩되는 경우도 있습니다.  
- 이 때 생기는 SELECT문의 복잡성을 줄이고자 뷰를 사용할 수 있습니다.  
- 특정 역할을 하는 SELECT문들을 뷰로 저장해둡니다.  
- 코드 스니펫처럼 필요할 때마다 가져와서 사용할 수 있습니다.  
- 백엔드 개발자들의 자산과도 같습니다


# 마치며
지쳐서 너무 대충해버렸다...생각날 때마다 조금씩 보충해야겠다  